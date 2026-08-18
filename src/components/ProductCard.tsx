import { useRef, useState } from 'react'
import type { Product, ProductVariant } from '../data/products'
import RollingNumber from './RollingNumber'

const FRUIT_SHOP_IMAGE = '/fruit-shop-placeholder.png'


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
  const [selectedVariant, setSelectedVariant] =
    useState(product.variants[0])

  const [selectedImageIndex, setSelectedImageIndex] =
    useState(0)

const [imageDragX, setImageDragX] = useState(0)
const [isDraggingImage, setIsDraggingImage] = useState(false)

const imageTouchStartX = useRef<number | null>(null)

const handleImageTouchStart = (
  event: React.TouchEvent<HTMLDivElement>
) => {
  if (!product.images || product.images.length < 2) return

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

  const imageCount = product.images?.length ?? 0

  if (imageCount < 2) {
    setImageDragX(0)
    return
  }

  const threshold = 45

  if (distance < -threshold) {
    setSelectedImageIndex(
      (current) => (current + 1) % imageCount
    )
  } else if (distance > threshold) {
    setSelectedImageIndex(
      (current) =>
        (current - 1 + imageCount) % imageCount
    )
  }

  setImageDragX(0)
}

return (

<article
  onClick={() => onOpenProduct(product)}
  className="group relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#17351d]/10 bg-white/70 px-0 pb-2.5 pt-0 shadow-[0_6px_20px_rgba(8,21,11,0.05)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 sm:rounded-[22px] sm:pb-3"
>

      {/* IMAGE */}

      <div
  className="relative aspect-[1.32] shrink-0 overflow-hidden rounded-[12px] bg-[#eef2df] touch-pan-y sm:aspect-[1.18] sm:rounded-[18px]"
  onTouchStart={handleImageTouchStart}
  onTouchMove={handleImageTouchMove}
  onTouchEnd={handleImageTouchEnd}
>

        <div
  className="flex h-full w-full"
  style={{
    transform: `translate3d(calc(${-selectedImageIndex * 100}% + ${imageDragX}px), 0, 0)`,
    transition: isDraggingImage
      ? 'none'
      : 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'transform',
  }}
>
  {(product.images?.length
    ? product.images
    : [FRUIT_SHOP_IMAGE]
  ).map((image, index) => (
    <div
      key={`${image}-${index}`}
      className="relative h-full w-full shrink-0"
    >
      <img
        src={image}
        alt={`${product.name} ${index + 1}`}
        draggable={false}
        loading={index === 0 ? 'eager' : 'lazy'}
        className="h-full w-full select-none object-cover"
      />
    </div>
  ))}
</div>

        {product.badge && (
          <div className="absolute left-2 top-2 rounded-full bg-[#17351d] px-2 py-1 text-[6px] font-semibold tracking-[0.14em] text-[#efffb0] sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[8px]">
            {product.badge}
          </div>
        )}

        {product.rating && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[8px] text-[#17351d] backdrop-blur-md sm:right-3 sm:top-3 sm:px-2.5 sm:py-1.5 sm:text-[10px]">
            <span>★</span>

            <span>
              {product.rating.toFixed(1)}
            </span>

            {product.reviewCount && (
              <span className="text-black/35">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

      </div>

{/* PHOTO SELECTOR */}

{product.images && product.images.length > 1 && (
  <div
    className="flex items-center justify-center gap-1.5 pt-2"
    onClick={(event) => event.stopPropagation()}
  >
    {product.images.slice(0, 3).map((image, index) => (
      <button
        key={`${image}-${index}`}
        type="button"
        onClick={() => setSelectedImageIndex(index)}
        aria-label={`View photo ${index + 1}`}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          selectedImageIndex === index
            ? 'w-4 bg-[#17351d]'
            : 'w-1.5 bg-[#17351d]/20'
        }`}
      />
    ))}
  </div>
)}

      {/* PRODUCT INFORMATION */}

      <div className="flex min-w-0 flex-1 flex-col px-2.5 pt-2 sm:px-3 sm:pt-2">

        {/* NAME + ORIGIN */}

        <div className="h-[48px] min-w-0 shrink-0 sm:h-[52px]">

          <h3
            className="
              min-w-0
              max-w-full
              overflow-hidden
              font-serif
              font-medium
              leading-[1.2]
              tracking-[-0.01em]
              text-[#17351d]
              text-[13px]
              sm:whitespace-nowrap
              sm:text-[17px]
            "
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {product.name}
          </h3>

          <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[7px] uppercase tracking-[0.12em] text-[#17351d]/45 sm:mt-2 sm:text-[10px] sm:tracking-[0.12em]">
            {product.origin}
          </p>

        </div>

        {/* PRODUCT SELECTION */}

        <div className="flex h-[38px] shrink-0 items-center sm:h-[38px]">

          {product.variants.length === 1 ? (

            <span className="inline-flex max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[#17351d]/12 bg-[#17351d]/[0.04] px-2.5 py-1.5 text-[8px] font-medium text-[#17351d]/65 sm:px-3 sm:py-1.5 sm:text-[9px]">
              {product.quantity}
            </span>

          ) : (

            <div className="flex min-w-0 flex-wrap items-center gap-1">

              {product.variants.map((variant) => {

                const selected =
                  selectedVariant.label === variant.label

                return (
                  <button
                    key={variant.label}
                    type="button"
                    onClick={(event) => {
  event.stopPropagation()
  setSelectedVariant(variant)
}}
                    className={
                      selected
                        ? 'rounded-full bg-[#17351d] px-2.5 py-1 text-[7px] font-medium text-[#efffb0] sm:px-3 sm:py-1.5 sm:text-[9px]'
                        : 'rounded-full border border-[#17351d]/15 bg-transparent px-2.5 py-1 text-[7px] font-medium text-[#17351d]/65 transition hover:border-[#17351d]/35 sm:px-3 sm:py-1.5 sm:text-[9px]'
                    }
                  >
                    {variant.label}
                  </button>
                )
              })}

            </div>

          )}

        </div>

        {/* PRICE */}

<div className="flex h-[40px] shrink-0 items-center gap-1.5 sm:h-[42px]">

  <span className="text-[18px] font-semibold leading-none text-[#17351d] sm:text-[23px]">
    <RollingNumber
      value={selectedVariant.price}
      prefix="₹"
    />
  </span>

  {selectedVariant.compareAtPrice && (
    <span className="text-[8px] text-[#17351d]/35 line-through sm:text-[11px]">
      ₹
      {selectedVariant.compareAtPrice.toLocaleString('en-IN')}
    </span>
  )}

</div>

       {/* ADD TO BASKET / QUANTITY */}

<div className="mt-1 h-9 shrink-0 sm:h-12">

  {(() => {
    const basketItem = basket.find(
      (item) =>
        item.product.id === product.id &&
        item.variant.label === selectedVariant.label
    )

    const quantity = basketItem?.quantity ?? 0

    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()

            onAddToBasket(
              product,
              selectedVariant
            )
          }}
          className="flex h-full w-full items-center justify-center rounded-full bg-[#17351d] px-2 text-[9px] font-semibold tracking-[0.02em] text-white transition duration-300 hover:bg-[#244b2b] active:scale-[0.98] sm:px-4 sm:text-xs"
        >
          Add to Basket
        </button>
      )
    }

    return (
      <div
        className="flex h-full w-full items-center justify-between rounded-full bg-[#17351d] px-2 text-white sm:px-3"
        onClick={(event) => {
          event.stopPropagation()
        }}
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
          className="flex h-7 w-7 items-center justify-center rounded-full text-base transition hover:bg-white/10 active:scale-90 sm:h-9 sm:w-9"
        >
          −
        </button>

        {/* QUANTITY */}

        <span className="min-w-[24px] text-center text-[11px] font-semibold sm:text-sm">
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
          className="flex h-7 w-7 items-center justify-center rounded-full text-base transition hover:bg-white/10 active:scale-90 sm:h-9 sm:w-9"
        >
          +
        </button>

      </div>
    )
  })()}

</div>

</div>

</article>
  )
}
