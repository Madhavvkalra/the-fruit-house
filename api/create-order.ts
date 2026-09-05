import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

const CASHFREE_API_VERSION = '2025-01-01'

type OrderItem = {
  productId: string
  productName: string
  variantLabel: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

type OrderRequest = {
  cashfreeOrderId: string
  cashfreePaymentId: string
  customer: {
    name: string
    email: string
    mobile: string
    recipientType?: string
  }
  delivery: {
    locationMethod?: string | null
    latitude?: number | null
    longitude?: number | null
    location?: string
    addressLine1?: string
    addressLine2?: string
    pinCode?: string
  }
  items: OrderItem[]
  pricing: {
    subtotal: number
    couponCode?: string | null
    couponDiscount: number
    deliveryCharge: number
    convenienceFee: number
    grandTotal: number
  }
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

  try {
    const body = req.body as OrderRequest

    if (
      !body?.cashfreeOrderId ||
      !body?.cashfreePaymentId ||
      !body?.customer?.name ||
      !body?.customer?.email ||
      !body?.customer?.mobile ||
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      !body.pricing ||
      Number(body.pricing.grandTotal) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete order details.',
      })
    }

    const baseUrl =
      environment === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg'

    // Verify the Cashfree payment independently on the server.
    const cashfreeResponse = await fetch(
      `${baseUrl}/orders/${encodeURIComponent(
        body.cashfreeOrderId
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

    const cashfreeText = await cashfreeResponse.text()

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
        'Cashfree order verification failed:',
        cashfreeResponse.status,
        cashfreeData
      )

      return res.status(cashfreeResponse.status).json({
        success: false,
        message:
          typeof cashfreeData.message === 'string'
            ? cashfreeData.message
            : 'Unable to verify payment.',
      })
    }

    if (cashfreeData.order_status !== 'PAID') {
      return res.status(400).json({
        success: false,
        message: `Payment is not PAID. Current status: ${
          typeof cashfreeData.order_status === 'string'
            ? cashfreeData.order_status
            : 'UNKNOWN'
        }.`,
      })
    }

    const sql = neon(databaseUrl)

    // Create the table if it does not already exist.
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        order_id TEXT NOT NULL UNIQUE,
        order_number TEXT UNIQUE,
        cashfree_order_id TEXT NOT NULL UNIQUE,
        cashfree_payment_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_mobile TEXT NOT NULL,
        recipient_type TEXT,
        delivery_location_method TEXT,
        delivery_latitude DOUBLE PRECISION,
        delivery_longitude DOUBLE PRECISION,
        delivery_location TEXT,
        delivery_address_line1 TEXT,
        delivery_address_line2 TEXT,
        delivery_pin_code TEXT,
        items JSONB NOT NULL,
        subtotal NUMERIC(12, 2) NOT NULL,
        coupon_code TEXT,
        coupon_discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
        delivery_charge NUMERIC(12, 2) NOT NULL DEFAULT 0,
        convenience_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
        grand_total NUMERIC(12, 2) NOT NULL,
        payment_status TEXT NOT NULL DEFAULT 'PAID',
        order_status TEXT NOT NULL DEFAULT 'PLACED',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `

    // IMPORTANT:
    // CREATE TABLE IF NOT EXISTS does not add a column to an
    // existing table. Add order_number safely if this is an
    // older orders table.
    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS order_number TEXT
    `

    // Make sure the customer-facing order number is unique.
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_key
      ON orders(order_number)
    `

    // Check whether this Cashfree order has already been stored.
    const existing = await sql`
      SELECT order_id, order_number
      FROM orders
      WHERE cashfree_order_id = ${body.cashfreeOrderId}
      LIMIT 1
    `

    if (existing.length > 0) {
      return res.status(200).json({
        success: true,
        orderId: existing[0].order_id,
        orderNumber: existing[0].order_number,
        alreadyCreated: true,
      })
    }

    // Internal database identifier.
    // This stays long and globally unique.
    const orderId = `TFH-${Date.now()}-${crypto.randomUUID()}`

    // Customer-facing order number.
    // Example: TFH-9473579
    const orderNumber = `TFH-${Date.now()
      .toString()
      .slice(-7)}`

    const inserted = await sql`
      INSERT INTO orders (
        order_id,
        order_number,
        cashfree_order_id,
        cashfree_payment_id,
        customer_name,
        customer_email,
        customer_mobile,
        recipient_type,
        delivery_location_method,
        delivery_latitude,
        delivery_longitude,
        delivery_location,
        delivery_address_line1,
        delivery_address_line2,
        delivery_pin_code,
        items,
        subtotal,
        coupon_code,
        coupon_discount,
        delivery_charge,
        convenience_fee,
        grand_total,
        payment_status,
        order_status
      )
      VALUES (
        ${orderId},
        ${orderNumber},
        ${body.cashfreeOrderId},
        ${body.cashfreePaymentId},
        ${body.customer.name},
        ${body.customer.email},
        ${body.customer.mobile},
        ${body.customer.recipientType ?? null},
        ${body.delivery.locationMethod ?? null},
        ${body.delivery.latitude ?? null},
        ${body.delivery.longitude ?? null},
        ${body.delivery.location ?? null},
        ${body.delivery.addressLine1 ?? null},
        ${body.delivery.addressLine2 ?? null},
        ${body.delivery.pinCode ?? null},
        ${JSON.stringify(body.items)}::jsonb,
        ${Number(body.pricing.subtotal)},
        ${body.pricing.couponCode ?? null},
        ${Number(body.pricing.couponDiscount)},
        ${Number(body.pricing.deliveryCharge)},
        ${Number(body.pricing.convenienceFee)},
        ${Number(body.pricing.grandTotal)},
        'PAID',
        'PLACED'
      )
      ON CONFLICT (cashfree_order_id)
      DO NOTHING
      RETURNING order_id, order_number
    `

    // Another request may have created the same Cashfree order
    // between our SELECT and INSERT.
    if (inserted.length === 0) {
      const existingAfterConflict = await sql`
        SELECT order_id, order_number
        FROM orders
        WHERE cashfree_order_id = ${body.cashfreeOrderId}
        LIMIT 1
      `

      if (existingAfterConflict.length > 0) {
        return res.status(200).json({
          success: true,
          orderId: existingAfterConflict[0].order_id,
          orderNumber: existingAfterConflict[0].order_number,
          alreadyCreated: true,
        })
      }

      throw new Error(
        'Order could not be created because the database rejected the insert.'
      )
    }

    return res.status(201).json({
      success: true,
      orderId: inserted[0].order_id,
      orderNumber: inserted[0].order_number,
      alreadyCreated: false,
    })
  } catch (error) {
    console.error('Create order error:', error)

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to create order.',
    })
  }
}