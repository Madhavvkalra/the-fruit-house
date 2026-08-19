import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node'

type LocationRequest = {
  requestId: string
  createdAt: number
  location: null
}

const requests = new Map<
  string,
  LocationRequest
>()

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  const requestId =
    `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`

  const host =
    req.headers.host ||
    'the-fruit-house.vercel.app'

  const protocol =
    req.headers['x-forwarded-proto'] ||
    'https'

  const locationUrl =
    `${protocol}://${host}/?recipientLocation=true&requestId=${encodeURIComponent(
      requestId
    )}`

  requests.set(requestId, {
    requestId,
    createdAt: Date.now(),
    location: null,
  })

  return res.status(200).json({
    requestId,
    locationUrl,
  })
}