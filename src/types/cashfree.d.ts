declare module '@cashfreepayments/cashfree-js' {
  type CashfreeCheckoutResult = {
    error?: unknown
    redirect?: boolean
    paymentDetails?: {
      paymentMessage?: string
    }
  }

  type CashfreeInstance = {
    checkout: (options: {
      paymentSessionId: string
      redirectTarget: '_modal' | '_self' | '_blank' | '_top'
    }) => Promise<CashfreeCheckoutResult>
  }

  export function load(options: {
    mode: 'sandbox' | 'production'
  }): Promise<CashfreeInstance | null>
}