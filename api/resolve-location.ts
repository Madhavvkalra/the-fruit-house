import type { VercelRequest, VercelResponse } from '@vercel/node'

type ResolveResponse = {
  latitude?: number
  longitude?: number
  location?: string
  pincode?: string
  error?: string
}

function extractCoordinates(url: string) {
  const patterns = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)

    if (!match) continue

    const latitude = Number(match[1])
    const longitude = Number(match[2])

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      return {
        latitude,
        longitude,
      }
    }
  }

  return null
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const { url } = req.body ?? {}

    if (
      typeof url !== 'string' ||
      !url.trim()
    ) {
      return res.status(400).json({
        error: 'Google Maps URL is required.',
      })
    }

    const inputUrl = url.trim()

    let resolvedUrl = inputUrl

    /*
     * First try the URL exactly as provided.
     * This handles normal Google Maps URLs
     * containing coordinates.
     */
    let coordinates =
      extractCoordinates(resolvedUrl)

    /*
     * If the URL is a shortened Google Maps
     * URL, follow the redirect server-side.
     */
    if (!coordinates) {
      const response = await fetch(
        inputUrl,
        {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent':
              'The Fruit House Location Resolver/1.0',
          },
        }
      )

      resolvedUrl = response.url

      coordinates =
        extractCoordinates(resolvedUrl)
    }

    if (!coordinates) {
      return res.status(422).json({
        error:
          'Coordinates could not be found in this Google Maps link.',
      })
    }

    const {
      latitude,
      longitude,
    } = coordinates

    /*
     * Reverse geocode the coordinates using
     * OpenStreetMap Nominatim.
     */
    const geocodeResponse =
      await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent':
              'The Fruit House Location Resolver/1.0',
          },
        }
      )

    if (!geocodeResponse.ok) {
      throw new Error(
        'Reverse geocoding failed.'
      )
    }

    const geocodeData =
      await geocodeResponse.json()

    const address =
      geocodeData.address ?? {}

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.county ||
      ''

    const state =
      address.state || ''

    const pincode =
      address.postcode || ''

    const location =
      [city, state]
        .filter(Boolean)
        .join(', ') ||
      `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

    const result: ResolveResponse = {
      latitude,
      longitude,
      location,
      pincode,
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error(
      'Location resolver error:',
      error
    )

    return res.status(500).json({
      error:
        'Unable to resolve this Google Maps location.',
    })
  }
}