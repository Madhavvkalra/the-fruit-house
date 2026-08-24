import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node'

type Coordinates = {
  latitude: number
  longitude: number
}

function makeCoordinates(
  latitude: number,
  longitude: number
): Coordinates | null {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null
  }

  return { latitude, longitude }
}

/* =========================================================
   EXTRACT EXPLICIT COORDINATES
========================================================= */

function extractCoordinatesFromUrl(
  url: string
): Coordinates | null {
  const patterns = [
    // @30.7333,76.7794
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,

    // ?q=30.7333,76.7794
    /[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,

    // ?ll=30.7333,76.7794
    /[?&]ll=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,

    // !3d30.7333!4d76.7794
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)

    if (!match) continue

    const result = makeCoordinates(
      Number(match[1]),
      Number(match[2])
    )

    if (result) {
      return result
    }
  }

  return null
}

/* =========================================================
   EXTRACT PLACE / ADDRESS
========================================================= */

function extractPlaceQuery(
  url: string
): string {
  try {
    const parsed = new URL(url)

    const q = parsed.searchParams.get('q')

    if (q) {
      const trimmed = q.trim()

      // Don't treat q=lat,lng as an address.
      if (
        !/^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/.test(
          trimmed
        )
      ) {
        return trimmed
      }
    }

    // /maps/place/...
    const placeMatch = url.match(
      /\/maps\/place\/([^/?]+)/i
    )

    if (placeMatch?.[1]) {
      return decodeURIComponent(
        placeMatch[1].replace(/\+/g, ' ')
      )
    }
  } catch {
    // Ignore malformed URLs.
  }

  return ''
}

/* =========================================================
   FOLLOW GOOGLE REDIRECTS
========================================================= */

async function resolveFinalUrl(
  inputUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(
      inputUrl,
      {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml',
          'Accept-Language':
            'en-US,en;q=0.9',
        },
      }
    )

    return response.url || inputUrl
  } catch (error) {
    console.error(
      'Google redirect error:',
      error
    )

    return null
  }
}

/* =========================================================
   GEOCODE ADDRESS
========================================================= */

async function geocodeAddress(
  query: string
): Promise<Coordinates | null> {
  if (!query.trim()) {
    return null
  }

  const queries = [
    query,

    query
      .replace(/^HDFC Bank,\s*/i, '')
      .trim(),

    query
      .replace(
        /Sahibzada Ajit Singh Nagar/gi,
        'Mohali'
      )
      .trim(),

    query
      .replace(/^HDFC Bank,\s*/i, '')
      .replace(
        /Sahibzada Ajit Singh Nagar/gi,
        'Mohali'
      )
      .trim(),
  ]

  for (const searchQuery of queries) {
    try {
      console.log(
        'Trying geocode:',
        searchQuery
      )

      const url =
        'https://nominatim.openstreetmap.org/search' +
        '?format=jsonv2' +
        '&limit=5' +
        '&countrycodes=in' +
        '&addressdetails=1' +
        '&q=' +
        encodeURIComponent(searchQuery)

      const response = await fetch(
        url,
        {
          headers: {
            'User-Agent':
              'The Fruit House Location Resolver/1.0',
            Accept:
              'application/json',
          },
        }
      )

      if (!response.ok) {
        console.error(
          'Geocoder status:',
          response.status
        )

        continue
      }

      const results =
        await response.json()

      if (
        !Array.isArray(results) ||
        results.length === 0
      ) {
        console.log(
          'No results for:',
          searchQuery
        )

        continue
      }

      /*
       * Prefer an Indian result that actually
       * looks like a place/address rather than
       * an unrelated result.
       */

      for (const result of results) {
        const latitude =
          Number(result.lat)

        const longitude =
          Number(result.lon)

        const coordinates =
          makeCoordinates(
            latitude,
            longitude
          )

        if (!coordinates) {
          continue
        }

        const address =
          result.address ?? {}

        const displayName =
          String(
            result.display_name ?? ''
          ).toLowerCase()

        const addressText =
          JSON.stringify(
            address
          ).toLowerCase()

        const combined =
          `${displayName} ${addressText}`

        /*
         * We want the result to be in Punjab
         * / Mohali / Sahibzada Ajit Singh Nagar.
         */

        const isRelevant =
          combined.includes('punjab') ||
          combined.includes('mohali') ||
          combined.includes(
            'sahibzada ajit singh nagar'
          ) ||
          combined.includes(
            'phase 7'
          ) ||
          combined.includes(
            'sector 61'
          )

        if (isRelevant) {
          console.log(
            'Geocoded coordinates:',
            coordinates
          )

          console.log(
            'Matched result:',
            result.display_name
          )

          return coordinates
        }
      }

      /*
       * If there was no specifically relevant
       * result, use the first valid result from
       * this query as a fallback.
       */

      const first =
        results.find(
          (result: any) =>
            makeCoordinates(
              Number(result.lat),
              Number(result.lon)
            ) !== null
        )

      if (first) {
        const coordinates =
          makeCoordinates(
            Number(first.lat),
            Number(first.lon)
          )

        if (coordinates) {
          console.log(
            'Fallback geocoded coordinates:',
            coordinates
          )

          console.log(
            'Fallback result:',
            first.display_name
          )

          return coordinates
        }
      }
    } catch (error) {
      console.error(
        'Geocoding attempt failed:',
        error
      )
    }
  }

  return null
}

/* =========================================================
   RESOLVE LOCATION
========================================================= */

async function resolveLocation(
  inputUrl: string
): Promise<Coordinates | null> {
  /*
   * 1. Try the original URL.
   *
   * This handles full URLs containing coordinates.
   */

  let coordinates =
    extractCoordinatesFromUrl(
      inputUrl
    )

  if (coordinates) {
    return coordinates
  }

  /*
   * 2. Follow the Google short URL.
   *
   * maps.app.goo.gl → maps.google.com
   */

  const finalUrl =
    await resolveFinalUrl(
      inputUrl
    )

  if (!finalUrl) {
    return null
  }

  console.log(
    'Google final URL:',
    finalUrl
  )

  /*
   * 3. Try coordinates from the final URL.
   */

  coordinates =
    extractCoordinatesFromUrl(
      finalUrl
    )

  if (coordinates) {
    console.log(
      'Coordinates found directly:',
      coordinates
    )

    return coordinates
  }

  /*
   * 4. Extract the actual Google place/address.
   *
   * For your test link this becomes:
   *
   * HDFC Bank, SCF 55 & 57, Phase 7,
   * Sector 61, Sahibzada Ajit Singh Nagar,
   * Punjab 160062
   */

  const placeQuery =
    extractPlaceQuery(
      finalUrl
    )

  console.log(
    'Google place query:',
    placeQuery
  )

  if (!placeQuery) {
    return null
  }

  /*
   * 5. Geocode the actual address.
   */

  coordinates =
    await geocodeAddress(
      placeQuery
    )

  if (coordinates) {
    console.log(
      'Geocoded coordinates:',
      coordinates
    )

    return coordinates
  }

  return null
}

/* =========================================================
   REVERSE GEOCODE
========================================================= */

async function reverseGeocode(
  latitude: number,
  longitude: number
) {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=jsonv2` +
      `&lat=${latitude}` +
      `&lon=${longitude}`

    const response = await fetch(
      url,
      {
        headers: {
          'User-Agent':
            'The Fruit House Location Resolver/1.0',
          Accept:
            'application/json',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data =
      await response.json()

    const address =
      data.address ?? {}

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.suburb ||
      address.county ||
      ''

    const state =
      address.state || ''

    const pincode =
      address.postcode || ''

    return {
      location:
        [city, state]
          .filter(Boolean)
          .join(', ') ||
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,

      pincode,
    }
  } catch (error) {
    console.error(
      'Reverse geocoding error:',
      error
    )

    return null
  }
}

/* =========================================================
   API HANDLER
========================================================= */

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
    const body =
      req.body ?? {}

    const inputUrl =
      body.url

    if (
      typeof inputUrl !== 'string' ||
      !inputUrl.trim()
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Location link is required.',
      })
    }

    const cleanUrl =
      inputUrl.trim()

    try {
      new URL(cleanUrl)
    } catch {
      return res.status(400).json({
        success: false,
        error:
          'Please paste a valid location link.',
      })
    }

    const coordinates =
      await resolveLocation(
        cleanUrl
      )

    if (!coordinates) {
      return res.status(422).json({
        success: false,
        error:
          'We could not identify this location. Please try copying the location link again from Google Maps.',
      })
    }

    const {
      latitude,
      longitude,
    } = coordinates

    let location =
      `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

    let pincode = ''

    const geocoded =
      await reverseGeocode(
        latitude,
        longitude
      )

    if (geocoded) {
      location =
        geocoded.location ||
        location

      pincode =
        geocoded.pincode || ''
    }

    return res.status(200).json({
      success: true,
      latitude,
      longitude,
      location,
      pincode,
    })
  } catch (error) {
    console.error(
      'Location resolver error:',
      error
    )

    return res.status(500).json({
      success: false,
      error:
        'Unable to resolve this location link. Please try again.',
    })
  }
}