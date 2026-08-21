import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const requestId =
      typeof req.query.requestId === 'string'
        ? req.query.requestId.trim()
        : ''

    if (!requestId) {
      return res.status(400).json({
        success: false,
        error: 'Missing requestId.',
      })
    }

    const rows = await sql`
      SELECT
        request_id,
        created_at,
        name,
        location,
        address_line_1,
        address_line_2,
        pin_code,
        latitude,
        longitude,
        saved_at
      FROM location_requests
      WHERE request_id = ${requestId}
      LIMIT 1
    `

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Location request not found.',
      })
    }

    const row = rows[0]
    const saved = row.saved_at !== null

    return res.status(200).json({
      success: true,
      saved,
      location: saved
        ? {
            requestId: row.request_id,
            name: row.name,
            location: row.location,
            addressLine1: row.address_line_1,
            addressLine2: row.address_line_2,
            pinCode: row.pin_code,
            latitude: row.latitude,
            longitude: row.longitude,
            savedAt: row.saved_at,
          }
        : null,
    })
  } catch (error) {
    console.error('Get location request error:', error)

    return res.status(500).json({
      success: false,
      error: 'Could not retrieve the location request.',
    })
  }
}