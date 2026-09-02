import { useRef, useState } from 'react'
import type { Product, ProductVariant } from '../data/products'
import RollingNumber from './RollingNumber'

const FRUIT_SHOP_IMAGE = '/fruit-shop-placeholder.png'
const ROYAL_ITALIC_FONT = "'Cormorant Garamond', Georgia, serif"

export default function ProductCard({
  product,
  basket,
  onAddToBasket,
  onUpdateBasketQuantity,
  onOpenProduct,
}: {
  product: Product
  basket: {
    product: Product
    variant: ProductVariant
    quantity: number
  }[]
  onUpdateBasketQuantity: (
    productId: string,
    variantLabel: string,
    change: number
  ) => void
  onAddToBasket: (
    product: Product,
    variant: ProductVariant
  ) => void
  onOpenProduct: (product: Product) => void
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]
  )

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageDragX, setImageDragX] = useState(0)
  const [isDraggingImage, setIsDraggingImage] = useState(false)

  const imageTouchStartX = useRef<number | null>(null)

  /* =========================================================
     IMAGE CAROUSEL
     ========================================================= */

  const images = product.images?.length
    ? product.images
    : [FRUIT_SHOP_IMAGE]

  const handleImageTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (images.length < 2) return

    imageTouchStartX.current =
      event.touches[0]?.clientX ?? null

    setIsDraggingImage(true)
  }

  const handleImageTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    const startX = imageTouchStartX.current

    if (startX === null) return

    const currentX =
      event.touches[0]?.clientX ?? startX

    setImageDragX(currentX - startX)
  }

  const handleImageTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    const startX = imageTouchStartX.current

    if (startX === null) return

    const endX =
      event.changedTouches[0]?.clientX ?? startX

    const distance = endX - startX

    imageTouchStartX.current = null
    setIsDraggingImage(false)

    if (images.length < 2) {
      setImageDragX(0)
      return
    }

    const threshold = 45

    if (distance < -threshold) {
      setSelectedImageIndex(
        (current) => (current + 1) % images.length
      )
    } else if (distance > threshold) {
      setSelectedImageIndex(
        (current) =>
          (current - 1 + images.length) %
          images.length
      )
    }

    setImageDragX(0)
  }

  /* =========================================================
     CURRENT BASKET QUANTITY
     ========================================================= */

  const basketItem = basket.find(
    (item) =>
      item.product.id === product.id &&
      item.variant.label === selectedVariant.label
  )

  const quantity = basketItem?.quantity ?? 0
  const isInBasket = quantity > 0

/* =========================================================
   ORIGIN FLAG
   ========================================================= */

const originCodes: Record<string, string> = {
  'New Zealand': 'nz',
  Kenya: 'ke',
  USA: 'us',
  'United States': 'us',

  China: 'cn',
  Chile: 'cl',
  Vietnam: 'vn',
  Peru: 'pe',
  India: 'in',
  Australia: 'au',
  Japan: 'jp',
  Mexico: 'mx',

  Turkey: 'tr',
  Türkiye: 'tr',

  Spain: 'es',
  Italy: 'it',
  'South Africa': 'za',
  Egypt: 'eg',

  Iran: 'ir',
  Iraq: 'iq',
  Tunisia: 'tn',

  Afghanistan: 'af',
  Algeria: 'dz',
  Argentina: 'ar',
  Austria: 'at',
  Belgium: 'be',
  Bangladesh: 'bd',
  Brazil: 'br',
  Canada: 'ca',
  Colombia: 'co',

  'Costa Rica': 'cr',

  Ecuador: 'ec',
  France: 'fr',
  Germany: 'de',
  Greece: 'gr',
  Israel: 'il',
  Jordan: 'jo',
  Morocco: 'ma',
  Netherlands: 'nl',
  Pakistan: 'pk',
  Philippines: 'ph',
  Portugal: 'pt',

  Saudi: 'sa',
  'Saudi Arabia': 'sa',

  Thailand: 'th',

  UAE: 'ae',
  'United Arab Emirates': 'ae',

  UK: 'gb',
  'United Kingdom': 'gb',
}

const originCode =
  originCodes[product.origin.trim()] || 'un'

  /* =========================================================
     PACK / QUANTITY DESCRIPTION
     ========================================================= */

  const quantityDescription =
    product.quantity || selectedVariant.label

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <article
      onClick={() => onOpenProduct(product)}
      className="
        group
        relative
        flex
        h-full
        min-w-0
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        border-[#17351d]/10
        bg-white/80
        shadow-[0_6px_20px_rgba(8,21,11,0.05)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(8,21,11,0.09)]
        sm:rounded-[22px]
      "
    >

      {/* =====================================================
          IMAGE
          ===================================================== */}

      <div
        className="
          relative
          aspect-[0.94]
          shrink-0
          overflow-hidden
          bg-[#eef2df]
          touch-pan-y
          sm:aspect-[1.05]
        "
        onTouchStart={handleImageTouchStart}
        onTouchMove={handleImageTouchMove}
        onTouchEnd={handleImageTouchEnd}
      >

        {/* IMAGE TRACK */}

        <div
          className="flex h-full w-full"
          style={{
            transform: `
              translate3d(
                calc(
                  ${-selectedImageIndex * 100}%
                  + ${imageDragX}px
                ),
                0,
                0
              )
            `,
            transition: isDraggingImage
              ? 'none'
              : 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
        >
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="
                relative
                h-full
                w-full
                shrink-0
              "
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                draggable={false}
                loading={
                  index === 0 ? 'eager' : 'lazy'
                }
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

        {/* ===================================================
            COUNTRY ORIGIN TAG
            =================================================== */}

        <div
          className="
            absolute
            left-2.5
            top-2.5
            z-10
            flex
            items-center
            gap-1.5
            rounded-full
            bg-white/92
            px-2.5
            py-1.5
            text-[8px]
            font-semibold
            text-[#17351d]
            shadow-[0_3px_10px_rgba(8,21,11,0.10)]
            backdrop-blur-md
            sm:left-3
            sm:top-3
            sm:px-3
            sm:py-1.5
            sm:text-[9px]
          "
        >
          <img
  src={`https://flagcdn.com/w40/${originCode}.png`}
  alt={`${product.origin} flag`}
  className="h-3 w-5 rounded-[2px] object-cover"
/>

          <span className="max-w-[90px] truncate">
            {product.origin}
          </span>
        </div>

        {/* ===================================================
            ADD / QUANTITY
            =================================================== */}

       <div
  className="
    absolute
    bottom-5
    right-2.5
    z-20
    sm:bottom-5
    sm:right-3
  "
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          {!isInBasket ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()

                onAddToBasket(
                  product,
                  selectedVariant
                )
              }}
              className="
                flex
                h-8
                min-w-[58px]
                items-center
                justify-center
                rounded-full
                border
                border-[#17351d]
                bg-white
                px-3
                text-[10px]
                font-semibold
                text-[#17351d]
                shadow-[0_4px_14px_rgba(8,21,11,0.14)]
                transition-all
                duration-300
                hover:bg-[#17351d]
                hover:text-white
                active:scale-[0.96]
                sm:h-9
                sm:min-w-[64px]
                sm:text-[11px]
              "
            >
              Add
            </button>
          ) : (
            <div
              className="
                flex
                h-8
                min-w-[82px]
                items-center
                justify-between
                rounded-full
                bg-[#17351d]/96
                px-1
                text-white
                shadow-[0_5px_16px_rgba(8,21,11,0.22)]
                backdrop-blur-md
                sm:h-9
                sm:min-w-[92px]
              "
            >

              {/* DECREASE */}

              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={(event) => {
                  event.stopPropagation()

                  onUpdateBasketQuantity(
                    product.id,
                    selectedVariant.label,
                    -1
                  )
                }}
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  text-[16px]
                  transition
                  hover:bg-white/10
                  active:scale-90
                "
              >
                −
              </button>

              {/* QUANTITY */}

              <span
                className="
                  min-w-[22px]
                  text-center
                  text-[10px]
                  font-semibold
                  tabular-nums
                "
              >
                {quantity}
              </span>

              {/* INCREASE */}

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={(event) => {
                  event.stopPropagation()

                  onUpdateBasketQuantity(
                    product.id,
                    selectedVariant.label,
                    1
                  )
                }}
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  text-[16px]
                  transition
                  hover:bg-white/10
                  active:scale-90
                "
              >
                +
              </button>

            </div>
          )}

        </div>

        {/* ===================================================
            IMAGE INDICATORS
            =================================================== */}

        {images.length > 1 && (
          <div
            className="
              absolute
              bottom-2.5
              left-1/2
              z-10
              flex
              -translate-x-1/2
              items-center
              gap-1
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {images.slice(0, 3).map(
              (image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex(index)
                  }
                  aria-label={`View photo ${
                    index + 1
                  }`}
                  className={`
                    h-1
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      selectedImageIndex === index
                        ? 'w-4 bg-white'
                        : 'w-1 bg-white/60'
                    }
                  `}
                />
              )
            )}
          </div>
        )}

      </div>

      {/* =====================================================
          PRODUCT INFORMATION
          ===================================================== */}

      <div
  className="
    flex
    min-w-0
    flex-1
    flex-col
    px-3
    pb-1
    pt-2.5
    sm:px-4
    sm:pb-1.5
    sm:pt-3
  "
>

        {/* ===================================================
            NAME
            FIXED 2-LINE SPACE
            =================================================== */}

<div
  className="
    flex
    min-h-[44px]
    shrink-0
    items-start
  "
>
  <h3
    className="
      w-full
      overflow-hidden
      font-serif
      font-normal
      text-[15px]
      italic
      leading-[1.3]
      tracking-[-0.015em]
      text-[#17351d]
      sm:min-h-[46px]
      sm:text-[18px]
      sm:leading-[1.25]
    "
    style={{
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      fontFamily: ROYAL_ITALIC_FONT,
    }}
  >
    {product.name}
  </h3>
</div>

{/* ===================================================
    QUANTITY / PACK DESCRIPTION
    =================================================== */}

<div
  className="
    mt-1.5
    flex
    h-[24px]
    w-full
    shrink-0
    items-center
    overflow-hidden
    rounded-[7px]
    bg-[#17351d]/[0.035]
    px-2
    sm:mt-2
    sm:h-[26px]
  "
>
  <p
    className="
      w-full
      truncate
      whitespace-nowrap
      text-[8px]
      leading-none
      text-[#17351d]/60
      sm:text-[9px]
    "
  >
    {quantityDescription}
  </p>
</div>

{/* ===================================================
    VARIANT SELECTOR
    FULL-WIDTH / DEDICATED SPACE
    =================================================== */}

<div
  className="
    mt-2.5
    flex
    min-h-[42px]
    w-full
    shrink-0
    items-center
    sm:mt-3
    sm:min-h-[46px]
  "
  onClick={(event) =>
    event.stopPropagation()
  }
>
  {product.variants.length === 1 ? (
    <div
      className="
        flex
        h-[38px]
        w-full
        items-center
        rounded-[10px]
        border
        border-[#17351d]/15
        bg-[#17351d]/[0.035]
        px-3
        text-[10px]
        font-semibold
        text-[#17351d]/75
        sm:h-[42px]
        sm:text-[11px]
      "
    >
      {product.variants[0].label}
    </div>
  ) : (
    <div
      className="
        grid
        w-full
        grid-cols-3
        gap-1.5
      "
    >
      {product.variants
        .slice(0, 3)
        .map((variant) => {
          const selected =
            selectedVariant.label ===
            variant.label

          return (
            <button
              key={variant.label}
              type="button"
              onClick={() =>
                setSelectedVariant(variant)
              }
              className={`
                flex
                h-[38px]
                min-w-0
                items-center
                justify-center
                overflow-hidden
                rounded-[10px]
                px-2
                text-[9px]
                font-semibold
                transition-all
                duration-200
                active:scale-[0.97]
                sm:h-[42px]
                sm:text-[10px]
                ${
                  selected
                    ? `
                      bg-[#17351d]
                      text-[#efffb0]
                      shadow-[0_4px_12px_rgba(23,53,29,0.15)]
                    `
                    : `
                      border
                      border-[#17351d]/15
                      bg-white
                      text-[#17351d]/65
                      hover:border-[#17351d]/35
                      hover:bg-[#17351d]/[0.035]
                    `
                }
              `}
            >
              <span className="truncate">
                {variant.label}
              </span>
            </button>
          )
        })}
    </div>
  )}
</div>

{/* ===================================================
    PRICE
    =================================================== */}

<div
  className="
    mt-2
    flex
    min-h-[42px]
    shrink-0
    items-start
    justify-between
    gap-2
    border-t
    border-[#17351d]/10
    pb-0
    pt-0.5
    sm:mt-2.5
    sm:min-h-[48px]
    sm:pt-1
  "
>
  <div
    className="
      flex
      min-w-0
      items-end
      gap-2
      pb-0
    "
  >
    {/* CURRENT PRICE */}

    <span
      className="
        whitespace-nowrap
        font-serif
        text-[22px]
        font-normal
        italic
        leading-[1.08]
        pb-0.5
        tabular-nums
        text-[#17351d]
        sm:text-[26px]
      "
      style={{ fontFamily: ROYAL_ITALIC_FONT }}
    >
      <RollingNumber
        value={selectedVariant.price}
        prefix="₹"
      />
    </span>

    {/* ORIGINAL PRICE */}

    {selectedVariant.compareAtPrice && (
      <span
        className="
          whitespace-nowrap
          pb-0
          text-[9px]
          leading-none
          tabular-nums
          text-[#17351d]/40
          line-through
          sm:text-[11px]
        "
      >
        ₹
        {selectedVariant.compareAtPrice.toLocaleString(
          'en-IN'
        )}
      </span>
    )}
  </div>

  {/* SELECTED PACK */}

  <span
    className="
      max-w-[38%]
      shrink-0
      truncate
      pb-0
      text-right
      text-[7px]
      font-semibold
      uppercase
      leading-none
      tracking-[0.1em]
      text-[#17351d]/45
      sm:text-[8px]
    "
  >
    {selectedVariant.label}
  </span>
</div>

      </div>

    </article>
  )
}
