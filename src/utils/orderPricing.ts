import { products } from '../data/products.js'

export type PricingItem = {
  productId: string
  variantLabel: string
  quantity: number
}

export type CalculatedPricing = {
  subtotal: number
  couponCode: string | null
  couponDiscount: number
  deliveryCharge: number
  convenienceFee: number
  grandTotal: number
  items: Array<{
    productId: string
    productName: string
    variantLabel: string
    unitPrice: number
    quantity: number
    lineTotal: number
  }>
}

const COUPONS = {
  FRESH100: {
    discountType: 'flat' as const,
    discountValue: 100,
    minimumOrder: 999,
  },
  WELCOME10: {
    discountType: 'percent' as const,
    discountValue: 10,
    minimumOrder: 0,
  },
}

export function calculateOrderPricing(
  inputItems: PricingItem[],
  couponCode?: string | null
): CalculatedPricing {
  if (!Array.isArray(inputItems) || inputItems.length === 0) {
    throw new Error('Your basket is empty.')
  }

  const items = inputItems.map((item) => {
    if (
      !item ||
      typeof item.productId !== 'string' ||
      typeof item.variantLabel !== 'string' ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    ) {
      throw new Error('Invalid basket item.')
    }

    const product = products.find(
      (candidate) => candidate.id === item.productId
    )

    if (!product) {
      throw new Error('A product in your basket is no longer available.')
    }

    const variant = product.variants.find(
      (candidate) => candidate.label === item.variantLabel
    )

    if (!variant) {
      throw new Error(
        `The selected variant for ${product.name} is no longer available.`
      )
    }

    const unitPrice = Number(variant.price)

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error('Invalid product price.')
    }

    return {
      productId: product.id,
      productName: product.name,
      variantLabel: variant.label,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
    }
  })

  const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  )

  const normalizedCoupon =
    typeof couponCode === 'string' && couponCode.trim()
      ? couponCode.trim().toUpperCase()
      : null

  const coupon = normalizedCoupon
    ? COUPONS[normalizedCoupon as keyof typeof COUPONS]
    : null

  const couponDiscount = coupon
    ? coupon.discountType === 'flat'
      ? subtotal >= coupon.minimumOrder
        ? coupon.discountValue
        : 0
      : Math.round(
          (subtotal * coupon.discountValue) / 100
        )
    : 0

  // Keep these server-controlled until delivery/convenience
  // pricing is introduced as a real business rule.
  const deliveryCharge = 0
  const convenienceFee = 0

  const grandTotal =
    subtotal -
    couponDiscount +
    deliveryCharge +
    convenienceFee

  if (grandTotal <= 0) {
    throw new Error('Invalid order total.')
  }

  return {
    subtotal,
    couponCode: normalizedCoupon,
    couponDiscount,
    deliveryCharge,
    convenienceFee,
    grandTotal,
    items,
  }
}
