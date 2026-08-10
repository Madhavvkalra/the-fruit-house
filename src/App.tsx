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
  X,
} from 'lucide-react'

const WHOLE_IMAGE_MOBILE = '/fruit-whole-mobile.png'
const CUT_IMAGE_MOBILE = '/fruit-cut-mobile.png'

const WHOLE_IMAGE_DESKTOP = '/fruit-whole-desktop.png'
const CUT_IMAGE_DESKTOP = '/fruit-cut-desktop.png'

type Variety = {
  name: string
  origin: string
}

type Fruit = {
  id: string
  fruit: string

  /*
   * These coordinates are percentages of the ORIGINAL image,
   * not percentages of the visible browser window.
   */
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

type ImageMetrics = {
  renderedWidth: number
  renderedHeight: number
  offsetX: number
  offsetY: number
}

/*
 * Calculates exactly how an image behaves when using:
 *
 * width: 100%
 * height: 100%
 * object-fit: cover
 * object-position: center
 *
 * This is important because mobile screens crop the hero image.
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

  const rawPointer = useRef({
    x: -500,
    y: -500,
  })

  const smoothPointer = useRef({
    x: -500,
    y: -500,
  })

  const animationRef =
    useRef<number | null>(null)

  const [cursor, setCursor] = useState({
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
  SMOOTH POINTER
  =====================================
  */

  useEffect(() => {
    const animate = () => {
      /*
       * Desktop gets the smooth trailing
       * cursor.
       *
       * Mobile follows the finger more
       * closely so it doesn't feel laggy.
       */

      const ease = isMobile ? 0.55 : 0.22

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

      animationRef.current =
        requestAnimationFrame(animate)
    }

    animationRef.current =
      requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        )
      }
    }
  }, [isMobile])

  /*
  =====================================
  DETECT WHICH FRUIT IS UNDER POINTER
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

    /*
     * Actual dimensions of the source
     * image.
     */
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

    /*
     * Convert browser pointer position
     * back into ORIGINAL IMAGE position.
     */
    const imageX =
      (localX - metrics.offsetX) /
      metrics.renderedWidth

    const imageY =
      (localY - metrics.offsetY) /
      metrics.renderedHeight

    const percentX = imageX * 100
    const percentY = imageY * 100

    let detectedFruit: Fruit | null =
      null

    let closestDistance = Infinity

    fruits.forEach((fruit) => {
      const dx =
        percentX - fruit.x

      const dy =
        percentY - fruit.y

      const distance = Math.sqrt(
        dx * dx + dy * dy
      )

      if (
        distance <
          fruit.triggerRadius &&
        distance < closestDistance
      ) {
        closestDistance = distance
        detectedFruit = fruit
      }
    })

    setActiveFruit(detectedFruit)
  }

  /*
  =====================================
  POINTER POSITION
  =====================================
  */

  const updatePointer = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    const hero = heroRef.current

    if (!hero) return

    const rect =
      hero.getBoundingClientRect()

    const x =
      event.clientX - rect.left

    const y =
      event.clientY - rect.top

    rawPointer.current = {
      x,
      y,
    }

    detectFruit(x, y)
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
     * Desktop doesn't need to click.
     * Hover already works.
     */
    if (event.pointerType === 'mouse') {
      return
    }

    setIsTouching(true)
    setInsideHero(true)

    /*
     * Capture the finger so dragging
     * remains connected to the hero.
     */
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
     * Mouse:
     * always reveal while inside hero.
     */
    if (event.pointerType === 'mouse') {
      setInsideHero(true)
      updatePointer(event)
      return
    }

    /*
     * Touch:
     * reveal only while finger is down.
     */
    if (!isTouching) return

    updatePointer(event)
  }

  /*
  =====================================
  POINTER RELEASE
  =====================================
  */

  const endTouchInteraction = (
    event?: ReactPointerEvent<HTMLElement>
  ) => {
    if (
      event &&
      event.pointerType === 'mouse'
    ) {
      return
    }

    setIsTouching(false)
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

  /*
  =====================================
  SHOULD THE LENS BE VISIBLE?
  =====================================
  */

  const showLens = isMobile
    ? isTouching
    : insideHero

  /*
  =====================================
  RESPONSIVE LENS SIZE
  =====================================
  */

  const lensRadius = isMobile
    ? 115
    : 180

  const lensDiameter =
    lensRadius * 2

  return (
    <main className="min-h-screen bg-[#08150b]">

      {/* ==============================
          NAVIGATION
      ============================== */}

      <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between p-5 md:px-10 md:py-7">

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

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/20 p-2 backdrop-blur-xl md:flex">

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

        <button className="hidden items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white hover:text-[#17351d] md:flex">

          Explore Collection

          <ArrowUpRight size={15} />

        </button>

        {/* MOBILE MENU */}

        <button className="text-white md:hidden">
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
          }
        }}

        className="relative h-screen min-h-[650px] overflow-hidden bg-[#0b1b0e] md:cursor-none"

        style={{
          height: '100dvh',

          /*
           * Allows normal vertical page
           * scrolling on touch devices.
           *
           * Horizontal browser gestures
           * are disabled over the hero.
           */
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
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />

        {/* ============================
            CINEMATIC OVERLAYS
        ============================ */}

        <div className="pointer-events-none absolute inset-0 z-10 bg-black/20" />

        <div
          className="pointer-events-none absolute inset-0 z-10"
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
            className="pointer-events-none absolute inset-0 z-20"
            style={{
  backgroundImage: `url(${cutImage})`,

  backgroundSize: 'cover',

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
            Move across the harvest to uncover
            the freshness, varieties and origins
            behind every fruit.
          </p>

        </div>

        {/* ============================
            DESKTOP LENS BORDER
        ============================ */}

        {showLens && !isMobile && (
          <div
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35"
            style={{
              left: cursor.x,
              top: cursor.y,

              width: lensDiameter,
              height: lensDiameter,

              boxShadow:
                '0 0 70px rgba(255,255,255,.08), inset 0 0 45px rgba(255,255,255,.04)',
            }}
          />
        )}

        {/* ============================
            MOBILE LENS BORDER
        ============================ */}

        {showLens && isMobile && (
          <div
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45"
            style={{
              left: cursor.x,

              /*
               * Lift lens slightly above
               * finger so user can see it.
               */
              top: cursor.y - 35,

              width: lensDiameter,
              height: lensDiameter,

              boxShadow:
                '0 0 45px rgba(255,255,255,.12), inset 0 0 30px rgba(255,255,255,.05)',
            }}
          />
        )}

        {/* ============================
            CENTER DOT — DESKTOP ONLY
        ============================ */}

        {showLens && !isMobile && (
          <div
            className="pointer-events-none absolute z-50 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{
              left: cursor.x,
              top: cursor.y,
            }}
          />
        )}

        {/* ============================
            DESKTOP FRUIT CARD
        ============================ */}

        {activeFruit &&
          showLens &&
          !isMobile && (
            <div
              className="pointer-events-none absolute z-[70] w-[220px] rounded-[28px] border border-white/20 bg-[#071109]/80 p-4 text-white shadow-2xl backdrop-blur-2xl"
              style={{
                left:
                  cursor.x >
                  window.innerWidth *
                    0.67
                    ? cursor.x - 345
                    : cursor.x + 215,

                top:
                  cursor.y >
                  window.innerHeight *
                    0.58
                    ? cursor.y - 260
                    : cursor.y - 40,
              }}
            >

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#efffb0]/70">
                Discover
              </p>

              <h2 className="font-playfair mt-2 text-[30px] leading-none italic">
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

        {/* ============================
            MOBILE TOUCH INSTRUCTION
        ============================ */}

        {!isTouching &&
          !activeFruit && (
            <div className="pointer-events-none absolute bottom-[92px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[9px] uppercase tracking-[0.22em] text-white/55 md:hidden">

              <span className="h-px w-5 bg-white/30" />

              Touch & drag to reveal

              <span className="h-px w-5 bg-white/30" />

            </div>
          )}

        {/* ============================
            DESKTOP INSTRUCTION
        ============================ */}

        {!activeFruit &&
          !isMobile && (
            <div className="pointer-events-none absolute bottom-9 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/45">

              <span className="h-px w-10 bg-white/25" />

              Move to reveal freshness

              <span className="h-px w-10 bg-white/25" />

            </div>
          )}

        {/* ============================
            MOBILE CTA
        ============================ */}

        {!isTouching && (
          <div className="absolute bottom-6 left-5 right-5 z-50 md:hidden">

            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#efffb0] px-7 py-3.5 text-sm font-semibold text-[#17351d] shadow-xl">

              Explore Collection

              <ArrowUpRight size={16} />

            </button>

          </div>
        )}

        {/* ============================
            MOBILE FRUIT BOTTOM SHEET
        ============================ */}

        {activeFruit &&
          isTouching &&
          isMobile && (
            <div className="absolute bottom-0 left-0 right-0 z-[90] px-3 pb-3">

              <div className="rounded-[30px] border border-white/15 bg-[#071109]/90 p-5 text-white shadow-[0_-20px_60px_rgba(0,0,0,.35)] backdrop-blur-2xl">

                {/* HANDLE */}

                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

                {/* HEADER */}

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#efffb0]/70">
                      Discover
                    </p>

                    <h2 className="font-playfair mt-1 text-[34px] leading-none italic">
                      {activeFruit.fruit}
                    </h2>

                    <p className="mt-2 text-[11px] text-white/40">
                      Varieties & origins
                    </p>

                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40">
                    <X size={14} />
                  </div>

                </div>

                <div className="my-4 h-px bg-white/10" />

                {/* VARIETIES */}

                <div
                  className={
                    activeFruit.varieties
                      .length > 1
                      ? 'grid grid-cols-2 gap-3'
                      : 'grid grid-cols-1 gap-3'
                  }
                >

                  {activeFruit.varieties.map(
                    (variety) => (
                      <div
                        key={`${variety.name}-${variety.origin}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                      >

                        <p className="text-[13px] font-medium">
                          {variety.name}
                        </p>

                        <div className="mt-1.5 flex items-start gap-1.5 text-[10px] leading-4 text-white/45">

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

                <div className="mt-4 flex items-center justify-center gap-2">

                  <div className="h-1.5 w-1.5 rounded-full bg-[#efffb0]" />

                  <span className="text-[7px] uppercase tracking-[0.24em] text-white/30">
                    The Fruit House Selection
                  </span>

                </div>

              </div>

            </div>
          )}

      </section>

    </main>
  )
}

export default App