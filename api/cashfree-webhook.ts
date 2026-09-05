import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

const CASHFREE_API_VERSION = '2025-01-01'

function getHeader(
  req: VercelRequest,
  name: string
): string | undefined {
  const value = req.headers[name.toLowerCase()]

  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function getRawBody(req: VercelRequest): string {
  if (typeof req.body === 'string') {
    return req.body
  }

  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8')
  }

  return JSON.stringify(req.body ?? {})
}

function verifyCashfreeSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
  secret: string
): boolean {
  const signedPayload = timestamp + rawBody

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('base64')

  const expectedBuffer = Buffer.from(expectedSignature)
  const receivedBuffer = Buffer.from(signature)

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  )
}

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

  const databaseUrl = process.env.DATABASE_URL
  const clientId = process.env.CASHFREE_CLIENT_ID
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET
  const environment =
    process.env.CASHFREE_ENVIRONMENT || 'sandbox'

  if (!databaseUrl) {
    return res.status(500).json({
      success: false,
      message: 'Database is not configured.',
    })
  }

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      success: false,
      message: 'Cashfree credentials are not configured.',
    })
  }

  const webhookSignature = getHeader(
    req,
    'x-webhook-signature'
  )

  const webhookTimestamp = getHeader(
    req,
    'x-webhook-timestamp'
  )

  if (!webhookSignature || !webhookTimestamp) {
    return res.status(401).json({
      success: false,
      message: 'Missing Cashfree webhook signature.',
    })
  }

  const rawBody = getRawBody(req)

  const isValid = verifyCashfreeSignature(
    rawBody,
    webhookTimestamp,
    webhookSignature,
    clientSecret
  )

  if (!isValid) {
    console.error('Invalid Cashfree webhook signature.')

    return res.status(401).json({
      success: false,
      message: 'Invalid webhook signature.',
    })
  }

  let payload: Record<string, unknown>

  try {
    payload = JSON.parse(rawBody)
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Invalid webhook payload.',
    })
  }

  const data =
    payload.data &&
    typeof payload.data === 'object'
      ? (payload.data as Record<string, unknown>)
      : {}

  const order =
    data.order &&
    typeof data.order === 'object'
      ? (data.order as Record<string, unknown>)
      : {}

  const payment =
    data.payment &&
    typeof data.payment === 'object'
      ? (data.payment as Record<string, unknown>)
      : {}

  const cashfreeOrderId =
    typeof order.order_id === 'string'
      ? order.order_id
      : ''

  const paymentStatus =
    typeof payment.payment_status === 'string'
      ? payment.payment_status
      : ''

  if (!cashfreeOrderId) {
    return res.status(400).json({
      success: false,
      message: 'Cashfree order ID is missing.',
    })
  }

  console.log(
    'Cashfree webhook received:',
    {
      eventType: payload.type,
      cashfreeOrderId,
      paymentStatus,
    }
  )

  const baseUrl =
    environment === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg'

  /*
   * Never trust the webhook payload alone for the final
   * payment state. Confirm the order directly with Cashfree.
   */
  const cashfreeResponse = await fetch(
    `${baseUrl}/orders/${encodeURIComponent(
      cashfreeOrderId
    )}`,
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

  const cashfreeText =
    await cashfreeResponse.text()

  let cashfreeData: Record<string, unknown> = {}

  try {
    cashfreeData = cashfreeText
      ? JSON.parse(cashfreeText)
      : {}
  } catch {
    return res.status(502).json({
      success: false,
      message: 'Invalid response from Cashfree.',
    })
  }

  if (!cashfreeResponse.ok) {
    console.error(
      'Cashfree webhook order verification failed:',
      cashfreeResponse.status,
      cashfreeData
    )

    return res.status(502).json({
      success: false,
      message: 'Unable to verify Cashfree order.',
    })
  }

  const verifiedOrderStatus =
    typeof cashfreeData.order_status === 'string'
      ? cashfreeData.order_status
      : 'UNKNOWN'

  if (verifiedOrderStatus !== 'PAID') {
    console.log(
      'Cashfree webhook ignored because order is not PAID:',
      {
        cashfreeOrderId,
        verifiedOrderStatus,
      }
    )

    return res.status(200).json({
      success: true,
      message: `Webhook received. Order status is ${verifiedOrderStatus}.`,
    })
  }

  const sql = neon(databaseUrl)

  /*
   * The webhook is responsible for confirming payment state.
   * It does not create a new order because the checkout flow
   * already creates the Fruit House order.
   */
  const existing = await sql`
    SELECT order_id
    FROM orders
    WHERE cashfree_order_id = ${cashfreeOrderId}
    LIMIT 1
  `

  if (existing.length === 0) {
    console.warn(
      'Paid Cashfree order has no Fruit House order yet:',
      cashfreeOrderId
    )

    return res.status(200).json({
      success: true,
      message:
        'Payment verified, but Fruit House order has not been created yet.',
    })
  }

  await sql`
    UPDATE orders
    SET
      payment_status = 'PAID',
      order_status = CASE
        WHEN order_status = 'PLACED'
          THEN order_status
        ELSE 'PLACED'
      END
    WHERE cashfree_order_id = ${cashfreeOrderId}
  `

  return res.status(200).json({
    success: true,
    message: 'Cashfree webhook verified and order updated.',
    orderId: existing[0].order_id,
  })
}