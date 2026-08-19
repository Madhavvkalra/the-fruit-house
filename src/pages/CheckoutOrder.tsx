type CheckoutBasketItem = {
  product: {
    id: string
    name: string
  }
  variant: {
    label: string
    price: number
  }
  quantity: number
}

type Coupon = {
  code: string
  title: string
  description: string
  discountType: 'flat' | 'percent'
  discountValue: number
  minimumOrder: number
}

type CheckoutOrderProps = {
  basket: CheckoutBasketItem[]
  basketTotal: number
  appliedCoupon: string | null
  setAppliedCoupon: (coupon: string | null) => void
  onContinue: () => void
}

const coupons: Coupon[] = [
  {
    code: 'FRESH100',
    title: 'Fresh House',
    description: 'Get ₹100 off on orders above ₹999',
    discountType: 'flat',
    discountValue: 100,
    minimumOrder: 999,
  },
  {
    code: 'WELCOME10',
    title: 'Welcome Offer',
    description: 'Get 10% off on your first order',
    discountType: 'percent',
    discountValue: 10,
    minimumOrder: 0,
  },
]

export default function CheckoutOrder({
  basket,
  basketTotal,
  appliedCoupon,
  setAppliedCoupon,
  onContinue,
}: CheckoutOrderProps) {
  const selectedCoupon =
    coupons.find(
      (coupon) => coupon.code === appliedCoupon
    ) ?? null

  const couponDiscount = selectedCoupon
    ? selectedCoupon.discountType === 'flat'
      ? basketTotal >= selectedCoupon.minimumOrder
        ? selectedCoupon.discountValue
        : 0
      : Math.round(
          (basketTotal * selectedCoupon.discountValue) / 100
        )
    : 0

  const itemCount = basket.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const deliveryCharge: number = 0
  const convenienceFee: number = 0

  const grandTotal =
    basketTotal -
    couponDiscount +
    deliveryCharge +
    convenienceFee

  return (
    <>
      {/* =================================================
          COUPONS — STEP 1 ONLY
      ================================================= */}

      <div className="mb-8 rounded-[20px] bg-[#17351d] px-4 py-3.5 text-white shadow-[0_12px_35px_rgba(8,21,11,.12)] sm:px-5">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2.5">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#efffb0] text-xs text-[#17351d]">
              ✦
            </div>

            <div>

              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#efffb0]/65">
                Offers for you
              </p>

              <p className="mt-0.5 text-[10px] text-white/45">
                Apply an offer and save on this order
              </p>

            </div>

          </div>

        </div>

        <div className="mt-3 space-y-2">

          {coupons.map((coupon) => {

            const isApplied =
              appliedCoupon === coupon.code

            const isEligible =
              basketTotal >= coupon.minimumOrder

            return (
              <div
                key={coupon.code}
                className={`flex items-center justify-between gap-3 rounded-[14px] border px-3 py-2.5 transition-all ${
                  isApplied
                    ? 'border-[#efffb0]/40 bg-[#efffb0]/10'
                    : 'border-white/10 bg-white/[0.04]'
                }`}
              >

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-xs text-[#efffb0]">
                    %
                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <p className="text-xs font-semibold">
                        {coupon.code}
                      </p>

                      {isApplied && (
                        <span className="rounded-full bg-[#efffb0] px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.08em] text-[#17351d]">
                          Applied
                        </span>
                      )}

                    </div>

                    <p className="mt-0.5 truncate text-[9px] text-white/45">
                      {coupon.description}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  disabled={!isEligible}
                  onClick={() => {
                    if (!isEligible) return

                    setAppliedCoupon(
                      isApplied ? null : coupon.code
                    )
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[9px] font-semibold transition active:scale-95 ${
                    isApplied
                      ? 'bg-[#efffb0] text-[#17351d]'
                      : isEligible
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'cursor-not-allowed bg-white/5 text-white/25'
                  }`}
                >
                  {isApplied ? 'Remove' : 'Apply'}
                </button>

              </div>
            )
          })}

        </div>

      </div>


      {/* =================================================
          ORDER SUMMARY
      ================================================= */}

      <section
        className="
          overflow-hidden
          rounded-[26px]
          border
          border-[#17351d]/10
          bg-white/60
          shadow-[0_18px_60px_rgba(8,21,11,.05)]
        "
      >

        <div className="px-5 pb-5 pt-6 sm:px-7 sm:pt-7">

          <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#71864d]">
            Order summary
          </p>

          <h3 className="mt-2 font-playfair text-3xl italic">
            Freshly selected
          </h3>

          <p className="mt-2 text-xs text-[#17351d]/40">
            {itemCount}{' '}
            {itemCount === 1 ? 'item' : 'items'} in your basket
          </p>

        </div>


        {/* PRODUCTS */}

        <div className="border-t border-[#17351d]/10 px-4 py-3 sm:px-5">

          <div className="space-y-1">

            {basket.map((item) => (

              <div
                key={`${item.product.id}-${item.variant.label}`}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-[18px]
                  px-2
                  py-4
                  transition
                  hover:bg-[#faf8ef]
                "
              >

                <div className="min-w-0">

                  <p className="font-playfair text-[18px] italic leading-tight">
                    {item.product.name}
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-[#17351d]/40">
                    {item.variant.label}
                    {' · '}
                    Qty {item.quantity}
                  </p>

                </div>

                <span className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums">
                  ₹
                  {(
                    item.variant.price *
                    item.quantity
                  ).toLocaleString('en-IN')}
                </span>

              </div>

            ))}

          </div>

        </div>


        {/* CHARGES */}

        <div className="border-t border-[#17351d]/10 bg-[#faf8ef]/70 px-5 py-5 sm:px-7">

          <div className="space-y-3">

            <div className="flex items-center justify-between text-sm">

              <span className="text-[#17351d]/45">
                Subtotal
              </span>

              <span className="font-medium">
                ₹
                {basketTotal.toLocaleString('en-IN')}
              </span>

            </div>


            {couponDiscount > 0 && (

              <div className="flex items-center justify-between text-sm">

                <span className="text-[#17351d]/45">
                  Coupon discount
                </span>

                <span className="font-medium text-[#71864d]">
                  −₹
                  {couponDiscount.toLocaleString('en-IN')}
                </span>

              </div>

            )}


            <div className="flex items-center justify-between text-sm">

              <span className="text-[#17351d]/45">
                Delivery
              </span>

              <span className="font-medium text-[#71864d]">
                {deliveryCharge === 0
                  ? 'Free'
                  : `₹${deliveryCharge.toLocaleString(
                      'en-IN'
                    )}`}
              </span>

            </div>


            <div className="flex items-center justify-between text-sm">

              <span className="text-[#17351d]/45">
                Convenience fee
              </span>

              <span className="font-medium">
                {convenienceFee === 0
                  ? 'Free'
                  : `₹${convenienceFee.toLocaleString(
                      'en-IN'
                    )}`}
              </span>

            </div>

          </div>


          {/* TOTAL */}

          <div className="mt-5 flex items-end justify-between border-t border-[#17351d]/10 pt-5">

            <div>

              <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#17351d]/40">
                Total
              </p>

              <p className="mt-1 text-[9px] text-[#17351d]/30">
                Inclusive of all charges
              </p>

            </div>

            <span className="font-playfair text-[30px] italic leading-none tabular-nums">
              ₹
              {grandTotal.toLocaleString('en-IN')}
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          FIXED CONTINUE BUTTON
      ================================================= */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-[450]
          border-t
          border-[#17351d]/10
          bg-[#f5f3e8]/90
          px-4
          pb-[max(16px,env(safe-area-inset-bottom))]
          pt-3
          backdrop-blur-xl
          sm:px-8
        "
      >

        <div className="mx-auto max-w-[760px]">

          <button
            type="button"
            onClick={onContinue}
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              rounded-full
              bg-[#17351d]
              text-sm
              font-semibold
              text-white
              shadow-[0_12px_35px_rgba(8,21,11,.20)]
              transition
              hover:bg-[#244b2b]
              active:scale-[0.98]
            "
          >
            Continue to Delivery
          </button>

        </div>

      </div>

    </>
  )
}