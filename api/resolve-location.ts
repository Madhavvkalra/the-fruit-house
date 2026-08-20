import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node'

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

async function reverseGeocode(
  latitude: number,
  longitude: number
) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    {
      headers: {
        'User-Agent':
          'The Fruit House Location Resolver/1.0',
        Accept: 'application/json',
      },
    }
  )

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  const address = data.address ?? {}

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
      .join(', ')

  return {
    location:
      location ||
      `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    pincode,
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader(
    'Content-Type',
    'application/json'
  )

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const body = req.body ?? {}
    const inputUrl = body.url

    if (
      typeof inputUrl !== 'string' ||
      !inputUrl.trim()
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Google Maps URL is required.',
      })
    }

    const cleanUrl = inputUrl.trim()

    /*
     * First try to extract coordinates directly
     * from the URL.
     */
    let coordinates =
      extractCoordinates(cleanUrl)

    /*
     * If it is a shortened Google Maps URL,
     * follow the redirect.
     */
    if (!coordinates) {
      try {
        const redirectResponse =
          await fetch(cleanUrl, {
            method: 'GET',
            redirect: 'follow',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (compatible; The Fruit House Location Resolver/1.0)',
              Accept:
                'text/html,application/xhtml+xml',
            },
          })

        const finalUrl =
          redirectResponse.url || cleanUrl

        coordinates =
          extractCoordinates(finalUrl)

        /*
         * Sometimes the coordinates are present
         * in the returned HTML even when they are
         * not present in the final URL.
         */
        if (!coordinates) {
          const html =
            await redirectResponse.text()

          coordinates =
            extractCoordinates(html)
        }
      } catch (error) {
        console.error(
          'Google Maps redirect error:',
          error
        )
      }
    }

    if (!coordinates) {
      return res.status(422).json({
        success: false,
        error:
          'We could not find coordinates in this Google Maps link. Please copy the full Google Maps location URL.',
      })
    }

    const {
      latitude,
      longitude,
    } = coordinates

    /*
     * Reverse geocode.
     *
     * If Nominatim is temporarily unavailable,
     * we still return valid coordinates rather
     * than returning an empty response.
     */
    let location =
      `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

    let pincode = ''

    try {
      const geocoded =
        await reverseGeocode(
          latitude,
          longitude
        )

      if (geocoded) {
        location =
          geocoded.location || location

        pincode =
          geocoded.pincode || ''
      }
    } catch (error) {
      console.error(
        'Reverse geocoding error:',
        error
      )
    }

    const result: ResolveResponse = {
      latitude,
      longitude,
      location,
      pincode,
    }

    return res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error(
      'Location resolver error:',
      error
    )

    return res.status(500).json({
      success: false,
      error:
        'Unable to resolve this Google Maps location.',
    })
  }
}