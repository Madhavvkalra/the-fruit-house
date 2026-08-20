import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

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

    const {
      requestId,
      name,
      location,
      addressLine1,
      addressLine2,
      pinCode,
      latitude,
      longitude,
    } = body

    if (
      typeof requestId !== 'string' ||
      !requestId.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing requestId.',
      })
    }

    if (
      typeof name !== 'string' ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Name is required.',
      })
    }

    if (
      typeof location !== 'string' ||
      !location.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Location is required.',
      })
    }

    if (
      typeof addressLine1 !== 'string' ||
      !addressLine1.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Address is required.',
      })
    }

    if (
      typeof pinCode !== 'string' ||
      !/^\d{6}$/.test(pinCode)
    ) {
      return res.status(400).json({
        success: false,
        error:
          'A valid 6-digit pincode is required.',
      })
    }

    const cleanRequestId =
      requestId.trim()

    const existing =
      await sql`
        SELECT request_id
        FROM location_requests
        WHERE request_id = ${cleanRequestId}
        LIMIT 1
      `

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error:
          'This location request does not exist or has expired.',
      })
    }

    const cleanAddressLine2 =
      typeof addressLine2 === 'string'
        ? addressLine2.trim()
        : ''

    const cleanLatitude =
      typeof latitude === 'number' &&
      Number.isFinite(latitude)
        ? latitude
        : null

    const cleanLongitude =
      typeof longitude === 'number' &&
      Number.isFinite(longitude)
        ? longitude
        : null

    await sql`
      UPDATE location_requests
      SET
        name = ${name.trim()},
        location = ${location.trim()},
        address_line_1 = ${addressLine1.trim()},
        address_line_2 = ${cleanAddressLine2},
        pin_code = ${pinCode},
        latitude = ${cleanLatitude},
        longitude = ${cleanLongitude},
        saved_at = NOW()
      WHERE request_id = ${cleanRequestId}
    `

    return res.status(200).json({
      success: true,
      location: {
        requestId: cleanRequestId,
        name: name.trim(),
        location: location.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: cleanAddressLine2,
        pinCode,
        latitude: cleanLatitude,
        longitude: cleanLongitude,
      },
    })
  } catch (error) {
    console.error(
      'Save recipient location error:',
      error
    )

    return res.status(500).json({
      success: false,
      error:
        'Could not save the recipient location.',
    })
  }
}