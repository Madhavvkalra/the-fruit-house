import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node'

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const requestId =
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`

    const host =
      req.headers.host ||
      'the-fruit-house-5yh3.vercel.app'

    const forwardedProtocol =
      req.headers['x-forwarded-proto']

    const protocol =
      typeof forwardedProtocol === 'string'
        ? forwardedProtocol.split(',')[0]
        : 'https'

    const locationUrl =
      `${protocol}://${host}/?recipientLocation=true&requestId=${encodeURIComponent(
        requestId
      )}`

    return res.status(200).json({
      success: true,
      requestId,
      locationUrl,
    })
  } catch (error) {
    console.error(
      'Create location request error:',
      error
    )

    return res.status(500).json({
      success: false,
      error:
        'Could not create the location request.',
    })
  }
}