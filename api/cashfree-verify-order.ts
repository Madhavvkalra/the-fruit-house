import type { VercelRequest, VercelResponse } from '@vercel/node'

const CASHFREE_API_VERSION = '2025-01-01'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed.',
    })
  }

  try {
    const clientId = process.env.CASHFREE_CLIENT_ID
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET
    const environment =
      process.env.CASHFREE_ENVIRONMENT || 'sandbox'

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        success: false,
        message: 'Cashfree credentials are not configured.',
      })
    }

    const orderId = req.body?.orderId

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required.',
      })
    }

    const baseUrl =
      environment === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg'

    const response = await fetch(
      `${baseUrl}/orders/${encodeURIComponent(orderId)}`,
      {
        method: 'GET',
        headers: {
          'X-Client-Secret': clientSecret,
          'X-Client-Id': clientId,
          'x-api-version': CASHFREE_API_VERSION,
          Accept: 'application/json',
        },
      }
    )

    const responseText = await response.text()

    let data: Record<string, unknown> = {}

    if (responseText) {
      try {
        data = JSON.parse(responseText)
      } catch {
        console.error(
          'Cashfree returned non-JSON response:',
          responseText
        )

        return res.status(502).json({
          success: false,
          message:
            'Cashfree returned an unexpected response while verifying the payment.',
        })
      }
    }

    if (!response.ok) {
      console.error(
        'Cashfree verification failed:',
        response.status,
        data
      )

      return res.status(response.status).json({
        success: false,
        message:
          typeof data.message === 'string'
            ? data.message
            : 'Cashfree could not verify the order.',
      })
    }

    const orderStatus = data.order_status

    if (orderStatus !== 'PAID') {
      return res.status(200).json({
        success: false,
        orderId: data.order_id,
        orderStatus,
        message: `Payment is not completed. Current status: ${
          typeof orderStatus === 'string'
            ? orderStatus
            : 'UNKNOWN'
        }.`,
      })
    }

    return res.status(200).json({
      success: true,
      orderId: data.order_id,
      orderStatus: 'PAID',
      paymentId:
        typeof data.cf_order_id === 'string'
          ? data.cf_order_id
          : data.order_id,
      message: 'Payment verified successfully.',
    })
  } catch (error) {
    console.error(
      'Cashfree verification server error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to verify payment.',
    })
  }
}