import type { Product, ProductVariant } from '../data/products'
import RollingNumber from './RollingNumber'

type BasketItem = {
  product: Product
  variant: ProductVariant
  quantity: number
}

type BasketProps = {
  basket: BasketItem[]
  basketCount: number
  basketTotal: number

  basketOpen: boolean
  isBasketClosing: boolean
  isBasketPillEntering: boolean
  isBasketCartReacting: boolean

  removingBasketItem: string | null
  newBasketItemKey: string | null

  setBasketOpen: (open: boolean) => void
  setCheckoutOpen: (open: boolean) => void

  updateBasketQuantity: (
    productId: string,
    variantLabel: string,
    change: number
  ) => void
}

export default function Basket({
  basket,
  basketCount,
  basketTotal,

  basketOpen,
  isBasketClosing,
  isBasketPillEntering,
  isBasketCartReacting,

  removingBasketItem,
  newBasketItemKey,

  setBasketOpen,
  setCheckoutOpen,

  updateBasketQuantity,
}: BasketProps) {
  return (
    <>
      {(basketCount > 0 || isBasketClosing) && (
        <div
          className="
            fixed
            bottom-5
            left-1/2
            z-[250]
            -translate-x-1/2
            sm:bottom-6
            md:left-auto
            md:right-6
            md:translate-x-0
          "
        >
         {/* =================================================
    CLOSED BASKET PILL
================================================= */}

<div
  className={`
    transition-[opacity,transform,filter]
    duration-[600ms]
    ease-[cubic-bezier(.22,1,.36,1)]

    ${
      basketOpen || isBasketClosing
        ? 'pointer-events-none translate-y-2 opacity-0 blur-[6px]'
        : isBasketPillEntering
          ? 'pointer-events-auto animate-[basketPillEnter_.5s_cubic-bezier(.22,1,.36,1)]'
          : 'pointer-events-auto translate-y-0 opacity-100 blur-0'
    }
  `}
>
  <button
  type="button"
  onClick={() => setBasketOpen(true)}
  className="
    flex
    h-[58px]
w-[calc(100vw-32px)]
max-w-[245px]
    items-center
    rounded-full
    bg-[#17351d]
    pl-2
    pr-1
    text-white
    shadow-[0_14px_45px_rgba(8,21,11,.30)]
    transition-all
    duration-300
    hover:bg-[#244b2b]
    active:scale-[0.98]

    sm:h-[60px]
    sm:w-[245px]

    max-[380px]:w-[270px]
  "
>
  {/* CART */}

  <span
    className={`
      flex
      h-10
      w-10
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-[#efffb0]
      text-[15px]
      text-[#17351d]

      sm:h-11
      sm:w-11

      ${
        isBasketPillEntering || isBasketCartReacting
          ? 'animate-[basketCartPop_.5s_ease-out]'
          : ''
      }
    `}
  >
    🛒
  </span>

  {/* LABEL */}

  <span
    className="
      ml-3
      shrink-0
      whitespace-nowrap
      text-[10px]
      font-semibold
      uppercase
      tracking-[0.15em]
      text-white/55
    "
  >
    Your basket
  </span>

  {/* DIVIDER */}

  <span
    className="
      mx-3
      h-7
      w-px
      shrink-0
      bg-white/15
    "
  />

  {/* AMOUNT */}

  <span
    className="
      shrink-0
      whitespace-nowrap
      font-playfair
      text-[18px]
      italic
      leading-none
      text-white
      tabular-nums
    "
  >
    <RollingNumber
      value={basketTotal}
      prefix="₹"
    />
  </span>

</button>
</div>

          {/* =================================================
              EXPANDED BASKET
          ================================================= */}

         <div
  className={`
    fixed
    bottom-5
    left-1/2
    z-[251]
    flex
    -translate-x-1/2
    flex-col

    h-[min(620px,calc(100dvh-32px))]
    w-[min(380px,calc(100vw-24px))]

    overflow-hidden
    rounded-[26px]
    border
    border-[#17351d]/10
    bg-[#f5f3e8]/95
    text-[#17351d]
    shadow-[0_25px_80px_rgba(8,21,11,.25)]
    backdrop-blur-2xl

    transition-[opacity,transform,filter]
    duration-[650ms]
    ease-[cubic-bezier(.22,1,.36,1)]

    ${
      basketOpen
        ? 'pointer-events-auto translate-y-0 opacity-100 blur-0'
        : 'pointer-events-none translate-y-3 opacity-0 blur-[8px]'
    }

    sm:bottom-6

    md:left-auto
    md:right-6
    md:translate-x-0
  `}
>
            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-[#17351d]/10
                px-5
                py-4
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-[#71864d]
                  "
                >
                  Your selection
                </p>

                <h3
                  className="
                    mt-1
                    font-playfair
                    text-2xl
                    italic
                  "
                >
                  Basket
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setBasketOpen(false)}
                aria-label="Collapse basket"
                className="
                  ml-4
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#17351d]/10
                  bg-white/60
                  text-lg
                  transition-all
                  duration-300
                  hover:bg-[#17351d]
                  hover:text-white
                  active:scale-90
                "
              >
                 ×
              </button>
            </div>

            {/* =================================================
    ITEMS
================================================= */}

<div
  className="
    min-h-0
    flex-1
    overflow-y-auto
    overscroll-contain
    px-4
    py-4
  "
>
  <div className="flex flex-col gap-2.5">
    {basket.map((item) => {
      const itemKey =
        `${item.product.id}-${item.variant.label}`

      return (
        <div
          key={itemKey}
          className={`
            rounded-[18px]
            border
            border-[#17351d]/10
            bg-white/65
            p-3.5

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:shadow-[0_8px_25px_rgba(8,21,11,.06)]

            ${
              removingBasketItem === itemKey
                ? 'pointer-events-none animate-[basketItemRemove_.32s_ease-out_forwards]'
                : newBasketItemKey === itemKey
                  ? 'animate-[basketItemEnter_.42s_cubic-bezier(.22,1,.36,1)]'
                  : ''
            }
          `}
        >

          {/* PRODUCT INFORMATION */}

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h4
                className="
                  font-playfair
                  text-[17px]
                  leading-tight
                  italic
                "
              >
                {item.product.name}
              </h4>

              <p
                className="
                  mt-1
                  text-[8px]
                  uppercase
                  tracking-[0.12em]
                  text-[#17351d]/40
                "
              >
                {item.variant.label} · {item.product.origin}
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
              <RollingNumber
                value={
                  item.variant.price *
                  item.quantity
                }
                prefix="₹"
              />
            </span>

          </div>


          {/* QUANTITY */}

          <div className="mt-3 flex items-center justify-between">

            <div
              className="
                flex
                items-center
                rounded-full
                border
                border-[#17351d]/10
                bg-white/75
              "
            >

              <button
                type="button"
                onClick={() =>
                  updateBasketQuantity(
                    item.product.id,
                    item.variant.label,
                    -1
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  text-sm
                  transition-all
                  duration-200
                  hover:bg-[#17351d]/5
                  hover:scale-105
                  active:scale-75
                "
              >
                −
              </button>

              <span
                key={item.quantity}
                className="
                  w-7
                  overflow-hidden
                  text-center
                  text-xs
                  font-semibold
                  tabular-nums
                  animate-[basketQuantity_.35s_ease-out]
                "
              >
                <RollingNumber
                  value={item.quantity}
                />
              </span>

              <button
                type="button"
                onClick={() =>
                  updateBasketQuantity(
                    item.product.id,
                    item.variant.label,
                    1
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  text-sm
                  transition-all
                  duration-200
                  hover:bg-[#17351d]/5
                  active:scale-90
                "
              >
                +
              </button>

            </div>

          </div>

        </div>
      )
    })}
  </div>
</div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
  className="
    shrink-0
    border-t
    border-[#17351d]/10
    bg-[#f5f3e8]/95
    px-5
    pb-5
    pt-4
  "
>
              {/* SUBTOTAL STRUCTURE */}

              <div
                className="
                  grid
                  grid-cols-[1fr_auto]
                  items-center
                  gap-4
                "
              >
                {/* LEFT */}

                <div className="min-w-0">
                  <span
                    className="
                      block
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#17351d]/40
                    "
                  >
                    Subtotal
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[9px]
                      text-[#17351d]/30
                    "
                  >
                    {basketCount}{' '}
                    {basketCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* RIGHT */}

                <div
  className="
    shrink-0
    min-w-[110px]
    py-1
    text-right
    font-playfair
    text-[27px]
    leading-[1.2]
    italic
    text-[#17351d]
    tabular-nums
    whitespace-nowrap
  "
>
                  <RollingNumber
                    value={basketTotal}
                    prefix="₹"
                  />
                </div>
              </div>

              {/* CHECKOUT BUTTON */}

              <button
                type="button"
                onClick={() => {
                  setBasketOpen(false)
                  setCheckoutOpen(true)
                }}
                className="
                  mt-4
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
                  transition-all
                  duration-300
                  hover:bg-[#244b2b]
                  active:scale-[0.98]
                "
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}