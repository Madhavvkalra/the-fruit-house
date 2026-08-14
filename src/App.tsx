import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { ArrowUpRight, MapPin, Menu } from 'lucide-react'

const WHOLE_IMAGE_MOBILE = '/fruit-whole-mobile.png'
const CUT_IMAGE_MOBILE = '/fruit-cut-mobile.png'
const WHOLE_IMAGE_DESKTOP = '/fruit-whole-desktop.png'
const CUT_IMAGE_DESKTOP = '/fruit-cut-desktop.png'

const AUTO_START_DELAY = 900
const AUTO_STEP_DELAY = 2400
const AUTO_RESUME_DELAY = 3000

const FRUIT_SHOP_IMAGE = '/fruit-shop-placeholder.png'

type ProductVariant = {
  label: string
  price: number
  compareAtPrice?: number
}

type Product = {
  id: string
  name: string
  origin: string
  images?: string[]
  quantity: string
  description?: string
  badge?: string
  rating?: number
  reviewCount?: number
  note?: string
  variants: ProductVariant[]
}

const products: Product[] = [
  {
    id: 'gala-apples',
    name: 'New Zealand Gala Apples',
    origin: 'New Zealand',
   images: [
  '/gala-apple-1.jpg',
  '/gala-apple-2.jpg',
  '/gala-apple-3.jpg',
],
    quantity: '4 pcs · ~700–750g',

description:
    'Crisp, naturally sweet and beautifully aromatic, New Zealand Gala Apples are known for their delicate floral fragrance, fine texture and refreshing bite. Grown in the cool orchards of New Zealand, these apples offer a balanced sweetness with a gentle crispness that makes them perfect for everyday snacking, breakfast bowls and fresh fruit platters.',

    badge: 'PREMIUM',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '4 pcs',
        price: 349,
        compareAtPrice: 549,
      },
    ],
  },

  {
    id: 'red-delicious',
    name: 'Red Delicious Apples',
    origin: 'Washington, USA',
    quantity: '4 pcs · ~700–750g',
    badge: 'PREMIUM',
    variants: [
      {
        label: '4 pcs',
        price: 389,
        compareAtPrice: 649,
      },
    ],
  },

  {
    id: 'shine-muscat',
    name: 'Shine Muscat Seedless Grapes',
    origin: 'China',
    quantity: '500g',
    badge: 'PREMIUM',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '500g',
        price: 300,
        compareAtPrice: 500,
      },
    ],
  },

  {
    id: 'turkish-cherries',
    name: 'Turkish Cherries',
    origin: 'Turkey',
    quantity: 'Select your weight',
    badge: 'PREMIUM',
    variants: [
      {
        label: '250g',
        price: 500,
      },
      {
        label: '500g',
        price: 900,
      },
      {
        label: '2kg',
        price: 3200,
      },
    ],
  },

  {
    id: 'avocado',
    name: 'Avocado',
    origin: 'Kenya',
    quantity: 'Ready to eat',
    badge: 'BEST SELLER',
    rating: 5,
    reviewCount: 4,
    note: 'Ripe in 3–5 days',
    variants: [
      {
        label: '1 pc',
        price: 249,
        compareAtPrice: 379,
      },
    ],
  },

  {
    id: 'dragon-fruit',
    name: 'Dragon Fruit',
    origin: 'Vietnam',
    quantity: '2 pcs',
    badge: 'TRENDING',
    variants: [
      {
        label: '2 pcs',
        price: 250,
      },
    ],
  },

  {
    id: 'medjoul-dates',
    name: 'Medjoul Dates',
    origin: 'UAE',
    quantity: '500g',
    badge: 'PREMIUM',
    rating: 5,
    reviewCount: 3,
    variants: [
      {
        label: '500g',
        price: 999,
        compareAtPrice: 1299,
      },
    ],
  },

  {
    id: 'kiwi-chile',
    name: 'Kiwi',
    origin: 'Chile',
    quantity: '4 pcs',
    badge: 'BEST SELLER',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '4 pcs',
        price: 240,
        compareAtPrice: 300,
      },
    ],
  },

  {
    id: 'queen-apples',
    name: 'New Zealand Queen Apples',
    origin: 'New Zealand',
    quantity: '4 pcs · ~700–750g',
    variants: [
      {
        label: '4 pcs',
        price: 349,
      },
    ],
  },

  {
    id: 'granny-smith',
    name: 'Granny Smith Apples',
    origin: 'USA',
    quantity: '4 pcs · ~700–750g',
    variants: [
      {
        label: '4 pcs',
        price: 360,
      },
    ],
  },

  {
    id: 'packham-pears',
    name: 'Packham Pears',
    origin: 'South Africa',
    quantity: '4 pcs · ~650–700g',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '4 pcs',
        price: 320,
      },
    ],
  },

  {
    id: 'beauty-pears',
    name: 'Beauty Pears',
    origin: 'South Africa',
    quantity: '4 pcs · ~650–700g',
    variants: [
      {
        label: '4 pcs',
        price: 379,
        compareAtPrice: 449,
      },
    ],
  },

  {
    id: 'egyptian-orange',
    name: 'Egyptian Valencia Orange',
    origin: 'Egypt',
    quantity: '4 pcs · ~800–850g',
    variants: [
      {
        label: '4 pcs',
        price: 160,
      },
    ],
  },

  {
    id: 'south-african-orange',
    name: 'South African Valencia Orange',
    origin: 'South Africa',
    quantity: '4 pcs · ~800–850g',
    variants: [
      {
        label: '4 pcs',
        price: 200,
      },
    ],
  },

  {
    id: 'royal-honey-murcott',
    name: 'Royal Honey Murcott (RHM)',
    origin: 'South Africa',
    quantity: '800–850g',
    variants: [
      {
        label: '800–850g',
        price: 300,
      },
    ],
  },

  {
    id: 'nova-mandarin',
    name: 'Nova Mandarin',
    origin: 'South Africa',
    quantity: '800–850g',
    note: 'By Sea',
    variants: [
      {
        label: '800–850g',
        price: 299,
      },
    ],
  },

  {
    id: 'nadorcott',
    name: 'Nadorcott Mandarins',
    origin: 'South Africa',
    quantity: '800–850g',
    variants: [
      {
        label: '800–850g',
        price: 300,
      },
    ],
  },

  {
    id: 'red-globe',
    name: 'Red Globe Grapes',
    origin: 'China',
    quantity: '500g',
    variants: [
      {
        label: '500g',
        price: 300,
      },
    ],
  },

  {
    id: 'black-finger',
    name: 'Black Finger Grapes',
    origin: 'China',
    quantity: '500g',
    badge: 'PREMIUM',
    variants: [
      {
        label: '500g',
        price: 399,
      },
    ],
  },

  {
    id: 'blueberries',
    name: 'Blueberries',
    origin: 'Peru',
    quantity: '125g',
    variants: [
      {
        label: '125g',
        price: 300,
      },
    ],
  },

  {
    id: 'new-zealand-kiwi',
    name: 'Kiwi',
    origin: 'New Zealand',
    quantity: '4 pcs',
    variants: [
      {
        label: '4 pcs',
        price: 299,
      },
    ],
  },

  {
    id: 'golden-kiwi',
    name: 'Golden Kiwi',
    origin: 'New Zealand',
    quantity: '4 pcs',
    variants: [
      {
        label: '4 pcs',
        price: 400,
        compareAtPrice: 419,
      },
    ],
  },

  {
    id: 'chausa-mango',
    name: 'Chausa Mango',
    origin: 'India',
    quantity: '2 pcs · ~750–800g',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '2 pcs',
        price: 250,
      },
    ],
  },

  {
    id: 'langda-mango',
    name: 'Langda Mango',
    origin: 'India',
    quantity: '~800g',
    variants: [
      {
        label: '800g',
        price: 200,
      },
    ],
  },

  {
    id: 'kimia-dates',
    name: 'Kimia Dates',
    origin: 'Iran',
    quantity: '500g',
    variants: [
      {
        label: '500g',
        price: 349,
        compareAtPrice: 399,
      },
    ],
  },

  {
  id: 'zahidi-dates',
  name: 'Zahidi Dates',
  origin: 'Iraq',
  quantity: 'Select your weight',
  variants: [
    {
      label: '250g',
      price: 349,
    },
    {
      label: '500g',
      price: 349,
    },
  ],
},

  {
    id: 'alig-dates',
    name: 'Alig Dates',
    origin: 'Tunisia',
    quantity: '200g',
    variants: [
      {
        label: '200g',
        price: 100,
        compareAtPrice: 120,
      },
    ],
  },
]

type Variety = { name: string; origin: string }

type Fruit = {
  id: string
  fruit: string
  x: number
  y: number
  triggerRadius: number
  varieties: Variety[]
}

const fruits: Fruit[] = [
  { id: 'grapes', fruit: 'Grapes', x: 25, y: 52, triggerRadius: 15, varieties: [{ name: 'Shine Muscat', origin: 'China' }] },
  { id: 'apple', fruit: 'Apple', x: 46, y: 48, triggerRadius: 17, varieties: [
    { name: 'Gala', origin: 'New Zealand' },
    { name: 'Red Delicious', origin: 'Washington, USA' },
    { name: 'Fuji', origin: 'Japan' },
  ]},
  { id: 'cherries', fruit: 'Cherries', x: 48, y: 69, triggerRadius: 14, varieties: [
    { name: 'American Cherries', origin: 'USA' },
    { name: 'Turkish Cherries', origin: 'Turkey' },
  ]},
  { id: 'avocado', fruit: 'Avocado', x: 63, y: 44, triggerRadius: 12, varieties: [{ name: 'Hass Avocado', origin: 'Kenya' }] },
  { id: 'dragonfruit', fruit: 'Dragon Fruit', x: 79, y: 55, triggerRadius: 12, varieties: [{ name: 'White Flesh', origin: 'Vietnam' }] },
  { id: 'kiwi', fruit: 'Kiwi', x: 64, y: 74, triggerRadius: 12, varieties: [{ name: 'Green Kiwi', origin: 'Chile' }] },
]

type ImageMetrics = {
  renderedWidth: number
  renderedHeight: number
  offsetX: number
  offsetY: number
}

function getCoverMetrics(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number
): ImageMetrics {
  const scale = Math.max(containerWidth / imageWidth, containerHeight / imageHeight)
  const renderedWidth = imageWidth * scale
  const renderedHeight = imageHeight * scale

  return {
    renderedWidth,
    renderedHeight,
    offsetX: (containerWidth - renderedWidth) / 2,
    offsetY: (containerHeight - renderedHeight) / 2,
  }
}

const countryFlags: Record<string, string> = {
  'New Zealand': '🇳🇿',
  'Washington, USA': '🇺🇸',
  'USA': '🇺🇸',
  'China': '🇨🇳',
  'Turkey': '🇹🇷',
  'Kenya': '🇰🇪',
  'Vietnam': '🇻🇳',
  'UAE': '🇦🇪',
  'South Africa': '🇿🇦',
  'Egypt': '🇪🇬',
  'Peru': '🇵🇪',
  'Chile': '🇨🇱',
  'India': '🇮🇳',
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Tunisia': '🇹🇳',
  'Japan': '🇯🇵',
}


function ProductCard({
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

function RollingNumber({
  value,
  prefix = '',
}: {
  value: number
  prefix?: string
}) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (displayValue === value) return

    const start = displayValue
    const difference = value - start
    const duration = 380
    const startTime = performance.now()

    let frame: number

    const animate = (time: number) => {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      )

      const eased =
        1 - Math.pow(1 - progress, 3)

      setDisplayValue(
        Math.round(start + difference * eased)
      )

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <span className="inline-flex overflow-hidden">
      <span className="inline-block tabular-nums">
        {prefix}
        {displayValue.toLocaleString('en-IN')}
      </span>
    </span>
  )
}


function App() {
  const heroRef = useRef<HTMLElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)


  
  const rawPointer = useRef({ x: -500, y: -500 })
  const smoothPointer = useRef({ x: -500, y: -500 })
  const animationRef = useRef<number | null>(null)

  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoIndexRef = useRef(0)
  const autoOrderRef = useRef<Fruit[]>([])
  const userInteractingRef = useRef(false)

  const [cursor, setCursor] = useState({ x: -500, y: -500 })
  const [insideHero, setInsideHero] = useState(false)
  const [activeFruit, setActiveFruit] = useState<Fruit | null>(null)
  const [isTouching, setIsTouching] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isAutoActive, setIsAutoActive] = useState(false)
  const [basket, setBasket] = useState<
  {
    product: Product
    variant: ProductVariant
    quantity: number
  }[]
>([])

const [isBasketPillEntering, setIsBasketPillEntering] =
  useState(false)

const [newBasketItemKey, setNewBasketItemKey] =
  useState<string | null>(null)

  const [isBasketCartReacting, setIsBasketCartReacting] =
  useState(false)

const [removingBasketItem, setRemovingBasketItem] =
  useState<string | null>(null)

  const [isBasketClosing, setIsBasketClosing] =
  useState(false)

const [selectedProductImageIndex, setSelectedProductImageIndex] =
  useState(0)

const [selectedPopupVariant, setSelectedPopupVariant] =
  useState<ProductVariant | null>(null)  


const [productImageDragX, setProductImageDragX] = useState(0)
const [isProductImageDragging, setIsProductImageDragging] =
  useState(false)

const productImageTouchStartX = useRef<number | null>(null)

const handlePopupImageTouchStart = (
  event: React.TouchEvent<HTMLDivElement>
) => {
  if (!selectedProduct?.images || selectedProduct.images.length < 2) {
    return
  }

  productImageTouchStartX.current =
    event.touches[0]?.clientX ?? null

  setIsProductImageDragging(true)
}

const handlePopupImageTouchMove = (
  event: React.TouchEvent<HTMLDivElement>
) => {
  const startX = productImageTouchStartX.current

  if (startX === null) return

  const currentX =
    event.touches[0]?.clientX ?? startX

  setProductImageDragX(currentX - startX)
}

const handlePopupImageTouchEnd = (
  event: React.TouchEvent<HTMLDivElement>
) => {
  const startX = productImageTouchStartX.current

  if (startX === null) return

  const endX =
    event.changedTouches[0]?.clientX ?? startX

  const distance = endX - startX

  productImageTouchStartX.current = null
  setIsProductImageDragging(false)

  const imageCount =
    selectedProduct?.images?.length ?? 0

  if (imageCount < 2) {
    setProductImageDragX(0)
    return
  }

  const threshold = 50

  if (distance < -threshold) {
    setSelectedProductImageIndex(
      (current) => (current + 1) % imageCount
    )
  } else if (distance > threshold) {
    setSelectedProductImageIndex(
      (current) =>
        (current - 1 + imageCount) % imageCount
    )
  }

  setProductImageDragX(0)
}

const [basketOpen, setBasketOpen] = useState(false)

const [isProductChanging, setIsProductChanging] = useState(false)

const [selectedProduct, setSelectedProduct] =
  useState<Product | null>(null)

const addToBasket = (
  product: Product,
  variant: ProductVariant
) => {
  const wasEmpty = basket.length === 0
const itemKey = `${product.id}-${variant.label}`

setNewBasketItemKey(itemKey)

const isNewProduct = !basket.some(
  (item) =>
    item.product.id === product.id &&
    item.variant.label === variant.label
)

  setBasket((current) => {
    const existing = current.find(
      (item) =>
        item.product.id === product.id &&
        item.variant.label === variant.label
    )

    if (existing) {
      return current.map((item) =>
        item === existing
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    }

    return [
      ...current,
      {
        product,
        variant,
        quantity: 1,
      },
    ]
  })

if (isNewProduct) {
  setIsBasketCartReacting(true)

  window.setTimeout(() => {
    setIsBasketCartReacting(false)
  }, 500)
}

window.setTimeout(() => {
    setNewBasketItemKey(null)
  }, 500)

  if (wasEmpty) {
  setIsBasketPillEntering(true)

  window.setTimeout(() => {
    setIsBasketPillEntering(false)
  }, 500)
}

}

const updateBasketQuantity = (
  productId: string,
  variantLabel: string,
  change: number
) => {
  const itemKey = `${productId}-${variantLabel}`

  const item = basket.find(
    (basketItem) =>
      basketItem.product.id === productId &&
      basketItem.variant.label === variantLabel
  )

  if (!item) return

  // Removing the final unit of this product
  if (change < 0 && item.quantity === 1) {

    // Check whether this is the ONLY product/variant
    // remaining in the basket.
    const isLastBasketItem = basket.length === 1

    if (isLastBasketItem) {
      setRemovingBasketItem(itemKey)
      setIsBasketClosing(true)

      // Let item removal animation play first
      window.setTimeout(() => {
        setBasketOpen(false)
      }, 320)

      // Remove the item after the basket collapses
      window.setTimeout(() => {
        setBasket((current) =>
          current.filter(
            (basketItem) =>
              `${basketItem.product.id}-${basketItem.variant.label}` !==
              itemKey
          )
        )

        setRemovingBasketItem(null)
        setIsBasketClosing(false)
      }, 760)

      return
    }

    // There are other products in the basket.
    // Remove ONLY this item and keep basket open.
    setRemovingBasketItem(itemKey)

    window.setTimeout(() => {
      setBasket((current) =>
        current.filter(
          (basketItem) =>
            `${basketItem.product.id}-${basketItem.variant.label}` !==
            itemKey
        )
      )

      setRemovingBasketItem(null)
    }, 320)

    return
  }

  // Normal + / − quantity change
  setBasket((current) =>
    current
      .map((basketItem) => {
        if (
          basketItem.product.id !== productId ||
          basketItem.variant.label !== variantLabel
        ) {
          return basketItem
        }

        return {
          ...basketItem,
          quantity: basketItem.quantity + change,
        }
      })
      .filter((basketItem) => basketItem.quantity > 0)
  )
}

const basketCount = basket.reduce(
  (total, item) => total + item.quantity,
  0
)

const basketTotal = basket.reduce(
  (total, item) =>
    total +
    item.variant.price * item.quantity,
  0
)
  
  const wholeImage = isMobile ? WHOLE_IMAGE_MOBILE : WHOLE_IMAGE_DESKTOP
  const cutImage = isMobile ? CUT_IMAGE_MOBILE : CUT_IMAGE_DESKTOP

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  // Faster than the old 0.1/0.3 easing, keeping pointer response under ~0.30s.
  useEffect(() => {
    const animate = () => {
      const ease = isMobile ? 0.45 : 0.28

      smoothPointer.current.x +=
        (rawPointer.current.x - smoothPointer.current.x) * ease
      smoothPointer.current.y +=
        (rawPointer.current.y - smoothPointer.current.y) * ease

      setCursor({
        x: smoothPointer.current.x,
        y: smoothPointer.current.y,
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMobile])

  const getFruitScreenPosition = (fruit: Fruit) => {
    const hero = heroRef.current
    const image = imageRef.current
    if (!hero || !image) return null

    const rect = hero.getBoundingClientRect()
    const imageWidth = image.naturalWidth || 1536
    const imageHeight = image.naturalHeight || 1024

    const metrics = getCoverMetrics(
      rect.width,
      rect.height,
      imageWidth,
      imageHeight
    )

    return {
      x: metrics.offsetX + (fruit.x / 100) * metrics.renderedWidth,
      y: metrics.offsetY + (fruit.y / 100) * metrics.renderedHeight,
    }
  }

  const shuffle = (items: Fruit[]) => {
    const copy = [...items]
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }

  // Automatic tour: shuffled fruit order, works on desktop AND mobile.
  useEffect(() => {
    const clearTimer = () => {
      if (autoTimerRef.current !== null) {
        clearTimeout(autoTimerRef.current)
        autoTimerRef.current = null
      }
    }

    const showNextFruit = () => {
      if (userInteractingRef.current) return

      if (
        autoOrderRef.current.length === 0 ||
        autoIndexRef.current >= autoOrderRef.current.length
      ) {
        autoOrderRef.current = shuffle(fruits)
        autoIndexRef.current = 0
      }

      const fruit = autoOrderRef.current[autoIndexRef.current]
      autoIndexRef.current += 1

      const position = getFruitScreenPosition(fruit)

      if (position) {
        rawPointer.current = position
        setActiveFruit(fruit)
        setIsAutoActive(true)
      }

      autoTimerRef.current = setTimeout(showNextFruit, AUTO_STEP_DELAY)
    }

    autoOrderRef.current = shuffle(fruits)
    autoIndexRef.current = 0
    clearTimer()

    autoTimerRef.current = setTimeout(showNextFruit, AUTO_START_DELAY)

    return clearTimer
  }, [isMobile])

  const pauseAutoForUser = () => {
    userInteractingRef.current = true
    setIsAutoActive(false)

    if (autoTimerRef.current !== null) {
      clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }

    if (autoResumeTimerRef.current !== null) {
      clearTimeout(autoResumeTimerRef.current)
    }

    autoResumeTimerRef.current = setTimeout(() => {
      userInteractingRef.current = false
      autoOrderRef.current = shuffle(fruits)
      autoIndexRef.current = 0

      const fruit = autoOrderRef.current[autoIndexRef.current]
      autoIndexRef.current += 1

      const position = getFruitScreenPosition(fruit)

      if (position) {
        rawPointer.current = position
        setActiveFruit(fruit)
        setIsAutoActive(true)
      }

      const continueAuto = () => {
        if (userInteractingRef.current) return

        if (autoIndexRef.current >= autoOrderRef.current.length) {
          autoOrderRef.current = shuffle(fruits)
          autoIndexRef.current = 0
        }

        const nextFruit = autoOrderRef.current[autoIndexRef.current]
        autoIndexRef.current += 1
        const nextPosition = getFruitScreenPosition(nextFruit)

        if (nextPosition) {
          rawPointer.current = nextPosition
          setActiveFruit(nextFruit)
          setIsAutoActive(true)
        }

        autoTimerRef.current = setTimeout(continueAuto, AUTO_STEP_DELAY)
      }

      autoTimerRef.current = setTimeout(continueAuto, AUTO_STEP_DELAY)
    }, AUTO_RESUME_DELAY)
  }

  const detectFruit = (localX: number, localY: number) => {
    const hero = heroRef.current
    const image = imageRef.current
    if (!hero || !image) return

    const rect = hero.getBoundingClientRect()
    const imageWidth = image.naturalWidth || 1536
    const imageHeight = image.naturalHeight || 1024

    const metrics = getCoverMetrics(
      rect.width,
      rect.height,
      imageWidth,
      imageHeight
    )

    const imageX = (localX - metrics.offsetX) / metrics.renderedWidth
    const imageY = (localY - metrics.offsetY) / metrics.renderedHeight
    const percentX = imageX * 100
    const percentY = imageY * 100

    let detectedFruit: Fruit | null = null
    let closestDistance = Infinity

    fruits.forEach((fruit) => {
      const dx = percentX - fruit.x
      const dy = percentY - fruit.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (
        distance < fruit.triggerRadius &&
        distance < closestDistance
      ) {
        closestDistance = distance
        detectedFruit = fruit
      }
    })

    setActiveFruit(detectedFruit)
  }

  const updatePointer = (event: ReactPointerEvent<HTMLElement>) => {
    const hero = heroRef.current
    if (!hero) return

    const rect = hero.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    rawPointer.current = { x, y }
    detectFruit(x, y)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') return

    pauseAutoForUser()
    setIsTouching(true)
    setInsideHero(true)

    event.currentTarget.setPointerCapture(event.pointerId)
    updatePointer(event)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') {
      pauseAutoForUser()
      setInsideHero(true)
      updatePointer(event)
      return
    }

    if (!isTouching) return
    updatePointer(event)
  }

  const endTouchInteraction = (
    event?: ReactPointerEvent<HTMLElement>
  ) => {
    if (event?.pointerType === 'mouse') return

    setIsTouching(false)
    setInsideHero(false)

    rawPointer.current = { x: -500, y: -500 }
    smoothPointer.current = { x: -500, y: -500 }
  }

  const showLens = isAutoActive || (isMobile ? isTouching : insideHero)

  // Responsive: never lets the lens dominate the viewport.
  const lensDiameter = isMobile
    ? Math.min(140, Math.max(105, window.innerWidth * 0.42))
    : Math.min(400, Math.max(260, window.innerWidth * 0.16))

  const lensRadius = lensDiameter / 2
  const displayFruit = activeFruit && showLens

  return (
    <main className="min-h-screen bg-[#08150b]">
      <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between p-5 md:px-10 md:py-7">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-xl">
            ✦
          </div>
          <span className="font-playfair text-xl italic sm:text-2xl md:text-[27px]">
            The Fruit House
          </span>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/20 p-2 backdrop-blur-xl md:flex">
          <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#17351d]">
            Fruits
          </button>
          {['Seasonal', 'Origins', 'Our Story', 'Journal'].map((item) => (
            <button
              key={item}
              className="rounded-full px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>

        <button className="hidden items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white hover:text-[#17351d] md:flex">
          Explore Collection <ArrowUpRight size={15} />
        </button>

        <button className="text-white md:hidden">
          <Menu size={27} />
        </button>
      </nav>

      <section
        ref={heroRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endTouchInteraction}
        onPointerCancel={endTouchInteraction}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setInsideHero(true)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setInsideHero(false)
        }}
        className="relative h-screen min-h-[650px] overflow-hidden bg-[#0b1b0e] md:cursor-none"
        style={{ height: '100dvh', touchAction: 'pan-y' }}
      >
        <img
          ref={imageRef}
          src={wholeImage}
          alt="The Fruit House premium fruit collection"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />

        <div className="pointer-events-none absolute inset-0 z-10 bg-black/20" />

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(90deg, rgba(4,16,7,.58) 0%, rgba(4,16,7,.13) 45%, rgba(4,16,7,.05) 100%)',
          }}
        />

        {showLens && (
          <div
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              backgroundImage: `url(${cutImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              WebkitMaskImage: `radial-gradient(circle ${lensRadius}px at ${cursor.x}px ${cursor.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 36%, rgba(0,0,0,.88) 53%, rgba(0,0,0,.48) 70%, rgba(0,0,0,.14) 86%, rgba(0,0,0,0) 100%)`,
              maskImage: `radial-gradient(circle ${lensRadius}px at ${cursor.x}px ${cursor.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 36%, rgba(0,0,0,.88) 53%, rgba(0,0,0,.48) 70%, rgba(0,0,0,.14) 86%, rgba(0,0,0,0) 100%)`,
            }}
          />
        )}

        <div className="pointer-events-none absolute left-5 right-5 top-[16%] z-30 text-white sm:left-10 sm:right-auto sm:max-w-[620px] md:left-14">
          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#efffb0] sm:mb-5 sm:text-xs">
            Discover what you're eating
          </p>
          <h1 className="leading-[0.9]">
            <span className="font-playfair block text-[48px] font-normal italic sm:text-7xl md:text-[92px]">
              Every fruit
            </span>
            <span className="font-playfair block text-[48px] font-normal italic sm:text-7xl md:text-[92px]">
              has a story.
            </span>
          </h1>
          <p className="mt-6 max-w-[280px] text-[13px] leading-6 text-white/65 sm:mt-8 sm:max-w-[310px] sm:text-sm sm:leading-7">
            Move across the harvest to uncover the freshness, varieties and origins behind every fruit.
          </p>
        </div>

        {showLens && (
          <div
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35"
            style={{
              left: cursor.x,
              top: isMobile ? cursor.y - 35 : cursor.y,
              width: lensDiameter,
              height: lensDiameter,
              boxShadow:
                '0 0 55px rgba(255,255,255,.08), inset 0 0 35px rgba(255,255,255,.04)',
            }}
          />
        )}

        {showLens && !isMobile && (
          <div
            className="pointer-events-none absolute z-50 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{ left: cursor.x, top: cursor.y }}
          />
        )}

        {displayFruit && !isMobile && (
          <div
            className="pointer-events-none absolute z-[70] w-[220px] rounded-[20px] border border-white/20 bg-[#071109]/82 p-4 text-white shadow-2xl backdrop-blur-2xl"
            style={{
              left:
                cursor.x > window.innerWidth * 0.72
                  ? cursor.x - 245
                  : cursor.x + 135,
              top:
                cursor.y > window.innerHeight * 0.68
                  ? cursor.y - 210
                  : cursor.y - 55,
            }}
          >
            <p className="text-[7px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]/70">
              Discover
            </p>
            <h2 className="font-playfair mt-1.5 text-[30px] leading-none italic">
              {activeFruit.fruit}
            </h2>
            <p className="mt-2 text-[10px] text-white/45">Varieties & origins</p>
            <div className="my-3.5 h-px bg-white/15" />
            <div className="flex flex-col gap-3">
              {activeFruit.varieties.map((variety) => (
                <div key={`${variety.name}-${variety.origin}`}>
                  <p className="text-[12px] font-medium">{variety.name}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[9px] text-white/50">
                    <MapPin size={10} />
                    <span>{variety.origin}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#efffb0]" />
              <span className="text-[6px] uppercase tracking-[0.2em] text-white/35">
                The Fruit House Selection
              </span>
            </div>
          </div>
        )}

        {!isTouching && !activeFruit && !isAutoActive && (
          <div className="pointer-events-none absolute bottom-[92px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[9px] uppercase tracking-[0.22em] text-white/55 md:hidden">
            <span className="h-px w-5 bg-white/30" />
            Touch & drag to reveal
            <span className="h-px w-5 bg-white/30" />
          </div>
        )}

        {!activeFruit && !isMobile && !isAutoActive && (
          <div className="pointer-events-none absolute bottom-9 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/45">
            <span className="h-px w-10 bg-white/25" />
            Move to reveal freshness
            <span className="h-px w-10 bg-white/25" />
          </div>
        )}

        {!isTouching && (
          <div className="absolute bottom-6 left-5 right-5 z-50 md:hidden">
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#efffb0] px-7 py-3.5 text-sm font-semibold text-[#17351d] shadow-xl">
              Explore Collection <ArrowUpRight size={16} />
            </button>
          </div>
        )}

       {displayFruit && isMobile && (
  <div
    className="pointer-events-none absolute z-[90] w-[185px] rounded-[18px] border border-white/20 bg-[#071109]/88 p-3.5 text-white shadow-2xl backdrop-blur-2xl"
    style={{
      left:
        cursor.x > window.innerWidth * 0.62
          ? cursor.x - 200
          : cursor.x + 100,

      top:
        cursor.y > window.innerHeight * 0.62
          ? cursor.y - 175
          : cursor.y - 20,
    }}
  >
    <p className="text-[6px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]/70">
      Discover
    </p>

    <h2 className="font-playfair mt-1 text-[25px] leading-none italic">
      {activeFruit.fruit}
    </h2>

    <p className="mt-1.5 text-[8px] text-white/40">
      Varieties & origins
    </p>

    <div className="my-3 h-px bg-white/10" />

    <div className="flex flex-col gap-2.5">
      {activeFruit.varieties.map((variety) => (
        <div key={`${variety.name}-${variety.origin}`}>
          <p className="text-[10px] font-medium">
            {variety.name}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-[8px] text-white/45">
            <MapPin size={8} />
            <span>{variety.origin}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-3 flex items-center gap-1.5">
      <div className="h-1 w-1 rounded-full bg-[#efffb0]" />

      <span className="text-[5px] uppercase tracking-[0.2em] text-white/30">
        The Fruit House Selection
      </span>
    </div>
  </div>
)}

            </section>

            {/* ==============================
          FRUIT SHOP
      ============================== */}

      <section
        id="fruit-shop"
        className="relative overflow-hidden bg-[#f5f3e8] px-5 py-20 text-[#17351d] sm:px-8 sm:py-24 md:px-12 md:py-28"
      >

        {/* SECTION HEADER */}

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            <div className="max-w-2xl">

              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#71864d] sm:text-[10px]">
                From the world's finest growing regions
              </p>

              <h2 className="font-playfair text-[48px] leading-[0.9] italic sm:text-6xl md:text-7xl">
                The Fruit Shop
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-6 text-[#17351d]/55 sm:text-base sm:leading-7">
                Extraordinary fruit, carefully selected from
                extraordinary places.
              </p>

            </div>

            {/* BASKET INDICATOR */}

            <button
              type="button"
              onClick={() => setBasketOpen(true)}
              className="hidden md:flex w-fit items-center gap-3 rounded-full border border-[#17351d]/15 bg-white/75 px-5 py-3 text-xs font-medium text-[#17351d] shadow-[0_8px_30px_rgba(8,21,11,.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#17351d] hover:text-white"
            >
              <span>Basket</span>

              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#17351d] px-1.5 text-[9px] text-white">
                <RollingNumber value={basketCount} />
              </span>

              <span className="text-[#17351d]/40">
                <RollingNumber
                  value={basketTotal}
                  prefix="₹"
                />
              </span>
            </button>

          </div>

          {/* PRODUCT GRID */}

          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">

            {products.map((product) => (
            <ProductCard
  key={product.id}
  product={product}
  basket={basket}
  onAddToBasket={addToBasket}
  onUpdateBasketQuantity={updateBasketQuantity}
  onOpenProduct={(product) => {
  setSelectedProduct(product)
  setSelectedProductImageIndex(0)
  setSelectedPopupVariant(product.variants[0])
}}
            />
            ))}

          </div>

        </div>

      </section>

      {/* =========================================================
    PRODUCT DETAIL POPUP
========================================================= */}

{selectedProduct && (
  <div
    className="fixed inset-0 z-[300] flex items-center justify-center bg-[#071109]/50 p-0 backdrop-blur-md sm:p-4 md:p-6"
    onClick={() => setSelectedProduct(null)}
  >

   <div
  className="relative flex h-full w-full flex-col overflow-y-auto bg-[#f5f3e8] text-[#17351d] shadow-[0_30px_100px_rgba(0,0,0,.28)] sm:h-auto sm:max-h-[94vh] sm:overflow-hidden sm:max-w-[900px] sm:rounded-[30px] md:flex-row"
  onClick={(event) => event.stopPropagation()}
>
 

      {/* =====================================================
          CLOSE BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          setSelectedProduct(null)
        }}
        aria-label="Close product details"
        className="absolute right-4 top-4 z-[50] flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl font-light text-[#17351d] shadow-lg backdrop-blur-md transition hover:bg-[#17351d] hover:text-white active:scale-95 sm:right-5 sm:top-5"
      >
        ×
      </button>


      {/* =====================================================
          IMAGE SECTION
      ===================================================== */}

      <div className="relative shrink-0 bg-[#e9eadb] sm:h-[420px] md:h-auto md:w-[48%]">

        {/* MAIN IMAGE */}

    <div
  className="relative h-[48vh] min-h-[330px] max-h-[560px] shrink-0 overflow-hidden touch-pan-y sm:h-[420px] sm:rounded-t-[30px] md:h-full md:min-h-[650px] md:rounded-none"
  onTouchStart={handlePopupImageTouchStart}
onTouchMove={handlePopupImageTouchMove}
onTouchEnd={handlePopupImageTouchEnd}
>

<div
  className="flex h-full w-full"
  style={{
    transform: `translate3d(calc(${-selectedProductImageIndex * 100}% + ${productImageDragX}px), 0, 0)`,
    transition: isProductImageDragging
      ? 'none'
      : 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
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
        className="h-full w-full select-none object-cover"
      />
    </div>
  ))}
</div>

          {/* BADGE */}

          {selectedProduct.badge && (
            <div className="absolute left-5 top-5 rounded-full bg-[#17351d] px-4 py-2 text-[8px] font-semibold tracking-[0.18em] text-[#efffb0] shadow-lg">
              {selectedProduct.badge}
            </div>
          )}

        </div>

{/* ADD THIS */}

      {selectedProduct.images &&
        selectedProduct.images.length > 1 && (
          <div className="flex items-center justify-center gap-2 bg-[#f5f3e8] px-4 py-3 md:absolute md:bottom-5 md:left-5 md:z-20 md:bg-transparent">

            {selectedProduct.images
              .slice(0, 3)
              .map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setSelectedProductImageIndex(index)
                  }
                  aria-label={`View photo ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    selectedProductImageIndex === index
                      ? 'w-5 bg-[#efffb0]'
                      : 'w-1.5 bg-white/70'
                  }`}
                />
              ))}

          </div>
        )}

        {/* =================================================
            IMAGE THUMBNAILS
        ================================================= */}

        {selectedProduct.images &&
          selectedProduct.images.length > 1 && (

            <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 overflow-x-auto sm:bottom-5 sm:left-5">

              {selectedProduct.images.map(
                (image, index) => (

                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setSelectedProductImageIndex(index)
                    }}
                    className={`
                      h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[12px]
                      border-2 transition
                      sm:h-[72px] sm:w-[72px]
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

                )
              )}

            </div>
          )}

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

    <div
  id="product-popup-scroll"
  className="min-h-0 flex-1 overflow-visible sm:overflow-y-auto"
>

        <div
  className={`px-6 pb-10 pt-7 sm:px-8 sm:pb-10 sm:pt-9 md:px-10 md:py-10 transition-all duration-300 ${
    isProductChanging
      ? 'translate-y-1 opacity-0'
      : 'translate-y-0 opacity-100'
  }`}
>


          {/* =================================================
              CATEGORY
          ================================================= */}

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


          {/* =================================================
              PRODUCT NAME
          ================================================= */}

          <h2 className="mt-2 max-w-[620px] font-playfair text-[34px] leading-[0.95] italic tracking-[-0.02em] sm:text-[43px]">
            {selectedProduct.name}
          </h2>


          {/* =================================================
              ORIGIN
          ================================================= */}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#17351d]/45">

            <span className="text-lg leading-none">
              {countryFlags[selectedProduct.origin] ?? '🌍'}
            </span>

            <span>
              {selectedProduct.origin}
            </span>

            <span className="text-[#17351d]/20">
              ·
            </span>

            <span>
              {selectedProduct.quantity}
            </span>

          </div>


          {/* =================================================
              RATING
          ================================================= */}

          {selectedProduct.rating && (
            <div className="mt-4 flex items-center gap-2 text-xs">

              <span className="text-[#17351d]">
                ★
              </span>

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


          {/* =================================================
              PRICE
          ================================================= */}
      
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


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="my-7 h-px bg-[#17351d]/10" />


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
            About the fruit
          </p>

          <p className="mt-3 text-[14px] leading-7 text-[#17351d]/65 sm:text-[15px]">
            {selectedProduct.description ??
              `A carefully selected ${selectedProduct.name.toLowerCase()} from ${selectedProduct.origin}, chosen for exceptional freshness, flavour and quality.`}
          </p>


         {/* =================================================
    SELECTION
================================================= */}

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

          {/* =================================================
              HOW TO KEEP
          ================================================= */}

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
              FULL DETAILS
          ================================================= */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="mt-3 flex w-full items-center justify-between rounded-[18px] border border-[#17351d]/10 bg-[#faf8ef] px-4 py-4 text-left transition hover:bg-white"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef0e3] text-[#17351d]">
                ≡
              </div>

              <span className="text-sm font-semibold">
                Full details, nutrition & FAQs
              </span>

            </div>

            <span className="text-xl">
              →
            </span>

          </button>

        

          {/* =================================================
              PRICE DROP
          ================================================= */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-[#17351d]/45 transition hover:text-[#17351d]"
          >

            <span>
              🔔
            </span>

            <span>
              Notify me if the price drops
            </span>

          </button>


          {/* =================================================
              DIVIDER
          ================================================= */}

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

    requestAnimationFrame(() => {
      const popupScroll =
        document.getElementById('product-popup-scroll')

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

                    className="w-[150px] shrink-0 overflow-hidden rounded-[18px] border border-[#17351d]/10 bg-white text-left transition hover:-translate-y-1"
                  >

                    <div className="relative aspect-square overflow-hidden">

                      <img
  src={
    product.images?.[0] ??
    FRUIT_SHOP_IMAGE
  }
  alt={product.name}
  loading="lazy"
  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
/>

                      {product.badge && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#17351d] px-2 py-1 text-[6px] font-semibold uppercase tracking-[0.12em] text-[#efffb0]">
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
                className="rounded-full border border-[#17351d]/10 bg-white/60 px-4 py-2 text-xs font-semibold transition hover:bg-white"
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

  </div>
)}

{/* =========================================================
    FLOATING BASKET
========================================================= */}

{(basketCount > 0 || isBasketClosing) && (
  <div
    className={`
      fixed bottom-5 left-1/2 z-[250] -translate-x-1/2
      sm:bottom-6
      md:left-auto md:right-6 md:translate-x-0
      transition-[width] duration-500 ease-[cubic-bezier(.22,1,.36,1)]
      ${basketOpen
        ? 'w-[min(380px,calc(100vw-24px))]'
        : 'w-auto'
      }
    `}
  >

    {/* =====================================================
        COLLAPSED PILL
    ===================================================== */}

    <div
      className={`
        absolute bottom-0 left-1/2 -translate-x-1/2
        md:left-auto md:right-0 md:translate-x-0
        transition-all duration-400
        ease-[cubic-bezier(.22,1,.36,1)]
        ${
  basketOpen || isBasketClosing
    ? 'pointer-events-none translate-y-3 scale-90 opacity-0'
    : isBasketPillEntering
      ? 'pointer-events-auto animate-[basketPillEnter_.5s_cubic-bezier(.22,1,.36,1)]'
      : 'pointer-events-auto translate-y-0 scale-100 opacity-100'
}
      `}
    >

      <button
        type="button"
        onClick={() => setBasketOpen(true)}
        className="
          group flex items-center gap-2
          rounded-full
          bg-[#17351d]
          px-4 py-2.5
          text-white
          shadow-[0_14px_45px_rgba(8,21,11,.28)]
          backdrop-blur-xl
          transition-all duration-300
          hover:scale-[1.02]
          hover:bg-[#244b2b]
          active:scale-[0.97]
          animate-[basketPillFloat_4s_ease-in-out_infinite]
          sm:gap-3 sm:px-5 sm:py-3.5
        "
      >

        <span
  className={`
    flex h-8 w-8 items-center justify-center
    rounded-full
    bg-[#efffb0]
    text-xs text-[#17351d]
    sm:h-10 sm:w-10 sm:text-sm
    ${
      isBasketPillEntering || isBasketCartReacting
        ? 'animate-[basketCartPop_.5s_ease-out]'
        : ''
    }
  `}
>
  🛒
</span>

        <span className="flex flex-col items-start leading-none">

          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55 sm:text-[10px] sm:tracking-[0.18em]">
            Your basket
          </span>

        </span>

      <span className="ml-2 border-l border-white/15 pl-3 font-playfair text-lg italic">
  <RollingNumber
    value={basketTotal}
    prefix="₹"
  />
</span>

      </button>

    </div>


    {/* =====================================================
        EXPANDED BASKET
    ===================================================== */}

    <div
      className={`
        origin-bottom
        overflow-hidden
        rounded-[26px]
        border border-[#17351d]/10
        bg-[#f5f3e8]/95
        text-[#17351d]
        shadow-[0_25px_80px_rgba(8,21,11,.25)]
        backdrop-blur-2xl
        transition-all duration-500
        ease-[cubic-bezier(.22,1,.36,1)]
        ${
          basketOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-5 scale-[0.92] opacity-0'
        }
      `}
      style={{
        maxHeight: basketOpen ? 'calc(100dvh - 40px)' : '0px',
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-[#17351d]/10 px-5 py-4">

        <div>

          <p className="text-[7px] font-semibold uppercase tracking-[0.3em] text-[#71864d]">
            Your selection
          </p>

          <h3 className="font-playfair mt-1 text-2xl italic">
            Basket
          </h3>

        </div>

        <button
          type="button"
          onClick={() => setBasketOpen(false)}
          aria-label="Collapse basket"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-[#17351d]/10
            bg-white/60
            text-lg
            transition-all duration-300
            hover:bg-[#17351d]
            hover:text-white
            active:scale-90
          "
        >
          ↓
        </button>

      </div>


      {/* =====================================================
          ITEMS
      ===================================================== */}

      <div className="max-h-[42vh] overflow-y-auto px-4 py-4">

        <div className="flex flex-col gap-2.5">

          {basket.map((item) => (

           <div
  key={`${item.product.id}-${item.variant.label}`}
  className={`
  rounded-[18px]
  border border-[#17351d]/10
  bg-white/65
  p-3.5
  transition-all duration-300
  hover:-translate-y-0.5
  hover:shadow-[0_8px_25px_rgba(8,21,11,.06)]
 ${
  removingBasketItem ===
  `${item.product.id}-${item.variant.label}`
    ? 'animate-[basketItemRemove_.32s_ease-out_forwards] pointer-events-none'
    : newBasketItemKey ===
      `${item.product.id}-${item.variant.label}`
      ? 'animate-[basketItemEnter_.42s_cubic-bezier(.22,1,.36,1)]'
      : ''
}
`}
>

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <h4 className="font-playfair text-[17px] leading-tight italic">
                    {item.product.name}
                  </h4>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-[#17351d]/40">
                    {item.variant.label} · {item.product.origin}
                  </p>

                </div>
<span className="shrink-0 text-sm font-semibold tabular-nums">
  <RollingNumber
    value={item.variant.price * item.quantity}
    prefix="₹"
  />
</span>

              </div>


              {/* QUANTITY */}

              <div className="mt-3 flex items-center justify-between">

                <div className="flex items-center rounded-full border border-[#17351d]/10 bg-white/75">

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
  flex h-8 w-8 items-center justify-center
  text-sm
  transition-all duration-200
  hover:bg-[#17351d]/5
  hover:scale-105
  active:scale-75
"
                  >
                    −
                  </button>

                 <span
  key={item.quantity}
  className="w-7 overflow-hidden text-center text-xs font-semibold tabular-nums animate-[basketQuantity_.35s_ease-out]"
>
  <RollingNumber value={item.quantity} />
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
                      flex h-8 w-8 items-center justify-center
                      text-sm
                      transition
                      hover:bg-[#17351d]/5
                      active:scale-90
                    "
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="border-t border-[#17351d]/10 bg-white/30 px-5 pb-5 pt-4">

        <div className="flex items-center justify-between">

          <span className="text-[8px] uppercase tracking-[0.2em] text-[#17351d]/40">
            Subtotal
          </span>

         <span className="font-playfair text-2xl italic">
  <RollingNumber
    value={basketTotal}
    prefix="₹"
  />
</span>

        </div>

        <button
          type="button"
          className="
            mt-3 flex h-12 w-full
            items-center justify-center
            rounded-full
            bg-[#17351d]
            text-sm font-semibold text-white
            transition-all duration-300
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

    </main>
  )
}

export default App