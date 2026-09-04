export type PaymentRequest = {
  currency?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  items: Array<{
    productId: string
    variantLabel: string
    quantity: number
  }>
  couponCode?: string | null
}

export type PaymentResult = {
  success: boolean
  paymentId: string
  orderId?: string
  status: 'success' | 'failed'
  message: string
}

type CreateOrderResponse = {
  success: boolean
  orderId?: string
  paymentSessionId?: string
  message?: string
}

type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string
    redirectTarget: '_modal'
  }) => Promise<{
    error?: unknown
    redirect?: boolean
    paymentDetails?: {
      paymentMessage?: string
    }
  }>
}

let cashfreePromise: Promise<CashfreeInstance | null> | null = null

async function getCashfree() {
  if (!cashfreePromise) {
    cashfreePromise = import('@cashfreepayments/cashfree-js')
      .then(({ load }) =>
        load({
          mode: 'sandbox',
        })
      )
      .then((cashfree) => cashfree as CashfreeInstance | null)
  }

  return cashfreePromise
}

export async function initiatePayment(
  request: PaymentRequest
): Promise<PaymentResult> {
  if (
    !request.customerName ||
    !request.customerEmail ||
    !request.customerPhone
  ) {
    return {
      success: false,
      paymentId: '',
      status: 'failed',
      message: 'Please complete your customer details before payment.',
    }
  }

  try {
    const response = await fetch('/api/cashfree-create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerPhone: request.customerPhone,
        items: request.items,
        couponCode: request.couponCode ?? null,
      }),
    })

    const data =
      (await response.json()) as CreateOrderResponse

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Unable to create Cashfree order.'
      )
    }

    if (!data.orderId || !data.paymentSessionId) {
      throw new Error(
        'Cashfree did not return a payment session.'
      )
    }

    const cashfree = await getCashfree()

    if (!cashfree) {
      throw new Error(
        'Cashfree checkout could not be loaded.'
      )
    }

    const result = await cashfree.checkout({
      paymentSessionId: data.paymentSessionId,
      redirectTarget: '_modal',
    })

    if (result.error) {
      return {
        success: false,
        paymentId: data.orderId,
        status: 'failed',
        message:
          'Payment was cancelled or could not be completed.',
      }
    }

    // Cashfree recommends server-side verification after
    // the checkout flow. Do not trust the popup result alone.
    const verificationResponse = await fetch(
      '/api/cashfree-verify-order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderId,
        }),
      }
    )

    const verificationText =
      await verificationResponse.text()

    let verificationData: {
      success?: boolean
      orderStatus?: string
      paymentId?: string
      message?: string
    } = {}

    try {
      verificationData = verificationText
        ? JSON.parse(verificationText)
        : {}
    } catch {
      console.error(
        'Invalid verification response:',
        verificationText
      )

      return {
        success: false,
        paymentId: data.orderId,
        status: 'failed',
        message:
          'Payment verification returned an invalid response.',
      }
    }

    console.log(
      'Cashfree verification:',
      verificationData
    )

    if (
      !verificationResponse.ok ||
      verificationData.success !== true ||
      verificationData.orderStatus !== 'PAID'
    ) {
      return {
        success: false,
        paymentId: data.orderId,
        status: 'failed',
        message:
          verificationData.message ||
          `Payment is not verified. Current status: ${
            verificationData.orderStatus || 'UNKNOWN'
          }.`,
      }
    }

    return {
      success: true,
      paymentId:
        verificationData.paymentId || data.orderId,
      orderId: data.orderId,
      status: 'success',
      message: 'Payment verified successfully.',
    }
  } catch (error) {
    console.error('Cashfree payment error:', error)

    return {
      success: false,
      paymentId: '',
      status: 'failed',
      message:
        error instanceof Error
          ? error.message
          : 'Payment could not be completed.',
    }
  }
}