import { useState } from 'react'
import CheckoutDelivery from './CheckoutDelivery'
import type { DeliveryDetails } from './CheckoutDelivery'

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

type CheckoutProps = {
  basket: CheckoutBasketItem[]
  basketTotal: number
  onClose: () => void
}

type CheckoutStep = 'checkout' | 'delivery' | 'payment'

type Coupon = {
  code: string
  title: string
  description: string
  discountType: 'flat' | 'percent'
  discountValue: number
  minimumOrder: number
}

const coupons: Coupon[] = [
  {
    code: 'FRESH100',
    title: 'Fresh House',
    description: 'Get 100 off on orders above 999',
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

export default function Checkout({
  basket,
  basketTotal,
  onClose,
}: CheckoutProps) {
  const [step, setStep] =
    useState<CheckoutStep>('checkout')

  const [appliedCoupon, setAppliedCoupon] =
    useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [emailAuthenticated, setEmailAuthenticated] =
    useState(false)

  const [hasSavedAddress, setHasSavedAddress] =
    useState(false)

const [delivery, setDelivery] =
  useState<DeliveryDetails>({
    name: '',
    mobile: '',
    recipientType: 'self',
    locationMethod: null,
    latitude: null,
    longitude: null,
    location: '',
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
  })

  const [savedAddressSelected, setSavedAddressSelected] =
    useState(false)

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
          (basketTotal *
            selectedCoupon.discountValue) /
            100
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
const updateDelivery = (
  field: keyof DeliveryDetails,
  value: DeliveryDetails[keyof DeliveryDetails]
) => {
  setDelivery((current) => ({
    ...current,
    [field]: value,
  }))
}

  return (
    <div
      className="
        fixed
        inset-0
        z-[400]
        flex
        flex-col
        overflow-hidden
        bg-[#f5f3e8]
        text-[#17351d]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          shrink-0
          border-b
          border-[#17351d]/10
          bg-[#f5f3e8]/95
          px-5
          py-4
          backdrop-blur-xl
          sm:px-8
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[760px]
            items-center
            justify-between
            gap-4
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#71864d]
              "
            >
              The Fruit House
            </p>

            <h2
              className="
                mt-1
                font-playfair
                text-2xl
                italic
                sm:text-3xl
              "
            >
              {step === 'checkout'
                ? 'Checkout'
                : step === 'delivery'
                  ? 'Delivery'
                  : 'Payment'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#17351d]/10
              bg-white/60
              text-xl
              transition
              hover:bg-[#17351d]
              hover:text-white
              active:scale-90
            "
          >
            <span aria-hidden="true" className="leading-none">
              ×
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div
        className="
          shrink-0
          border-b
          border-[#17351d]/10
          bg-white/20
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[760px]
            items-center
            px-5
            py-3
            sm:px-8
          "
        >
          {[
            { id: 'checkout', label: 'Order' },
            { id: 'delivery', label: 'Delivery' },
            { id: 'payment', label: 'Payment' },
          ].map((item, index) => {
            const active = step === item.id

            const completed =
              (step === 'delivery' && index === 0) ||
              (step === 'payment' && index < 2)

            return (
              <div
                key={item.id}
                className="flex flex-1 items-center"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-[10px]
                      font-semibold

                      ${
                        active || completed
                          ? 'bg-[#17351d] text-[#efffb0]'
                          : 'border border-[#17351d]/15 bg-white/60 text-[#17351d]/35'
                      }
                    `}
                  >
                  {completed ? '✓' : index + 1}
                  </div>

                  <span
                    className={`
                      hidden
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      sm:block

                      ${
                        active
                          ? 'text-[#17351d]'
                          : 'text-[#17351d]/35'
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </div>

                {index < 2 && (
                  <div
                    className={`
                      mx-3
                      h-px
                      flex-1

                      ${
                        completed
                          ? 'bg-[#17351d]/30'
                          : 'bg-[#17351d]/10'
                      }
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* =====================================================
          SCROLL AREA
      ===================================================== */}

     <div
  className="
    min-h-0
    flex-1
    overflow-y-auto
    overscroll-contain
    touch-pan-y
  "
>
  <main
    className="
      mx-auto
      w-full
      max-w-[760px]
      px-4
      pb-36
      pt-5
      sm:px-8
      sm:pb-40
      sm:pt-8
    "
  >
          {/* =================================================
            STEP 1 - ORDER ONLY
          ================================================= */}

          {step === 'checkout' && (
            <>
              {/* COUPONS */}

              <div
                className="
                  mb-7
                  rounded-[20px]
                  bg-[#17351d]
                  px-4
                  py-3.5
                  text-white
                  shadow-[0_12px_35px_rgba(8,21,11,.12)]
                  sm:mb-8
                  sm:px-5
                "
              >
                <div className="flex items-center gap-2.5">
                  <div
  className="
    flex
    h-7
    w-7
    shrink-0
    items-center
    justify-center
    rounded-full
    bg-[#efffb0]
    text-xs
    text-[#17351d]
  "
>
  <span aria-hidden="true" className="font-semibold">
    %
  </span>
</div>

                  <div>
                    <p
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.25em]
                        text-[#efffb0]/65
                      "
                    >
                      Offers for you
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/45">
                      Apply an offer and save on this order
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {coupons.map((coupon) => {
                    const isApplied =
                      appliedCoupon === coupon.code

                    const isEligible =
                      basketTotal >=
                      coupon.minimumOrder

                    return (
                      <div
                        key={coupon.code}
                        className={`
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-[14px]
                          border
                          px-3
                          py-2.5
                          transition-all

                          ${
                            isApplied
                              ? 'border-[#efffb0]/40 bg-[#efffb0]/10'
                              : 'border-white/10 bg-white/[0.04]'
                          }
                        `}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-[10px]
                              bg-white/10
                              text-xs
                              text-[#efffb0]
                            "
                          >
                            %
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold">
                                {coupon.code}
                              </p>

                              {isApplied && (
                                <span
                                  className="
                                    rounded-full
                                    bg-[#efffb0]
                                    px-2
                                    py-0.5
                                    text-[7px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]
                                    text-[#17351d]
                                  "
                                >
                                  Applied
                                </span>
                              )}
                            </div>

                            <p
                              className="
                                mt-0.5
                                truncate
                                text-[9px]
                                text-white/45
                              "
                            >
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
                              isApplied
                                ? null
                                : coupon.code
                            )
                          }}
                          className={`
                            shrink-0
                            rounded-full
                            px-3.5
                            py-1.5
                            text-[9px]
                            font-semibold
                            transition
                            active:scale-95

                            ${
                              isApplied
                                ? 'bg-[#efffb0] text-[#17351d]'
                                : isEligible
                                  ? 'bg-white/10 text-white hover:bg-white/20'
                                  : 'cursor-not-allowed bg-white/5 text-white/25'
                            }
                          `}
                        >
                          {isApplied
                            ? 'Remove'
                            : 'Apply'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ORDER SUMMARY */}

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
                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.28em]
                      text-[#71864d]
                    "
                  >
                    Order summary
                  </p>

                  <h3
                    className="
                      mt-2
                      font-playfair
                      text-3xl
                      italic
                    "
                  >
                    Freshly selected
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-[#17351d]/40
                    "
                  >
                    {itemCount}{' '}
                    {itemCount === 1
                      ? 'item'
                      : 'items'}{' '}
                    in your basket
                  </p>
                </div>

                {/* PRODUCTS */}

                <div
                  className="
                    border-t
                    border-[#17351d]/10
                    px-4
                    py-3
                    sm:px-5
                  "
                >
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
                          <p
                            className="
                              font-playfair
                              text-[18px]
                              italic
                              leading-tight
                            "
                          >
                            {item.product.name}
                          </p>

                          <p
                            className="
                              mt-1
                              text-[8px]
                              uppercase
                              tracking-[0.14em]
                              text-[#17351d]/40
                            "
                          >
                            {item.variant.label}
                           {' · '}
                            Qty {item.quantity}
                          </p>
                        </div>

                        <span
                          className="
                            shrink-0
                            whitespace-nowrap
                            text-sm
                            font-semibold
                            tabular-nums
                          "
                        >
                         ₹{(
  item.variant.price *
  item.quantity
).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CHARGES */}

                <div
                  className="
                    border-t
                    border-[#17351d]/10
                    bg-[#faf8ef]/70
                    px-5
                    py-5
                    sm:px-7
                  "
                >
                  <div className="space-y-3">
                    {/* SUBTOTAL */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#17351d]/45">
                        Subtotal
                      </span>

                      <span className="font-medium">
                    ₹{basketTotal.toLocaleString(
  'en-IN'
)}
                      </span>
                    </div>

                    {/* COUPON */}

                    {couponDiscount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#17351d]/45">
                          Coupon discount
                        </span>

                        <span className="font-medium text-[#71864d]">
                         -₹{couponDiscount.toLocaleString(
  'en-IN'
)}
                        </span>
                      </div>
                    )}

                    {/* DELIVERY */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#17351d]/45">
                        Delivery
                      </span>

                      <span className="font-medium text-[#71864d]">
                    {deliveryCharge === 0
  ? 'Free'
  : `₹${deliveryCharge.toLocaleString('en-IN')}`}
                     </span>
                    </div>

                    {/* CONVENIENCE */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#17351d]/45">
                        Convenience fee
                      </span>

                      <span className="font-medium">
                      {convenienceFee === 0
  ? 'Free'
  : `₹${convenienceFee.toLocaleString('en-IN')}`}
                     </span>
                    </div>
                  </div>

                  {/* TOTAL */}

                  <div
                    className="
                      mt-5
                      flex
                      items-end
                      justify-between
                      border-t
                      border-[#17351d]/10
                      pt-5
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.22em]
                          text-[#17351d]/40
                        "
                      >
                        Total
                      </p>

                      <p
                        className="
                          mt-1
                          text-[9px]
                          text-[#17351d]/30
                        "
                      >
                        Inclusive of all charges
                      </p>
                    </div>

                    <span
                      className="
                        font-playfair
                        text-[30px]
                        italic
                        leading-none
                        tabular-nums
                      "
                    >
                     ₹{grandTotal.toLocaleString(
  'en-IN'
)}
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}

               {/* =================================================
          STEP 3 - PAYMENT
      ================================================= */}

      {step === 'payment' && (
        <section
          className="
            rounded-[26px]
            border
            border-[#17351d]/10
            bg-white/60
            p-5
            shadow-[0_18px_60px_rgba(8,21,11,.05)]
            sm:p-7
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#71864d]
            "
          >
            Payment
          </p>

          <h3
            className="
              mt-2
              font-playfair
              text-3xl
              italic
            "
          >
            Almost there
          </h3>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#17351d]/50
            "
          >
            Your delivery details are saved
            for this order. Payment integration
            will be connected here next.
          </p>

          <div
            className="
              mt-7
              rounded-[20px]
              border
              border-[#17351d]/10
              bg-[#faf8ef]
              p-5
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#17351d]/40
              "
            >
              Delivering to
            </p>

            <p className="mt-2 font-semibold">
              {delivery.name || 'Saved customer'}
            </p>

            {!hasSavedAddress && (
              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-[#17351d]/55
                "
              >
                {delivery.addressLine1}
{delivery.addressLine2 && (
  <>
    <br />
    {delivery.addressLine2}
  </>
)}
<br />
{delivery.location}
{' · '}
{delivery.pinCode}
                <br />
                +91 {delivery.mobile}
              </p>
            )}

            {hasSavedAddress && (
              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-[#17351d]/55
                "
              >
                Saved delivery address
              </p>
            )}
          </div>

          <button
            type="button"
            disabled
            className="
              mt-7
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
              opacity-45
            "
          >
            Proceed to Payment
          </button>

          <p
            className="
              mt-3
              text-center
              text-[9px]
              uppercase
              tracking-[0.16em]
              text-[#17351d]/30
            "
          >
            Payment integration coming next
          </p>
        </section>
      )}

      {/* =================================================
          STEP 2 - DELIVERY
      ================================================= */}

      {step === 'delivery' && (
        <CheckoutDelivery
          email={email}
          setEmail={setEmail}
          emailAuthenticated={emailAuthenticated}
          setEmailAuthenticated={setEmailAuthenticated}
          delivery={delivery}
          updateDelivery={updateDelivery}
          hasSavedAddress={hasSavedAddress}
          setHasSavedAddress={setHasSavedAddress}
          savedAddressSelected={savedAddressSelected}
          setSavedAddressSelected={setSavedAddressSelected}
          onContinueToPayment={() => setStep('payment')}
          onBackToOrder={() => setStep('checkout')}
        />
      )}

    </main>
  </div>

  {/* =================================================
      STEP 1 - CONTINUE BUTTON
  ================================================= */}

  {step === 'checkout' && (
    <div
      className="
        absolute
        bottom-0
        left-0
        right-0
        z-40
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
          onClick={() => setStep('delivery')}
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
  )}
</div>
  )
}

