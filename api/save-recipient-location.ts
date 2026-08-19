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

    const savedLocation = {
      requestId: requestId.trim(),
      name: name.trim(),
      location: location.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2:
        typeof addressLine2 === 'string'
          ? addressLine2.trim()
          : '',
      pinCode,
      latitude:
        typeof latitude === 'number'
          ? latitude
          : null,
      longitude:
        typeof longitude === 'number'
          ? longitude
          : null,
      savedAt: Date.now(),
    }

    console.log(
      'Recipient location saved:',
      savedLocation
    )

    return res.status(200).json({
      success: true,
      location: savedLocation,
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