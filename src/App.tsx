import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'

import Checkout from './pages/Checkout'

import {
  products,
  type Product,
  type ProductVariant,
} from './data/products'

import ProductPopup from './components/ProductPopup'
import Basket from './components/Basket'

import Home from './pages/Home'
import HamperStudio from './pages/HamperStudio'
import type { StudioMode } from './pages/HamperStudio'

import type { HamperCartEntry } from './lib/hamperCart'

import './styles/hamper.css'

const WHOLE_IMAGE_MOBILE = '/fruit-whole-mobile.png'
const CUT_IMAGE_MOBILE = '/fruit-cut-mobile.png'
const WHOLE_IMAGE_DESKTOP = '/fruit-whole-desktop.png'
const CUT_IMAGE_DESKTOP = '/fruit-cut-desktop.png'

const AUTO_START_DELAY = 900
const AUTO_STEP_DELAY = 2400
const AUTO_RESUME_DELAY = 3000


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


type AppProps = {
  routeProductId: string | null
  hamperMode: StudioMode | null
}

function App({ routeProductId, hamperMode }: AppProps) {
    const [isPageLoading, setIsPageLoading] = useState(true)

const navigate = useNavigate()

const isHamperStudio = hamperMode !== null

const [isLoaderVisible, setIsLoaderVisible] = useState(true)

  const heroRef = useRef<HTMLElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  
  const rawPointer = useRef({ x: -500, y: -500 })
  const smoothPointer = useRef({ x: -500, y: -500 })
  const animationRef = useRef<number | null>(null)
  const [cursor, setCursor] = useState({
  x: -500,
  y: -500,
})

  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoIndexRef = useRef(0)
  const autoOrderRef = useRef<Fruit[]>([])
  const userInteractingRef = useRef(false)

  const [insideHero, setInsideHero] = useState(false)
  const [activeFruit, setActiveFruit] = useState<Fruit | null>(null)
  const [isTouching, setIsTouching] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

const wholeImage = isMobile
  ? WHOLE_IMAGE_MOBILE
  : WHOLE_IMAGE_DESKTOP

const cutImage = isMobile
  ? CUT_IMAGE_MOBILE
  : CUT_IMAGE_DESKTOP

useEffect(() => {
  let cancelled = false

  const images = [
    WHOLE_IMAGE_MOBILE,
    CUT_IMAGE_MOBILE,
    WHOLE_IMAGE_DESKTOP,
    CUT_IMAGE_DESKTOP,
  ]

  const preloadImage = (src: string) =>
    new Promise<void>((resolve) => {
      const image = new Image()

      image.onload = () => resolve()
      image.onerror = () => resolve()

      image.src = src
    })

  const loadAssets = async () => {
    await Promise.all(images.map(preloadImage))

    if (cancelled) return

    await new Promise((resolve) =>
      window.setTimeout(resolve, 650)
    )

    if (!cancelled) {
  setIsPageLoading(false)

  window.setTimeout(() => {
    setIsLoaderVisible(false)
  }, 700)
}
  }

  loadAssets()

  return () => {
    cancelled = true
  }
}, [])

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

useEffect(() => {
  if (basketOpen) {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }

  return () => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
}, [basketOpen])

const [checkoutOpen, setCheckoutOpen] = useState(false)


const [isProductChanging, setIsProductChanging] = useState(false)

const [selectedProduct, setSelectedProduct] =
  useState<Product | null>(null)

  const [isProductPopupClosing, setIsProductPopupClosing] =
  useState(false)

useEffect(() => {
  if (selectedProduct) {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }

  return () => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
}, [selectedProduct])

const closeProductPopup = () => {
  if (isProductPopupClosing) return

  setIsProductPopupClosing(true)

  window.setTimeout(() => {
    setSelectedProduct(null)
    setSelectedPopupVariant(null)
    setSelectedProductImageIndex(0)
    setIsProductPopupClosing(false)

    // Drop back to "/" only once the exit animation has finished, so the URL
    // change cannot clear selectedProduct mid-animation.
    navigate('/', { replace: true })
  }, 560)
}

// Opening a product is a real navigation, so the URL is shareable and the
// browser back button closes the popup.
const openProduct = (product: Product) => {
  navigate(`/fruit/${product.id}`)
}

// "You may also like" swaps the product inside the already-open popup. Keep
// the URL pointing at whatever is on screen, using replace so that back still
// means "close the popup" instead of walking back through every product viewed.
const selectPopupProduct = (product: Product | null) => {
  setSelectedProduct(product)

  if (product) {
    navigate(`/fruit/${product.id}`, { replace: true })
  }
}

// The URL is the source of truth for which product the popup shows.
useEffect(() => {
  if (isProductPopupClosing) return

  if (!routeProductId) {
    // Browser back from /fruit/:id — close via the normal path so the exit
    // animation still plays.
    if (selectedProduct) closeProductPopup()
    return
  }

  if (selectedProduct?.id === routeProductId) return

  const product = products.find(
    (item) => item.id === routeProductId
  )

  if (!product) {
    navigate('/', { replace: true })
    return
  }

  setSelectedProduct(product)
  setSelectedProductImageIndex(0)
  setSelectedPopupVariant(product.variants[0])
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [routeProductId, selectedProduct, isProductPopupClosing])

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
      }, 120)

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
      }, 360)

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

// Hamper Studio -> existing cart + existing checkout.
//
// A finished hamper arrives as a ready-made { product, variant } pair from the
// hamper cart adapter. It is dropped into the SAME basket via the SAME
// addToBasket path as any shop product, then the existing checkout overlay is
// opened. There is no hamper-specific cart, checkout, delivery or payment — a
// hamper and a bag of apples travel the identical pipeline from here on.
const addHamperToCart = (entry: HamperCartEntry) => {
  addToBasket(entry.product, entry.variant)
  navigate('/')
  setCheckoutOpen(true)
}
  

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
 const displayFruit =
  activeFruit && showLens ? activeFruit : null

return (
  <main className="min-h-screen bg-[#08150b]">

  {isLoaderVisible && (
  <div
  className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#08150b] text-white transition-opacity duration-700 ${
    isPageLoading
      ? 'opacity-100'
      : 'pointer-events-none opacity-0'
  }`}
>

    <div className="fruit-house-skeleton__content">

          <div className="fruit-house-skeleton__logo" />

          <div className="fruit-house-skeleton__title" />

          <div className="fruit-house-skeleton__line" />

        </div>

    <div className="flex flex-col items-center">

      {/* Logo */}
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-lg text-[#efffb0]"
        style={{
          animation: 'loaderPulse 1.8s ease-in-out infinite',
        }}
      >
        ✦
      </div>

      {/* Brand */}
      <p className="mt-5 font-playfair text-2xl italic">
        The Fruit House
      </p>

      {/* Loading line */}
      <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
        <div
          className="h-full w-1/2 bg-[#efffb0]"
          style={{
            animation: 'loaderProgress 1.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Label */}
      <p className="mt-4 text-[7px] font-semibold uppercase tracking-[0.32em] text-white/35">
        Selecting the finest
      </p>

    </div>

  </div>
)}

     {/* =========================================================
        HOME — HERO + FRUIT SHOP  (or the HAMPER STUDIO)
    ========================================================= */}

    {isHamperStudio ? (
      <HamperStudio
        initialMode={hamperMode ?? 'landing'}
        onCheckoutHamper={addHamperToCart}
        onExit={() => navigate('/')}
      />
    ) : (
      <Home
        heroRef={heroRef}
        imageRef={imageRef}
        wholeImage={wholeImage}
        cutImage={cutImage}
        cursor={cursor}
        lensRadius={lensRadius}
        lensDiameter={lensDiameter}
        showLens={showLens}
        isMobile={isMobile}
        isTouching={isTouching}
        isAutoActive={isAutoActive}
        activeFruit={activeFruit}
       displayFruit={displayFruit}
basket={basket}
        basketCount={basketCount}
        basketTotal={basketTotal}
        setBasketOpen={setBasketOpen}
        setInsideHero={setInsideHero}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        endTouchInteraction={endTouchInteraction}
        addToBasket={addToBasket}
        updateBasketQuantity={updateBasketQuantity}
        onOpenProduct={openProduct}
        onOpenHamperStudio={(mode) =>
          navigate(
            mode && mode !== 'landing'
              ? `/hamper-studio?mode=${mode}`
              : '/hamper-studio'
          )
        }
      />
    )}

    {/* =========================================================
    PRODUCT DETAIL POPUP
========================================================= */}

{selectedProduct && (

  <div
    className={`
      fixed
      inset-0
      z-[500]
      flex
      items-end
      justify-center
      bg-[#08150b]/35
      backdrop-blur-[2px]
      sm:items-center

      ${
        isProductPopupClosing
          ? 'animate-[productPopupOverlayExit_.55s_ease_forwards]'
          : 'animate-[productPopupOverlayEnter_.75s_ease_forwards]'
      }
    `}
>
    <ProductPopup
      selectedProduct={selectedProduct}
      isProductPopupClosing={isProductPopupClosing}
      closeProductPopup={closeProductPopup}
      selectedPopupVariant={selectedPopupVariant}
      basket={basket}
      selectedProductImageIndex={selectedProductImageIndex}
      productImageDragX={productImageDragX}
      isProductImageDragging={isProductImageDragging}
      isProductChanging={isProductChanging}
      setSelectedProduct={selectPopupProduct}
      setSelectedPopupVariant={setSelectedPopupVariant}
      setSelectedProductImageIndex={setSelectedProductImageIndex}
      setIsProductChanging={setIsProductChanging}
      handlePopupImageTouchStart={handlePopupImageTouchStart}
      handlePopupImageTouchMove={handlePopupImageTouchMove}
      handlePopupImageTouchEnd={handlePopupImageTouchEnd}
      addToBasket={addToBasket}
      updateBasketQuantity={updateBasketQuantity}
    />
  </div>
)}

    {/* =========================================================
        FLOATING BASKET
    ========================================================= */}

    <Basket
      basket={basket}
      basketCount={basketCount}
      basketTotal={basketTotal}
      basketOpen={basketOpen}
      isBasketClosing={isBasketClosing}
      isBasketPillEntering={isBasketPillEntering}
      isBasketCartReacting={isBasketCartReacting}
      removingBasketItem={removingBasketItem}
      newBasketItemKey={newBasketItemKey}
      setBasketOpen={setBasketOpen}
      setCheckoutOpen={setCheckoutOpen}
      updateBasketQuantity={updateBasketQuantity}
    />

    {/* =========================================================
        CHECKOUT
    ========================================================= */}

       {checkoutOpen && (
      <Checkout
        basket={basket}
        basketTotal={basketTotal}
        onClose={() => setCheckoutOpen(false)}
      />
    )}

    <style>{`

    @keyframes productPopupOverlayEnter {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes productPopupOverlayExit {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
  
@keyframes productPopupEnter {
  0% {
    opacity: 0;
    transform: translateY(28px) scale(0.96);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes productPopupExit {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
}

  @keyframes loaderProgress {
    0% {
      transform: translateX(-100%);
    }

    50% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(250%);
    }
  }

  @keyframes loaderPulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.65;
    }

    50% {
      transform: scale(1.08);
      opacity: 1;
    }
  }
`}</style>

  </main>
  )
}

export default App