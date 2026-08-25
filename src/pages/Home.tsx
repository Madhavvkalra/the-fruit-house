import type {
  RefObject,
  PointerEvent as ReactPointerEvent,
} from 'react'

import {
  ArrowUpRight,
  MapPin,
  Menu,
} from 'lucide-react'

import ProductCard from '../components/ProductCard'
import RollingNumber from '../components/RollingNumber'
import HamperQuoteRotator from '../components/hamper/HamperQuoteRotator'

import type { StudioMode } from './HamperStudio'

import {
  products,
  type Product,
} from '../data/products'

/**
 * Display-only arrangement for the revolving basket on the home page. It is a
 * showcase, not a cart item — the Hamper Studio always starts the customer from
 * an empty basket. Ids are validated by the slot engine, so a renamed fruit
 * simply drops out of the visual rather than breaking the page.
 */

type Variety = {
  name: string
  origin: string
}

type ActiveFruit = {
  id: string
  fruit: string
  x: number
  y: number
  triggerRadius: number
  varieties: Variety[]
}

type BasketItem = {
  product: Product
  variant: Product['variants'][number]
  quantity: number
}

type HomeProps = {
  heroRef: RefObject<HTMLElement | null>
  imageRef: RefObject<HTMLImageElement | null>

  wholeImage: string
  cutImage: string

  cursor: {
    x: number
    y: number
  }

  lensRadius: number
  lensDiameter: number

  showLens: boolean
  isMobile: boolean
  isTouching: boolean
  isAutoActive: boolean

  activeFruit: ActiveFruit | null
  displayFruit: ActiveFruit | null

  basket: BasketItem[]
  basketCount: number
  basketTotal: number

  setBasketOpen: (open: boolean) => void

  setInsideHero: (inside: boolean) => void

  handlePointerDown: (
    event: ReactPointerEvent<HTMLElement>
  ) => void

  handlePointerMove: (
    event: ReactPointerEvent<HTMLElement>
  ) => void

  endTouchInteraction: () => void

  addToBasket: (
    product: Product,
    variant: Product['variants'][number]
  ) => void

  updateBasketQuantity: (
    productId: string,
    variantLabel: string,
    change: number
  ) => void

  onOpenProduct: (product: Product) => void

  onOpenHamperStudio: (mode?: StudioMode) => void
}

export default function Home({
  heroRef,
  imageRef,

  wholeImage,
  cutImage,

  cursor,

  lensRadius,
  lensDiameter,

  showLens,
  isMobile,
  isTouching,
  isAutoActive,

  activeFruit,
  displayFruit,

  basket,
  basketCount,
  basketTotal,

  setBasketOpen,
  setInsideHero,

  handlePointerDown,
  handlePointerMove,
  endTouchInteraction,

  addToBasket,
  updateBasketQuantity,

  onOpenProduct,
  onOpenHamperStudio,
}: HomeProps) {

return (
  <main className="min-h-screen bg-[#08150b]">

    {/* =====================================================
        NAVBAR
    ===================================================== */}

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

      <button className="hidden items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white hover:text-[#17351d] md:flex">
        Explore Collection
        <ArrowUpRight size={15} />
      </button>

      <button className="text-white md:hidden">
        <Menu size={27} />
      </button>

    </nav>


    {/* =====================================================
        HERO
    ===================================================== */}

    <section
      ref={heroRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endTouchInteraction}
      onPointerCancel={endTouchInteraction}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          setInsideHero(true)
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') {
          setInsideHero(false)
        }
      }}
      className="relative h-screen min-h-[650px] overflow-hidden bg-[#0b1b0e] md:cursor-none"
      style={{
        height: '100dvh',
        touchAction: 'pan-y',
      }}
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

      {/* =====================================================
          LENS
      ===================================================== */}

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


      {/* =====================================================
          HERO COPY
      ===================================================== */}

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


      {/* =====================================================
          LENS BORDER
      ===================================================== */}

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
          style={{
            left: cursor.x,
            top: cursor.y,
          }}
        />
      )}


      {/* =====================================================
          DESKTOP FRUIT DISCOVERY
      ===================================================== */}

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
            {displayFruit.fruit}
          </h2>

          <p className="mt-2 text-[10px] text-white/45">
            Varieties & origins
          </p>

          <div className="my-3.5 h-px bg-white/15" />

          <div className="flex flex-col gap-3">

            {displayFruit.varieties.map((variety) => (
              <div key={`${variety.name}-${variety.origin}`}>

                <p className="text-[12px] font-medium">
                  {variety.name}
                </p>

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


      {/* =====================================================
          MOBILE INSTRUCTIONS
      ===================================================== */}

      {!isTouching && !activeFruit && !isAutoActive && (
        <div className="pointer-events-none absolute bottom-[92px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[9px] uppercase tracking-[0.22em] text-white/55 md:hidden">

          <span className="h-px w-5 bg-white/30" />

          Touch & drag to reveal

          <span className="h-px w-5 bg-white/30" />

        </div>
      )}


      {/* =====================================================
          DESKTOP INSTRUCTIONS
      ===================================================== */}

      {!activeFruit && !isMobile && !isAutoActive && (
        <div className="pointer-events-none absolute bottom-9 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/45">

          <span className="h-px w-10 bg-white/25" />

          Move to reveal freshness

          <span className="h-px w-10 bg-white/25" />

        </div>
      )}


      {/* =====================================================
          MOBILE EXPLORE BUTTON
      ===================================================== */}

      {!isTouching && (
        <div className="absolute bottom-6 left-5 right-5 z-50 md:hidden">

          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#efffb0] px-7 py-3.5 text-sm font-semibold text-[#17351d] shadow-xl">
            Explore Collection
            <ArrowUpRight size={16} />
          </button>

        </div>
      )}


      {/* =====================================================
          MOBILE FRUIT DISCOVERY
      ===================================================== */}

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
            {displayFruit.fruit}
          </h2>

          <p className="mt-1.5 text-[8px] text-white/40">
            Varieties & origins
          </p>

          <div className="my-3 h-px bg-white/10" />

          <div className="flex flex-col gap-2.5">

            {displayFruit.varieties.map((variety) => (
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

    {/* =====================================================
        FRUIT SHOP
    ===================================================== */}

    <section
      id="fruit-shop"
      className="relative overflow-hidden bg-[#f5f3e8] px-5 py-20 text-[#17351d] sm:px-8 sm:py-24 md:px-12 md:py-28"
    >

      <div className="mx-auto max-w-7xl">

        {/* SECTION HEADER */}

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
            className="hidden w-fit items-center gap-3 rounded-full border border-[#17351d]/15 bg-white/75 px-5 py-3 text-xs font-medium text-[#17351d] shadow-[0_8px_30px_rgba(8,21,11,.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#17351d] hover:text-white md:flex"
          >

            <span>
              Basket
            </span>

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
              onOpenProduct={onOpenProduct}
            />
          ))}

        </div>

      </div>

    </section>

    {/* =====================================================
        HAMPER STUDIO INVITATION

        Closes the page: rises out of the fruit shop's warm off-white into
        deep green and stays there, so the last thing on screen is the
        gifting invitation. Both entry options lead to the same
        /hamper-studio route — this section only opens the door.
    ===================================================== */}

   <section
  id="hamper-studio"
  className="
    relative
    overflow-hidden
    bg-[#0b1b0e]
    px-5
    pb-32
    pt-20
    text-white
    sm:px-8
    sm:pb-36
    sm:pt-24
    md:px-12
    md:pt-28
  "
>

     <div
  className="
    pointer-events-none
    absolute
    inset-x-0
    top-0
    h-8
    bg-gradient-to-b
    from-[#f5f3e8]/25
    to-transparent
  "
/>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">

        {/* COPY + ENTRY OPTIONS */}

        <div>

          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#efffb0] sm:mb-5 sm:text-[10px]">
            The Hamper Studio
          </p>

          <h2 className="leading-[0.92]">

            <span className="font-playfair block text-[44px] font-normal italic sm:text-6xl md:text-[68px]">
              Build something
            </span>

            <span className="font-playfair block text-[44px] font-normal italic sm:text-6xl md:text-[68px]">
              worth gifting.
            </span>

          </h2>

          <p className="mt-6 max-w-lg text-[13px] leading-6 text-white/60 sm:mt-7 sm:text-[15px] sm:leading-7">
            Choose a basket, fill it slot by slot with fruit selected for
            gifting, and watch the hamper take shape as you go. Everything
            arrives through the same delivery you already know.
          </p>


          {/* TWO ENTRY OPTIONS */}

          <div className="mt-9 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">

            <button
              type="button"
              onClick={() => onOpenHamperStudio('curated')}
              className="group flex flex-col items-start rounded-[20px] border border-white/15 bg-white/[0.06] p-5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.11] active:scale-[0.99] sm:p-6"
            >

              <span className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[#efffb0]/75">
                Ready to send
              </span>

              <span className="font-playfair mt-2.5 text-[24px] italic leading-tight sm:text-[26px]">
                Premium Pre-Made
                <br />
                Hampers
              </span>

              <span className="mt-3 text-[11px] leading-5 text-white/50">
                Four hampers built by us, each filled to the brim.
              </span>

              <span className="mt-5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                Browse hampers
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>

            </button>

            <button
              type="button"
              onClick={() => onOpenHamperStudio('build')}
              className="group flex flex-col items-start rounded-[20px] border border-[#efffb0]/35 bg-[#efffb0] p-5 text-left text-[#17351d] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[0.99] sm:p-6"
            >

              <span className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[#17351d]/55">
                Three steps
              </span>

              <span className="font-playfair mt-2.5 text-[24px] italic leading-tight sm:text-[26px]">
                Build Your Own
                <br />
                Hamper
              </span>

              <span className="mt-3 text-[11px] leading-5 text-[#17351d]/55">
                Pick the basket, choose the fruit, review and send.
              </span>

              <span className="mt-5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#17351d]">
                Start building
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>

            </button>

          </div>


          <div className="mt-12 hidden lg:block">
            <HamperQuoteRotator tone="dark" />
          </div>

        </div>


        {/* REVOLVING BASKET */}

        <div className="flex flex-col items-center gap-8 lg:gap-10">

         <div className="hamper-rise flex justify-center">
  <img
    src="/hamper-basket.png"
    alt="The Fruit House premium fruit hamper"
    className="
      pointer-events-none
      w-full
      max-w-[620px]
      select-none
      object-contain
      drop-shadow-[0_30px_45px_rgba(0,0,0,0.35)]
      sm:max-w-[680px]
      lg:max-w-[720px]
    "
    draggable={false}
  />
</div>

          <div className="lg:hidden">
            <HamperQuoteRotator
              tone="dark"
              align="center"
            />
          </div>

        </div>

      </div>

    </section>


  </main>
)
}