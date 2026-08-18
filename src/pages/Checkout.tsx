import { useState } from 'react'

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

type DeliveryDetails = {
  name: string
  mobile: string
  address: string
  location: string
  pinCode: string
}

export default function Checkout({
  basket,
  basketTotal,
  onClose,
}: CheckoutProps) {
  const [step, setStep] =
    useState<CheckoutStep>('checkout')

    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

const coupons = [
  {
    code: 'FRESH100',
    title: 'Fresh House',
    description: 'Get ₹100 off on orders above ₹999',
    discountType: 'flat' as const,
    discountValue: 100,
    minimumOrder: 999,
  },
  {
    code: 'WELCOME10',
    title: 'Welcome Offer',
    description: 'Get 10% off on your first order',
    discountType: 'percent' as const,
    discountValue: 10,
    minimumOrder: 0,
  },
]

const selectedCoupon = coupons.find(
  (coupon) => coupon.code === appliedCoupon
) ?? null

const couponDiscount =
  selectedCoupon
    ? selectedCoupon.discountType === 'flat'
      ? basketTotal >= selectedCoupon.minimumOrder
        ? selectedCoupon.discountValue
        : 0
      : Math.round(
          (basketTotal * selectedCoupon.discountValue) / 100
        )
    : 0

  const [hasSavedAddress, setHasSavedAddress] =
    useState(false)

  const [delivery, setDelivery] =
    useState<DeliveryDetails>({
      name: '',
      mobile: '',
      address: '',
      location: '',
      pinCode: '',
    })

  const [savedAddressSelected, setSavedAddressSelected] =
    useState(false)

  const updateDelivery = (
    field: keyof DeliveryDetails,
    value: string
  ) => {
    setDelivery((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const deliveryComplete =
    delivery.name.trim().length > 1 &&
    delivery.mobile.replace(/\D/g, '').length === 10 &&
    delivery.address.trim().length > 4 &&
    delivery.location.trim().length > 1 &&
    delivery.pinCode.replace(/\D/g, '').length === 6

  const canContinueFromDelivery =
    hasSavedAddress
      ? savedAddressSelected
      : deliveryComplete

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
            ×
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

            const active =
              step === item.id

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
                    {completed
                      ? '✓'
                      : index + 1}
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

      <div className="min-h-0 flex-1 overflow-y-auto">

        <main
          className="
            mx-auto
            w-full
            max-w-[760px]
            px-4
            pb-32
            pt-5
            sm:px-8
            sm:pb-36
            sm:pt-8
          "
        >
        
        {/*============Coupon=============*/}

<div className="mb-7 rounded-[20px] bg-[#17351d] px-4 py-3.5 text-white shadow-[0_12px_35px_rgba(8,21,11,.12)] sm:mb-8 sm:px-5">

  {/* OFFERS HEADER */}

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


  {/* COUPONS */}

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

          {/* COUPON INFO */}

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


          {/* APPLY */}

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
              STEP 1 — ORDER SUMMARY
          ================================================= */}

          {step === 'checkout' && (

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

              {/* TITLE */}

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

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      text-sm
                    "
                  >
                    <span className="text-[#17351d]/45">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      ₹
                      {basketTotal.toLocaleString(
                        'en-IN'
                      )}
                    </span>
                  </div>

                  {/* COUPON DISCOUNT */}
  {couponDiscount > 0 && (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#17351d]/45">
        Coupon discount
      </span>

      <span className="font-medium text-[#71864d]">
        −₹{couponDiscount.toLocaleString('en-IN')}
      </span>
    </div>
  )}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      text-sm
                    "
                  >
                    <span className="text-[#17351d]/45">
                      Delivery
                    </span>

                    <span
                      className="
                        font-medium
                        text-[#71864d]
                      "
                    >
                      {deliveryCharge === 0
                        ? 'Free'
                        : `₹${deliveryCharge.toLocaleString(
                            'en-IN'
                          )}`}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      text-sm
                    "
                  >
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
                    ₹
                    {grandTotal.toLocaleString(
                      'en-IN'
                    )}
                  </span>

                </div>

              </div>

            </section>
          )}


          {/* =================================================
              STEP 2 — DELIVERY
          ================================================= */}

          {step === 'delivery' && (

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
                Delivery details
              </p>

              <h3
                className="
                  mt-2
                  font-playfair
                  text-3xl
                  italic
                "
              >
                Where should we deliver?
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#17351d]/50
                "
              >
                Just the essentials for delivery.
                You can complete the rest of your
                profile later.
              </p>


              {/* SAVED ADDRESS */}

              {hasSavedAddress ? (

                <div className="mt-7">

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <p
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.22em]
                        text-[#17351d]/40
                      "
                    >
                      Saved address
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setHasSavedAddress(false)
                        setSavedAddressSelected(false)
                      }}
                      className="
                        text-xs
                        font-semibold
                        underline
                        underline-offset-4
                      "
                    >
                      Use another address
                    </button>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      setSavedAddressSelected(true)
                    }
                    className={`
                      mt-3
                      w-full
                      rounded-[20px]
                      border
                      p-5
                      text-left
                      transition-all

                      ${
                        savedAddressSelected
                          ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
                          : 'border-[#17351d]/10 bg-[#faf8ef]'
                      }
                    `}
                  >

                    <div className="flex items-start gap-4">

                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full

                          ${
                            savedAddressSelected
                              ? 'bg-[#17351d] text-[#efffb0]'
                              : 'bg-[#efffb0] text-[#17351d]'
                          }
                        `}
                      >
                        {savedAddressSelected
                          ? '✓'
                          : '⌂'}
                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold">
                          Home
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            leading-6
                            text-[#17351d]/55
                          "
                        >
                          Your saved delivery address
                        </p>

                      </div>

                    </div>

                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setHasSavedAddress(false)
                      setSavedAddressSelected(false)
                    }}
                    className="
                      mt-4
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#17351d]/15
                      bg-white/60
                      text-sm
                      font-semibold
                    "
                  >
                    + Add new address
                  </button>

                </div>

              ) : (

                <div className="mt-7 space-y-5">

                  {/* NAME */}

                  <div>

                    <label
                      htmlFor="delivery-name"
                      className="
                        mb-2
                        block
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#17351d]/50
                      "
                    >
                      Name
                    </label>

                    <input
                      id="delivery-name"
                      type="text"
                      value={delivery.name}
                      onChange={(event) =>
                        updateDelivery(
                          'name',
                          event.target.value
                        )
                      }
                      placeholder="Your name"
                      autoComplete="name"
                      className="
                        h-12
                        w-full
                        rounded-[14px]
                        border
                        border-[#17351d]/10
                        bg-[#faf8ef]
                        px-4
                        text-sm
                        outline-none
                        transition
                        placeholder:text-[#17351d]/25
                        focus:border-[#17351d]/30
                        focus:bg-white
                      "
                    />

                  </div>


                  {/* MOBILE */}

                  <div>

                    <label
                      htmlFor="delivery-mobile"
                      className="
                        mb-2
                        block
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#17351d]/50
                      "
                    >
                      Mobile number
                    </label>

                    <div className="flex gap-2">

                      <div
                        className="
                          flex
                          h-12
                          shrink-0
                          items-center
                          rounded-[14px]
                          border
                          border-[#17351d]/10
                          bg-[#faf8ef]
                          px-3
                          text-sm
                          font-medium
                        "
                      >
                        +91
                      </div>

                      <input
                        id="delivery-mobile"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={delivery.mobile}
                        onChange={(event) =>
                          updateDelivery(
                            'mobile',
                            event.target.value.replace(
                              /\D/g,
                              ''
                            )
                          )
                        }
                        placeholder="10-digit mobile number"
                        autoComplete="tel"
                        className="
                          h-12
                          min-w-0
                          flex-1
                          rounded-[14px]
                          border
                          border-[#17351d]/10
                          bg-[#faf8ef]
                          px-4
                          text-sm
                          outline-none
                          transition
                          placeholder:text-[#17351d]/25
                          focus:border-[#17351d]/30
                          focus:bg-white
                        "
                      />

                    </div>

                  </div>


                  {/* ADDRESS */}

                  <div>

                    <label
                      htmlFor="delivery-address"
                      className="
                        mb-2
                        block
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#17351d]/50
                      "
                    >
                      Delivery address
                    </label>

                    <textarea
                      id="delivery-address"
                      rows={3}
                      value={delivery.address}
                      onChange={(event) =>
                        updateDelivery(
                          'address',
                          event.target.value
                        )
                      }
                      placeholder="House / flat, street, sector, locality"
                      autoComplete="street-address"
                      className="
                        min-h-[100px]
                        w-full
                        resize-none
                        rounded-[14px]
                        border
                        border-[#17351d]/10
                        bg-[#faf8ef]
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        placeholder:text-[#17351d]/25
                        focus:border-[#17351d]/30
                        focus:bg-white
                      "
                    />

                  </div>


                  {/* LOCATION + PIN */}

                  <div
                    className="
                      grid
                      gap-5
                      sm:grid-cols-[1fr_150px]
                    "
                  >

                    <div>

                      <label
                        htmlFor="delivery-location"
                        className="
                          mb-2
                          block
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#17351d]/50
                        "
                      >
                        Location / City
                      </label>

                      <input
                        id="delivery-location"
                        type="text"
                        value={delivery.location}
                        onChange={(event) =>
                          updateDelivery(
                            'location',
                            event.target.value
                          )
                        }
                        placeholder="Chandigarh"
                        autoComplete="address-level2"
                        className="
                          h-12
                          w-full
                          rounded-[14px]
                          border
                          border-[#17351d]/10
                          bg-[#faf8ef]
                          px-4
                          text-sm
                          outline-none
                          transition
                          placeholder:text-[#17351d]/25
                          focus:border-[#17351d]/30
                          focus:bg-white
                        "
                      />

                    </div>

                    <div>

                      <label
                        htmlFor="delivery-pin"
                        className="
                          mb-2
                          block
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#17351d]/50
                        "
                      >
                        PIN code
                      </label>

                      <input
                        id="delivery-pin"
                        type="tel"
                        inputMode="numeric"
                        maxLength={6}
                        value={delivery.pinCode}
                        onChange={(event) =>
                          updateDelivery(
                            'pinCode',
                            event.target.value.replace(
                              /\D/g,
                              ''
                            )
                          )
                        }
                        placeholder="160001"
                        autoComplete="postal-code"
                        className="
                          h-12
                          w-full
                          rounded-[14px]
                          border
                          border-[#17351d]/10
                          bg-[#faf8ef]
                          px-4
                          text-sm
                          outline-none
                          transition
                          placeholder:text-[#17351d]/25
                          focus:border-[#17351d]/30
                          focus:bg-white
                        "
                      />

                    </div>

                  </div>

                </div>

              )}


              {/* DELIVERY ACTION */}

              <button
                type="button"
                disabled={!canContinueFromDelivery}
                onClick={() => {
                  if (canContinueFromDelivery) {
                    setStep('payment')
                  }
                }}
                className={`
                  mt-7
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  text-sm
                  font-semibold
                  transition
                  active:scale-[0.98]

                  ${
                    canContinueFromDelivery
                      ? 'bg-[#17351d] text-white hover:bg-[#244b2b]'
                      : 'cursor-not-allowed bg-[#17351d]/10 text-[#17351d]/30'
                  }
                `}
              >
                Continue to Payment
              </button>

              <button
                type="button"
                onClick={() =>
                  setStep('checkout')
                }
                className="
                  mt-3
                  w-full
                  text-xs
                  text-[#17351d]/45
                  transition
                  hover:text-[#17351d]
                "
              >
                ← Back to order
              </button>

            </section>
          )}


          {/* =================================================
              STEP 3 — PAYMENT
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
                Your delivery details are saved for
                this order. Payment integration will
                be connected here next.
              </p>


              {/* DELIVERY PREVIEW */}

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

                <div
                  className="
                    flex
                    items-start
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
                        tracking-[0.2em]
                        text-[#17351d]/40
                      "
                    >
                      Delivering to
                    </p>

                    <p className="mt-2 font-semibold">
                      {delivery.name ||
                        'Saved customer'}
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
                        {delivery.address}
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
                    onClick={() =>
                      setStep('delivery')
                    }
                    className="
                      shrink-0
                      text-xs
                      font-semibold
                      underline
                      underline-offset-4
                    "
                  >
                    Edit
                  </button>

                </div>

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

        </main>

      </div>


      {/* =====================================================
          FLOATING CONTINUE BUTTON
      ===================================================== */}

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
              onClick={() =>
                setStep('delivery')
              }
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