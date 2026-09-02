import { useState } from 'react'

import {
  products,
  type Product,
  type ProductVariant,
} from '../data/products'
import RollingNumber from './RollingNumber'

const FRUIT_SHOP_IMAGE = '/fruit-shop-placeholder.png'

const countryFlags: Record<string, string> = {
  'New Zealand': '🇳🇿',
  'Washington, USA': '🇺🇸',
  USA: '🇺🇸',
  China: '🇨🇳',
  Turkey: '🇹🇷',
  Kenya: '🇰🇪',
  Vietnam: '🇻🇳',
  UAE: '🇦🇪',
  'South Africa': '🇿🇦',
  Egypt: '🇪🇬',
  Peru: '🇵🇪',
  Chile: '🇨🇱',
  India: '🇮🇳',
  Iran: '🇮🇷',
  Iraq: '🇮🇶',
  Tunisia: '🇹🇳',
  Japan: '🇯🇵',
}

type BasketItem = {
  product: Product
  variant: ProductVariant
  quantity: number
}

type ProductPopupProps = {
  selectedProduct: Product
  closeProductPopup: () => void
  selectedPopupVariant: ProductVariant | null
  basket: BasketItem[]

  selectedProductImageIndex: number
  productImageDragX: number
  isProductImageDragging: boolean
  isProductChanging: boolean

  setSelectedProduct: (product: Product | null) => void
  setSelectedPopupVariant: (variant: ProductVariant) => void
  setSelectedProductImageIndex: (index: number) => void
  setIsProductChanging: (value: boolean) => void

  handlePopupImageTouchStart: (
    event: React.TouchEvent<HTMLDivElement>
  ) => void

  handlePopupImageTouchMove: (
    event: React.TouchEvent<HTMLDivElement>
  ) => void

  handlePopupImageTouchEnd: (
    event: React.TouchEvent<HTMLDivElement>
  ) => void

  addToBasket: (
    product: Product,
    variant: ProductVariant
  ) => void

  updateBasketQuantity: (
    productId: string,
    variantLabel: string,
    change: number
  ) => void
}

export default function ProductPopup({
  selectedProduct,
  closeProductPopup,

  selectedPopupVariant,
  basket,

  selectedProductImageIndex,
  productImageDragX,
  isProductImageDragging,
  isProductChanging,

  setSelectedProduct,
  setSelectedPopupVariant,
  setSelectedProductImageIndex,
  setIsProductChanging,

  handlePopupImageTouchStart,
  handlePopupImageTouchMove,
  handlePopupImageTouchEnd,

  addToBasket,
  updateBasketQuantity,
}: ProductPopupProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (!selectedProduct) return null

  return (
   <div
  className="
    relative
    flex
    h-full
    w-full
    flex-col
    overflow-y-auto
    bg-[#f5f3e8]
    text-[#17351d]
    shadow-[0_30px_100px_rgba(0,0,0,.28)]
    sm:h-auto
    sm:max-h-[94vh]
    sm:overflow-hidden
    sm:max-w-[900px]
    sm:rounded-[30px]
    md:flex-row
  "
>

      {/* =====================================================
          CLOSE BUTTON
          ===================================================== */}

     <div className="sticky top-4 z-[50] flex h-0 justify-end px-4">
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation()
      closeProductPopup()
    }}
    aria-label="Close product details"
    className="
      flex
      h-11
      w-11
      items-center
      justify-center
      rounded-full
      border
      border-[#17351d]/10
      bg-white/90
      text-2xl
      font-light
      text-[#17351d]
      shadow-lg
      backdrop-blur-md
      transition-all
      duration-200
      hover:scale-105
      hover:bg-[#17351d]
      hover:text-white
      active:scale-90
    "
  >
    ×
  </button>
</div>

      {/* =====================================================
          IMAGE SECTION
          ===================================================== */}

      <div
        className="
          relative
          shrink-0
          bg-[#e9eadb]
          sm:h-[420px]
          md:h-auto
          md:w-[48%]
        "
      >

        <div
          className="
            relative
            h-[42svh]
            min-h-[300px]
            max-h-[460px]
            shrink-0
            overflow-hidden
            touch-pan-y
            sm:h-[420px]
            sm:rounded-t-[30px]
            md:h-full
            md:min-h-[650px]
            md:rounded-none
          "
          onTouchStart={handlePopupImageTouchStart}
          onTouchMove={handlePopupImageTouchMove}
          onTouchEnd={handlePopupImageTouchEnd}
        >

          {/* IMAGE TRACK */}

          <div
            className="flex h-full w-full"
            style={{
              transform: `translate3d(calc(${-selectedProductImageIndex * 100}% + ${productImageDragX}px), 0, 0)`,
              transition: isProductImageDragging
                ? 'none'
                : 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform',
            }}
          >

            {(selectedProduct.images?.length
              ? selectedProduct.images
              : [FRUIT_SHOP_IMAGE]
            ).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative h-full w-full shrink-0"
              >
                <img
                  src={image}
                  alt={`${selectedProduct.name} ${index + 1}`}
                  draggable={false}
                  className="
                    h-full
                    w-full
                    select-none
                    object-cover
                  "
                />
              </div>
            ))}

          </div>

        </div>

        {/* IMAGE DOTS */}

        {selectedProduct.images &&
          selectedProduct.images.length > 1 && (
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-[#f5f3e8]
                px-4
                py-3
                md:absolute
                md:bottom-5
                md:left-5
                md:z-20
                md:bg-transparent
              "
            >
              {selectedProduct.images
                .slice(0, 3)
                .map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setSelectedProductImageIndex(index)
                    }}
                    aria-label={`View photo ${index + 1}`}
                    className={`
                      h-1.5
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        selectedProductImageIndex === index
                          ? 'w-5 bg-[#efffb0]'
                          : 'w-1.5 bg-white/70'
                      }
                    `}
                  />
                ))}
            </div>
          )}

        {/* IMAGE THUMBNAILS */}

        {selectedProduct.images &&
          selectedProduct.images.length > 1 && (
            <div
              className="
                absolute
                bottom-4
                left-4
                right-4
                z-20
                flex
                gap-2
                overflow-x-auto
                sm:bottom-5
                sm:left-5
              "
            >
              {selectedProduct.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelectedProductImageIndex(index)
                  }}
                  className={`
                    h-[64px]
                    w-[64px]
                    shrink-0
                    overflow-hidden
                    rounded-[12px]
                    border-2
                    transition
                    sm:h-[72px]
                    sm:w-[72px]
                    ${
                      selectedProductImageIndex === index
                        ? 'border-[#efffb0] shadow-lg'
                        : 'border-white/70'
                    }
                  `}
                >
                  <img
                    src={image}
                    alt={`${selectedProduct.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        id="product-popup-scroll"
        className="
          min-h-0
          flex-1
          overflow-visible
          sm:overflow-y-auto
        "
      >

        <div
          className={`
            px-6
            pb-10
            pt-7
            transition-all
            duration-300
            sm:px-8
            sm:pb-10
            sm:pt-9
            md:px-10
            md:py-10
            ${
              isProductChanging
                ? 'translate-y-1 opacity-0'
                : 'translate-y-0 opacity-100'
            }
          `}
        >

          {/* CATEGORY */}

          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#71864d]">
            {selectedProduct.name.includes('Apple')
              ? 'Apples'
              : selectedProduct.name.includes('Grape')
                ? 'Grapes'
                : selectedProduct.name.includes('Cherry')
                  ? 'Cherries'
                  : selectedProduct.name.includes('Kiwi')
                    ? 'Kiwi'
                    : selectedProduct.name.includes('Date')
                      ? 'Dates'
                      : selectedProduct.name.includes('Mango')
                        ? 'Mangoes'
                        : selectedProduct.name.includes('Pear')
                          ? 'Pears'
                          : selectedProduct.name.includes('Orange')
                            ? 'Citrus'
                            : 'Premium Fruits'}
          </p>

          {/* PRODUCT NAME */}

          <h2 className="mt-2 max-w-[620px] font-playfair text-[34px] leading-[0.95] italic tracking-[-0.02em] sm:text-[43px]">
            {selectedProduct.name}
          </h2>

          {/* ORIGIN */}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#17351d]/45">
            <span className="text-lg leading-none">
              {countryFlags[selectedProduct.origin] ?? '🌍'}
            </span>

            <span>{selectedProduct.origin}</span>

            <span className="text-[#17351d]/20">·</span>

            <span>{selectedProduct.quantity}</span>
          </div>

          {/* RATING */}

          {selectedProduct.rating && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="text-[#17351d]">★</span>

              <span className="font-medium">
                {selectedProduct.rating.toFixed(1)}
              </span>

              {selectedProduct.reviewCount && (
                <span className="text-[#17351d]/35">
                  ({selectedProduct.reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          {/* PRICE */}

          <div className="mt-6 flex items-end gap-3">
            <span className="font-playfair text-[34px] font-semibold leading-none">
              <RollingNumber
                value={selectedPopupVariant?.price ?? 0}
                prefix="₹"
              />
            </span>

            {selectedPopupVariant?.compareAtPrice && (
              <span className="mb-1 text-sm text-[#17351d]/30 line-through">
                ₹
                {selectedPopupVariant.compareAtPrice.toLocaleString(
                  'en-IN'
                )}
              </span>
            )}
          </div>

          <div className="my-7 h-px bg-[#17351d]/10" />

          {/* DESCRIPTION */}

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
            About the fruit
          </p>

          <p className="mt-3 text-[14px] leading-7 text-[#17351d]/65 sm:text-[15px]">
            {selectedProduct.description ??
              `A carefully selected ${selectedProduct.name.toLowerCase()} from ${selectedProduct.origin}, chosen for exceptional freshness, flavour and quality.`}
          </p>

          {/* SELECTION */}

          <div className="mt-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
              Selection
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProduct.variants.map((variant) => {
                const selected =
                  selectedPopupVariant?.label === variant.label

                return (
                  <button
                    key={variant.label}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setSelectedPopupVariant(variant)
                    }}
                    className={
                      selected
                        ? 'rounded-full bg-[#17351d] px-4 py-2 text-xs font-medium text-[#efffb0] shadow-sm'
                        : 'rounded-full border border-[#17351d]/15 bg-white/60 px-4 py-2 text-xs font-medium text-[#17351d]/65 transition hover:border-[#17351d]/40 hover:bg-white'
                    }
                  >
                    {variant.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* HOW TO KEEP */}

          <div className="mt-7 rounded-[18px] border border-[#17351d]/10 bg-[#faf8ef] px-4 py-4">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efffb0] text-[#17351d]">
                ◇
              </div>

              <div>
                <p className="text-sm font-semibold">
                  How to keep it
                </p>

                <p className="mt-1 text-xs leading-5 text-[#17351d]/50">
                  Keep chilled in the refrigerator
                  for maximum freshness.
                </p>
              </div>
            </div>
          </div>

        {/* =================================================
    WHY YOU'LL LOVE IT
    ================================================= */}

<div className="mt-8">
  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
    Why you'll love it
  </p>

  <div className="mt-4 grid grid-cols-2 gap-3">

    <div className="rounded-[20px] border border-[#17351d]/10 bg-white/60 p-4">
      <div className="text-xl">✦</div>

      <p className="mt-3 text-sm font-semibold">
        Carefully selected
      </p>

      <p className="mt-1 text-xs leading-5 text-[#17351d]/50">
        Chosen for exceptional appearance, flavour and
        freshness.
      </p>
    </div>

    <div className="rounded-[20px] border border-[#17351d]/10 bg-white/60 p-4">
      <div className="text-xl">◈</div>

      <p className="mt-3 text-sm font-semibold">
        Premium quality
      </p>

      <p className="mt-1 text-xs leading-5 text-[#17351d]/50">
        A fruit experience selected to feel special from
        the very first bite.
      </p>
    </div>

  </div>
</div>


{/* =================================================
    TASTE & EXPERIENCE
    ================================================= */}

<div className="mt-8">
  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
    The experience
  </p>

  <div className="mt-4 rounded-[22px] border border-[#17351d]/10 bg-[#17351d] p-5 text-[#f5f3e8]">

    <p className="font-playfair text-[24px] italic">
      A little moment of luxury.
    </p>

    <p className="mt-3 text-sm leading-6 text-white/60">
      Enjoy {selectedProduct.name} at its freshest and
      let its natural flavour, texture and character do
      the talking.
    </p>

    <div className="mt-5 flex flex-wrap gap-2">

      {[
        'Naturally delicious',
        'Freshly selected',
        'Premium quality',
      ].map((quality) => (
        <span
          key={quality}
          className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-[#efffb0]/80"
        >
          {quality}
        </span>
      ))}

    </div>
  </div>
</div>


{/* =================================================
    NUTRITION
    ================================================= */}

<div className="mt-8">

  <div className="flex items-end justify-between gap-4">

    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
        Nutrition
      </p>

      <h3 className="mt-2 font-playfair text-[26px] italic">
        Naturally good.
      </h3>
    </div>

    <span className="text-[9px] text-[#17351d]/35">
      Approx. per 100g
    </span>

  </div>

  <div className="mt-4 grid grid-cols-2 gap-3">

    <div className="rounded-[20px] border border-[#17351d]/10 bg-[#efffb0]/35 p-4">
      <p className="text-[9px] uppercase tracking-[0.16em] text-[#17351d]/40">
        Energy
      </p>

      <p className="mt-2 font-playfair text-[26px]">
        ~60
      </p>

      <p className="text-[10px] text-[#17351d]/40">
        kcal
      </p>
    </div>

    <div className="rounded-[20px] border border-[#17351d]/10 bg-white/60 p-4">
      <p className="text-[9px] uppercase tracking-[0.16em] text-[#17351d]/40">
        Carbohydrates
      </p>

      <p className="mt-2 font-playfair text-[26px]">
        ~15g
      </p>

      <p className="text-[10px] text-[#17351d]/40">
        naturally occurring
      </p>
    </div>

    <div className="rounded-[20px] border border-[#17351d]/10 bg-white/60 p-4">
      <p className="text-[9px] uppercase tracking-[0.16em] text-[#17351d]/40">
        Fibre
      </p>

      <p className="mt-2 font-playfair text-[26px]">
        ~3g
      </p>

      <p className="text-[10px] text-[#17351d]/40">
        dietary fibre
      </p>
    </div>

    <div className="rounded-[20px] border border-[#17351d]/10 bg-[#e9eadb] p-4">
      <p className="text-[9px] uppercase tracking-[0.16em] text-[#17351d]/40">
        Naturally
      </p>

      <p className="mt-2 font-playfair text-[22px]">
        Fresh
      </p>

      <p className="mt-1 text-[10px] text-[#17351d]/40">
        real fruit goodness
      </p>
    </div>

  </div>

  <p className="mt-3 text-[10px] leading-5 text-[#17351d]/35">
    Nutritional values are approximate and can naturally
    vary depending on variety, ripeness and growing
    conditions.
  </p>

</div>


{/* =================================================
    STORAGE & FRESHNESS
    ================================================= */}

<div className="mt-8">

  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
    Freshness guide
  </p>

  <div className="mt-4 space-y-3">

    <div className="rounded-[20px] border border-[#17351d]/10 bg-white/60 p-4">

      <div className="flex gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efffb0] text-lg">
          ❄
        </div>

        <div>
          <p className="text-sm font-semibold">
            Store with care
          </p>

          <p className="mt-1 text-xs leading-5 text-[#17351d]/50">
            Keep refrigerated when appropriate and avoid
            unnecessary exposure to heat for the best
            freshness.
          </p>
        </div>

      </div>
    </div>

    <div className="rounded-[20px] border border-[#17351d]/10 bg-[#faf8ef] p-4">

      <div className="flex gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0e3] text-lg">
          ✦
        </div>

        <div>
          <p className="text-sm font-semibold">
            Best enjoyed fresh
          </p>

          <p className="mt-1 text-xs leading-5 text-[#17351d]/50">
            Wash before enjoying and serve when the fruit
            is at its freshest for the best flavour and
            texture.
          </p>
        </div>

      </div>
    </div>

  </div>
</div>

{/* =================================================
    FAQs
    ================================================= */}

<div className="mt-9">

  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
    Questions
  </p>

  <h3 className="mt-2 font-playfair text-[28px] italic">
    Good to know.
  </h3>

  <div className="mt-5 overflow-hidden rounded-[22px] border border-[#17351d]/10 bg-white/60">

    {[
      {
        question: `Where does this ${selectedProduct.name} come from?`,
        answer: `This fruit is sourced from ${selectedProduct.origin} and selected for freshness, appearance and overall quality.`,
      },
      {
        question: 'How should I store it?',
        answer: 'For the best experience, follow the freshness guidance above and enjoy the fruit while it is at its best.',
      },
      {
        question: 'How do I know it is ready to enjoy?',
        answer: 'Fresh fruit naturally changes with ripeness. Check its appearance, texture and aroma, and enjoy it according to your preferred level of ripeness.',
      },
      {
        question: 'Can I order different quantities?',
        answer: 'Yes. Choose your preferred selection above before adding the fruit to your basket.',
      },
    ].map((faq, index) => {
      const isOpen = openFaq === index

      return (
        <div
          key={faq.question}
          className={
            index > 0
              ? 'border-t border-[#17351d]/10'
              : ''
          }
        >
          <button
            type="button"
            onClick={() =>
              setOpenFaq(
                isOpen ? null : index
              )
            }
            className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
          >
            <span className="text-sm font-semibold">
              {faq.question}
            </span>

            <span
              className={`
                text-xl
                text-[#17351d]/45
                transition-transform
                duration-300
                ${isOpen ? 'rotate-45' : 'rotate-0'}
              `}
            >
              +
            </span>
          </button>

          <div
            className={`
              grid
              transition-all
              duration-300
              ${
                isOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }
            `}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-5 text-xs leading-6 text-[#17351d]/50">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      )
    })}

  </div>
</div>

          {/* =================================================
              ADD TO BASKET / QUANTITY
              ================================================= */}

          {selectedPopupVariant &&
            (() => {
              const popupBasketItem = basket.find(
                (item) =>
                  item.product.id === selectedProduct.id &&
                  item.variant.label === selectedPopupVariant.label
              )

              const popupQuantity =
                popupBasketItem?.quantity ?? 0

              if (popupQuantity <= 0) {
                return (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()

                      addToBasket(
                        selectedProduct,
                        selectedPopupVariant
                      )
                    }}
                    className="
                      mt-7
                      flex
                      h-[56px]
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-[18px]
                      bg-[#0d4b36]
                      px-6
                      text-[15px]
                      font-semibold
                      text-white
                      shadow-[0_12px_30px_rgba(13,75,54,.18)]
                      transition
                      hover:bg-[#17351d]
                      active:scale-[0.98]
                    "
                  >
                    <span className="text-2xl font-light leading-none">
                      +
                    </span>

                    Add to Basket
                  </button>
                )
              }

              return (
                <div
                  className="
                    mt-7
                    flex
                    h-[56px]
                    w-full
                    items-center
                    justify-between
                    rounded-[18px]
                    bg-[#0d4b36]
                    px-4
                    text-white
                    shadow-[0_12px_30px_rgba(13,75,54,.18)]
                  "
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={(event) => {
                      event.stopPropagation()

                      updateBasketQuantity(
                        selectedProduct.id,
                        selectedPopupVariant.label,
                        -1
                      )
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      text-xl
                      transition
                      hover:bg-white/10
                      active:scale-90
                    "
                  >
                    −
                  </button>

                  <span className="text-base font-semibold">
                    {popupQuantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={(event) => {
                      event.stopPropagation()

                      updateBasketQuantity(
                        selectedProduct.id,
                        selectedPopupVariant.label,
                        1
                      )
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      text-xl
                      transition
                      hover:bg-white/10
                      active:scale-90
                    "
                  >
                    +
                  </button>
                </div>
              )
            })()}

          {/* PRICE DROP */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-2
              text-sm
              text-[#17351d]/45
              transition
              hover:text-[#17351d]
            "
          >
            <span>🔔</span>

            <span>
              Notify me if the price drops
            </span>
          </button>

          <div className="my-8 h-px bg-[#17351d]/10" />

          {/* =================================================
              YOU MAY ALSO LIKE
              ================================================= */}

          <div>
            <h3 className="font-playfair text-[25px] italic">
              You may also like
            </h3>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {products
                .filter(
                  (product) =>
                    product.id !== selectedProduct.id
                )
                .slice(0, 4)
                .map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setIsProductChanging(true)

                      setTimeout(() => {
                        setSelectedProduct(product)
                        setSelectedProductImageIndex(0)

                        if (product.variants.length > 0) {
                          setSelectedPopupVariant(
                            product.variants[0]
                          )
                        }

                        requestAnimationFrame(() => {
                          const popupScroll =
                            document.getElementById(
                              'product-popup-scroll'
                            )

                          if (popupScroll) {
                            popupScroll.scrollTo({
                              top: 0,
                              behavior: 'instant',
                            })
                          }
                        })

                        setTimeout(() => {
                          setIsProductChanging(false)
                        }, 50)
                      }, 220)
                    }}
                    className="
                      w-[150px]
                      shrink-0
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-[#17351d]/10
                      bg-white
                      text-left
                      transition
                      hover:-translate-y-1
                    "
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={
                          product.images?.[0] ??
                          FRUIT_SHOP_IMAGE
                        }
                        alt={product.name}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-500
                        "
                      />

                      {product.badge && (
                        <span
                          className="
                            absolute
                            left-2
                            top-2
                            rounded-full
                            bg-[#17351d]
                            px-2
                            py-1
                            text-[6px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-[#efffb0]
                          "
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="line-clamp-2 font-playfair text-[15px] leading-tight">
                        {product.name}
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        ₹
                        {product.variants[0].price.toLocaleString(
                          'en-IN'
                        )}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* =================================================
              CUSTOMER REVIEWS
              ================================================= */}

          <div className="mt-8 border-t border-[#17351d]/10 pt-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-playfair text-[25px] italic">
                Customer reviews
              </h3>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                }}
                className="
                  rounded-full
                  border
                  border-[#17351d]/10
                  bg-white/60
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  transition
                  hover:bg-white
                "
              >
                ✍ Write a review
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#17351d]/40">
              {selectedProduct.reviewCount
                ? `${selectedProduct.reviewCount} customer review${
                    selectedProduct.reviewCount > 1
                      ? 's'
                      : ''
                  } for this fruit.`
                : 'No reviews yet — ordered this fruit? Be the first to review it!'}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}