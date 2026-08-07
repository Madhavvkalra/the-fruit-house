import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { ArrowUpRight, MapPin, Menu } from 'lucide-react'

const WHOLE_IMAGE = '/fruit-whole.png'
const CUT_IMAGE = '/fruit-cut.png'

const AUTO_START_DELAY = 1600
const AUTO_HOLD_TIME = 2400
const AUTO_TRAVEL_TIME = 1300
const AUTO_RESUME_DELAY = 5000

type Variety = {
  name: string
  origin: string
}

type Fruit = {
  id: string
  fruit: string
  x: number
  y: number
  triggerRadius: number
  varieties: Variety[]
}

/*
  Coordinates are percentages of the ORIGINAL locked image.

  Final composition:
  Grapes       ≈ 17%, 48%
  Apple        ≈ 50%, 29%
  Cherries     ≈ 43%, 63%
  Avocado      ≈ 72%, 47%
  Dragon Fruit ≈ 87%, 51%
  Kiwi         ≈ 78%, 76%
*/

const fruits: Fruit[] = [
  {
    id: 'apple',
    fruit: 'Apple',
    x: 50,
    y: 29,
    triggerRadius: 16,
    varieties: [
      {
        name: 'Gala',
        origin: 'New Zealand',
      },
      {
        name: 'Red Delicious',
        origin: 'Washington, USA',
      },
      {
        name: 'Fuji',
        origin: 'Japan',
      },
    ],
  },

  {
    id: 'grapes',
    fruit: 'Grapes',
    x: 17,
    y: 48,
    triggerRadius: 15,
    varieties: [
      {
        name: 'Shine Muscat',
        origin: 'China',
      },
    ],
  },

  {
    id: 'cherries',
    fruit: 'Cherries',
    x: 43,
    y: 63,
    triggerRadius: 14,
    varieties: [
      {
        name: 'American Cherries',
        origin: 'USA',
      },
      {
        name: 'Turkish Cherries',
        origin: 'Turkey',
      },
    ],
  },

  {
    id: 'avocado',
    fruit: 'Avocado',
    x: 72,
    y: 47,
    triggerRadius: 12,
    varieties: [
      {
        name: 'Hass Avocado',
        origin: 'Kenya',
      },
    ],
  },

  {
    id: 'dragonfruit',
    fruit: 'Dragon Fruit',
    x: 87,
    y: 51,
    triggerRadius: 12,
    varieties: [
      {
        name: 'White Flesh',
        origin: 'Vietnam',
      },
    ],
  },

  {
    id: 'kiwi',
    fruit: 'Kiwi',
    x: 78,
    y: 76,
    triggerRadius: 13,
    varieties: [
      {
        name: 'Green Kiwi',
        origin: 'Chile',
      },
    ],
  },
]

type Point = {
  x: number
  y: number
}

type ImageMetrics = {
  renderedWidth: number
  renderedHeight: number
  offsetX: number
  offsetY: number
}

/*
  Reproduces object-fit: cover mathematically.

  This lets fruit coordinates remain accurate even when
  phones/tablets crop the image.
*/

function getCoverMetrics(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number
): ImageMetrics {
  const scale = Math.max(
    containerWidth / imageWidth,
    containerHeight / imageHeight
  )

  const renderedWidth = imageWidth * scale
  const renderedHeight = imageHeight * scale

  return {
    renderedWidth,
    renderedHeight,

    offsetX:
      (containerWidth - renderedWidth) / 2,

    offsetY:
      (containerHeight - renderedHeight) / 2,
  }
}

function App() {
  const heroRef =
    useRef<HTMLElement | null>(null)

  const imageRef =
    useRef<HTMLImageElement | null>(null)

  const rawPointer = useRef<Point>({
    x: -500,
    y: -500,
  })

  const smoothPointer = useRef<Point>({
    x: -500,
    y: -500,
  })

  const animationRef =
    useRef<number | null>(null)

  const autoTimerRef =
    useRef<number | null>(null)

  const resumeTimerRef =
    useRef<number | null>(null)

  const autoAnimationRef =
    useRef<number | null>(null)

  const autoIndexRef = useRef(0)

  const autoRunningRef =
    useRef(false)

  const userControllingRef =
    useRef(false)

  const [cursor, setCursor] =
    useState<Point>({
      x: -500,
      y: -500,
    })

  const [insideHero, setInsideHero] =
    useState(false)

  const [activeFruit, setActiveFruit] =
    useState<Fruit | null>(null)

  const [isTouching, setIsTouching] =
    useState(false)

  const [isTouchFirst, setIsTouchFirst] =
    useState(false)

  const [isSmallScreen, setIsSmallScreen] =
    useState(false)

  const [autoRunning, setAutoRunning] =
    useState(false)

  const [imageLoaded, setImageLoaded] =
    useState(false)

  /*
  =====================================
  DEVICE CAPABILITIES
  =====================================
  */

  useEffect(() => {
    const updateDevice = () => {
      const coarse =
        window.matchMedia(
          '(pointer: coarse)'
        ).matches

      const hover =
        window.matchMedia(
          '(hover: hover)'
        ).matches

      /*
        Touch-first:
        phone/tablet primarily controlled by finger.

        An iPad with a real mouse/trackpad can therefore
        behave more like desktop when hover is available.
      */

      setIsTouchFirst(
        coarse && !hover
      )

      setIsSmallScreen(
        window.innerWidth < 768
      )
    }

    updateDevice()

    window.addEventListener(
      'resize',
      updateDevice
    )

    return () => {
      window.removeEventListener(
        'resize',
        updateDevice
      )
    }
  }, [])

  /*
  =====================================
  REDUCED MOTION
  =====================================
  */

  const prefersReducedMotion = () =>
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

  /*
  =====================================
  IMAGE POSITION HELPERS
  =====================================
  */

  const getFruitScreenPosition = (
    fruit: Fruit
  ): Point | null => {
    const hero = heroRef.current
    const image = imageRef.current

    if (!hero || !image) {
      return null
    }

    const rect =
      hero.getBoundingClientRect()

    const naturalWidth =
      image.naturalWidth || 1400

    const naturalHeight =
      image.naturalHeight || 928

    const metrics = getCoverMetrics(
      rect.width,
      rect.height,
      naturalWidth,
      naturalHeight
    )

    return {
      x:
        metrics.offsetX +
        metrics.renderedWidth *
          (fruit.x / 100),

      y:
        metrics.offsetY +
        metrics.renderedHeight *
          (fruit.y / 100),
    }
  }

  /*
    Prevent automatic tour from targeting fruit
    cropped outside the visible hero.
  */

  const isFruitVisible = (
    fruit: Fruit
  ) => {
    const hero = heroRef.current

    if (!hero) return false

    const rect =
      hero.getBoundingClientRect()

    const position =
      getFruitScreenPosition(fruit)

    if (!position) return false

    const safeMargin = isSmallScreen
      ? 45
      : 70

    return (
      position.x > safeMargin &&
      position.x <
        rect.width - safeMargin &&
      position.y > 100 &&
      position.y <
        rect.height - safeMargin
    )
  }

  /*
  =====================================
  DETECT FRUIT UNDER MANUAL POINTER
  =====================================
  */

  const detectFruit = (
    localX: number,
    localY: number
  ) => {
    const hero = heroRef.current
    const image = imageRef.current

    if (!hero || !image) return

    const rect =
      hero.getBoundingClientRect()

    const metrics = getCoverMetrics(
      rect.width,
      rect.height,
      image.naturalWidth || 1400,
      image.naturalHeight || 928
    )

    const normalizedX =
      (localX - metrics.offsetX) /
      metrics.renderedWidth

    const normalizedY =
      (localY - metrics.offsetY) /
      metrics.renderedHeight

    const percentX =
      normalizedX * 100

    const percentY =
      normalizedY * 100

    let detected: Fruit | null =
      null

    let closestDistance =
      Infinity

    fruits.forEach((fruit) => {
      const dx =
        percentX - fruit.x

      const dy =
        percentY - fruit.y

      const distance =
        Math.sqrt(
          dx * dx + dy * dy
        )

      if (
        distance <
          fruit.triggerRadius &&
        distance <
          closestDistance
      ) {
        closestDistance =
          distance

        detected = fruit
      }
    })

    setActiveFruit(detected)
  }

  /*
  =====================================
  DESKTOP SMOOTH CURSOR
  =====================================
  */

  useEffect(() => {
    const animate = () => {
      /*
        During automatic tour we directly control
        cursor position, so don't apply mouse easing.
      */

      if (
        !autoRunningRef.current
      ) {
        const ease =
          isTouchFirst ? 0.28 : 0.1

        smoothPointer.current.x +=
          (rawPointer.current.x -
            smoothPointer.current.x) *
          ease

        smoothPointer.current.y +=
          (rawPointer.current.y -
            smoothPointer.current.y) *
          ease

        setCursor({
          x:
            smoothPointer.current.x,

          y:
            smoothPointer.current.y,
        })
      }

      animationRef.current =
        requestAnimationFrame(
          animate
        )
    }

    animationRef.current =
      requestAnimationFrame(
        animate
      )

    return () => {
      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        )
      }
    }
  }, [isTouchFirst])

  /*
  =====================================
  AUTO TOUR HELPERS
  =====================================
  */

  const clearAutoTimers = () => {
    if (autoTimerRef.current) {
      window.clearTimeout(
        autoTimerRef.current
      )

      autoTimerRef.current = null
    }

    if (autoAnimationRef.current) {
      cancelAnimationFrame(
        autoAnimationRef.current
      )

      autoAnimationRef.current =
        null
    }
  }

  const stopAutoTour = () => {
    clearAutoTimers()

    autoRunningRef.current =
      false

    setAutoRunning(false)
  }

  /*
    Smoothly move spotlight between two points.
  */

  const animateSpotlight = (
    from: Point,
    to: Point,
    duration: number,
    onComplete: () => void
  ) => {
    const start =
      performance.now()

    const frame = (
      now: number
    ) => {
      if (
        !autoRunningRef.current
      ) {
        return
      }

      const progress =
        Math.min(
          (now - start) /
            duration,
          1
        )

      /*
        Smooth premium easing:
        cubic ease-in-out.
      */

      const eased =
        progress < 0.5
          ? 4 *
            progress *
            progress *
            progress
          : 1 -
            Math.pow(
              -2 * progress + 2,
              3
            ) /
              2

      const x =
        from.x +
        (to.x - from.x) *
          eased

      const y =
        from.y +
        (to.y - from.y) *
          eased

      setCursor({
        x,
        y,
      })

      if (progress < 1) {
        autoAnimationRef.current =
          requestAnimationFrame(
            frame
          )
      } else {
        autoAnimationRef.current =
          null

        onComplete()
      }
    }

    autoAnimationRef.current =
      requestAnimationFrame(frame)
  }

  /*
  =====================================
  RUN ONE AUTO TOUR STEP
  =====================================
  */

  const runAutoStep = () => {
    if (
      !autoRunningRef.current ||
      userControllingRef.current
    ) {
      return
    }

    /*
      Only tour fruits that are actually
      visible after responsive cropping.
    */

    const visibleFruits =
      fruits.filter(
        isFruitVisible
      )

    if (
      visibleFruits.length === 0
    ) {
      return
    }

    const index =
      autoIndexRef.current %
      visibleFruits.length

    const fruit =
      visibleFruits[index]

    const destination =
      getFruitScreenPosition(
        fruit
      )

    if (!destination) return

    /*
      If tour has just begun, start from
      somewhere near the middle of hero.
    */

    let startPoint = cursor

    if (
      startPoint.x < 0 ||
      startPoint.y < 0
    ) {
      const hero =
        heroRef.current

      if (!hero) return

      const rect =
        hero.getBoundingClientRect()

      startPoint = {
        x: rect.width / 2,
        y:
          rect.height *
          0.55,
      }
    }

    setActiveFruit(null)

    animateSpotlight(
      startPoint,
      destination,
      AUTO_TRAVEL_TIME,
      () => {
        if (
          !autoRunningRef.current
        ) {
          return
        }

        setActiveFruit(fruit)

        autoIndexRef.current =
          (index + 1) %
          visibleFruits.length

        autoTimerRef.current =
          window.setTimeout(
            () => {
              runAutoStep()
            },
            AUTO_HOLD_TIME
          )
      }
    )
  }

  /*
  =====================================
  START AUTOMATIC TOUR
  =====================================
  */

  const startAutoTour = (
    delay = AUTO_START_DELAY
  ) => {
    /*
      Auto tour is primarily for touch-first
      devices where hover discovery doesn't exist.
    */

    if (
      !isTouchFirst ||
      !imageLoaded ||
      prefersReducedMotion()
    ) {
      return
    }

    stopAutoTour()

    autoTimerRef.current =
      window.setTimeout(
        () => {
          if (
            userControllingRef.current
          ) {
            return
          }

          autoRunningRef.current =
            true

          setAutoRunning(true)
          setInsideHero(true)

          runAutoStep()
        },
        delay
      )
  }

  /*
  =====================================
  INITIAL AUTO TOUR
  =====================================
  */

  useEffect(() => {
    if (
      isTouchFirst &&
      imageLoaded
    ) {
      startAutoTour()
    }

    return () => {
      clearAutoTimers()
    }
  }, [
    isTouchFirst,
    imageLoaded,
  ])

  /*
  =====================================
  MANUAL POINTER POSITION
  =====================================
  */

  const updateManualPointer = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    const hero =
      heroRef.current

    if (!hero) return

    const rect =
      hero.getBoundingClientRect()

    const x =
      event.clientX -
      rect.left

    const y =
      event.clientY -
      rect.top

    rawPointer.current = {
      x,
      y,
    }

    /*
      Touch should respond immediately.
    */

    if (
      event.pointerType !==
      'mouse'
    ) {
      smoothPointer.current = {
        x,
        y,
      }

      setCursor({
        x,
        y,
      })
    }

    detectFruit(x, y)
  }

  /*
  =====================================
  MANUAL TAKEOVER
  =====================================
  */

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    /*
      Mouse doesn't need click.
    */

    if (
      event.pointerType ===
      'mouse'
    ) {
      return
    }

    userControllingRef.current =
      true

    stopAutoTour()

    setIsTouching(true)
    setInsideHero(true)

    event.currentTarget.setPointerCapture(
      event.pointerId
    )

    updateManualPointer(event)
  }

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    /*
      Desktop mouse / trackpad
    */

    if (
      event.pointerType ===
      'mouse'
    ) {
      stopAutoTour()

      setInsideHero(true)

      updateManualPointer(event)

      return
    }

    /*
      Finger / stylus
    */

    if (!isTouching) {
      return
    }

    updateManualPointer(event)
  }

  /*
  =====================================
  TOUCH RELEASE + AUTO RESUME
  =====================================
  */

  const endTouchInteraction = (
    event?: ReactPointerEvent<HTMLElement>
  ) => {
    if (
      event &&
      event.pointerType ===
        'mouse'
    ) {
      return
    }

    setIsTouching(false)

    userControllingRef.current =
      false

    /*
      Keep the current reveal visible briefly,
      then automatic tour resumes.
    */

    if (
      resumeTimerRef.current
    ) {
      window.clearTimeout(
        resumeTimerRef.current
      )
    }

    resumeTimerRef.current =
      window.setTimeout(
        () => {
          setActiveFruit(null)

          startAutoTour(0)
        },
        AUTO_RESUME_DELAY
      )
  }

  /*
  =====================================
  VISUAL SETTINGS
  =====================================
  */

  const showLens =
    insideHero &&
    (
      !isTouchFirst ||
      autoRunning ||
      isTouching
    )

  const lensRadius =
    isSmallScreen
      ? 105
      : isTouchFirst
      ? 145
      : 180

  const lensDiameter =
    lensRadius * 2

  /*
    On touch devices, slightly lift the
    visual ring so the user's finger
    doesn't cover everything.

    The automatic tour stays centered.
  */

  const ringYOffset =
    isTouching &&
    isSmallScreen
      ? -45
      : 0

  return (
    <main className="min-h-screen bg-[#08150b]">

      {/* =================================
          NAVIGATION
      ================================= */}

      <nav
        className="
          fixed
          left-0
          right-0
          top-0
          z-[100]
          flex
          items-center
          justify-between
          p-4
          sm:p-5
          md:px-10
          md:py-7
        "
        style={{
          paddingTop:
            'max(1rem, env(safe-area-inset-top))',
        }}
      >

        {/* BRAND */}

        <div className="flex items-center gap-2.5 text-white sm:gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-xl sm:h-9 sm:w-9">
            ✦
          </div>

          <span className="font-playfair text-[19px] italic sm:text-2xl md:text-[27px]">
            The Fruit House
          </span>

        </div>

        {/* DESKTOP NAV */}

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/20 p-2 backdrop-blur-xl lg:flex">

          <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#17351d]">
            Fruits
          </button>

          {[
            'Seasonal',
            'Origins',
            'Our Story',
            'Journal',
          ].map((item) => (
            <button
              key={item}
              className="rounded-full px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item}
            </button>
          ))}

        </div>

        {/* DESKTOP CTA */}

        <button className="hidden items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white hover:text-[#17351d] lg:flex">

          Explore Collection

          <ArrowUpRight size={15} />

        </button>

        {/* TABLET / MOBILE MENU */}

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/10 text-white backdrop-blur-xl lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

      </nav>

      {/* =================================
          HERO
      ================================= */}

      <section
        ref={heroRef}

        onPointerDown={
          handlePointerDown
        }

        onPointerMove={
          handlePointerMove
        }

        onPointerUp={
          endTouchInteraction
        }

        onPointerCancel={
          endTouchInteraction
        }

        onPointerEnter={(event) => {
          if (
            event.pointerType ===
            'mouse'
          ) {
            setInsideHero(true)
          }
        }}

        onPointerLeave={(event) => {
          if (
            event.pointerType ===
            'mouse'
          ) {
            setInsideHero(false)
            setActiveFruit(null)

            rawPointer.current = {
              x: -500,
              y: -500,
            }

            smoothPointer.current = {
              x: -500,
              y: -500,
            }
          }
        }}

        className="
          relative
          min-h-[600px]
          overflow-hidden
          bg-[#0b1b0e]
          md:cursor-none
        "

        style={{
          height: '100dvh',

          /*
            Allows normal vertical scrolling on
            phones/tablets.
          */
          touchAction: 'pan-y',
        }}
      >

        {/* =================================
            WHOLE IMAGE
        ================================= */}

        <img
          ref={imageRef}
          src={WHOLE_IMAGE}
          alt="The Fruit House premium fruit collection"

          onLoad={() =>
            setImageLoaded(true)
          }

          draggable={false}

          className="
            pointer-events-none
            absolute
            inset-0
            h-full
            w-full
            select-none
            object-cover
            object-center
          "
        />

        {/* =================================
            DARK OVERLAYS
        ================================= */}

        <div className="pointer-events-none absolute inset-0 z-10 bg-black/20" />

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(90deg, rgba(4,16,7,.58) 0%, rgba(4,16,7,.12) 46%, rgba(4,16,7,.04) 100%)',
          }}
        />

        {/* Extra mobile readability */}

        <div
          className="pointer-events-none absolute inset-0 z-10 md:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(3,12,5,.32) 0%, rgba(3,12,5,.04) 48%, rgba(3,12,5,.35) 100%)',
          }}
        />

        {/* =================================
            CUT IMAGE SPOTLIGHT
        ================================= */}

        {showLens && (
          <div
            className="pointer-events-none absolute inset-0 z-20"

            style={{
              backgroundImage:
                `url(${CUT_IMAGE})`,

              backgroundSize:
                'cover',

              backgroundPosition:
                'center',

              WebkitMaskImage: `
                radial-gradient(
                  circle ${lensRadius}px at ${cursor.x}px ${cursor.y}px,
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,1) 35%,
                  rgba(0,0,0,.9) 52%,
                  rgba(0,0,0,.55) 69%,
                  rgba(0,0,0,.18) 85%,
                  rgba(0,0,0,0) 100%
                )
              `,

              maskImage: `
                radial-gradient(
                  circle ${lensRadius}px at ${cursor.x}px ${cursor.y}px,
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,1) 35%,
                  rgba(0,0,0,.9) 52%,
                  rgba(0,0,0,.55) 69%,
                  rgba(0,0,0,.18) 85%,
                  rgba(0,0,0,0) 100%
                )
              `,
            }}
          />
        )}

        {/* =================================
            HERO COPY
        ================================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-5
            right-5
            top-[15%]
            z-30
            text-white

            sm:left-8
            sm:right-auto
            sm:top-[16%]
            sm:max-w-[520px]

            md:left-12
            md:max-w-[620px]

            lg:left-14
          "
        >

          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#efffb0] sm:mb-5 sm:text-[11px] md:text-xs">
            Discover what you're eating
          </p>

          <h1 className="leading-[0.89]">

            <span className="font-playfair block text-[45px] font-normal italic sm:text-[64px] md:text-[76px] lg:text-[92px]">
              Every fruit
            </span>

            <span className="font-playfair block text-[45px] font-normal italic sm:text-[64px] md:text-[76px] lg:text-[92px]">
              has a story.
            </span>

          </h1>

          <p className="mt-5 max-w-[265px] text-[12px] leading-[1.7] text-white/65 sm:mt-7 sm:max-w-[310px] sm:text-sm sm:leading-7">
            Move across the harvest to uncover
            the freshness, varieties and origins
            behind every fruit.
          </p>

        </div>

        {/* =================================
            SPOTLIGHT RING
        ================================= */}

        {showLens && (
          <div
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35"

            style={{
              left: cursor.x,

              top:
                cursor.y +
                ringYOffset,

              width:
                lensDiameter,

              height:
                lensDiameter,

              boxShadow:
                '0 0 70px rgba(255,255,255,.08), inset 0 0 45px rgba(255,255,255,.04)',

              transition:
                isTouching
                  ? 'none'
                  : undefined,
            }}
          />
        )}

        {/* =================================
            DESKTOP CENTER DOT
        ================================= */}

        {showLens &&
          !isTouchFirst && (
            <div
              className="pointer-events-none absolute z-50 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"

              style={{
                left:
                  cursor.x,

                top:
                  cursor.y,
              }}
            />
          )}

        {/* =================================
            DESKTOP / TRACKPAD CARD
        ================================= */}

        {activeFruit &&
          showLens &&
          !isTouchFirst && (
            <div
              className="
                pointer-events-none
                absolute
                z-[70]
                hidden
                w-[300px]
                rounded-[28px]
                border
                border-white/20
                bg-[#071109]/80
                p-6
                text-white
                shadow-2xl
                backdrop-blur-2xl
                md:block
              "

              style={{
                left:
                  cursor.x >
                  window.innerWidth *
                    0.67
                    ? cursor.x -
                      345
                    : cursor.x +
                      215,

                top:
                  cursor.y >
                  window.innerHeight *
                    0.58
                    ? cursor.y -
                      260
                    : cursor.y -
                      40,
              }}
            >

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#efffb0]/70">
                Discover
              </p>

              <h2 className="font-playfair mt-2 text-[42px] leading-none italic">
                {activeFruit.fruit}
              </h2>

              <p className="mt-3 text-xs text-white/45">
                Varieties & origins
              </p>

              <div className="my-5 h-px bg-white/15" />

              <div className="flex flex-col gap-5">

                {activeFruit.varieties.map(
                  (variety) => (
                    <div
                      key={`${variety.name}-${variety.origin}`}
                    >

                      <p className="text-[15px] font-medium">
                        {variety.name}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2 text-xs text-white/50">

                        <MapPin size={12} />

                        <span>
                          {variety.origin}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>

              <div className="mt-6 flex items-center gap-2">

                <div className="h-1.5 w-1.5 rounded-full bg-[#efffb0] shadow-[0_0_12px_rgba(239,255,176,.8)]" />

                <span className="text-[8px] uppercase tracking-[0.23em] text-white/35">
                  The Fruit House Selection
                </span>

              </div>

            </div>
          )}

        {/* =================================
            TOUCH DEVICE FRUIT CARD
        ================================= */}

        {activeFruit &&
          showLens &&
          isTouchFirst && (
            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-0
                right-0
                z-[80]
                px-3
                sm:px-5
              "

              style={{
                paddingBottom:
                  'max(12px, env(safe-area-inset-bottom))',
              }}
            >

              <div
                className="
                  mx-auto
                  max-w-[520px]
                  rounded-[26px]
                  border
                  border-white/15
                  bg-[#071109]/90
                  p-4
                  text-white
                  shadow-[0_-20px_60px_rgba(0,0,0,.35)]
                  backdrop-blur-2xl
                  sm:rounded-[30px]
                  sm:p-5
                "
              >

                <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-white/20" />

                <div className="flex items-end justify-between gap-4">

                  <div>

                    <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#efffb0]/70">
                      Discover
                    </p>

                    <h2 className="font-playfair mt-1 text-[30px] leading-none italic sm:text-[36px]">
                      {activeFruit.fruit}
                    </h2>

                  </div>

                  {autoRunning && (
                    <div className="mb-1 flex items-center gap-2">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#efffb0]" />

                      <span className="text-[7px] uppercase tracking-[0.22em] text-white/35">
                        Exploring
                      </span>

                    </div>
                  )}

                </div>

                <div className="my-3 h-px bg-white/10 sm:my-4" />

                <div
                  className={
                    activeFruit.varieties
                      .length > 1
                      ? 'grid grid-cols-2 gap-2.5 sm:gap-3'
                      : 'grid grid-cols-1 gap-2.5 sm:gap-3'
                  }
                >

                  {activeFruit.varieties.map(
                    (variety) => (
                      <div
                        key={`${variety.name}-${variety.origin}`}

                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                      >

                        <p className="text-[12px] font-medium sm:text-[13px]">
                          {variety.name}
                        </p>

                        <div className="mt-1.5 flex items-start gap-1.5 text-[9px] leading-4 text-white/45 sm:text-[10px]">

                          <MapPin
                            size={11}
                            className="mt-[2px] shrink-0"
                          />

                          <span>
                            {variety.origin}
                          </span>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>
          )}

        {/* =================================
            DESKTOP INSTRUCTION
        ================================= */}

        {!activeFruit &&
          !isTouchFirst && (
            <div className="pointer-events-none absolute bottom-9 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-3 whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-white/45 md:flex">

              <span className="h-px w-10 bg-white/25" />

              Move to reveal freshness

              <span className="h-px w-10 bg-white/25" />

            </div>
          )}

        {/* =================================
            TOUCH AUTO TOUR LABEL
        ================================= */}

        {isTouchFirst &&
          autoRunning &&
          !activeFruit && (
            <div className="pointer-events-none absolute bottom-[95px] left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[8px] uppercase tracking-[0.24em] text-white/50 backdrop-blur-md">

              Exploring the harvest

            </div>
          )}

        {/* =================================
            MOBILE CTA BEFORE TOUR STARTS
        ================================= */}

        {isTouchFirst &&
          !showLens && (
            <div
              className="absolute bottom-5 left-5 right-5 z-50 md:hidden"

              style={{
                paddingBottom:
                  'env(safe-area-inset-bottom)',
              }}
            >

              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#efffb0] px-7 py-3.5 text-sm font-semibold text-[#17351d] shadow-xl">

                Explore Collection

                <ArrowUpRight size={16} />

              </button>

            </div>
          )}

      </section>

    </main>
  )
}

export default App