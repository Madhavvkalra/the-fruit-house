export type PaymentRequest = {
  amount: number
  currency?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
}

export type PaymentResult = {
  success: boolean
  paymentId: string
  status: 'success' | 'failed'
  message: string
}

export async function initiatePayment(
  request: PaymentRequest
): Promise<PaymentResult> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1200)
  )

  if (!request.amount || request.amount <= 0) {
    return {
      success: false,
      paymentId: '',
      status: 'failed',
      message: 'Invalid payment amount.',
    }
  }

  return {
    success: true,
    paymentId: `TEST_${Date.now()}`,
    status: 'success',
    message: 'Test payment successful.',
  }
}