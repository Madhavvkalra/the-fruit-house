import type { VercelRequest, VercelResponse } from '@vercel/node'
import { calculateOrderPricing } from '../src/utils/orderPricing.js'

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

  const clientId = process.env.CASHFREE_CLIENT_ID
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET
  const environment = process.env.CASHFREE_ENVIRONMENT || 'sandbox'

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      success: false,
      message: 'Cashfree credentials are not configured.',
    })
  }

  try {
    const {
      items,
      couponCode,
      customerName,
      customerEmail,
      customerPhone,
    } = req.body ?? {}

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Customer details are required.',
      })
    }

    const pricing = calculateOrderPricing(
      items,
      couponCode
    )

    const orderId = `FH_${Date.now()}`

    const baseUrl =
      environment === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg'

    const cashfreeResponse = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'X-Client-Secret': clientSecret,
        'X-Client-Id': clientId,
        'x-api-version': CASHFREE_API_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: pricing.grandTotal,
        order_currency: 'INR',

        customer_details: {
          customer_id: `FH_CUSTOMER_${Date.now()}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },

        order_tags: {
          checkout_context: 'The Fruit House purchase',
        },
      }),
    })

    const data = await cashfreeResponse.json()

    if (!cashfreeResponse.ok) {
      console.error('Cashfree order creation failed:', data)

      return res.status(cashfreeResponse.status).json({
        success: false,
        message:
          data?.message ||
          data?.error_description ||
          'Cashfree could not create the order.',
      })
    }

    return res.status(200).json({
      success: true,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
    })
  } catch (error) {
    console.error('Cashfree create order error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create Cashfree order.',
    })
  }
}