import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  ArrowUpRight,
  MapPin,
  Menu,
} from 'lucide-react'

const WHOLE_IMAGE_MOBILE = '/fruit-whole-mobile.png'
const CUT_IMAGE_MOBILE = '/fruit-cut-mobile.png'

const WHOLE_IMAGE_DESKTOP = '/fruit-whole-desktop.png'
const CUT_IMAGE_DESKTOP = '/fruit-cut-desktop.png'

const AUTO_START_DELAY = 1400
const AUTO_TRAVEL_TIME = 900
const AUTO_HOLD_TIME = 1800
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

const fruits: Fruit[] = [
  {
    id: 'grapes',
    fruit: 'Grapes',
    x: 25,
    y: 52,
    triggerRadius: 15,
    varieties: [
      {
        name: 'Shine Muscat',
        origin: 'China',
      },
    ],
  },

  {
    id: 'apple',
    fruit: 'Apple',
    x: 46,
    y: 48,
    triggerRadius: 17,
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
    id: 'cherries',
    fruit: 'Cherries',
    x: 48,
    y: 69,
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
    x: 63,
    y: 44,
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
    x: 79,
    y: 55,
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
    x: 64,
    y: 74,
    triggerRadius: 12,
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
 * Calculates exactly how an image behaves with:
 *
 * width: 100%
 * height: 100%
 * object-fit: cover
 * object-position: center
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

  const renderedWidth =
    imageWidth * scale

  const renderedHeight =
    imageHeight * scale

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

  /*
   * POINTER
   */

  const rawPointer =
    useRef<Point>({
      x: -500,
      y: -500,
    })

  const smoothPointer =
    useRef<Point>({
      x: -500,
      y: -500,
    })

  const animationRef =
    useRef<number | null>(null)

  /*
   * AUTOMATIC TOUR
   */

  const autoTimerRef =
    useRef<number | null>(null)

  const autoAnimationRef =
    useRef<number | null>(null)

  const resumeTimerRef =
    useRef<number | null>(null)

  const autoRunningRef =
    useRef(false)

  const userControllingRef =
    useRef(false)

  const autoIndexRef =
    useRef(0)

  /*
   * STATE
   */

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

  const [isMobile, setIsMobile] =
    useState(false)

  const [imageLoaded, setImageLoaded] =
    useState(false)

  const [autoRunning, setAutoRunning] =
    useState(false)

  /*
   * RESPONSIVE IMAGE SOURCES
   */

  const wholeImage = isMobile
    ? WHOLE_IMAGE_MOBILE
    : WHOLE_IMAGE_DESKTOP

  const cutImage = isMobile
    ? CUT_IMAGE_MOBILE
    : CUT_IMAGE_DESKTOP

  /*
  =====================================
  DETECT MOBILE / DESKTOP
  =====================================
  */

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(
        window.matchMedia(
          '(max-width: 767px)'
        ).matches
      )
    }

    checkScreen()

    window.addEventListener(
      'resize',
      checkScreen
    )

    return () => {
      window.removeEventListener(
        'resize',
        checkScreen
      )
    }
  }, [])

  /*
  =====================================
  FAST POINTER SMOOTHING
  =====================================
  */

  useEffect(() => {
    const animate = () => {
      if (!autoRunningRef.current) {
        /*
         * Much faster than the old 0.1 desktop
         * easing.
         *
         * This keeps the movement smooth while
         * making the response feel almost instant.
         */

        const ease = isMobile
          ? 0.55
          : 0.38

        smoothPointer.current.x +=
          (rawPointer.current.x -
            smoothPointer.current.x) *
          ease

        smoothPointer.current.y +=
          (rawPointer.current.y -
            smoothPointer.current.y) *
          ease

        setCursor({
          x: smoothPointer.current.x,
          y: smoothPointer.current.y,
        })
      }

      animationRef.current =
        requestAnimationFrame(animate)
    }

    animationRef.current =
      requestAnimationFrame(animate)

    return () => {
      if (
        animationRef.current !== null
      ) {
        cancelAnimationFrame(
          animationRef.current
        )
      }
    }
  }, [isMobile])

  /*
  =====================================
  IMAGE POSITION
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

    const imageWidth =
      image.naturalWidth || 1536

    const imageHeight =
      image.naturalHeight || 1024

    const metrics = getCoverMetrics(
      rect.width,
      rect.height,
      imageWidth,
      imageHeight
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
  =====================================
  CHECK WHETHER FRUIT IS VISIBLE
  =====================================
  */

  const isFruitVisible = (
    fruit: Fruit
  ) => {
    const hero = heroRef.current

    if (!hero) {
      return false
    }

    const rect =
      hero.getBoundingClientRect()

    const position =
      getFruitScreenPosition(fruit)

    if (!position) {
      return false
    }

    const horizontalMargin =
      isMobile ? 45 : 80

    const topMargin =
      isMobile ? 105 : 100

    const bottomMargin =
      isMobile ? 120 : 90

    return (
      position.x >
        horizontalMargin &&
      position.x <
        rect.width -
          horizontalMargin &&
      position.y > topMargin &&
      position.y <
        rect.height -
          bottomMargin
    )
  }

  /*
  =====================================
  DETECT FRUIT UNDER POINTER
  =====================================
  */

  const detectFruit = (
    localX: number,
    localY: number
  ) => {
    const hero = heroRef.current
    const image = imageRef.current

    if (!hero || !image) {
      return
    }

    const rect =
      hero.getBoundingClientRect()

    const imageWidth =
      image.naturalWidth || 1536

    const imageHeight =
      image.naturalHeight || 1024

    const metrics = getCoverMetrics(
      rect.width,
      rect.height,
      imageWidth,
      imageHeight
    )

    const imageX =
      (localX - metrics.offsetX) /
      metrics.renderedWidth

    const imageY =
      (localY - metrics.offsetY) /
      metrics.renderedHeight

    const percentX =
      imageX * 100

    const percentY =
      imageY * 100

    let detectedFruit:
      Fruit | null = null

    let closestDistance =
      Infinity

    fruits.forEach((fruit) => {
      const dx =
        percentX - fruit.x

      const dy =
        percentY - fruit.y

      const distance =
        Math.sqrt(
          dx * dx +
            dy * dy
        )

      if (
        distance <
          fruit.triggerRadius &&
        distance <
          closestDistance
      ) {
        closestDistance =
          distance

        detectedFruit =
          fruit
      }
    })

    setActiveFruit(
      detectedFruit
    )
  }

  /*
  =====================================
  CLEAR AUTO TOUR
  =====================================
  */

  const clearAutoTour = () => {
    if (
      autoTimerRef.current !== null
    ) {
      window.clearTimeout(
        autoTimerRef.current
      )

      autoTimerRef.current =
        null
    }

    if (
      autoAnimationRef.current !==
      null
    ) {
      cancelAnimationFrame(
        autoAnimationRef.current
      )

      autoAnimationRef.current =
        null
    }
  }

  /*
  =====================================
  STOP AUTO TOUR
  =====================================
  */

  const stopAutoTour = () => {
    clearAutoTour()

    autoRunningRef.current =
      false

    setAutoRunning(false)
  }

  /*
  =====================================
  AUTO SPOTLIGHT ANIMATION
  =====================================
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
        !autoRunningRef.current ||
        userControllingRef.current
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
       * Premium cubic ease-in-out.
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

    const visibleFruits =
      fruits.filter(
        isFruitVisible
      )

    if (
      visibleFruits.length === 0
    ) {
      /*
       * Try again shortly if the layout
       * hasn't settled yet.
       */

      autoTimerRef.current =
        window.setTimeout(
          runAutoStep,
          500
        )

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

    if (!destination) {
      return
    }

    let startPoint =
      cursor

    if (
      startPoint.x < 0 ||
      startPoint.y < 0
    ) {
      const hero =
        heroRef.current

      if (!hero) {
        return
      }

      const rect =
        hero.getBoundingClientRect()

      startPoint = {
        x:
          rect.width * 0.5,

        y:
          rect.height * 0.52,
      }
    }

    /*
     * Move spotlight to fruit.
     */

    animateSpotlight(
      startPoint,
      destination,
      AUTO_TRAVEL_TIME,
      () => {
        if (
          !autoRunningRef.current ||
          userControllingRef.current
        ) {
          return
        }

        /*
         * Show the fruit card.
         */

        setActiveFruit(fruit)

        autoIndexRef.current =
          (index + 1) %
          visibleFruits.length

        /*
         * Hold the fruit briefly.
         */

        autoTimerRef.current =
          window.setTimeout(
            runAutoStep,
            AUTO_HOLD_TIME
          )
      }
    )
  }

  /*
  =====================================
  START AUTO TOUR
  =====================================
  */

  const startAutoTour = (
    delay = AUTO_START_DELAY
  ) => {
    if (!imageLoaded) {
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
  START AUTO TOUR AFTER IMAGE LOAD
  =====================================
  */

  useEffect(() => {
    if (!imageLoaded) {
      return
    }

    /*
     * Give the browser a moment to finish
     * layout/image sizing before calculating
     * fruit positions.
     */

    const timer =
      window.setTimeout(
        () => {
          startAutoTour()
        },
        300
      )

    return () => {
      window.clearTimeout(timer)
      clearAutoTour()
    }
  }, [
    imageLoaded,
    isMobile,
  ])

  /*
  =====================================
  CLEANUP
  =====================================
  */

  useEffect(() => {
    return () => {
      clearAutoTour()

      if (
        resumeTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          resumeTimerRef.current
        )
      }
    }
  }, [])

  /*
  =====================================
  POINTER POSITION
  =====================================
  */

  const updatePointer = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    const hero =
      heroRef.current

    if (!hero) {
      return
    }

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
     * Immediate response on touch.
     * This removes almost all perceived lag.
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
  USER TAKES CONTROL
  =====================================
  */

  const takeManualControl = () => {
    userControllingRef.current =
      true

    stopAutoTour()

    if (
      resumeTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        resumeTimerRef.current
      )

      resumeTimerRef.current =
        null
    }
  }

  /*
  =====================================
  POINTER DOWN
  =====================================
  */

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    /*
     * Desktop mouse doesn't need click.
     */

    if (
      event.pointerType ===
      'mouse'
    ) {
      return
    }

    takeManualControl()

    setIsTouching(true)
    setInsideHero(true)

    event.currentTarget.setPointerCapture(
      event.pointerId
    )

    updatePointer(event)
  }

  /*
  =====================================
  POINTER MOVE
  =====================================
  */

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    /*
     * Desktop mouse.
     */

    if (
      event.pointerType ===
      'mouse'
    ) {
      takeManualControl()

      setInsideHero(true)

      updatePointer(event)

      return
    }

    /*
     * Touch only while finger is down.
     */

    if (!isTouching) {
      return
    }

    updatePointer(event)
  }

  /*
  =====================================
  RESUME AUTO TOUR
  =====================================
  */

  const scheduleAutoResume = () => {
    if (
      resumeTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        resumeTimerRef.current
      )
    }

    resumeTimerRef.current =
      window.setTimeout(
        () => {
          userControllingRef.current =
            false

          setActiveFruit(null)

          startAutoTour(0)
        },
        AUTO_RESUME_DELAY
      )
  }

  /*
  =====================================
  TOUCH RELEASE
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

    /*
     * Keep the spotlight visible for a
     * moment before automatic exploration
     * resumes.
     */

    userControllingRef.current =
      false

    scheduleAutoResume()
  }

  /*
  =====================================
  MOUSE ENTER
  =====================================
  */

  const handlePointerEnter = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    if (
      event.pointerType ===
      'mouse'
    ) {
      takeManualControl()

      setInsideHero(true)

      updatePointer(event)
    }
  }

  /*
  =====================================
  MOUSE LEAVE
  =====================================
  */

  const handlePointerLeave = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
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

      /*
       * Automatically return to tour
       * after leaving the hero.
       */

      userControllingRef.current =
        false

      scheduleAutoResume()
    }
  }

  /*
  =====================================
  VISUAL SETTINGS
  =====================================
  */

  /*
   * Automatic tour is visible on both
   * desktop and mobile.
   */

  const showLens =
    isMobile
      ? autoRunning || isTouching
      : insideHero || autoRunning

  /*
   * Smaller lens on mobile.
   */

  const lensRadius =
    isMobile ? 105 : 170

  const lensDiameter =
    lensRadius * 2

  /*
  =====================================
  MOBILE CARD POSITION
  =====================================
  */

  const getMobileCardPosition =
    () => {
      const hero =
        heroRef.current

      if (!hero) {
        return {
          left: '50%',
          top: '55%',
          transform:
            'translate(-50%, -50%)',
        }
      }

      const rect =
        hero.getBoundingClientRect()

      const cardWidth =
        185

      const horizontalPadding =
        12

      let left =
        cursor.x -
        cardWidth / 2

      left = Math.max(
        horizontalPadding,
        Math.min(
          left,
          rect.width -
            cardWidth -
            horizontalPadding
        )
      )

      let top =
        cursor.y - 165

      if (top < 105) {
        top =
          cursor.y + 70
      }

      top = Math.max(
        88,
        Math.min(
          top,
          rect.height - 185
        )
      )

      return {
        left,
        top,
      }
    }

  return (
    <main className="min-h-screen bg-[#F7F2E6]">

      {/* ==============================
          NAVIGATION
      ============================== */}

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
          p-5
          md:px-10
          md:py-7
        "
      >

        {/* BRAND */}

        <div className="flex items-center gap-3 text-white">

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-xl">
            ✦
          </div>

          <span className="font-playfair text-xl italic sm:text-2xl md:text-[27px]">
            The Fruit House
          </span>

        </div>

        {/* DESKTOP MENU */}

        <div className="
          absolute
          left-1/2
          hidden
          -translate-x-1/2
          items-center
          gap-1
          rounded-full
          border
          border-white/15
          bg-black/20
          p-2
          backdrop-blur-xl
          md:flex
        ">

          <button className="
            rounded-full
            bg-white
            px-5
            py-2
            text-sm
            font-medium
            text-[#17351d]
          ">
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
              className="
                rounded-full
                px-5
                py-2
                text-sm
                font-medium
                text-white/80
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              {item}
            </button>
          ))}

        </div>

        {/* DESKTOP CTA */}

        <button className="
          hidden
          items-center
          gap-2
          rounded-full
          border
          border-white/30
          bg-white/10
          px-6
          py-3
          text-sm
          font-medium
          text-white
          backdrop-blur-xl
          transition
          hover:bg-white
          hover:text-[#17351d]
          md:flex
        ">

          Explore Collection

          <ArrowUpRight size={15} />

        </button>

        {/* MOBILE MENU */}

        <button
          className="
            text-white
            md:hidden
          "
        >
          <Menu size={27} />
        </button>

      </nav>

      {/* ==============================
          HERO
      ============================== */}

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

        onPointerEnter={
          handlePointerEnter
        }

        onPointerLeave={
          handlePointerLeave
        }

        className="
          relative
          h-screen
          min-h-[650px]
          overflow-hidden
          bg-[#0b1b0e]
          md:cursor-none
        "

        style={{
          height: '100dvh',
          touchAction: 'pan-y',
        }}
      >

        {/* ============================
            WHOLE FRUIT IMAGE
        ============================ */}

        <img
          ref={imageRef}
          src={wholeImage}
          alt="The Fruit House premium fruit collection"
          draggable={false}
          onLoad={() =>
            setImageLoaded(true)
          }
          className="
            pointer-events-none
            absolute
            inset-0
            h-full
            w-full
            select-none
            object-cover
          "
        />

        {/* ============================
            CINEMATIC OVERLAYS
        ============================ */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
            bg-black/20
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
          "
          style={{
            background:
              'linear-gradient(90deg, rgba(4,16,7,.58) 0%, rgba(4,16,7,.13) 45%, rgba(4,16,7,.05) 100%)',
          }}
        />

        {/* ============================
            CUT FRUIT REVEAL
        ============================ */}

        {showLens && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-20
            "
            style={{
              backgroundImage:
                `url(${cutImage})`,

              backgroundSize:
                'cover',

              backgroundPosition:
                'center',

              WebkitMaskImage: `
                radial-gradient(
                  circle ${lensRadius}px at ${cursor.x}px ${cursor.y}px,
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,1) 36%,
                  rgba(0,0,0,.88) 53%,
                  rgba(0,0,0,.48) 70%,
                  rgba(0,0,0,.14) 86%,
                  rgba(0,0,0,0) 100%
                )
              `,

              maskImage: `
                radial-gradient(
                  circle ${lensRadius}px at ${cursor.x}px ${cursor.y}px,
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,1) 36%,
                  rgba(0,0,0,.88) 53%,
                  rgba(0,0,0,.48) 70%,
                  rgba(0,0,0,.14) 86%,
                  rgba(0,0,0,0) 100%
                )
              `,
            }}
          />
        )}

        {/* ============================
            HERO TEXT
        ============================ */}

        <div className="
          pointer-events-none
          absolute
          left-5
          right-5
          top-[16%]
          z-30
          text-white
          sm:left-10
          sm:right-auto
          sm:max-w-[620px]
          md:left-14
        ">

          <p className="
            mb-4
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.3em]
            text-[#efffb0]
            sm:mb-5
            sm:text-xs
          ">
            Discover what you're eating
          </p>

          <h1 className="leading-[0.9]">

            <span className="
              font-playfair
              block
              text-[48px]
              font-normal
              italic
              sm:text-7xl
              md:text-[92px]
            ">
              Every fruit
            </span>

            <span className="
              font-playfair
              block
              text-[48px]
              font-normal
              italic
              sm:text-7xl
              md:text-[92px]
            ">
              has a story.
            </span>

          </h1>

          <p className="
            mt-6
            max-w-[280px]
            text-[13px]
            leading-6
            text-white/65
            sm:mt-8
            sm:max-w-[310px]
            sm:text-sm
            sm:leading-7
          ">
            Move across the harvest to uncover
            the freshness, varieties and origins
            behind every fruit.
          </p>

        </div>

        {/* ============================
            DESKTOP LENS BORDER
        ============================ */}

        {showLens &&
          !isMobile && (
            <div
              className="
                pointer-events-none
                absolute
                z-40
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-white/35
              "
              style={{
                left: cursor.x,
                top: cursor.y,
                width: lensDiameter,
                height: lensDiameter,

                boxShadow:
                  '0 0 60px rgba(255,255,255,.08), inset 0 0 40px rgba(255,255,255,.04)',
              }}
            />
          )}

        {/* ============================
            MOBILE LENS BORDER
        ============================ */}

        {showLens &&
          isMobile && (
            <div
              className="
                pointer-events-none
                absolute
                z-40
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-white/40
              "
              style={{
                left: cursor.x,
                top: cursor.y - 35,
                width: lensDiameter,
                height: lensDiameter,

                boxShadow:
                  '0 0 40px rgba(255,255,255,.10), inset 0 0 25px rgba(255,255,255,.04)',
              }}
            />
          )}

        {/* ============================
            CENTER DOT
        ============================ */}

        {showLens &&
          !isMobile && (
            <div
              className="
                pointer-events-none
                absolute
                z-50
                h-[5px]
                w-[5px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white
              "
              style={{
                left: cursor.x,
                top: cursor.y,
              }}
            />
          )}

        {/* ============================
            DESKTOP SMALL FRUIT CARD
        ============================ */}

        {activeFruit &&
          showLens &&
          !isMobile && (
            <div
              className="
                pointer-events-none
                absolute
                z-[70]
                w-[235px]
                rounded-[22px]
                border
                border-white/20
                bg-[#071109]/82
                p-4
                text-white
                shadow-2xl
                backdrop-blur-2xl
              "
              style={{
                left:
                  cursor.x >
                  window.innerWidth *
                    0.68
                    ? cursor.x - 255
                    : cursor.x + 190,

                top:
                  cursor.y >
                  window.innerHeight *
                    0.62
                    ? cursor.y - 220
                    : cursor.y - 30,
              }}
            >

              <p className="
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#efffb0]/70
              ">
                Discover
              </p>

              <h2 className="
                font-playfair
                mt-1.5
                text-[30px]
                leading-none
                italic
              ">
                {activeFruit.fruit}
              </h2>

              <p className="
                mt-2
                text-[9px]
                text-white/40
              ">
                Varieties & origins
              </p>

              <div className="
                my-3
                h-px
                bg-white/12
              " />

              <div className="
                flex
                flex-col
                gap-3
              ">

                {activeFruit.varieties.map(
                  (variety) => (
                    <div
                      key={`${variety.name}-${variety.origin}`}
                    >

                      <p className="
                        text-[11px]
                        font-medium
                      ">
                        {variety.name}
                      </p>

                      <div className="
                        mt-1
                        flex
                        items-center
                        gap-1.5
                        text-[8px]
                        text-white/45
                      ">

                        <MapPin size={9} />

                        <span>
                          {variety.origin}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>

              <div className="
                mt-4
                flex
                items-center
                gap-1.5
              ">

                <div className="
                  h-1
                  w-1
                  rounded-full
                  bg-[#efffb0]
                " />

                <span className="
                  text-[6px]
                  uppercase
                  tracking-[0.2em]
                  text-white/30
                ">
                  The Fruit House Selection
                </span>

              </div>

            </div>
          )}

        {/* ============================
            MOBILE SMALL FLOATING CARD
        ============================ */}

        {activeFruit &&
          showLens &&
          isMobile && (
            <div
              className="
                pointer-events-none
                absolute
                z-[80]
                w-[185px]
              "
              style={
                getMobileCardPosition()
              }
            >

              <div className="
                rounded-[19px]
                border
                border-[#176B45]/15
                bg-[#F7F2E6]/95
                p-3
                text-[#123D2B]
                shadow-[0_15px_45px_rgba(15,81,53,.20)]
                backdrop-blur-xl
              ">

                <div className="
                  flex
                  items-start
                  justify-between
                  gap-2
                ">

                  <div>

                    <p className="
                      text-[6px]
                      font-semibold
                      uppercase
                      tracking-[0.26em]
                      text-[#176B45]/65
                    ">
                      Discover
                    </p>

                    <h2 className="
                      font-playfair
                      mt-1
                      text-[25px]
                      leading-none
                      italic
                      text-[#123D2B]
                    ">
                      {activeFruit.fruit}
                    </h2>

                  </div>

                  {autoRunning && (
                    <span className="
                      mt-1
                      h-1.5
                      w-1.5
                      animate-pulse
                      rounded-full
                      bg-[#176B45]
                    " />
                  )}

                </div>

                <div className="
                  my-2.5
                  h-px
                  bg-[#176B45]/10
                " />

                <div className="
                  flex
                  flex-col
                  gap-1.5
                ">

                  {activeFruit.varieties.map(
                    (variety) => (
                      <div
                        key={`${variety.name}-${variety.origin}`}
                        className="
                          rounded-[10px]
                          border
                          border-[#176B45]/10
                          bg-[#FCFAF3]/85
                          px-2
                          py-1.5
                        "
                      >

                        <p className="
                          text-[9px]
                          font-medium
                          text-[#123D2B]
                        ">
                          {variety.name}
                        </p>

                        <div className="
                          mt-0.5
                          flex
                          items-center
                          gap-1
                          text-[7px]
                          text-[#123D2B]/45
                        ">

                          <MapPin size={7} />

                          <span>
                            {variety.origin}
                          </span>

                        </div>

                      </div>
                    )
                  )}

                </div>

                <div className="
                  mt-2.5
                  flex
                  items-center
                  gap-1
                ">

                  <span className="
                    h-1
                    w-1
                    rounded-full
                    bg-[#176B45]
                  />

                  <span className="
                    text-[5px]
                    uppercase
                    tracking-[0.2em]
                    text-[#123D2B]/35
                  ">
                    The Fruit House
                  </span>

                </div>

              </div>

            </div>
          )}

        {/* ============================
            MOBILE TOUCH INSTRUCTION
        ============================ */}

        {!isTouching &&
          !activeFruit &&
          !autoRunning && (
            <div className="
              pointer-events-none
              absolute
              bottom-[92px]
              left-1/2
              z-40
              flex
              -translate-x-1/2
              items-center
              gap-2
              whitespace-nowrap
              text-[9px]
              uppercase
              tracking-[0.22em]
              text-white/55
              md:hidden
            ">

              <span className="
                h-px
                w-5
                bg-white/30
              " />

              Touch & drag to reveal

              <span className="
                h-px
                w-5
                bg-white/30
              " />

            </div>
          )}

        {/* ============================
            AUTOMATIC TOUR LABEL
        ============================ */}

        {autoRunning &&
          !activeFruit && (
            <div className="
              pointer-events-none
              absolute
              bottom-[88px]
              left-1/2
              z-40
              -translate-x-1/2
              whitespace-nowrap
              rounded-full
              border
              border-white/10
              bg-black/15
              px-4
              py-2
              text-[7px]
              uppercase
              tracking-[0.22em]
              text-white/45
              backdrop-blur-md
            ">
              Exploring the harvest
            </div>
          )}

        {/* ============================
            MOBILE CTA
        ============================ */}

        {!isTouching &&
          !autoRunning && (
            <div className="
              absolute
              bottom-6
              left-5
              right-5
              z-50
              md:hidden
            ">

              <button className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#efffb0]
                px-7
                py-3.5
                text-sm
                font-semibold
                text-[#17351d]
                shadow-xl
              ">

                Explore Collection

                <ArrowUpRight
                  size={16}
                />

              </button>

            </div>
          )}

        {/* ============================
            DESKTOP INSTRUCTION
        ============================ */}

        {!activeFruit &&
          !isMobile &&
          !autoRunning && (
            <div className="
              pointer-events-none
              absolute
              bottom-9
              left-1/2
              z-40
              flex
              -translate-x-1/2
              items-center
              gap-3
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-white/45
            ">

              <span className="
                h-px
                w-10
                bg-white/25
              " />

              Move to reveal freshness

              <span className="
                h-px
                w-10
                bg-white/25
              " />

            </div>
          )}

      </section>

    </main>
  )
}

export default App