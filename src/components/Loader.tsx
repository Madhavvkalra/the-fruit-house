import { useState } from 'react'

type LoaderProps = {
  isVisible: boolean
  isLoading: boolean
}

const fruitFacts = [
  'An apple can float because it is about 25% air.',
  'Bananas are technically berries, but strawberries are not.',
  'There are more than 7,500 varieties of apples grown around the world.',
  'A pineapple can take almost two years to grow.',
  'Grapes were one of the earliest fruits cultivated by humans.',
  'Every fruit has a story. We are here to help you discover it.',
  'Freshness begins long before fruit reaches your table.',
  'A perfectly ripe fruit is nature’s version of perfect timing.',
  'Good fruit is grown with patience, not rushed with time.',
  'From orchard to table, every fruit travels a story worth knowing.',
  'The sweetest discoveries often come naturally.',
]

export default function Loader({
  isVisible,
  isLoading,
}: LoaderProps) {
  const [randomFact] = useState(
    () => fruitFacts[Math.floor(Math.random() * fruitFacts.length)]
  )

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#08150b] text-white transition-opacity duration-700 ${
        isLoading
          ? 'opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Optional existing skeleton effect */}
      <div className="fruit-house-skeleton__content">
        <div className="fruit-house-skeleton__logo" />
        <div className="fruit-house-skeleton__title" />
        <div className="fruit-house-skeleton__line" />
      </div>

      {/* Main Loader */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* LOGO */}
        <div
          className="flex h-20 w-20 items-center justify-center"
          style={{
            animation: 'loaderPulse 1.8s ease-in-out infinite',
          }}
        >
          <img
            src="/fruit-house-logo.png"
            alt="The Fruit House"
            draggable={false}
            className="h-full w-full object-contain select-none"
          />
        </div>

        {/* BRAND */}
        <p className="font-playfair mt-5 text-3xl italic sm:text-4xl">
          The Fruit House
        </p>

        {/* LOADING LINE */}
        <div className="mt-8 h-px w-48 overflow-hidden bg-white/10">
          <div
            className="h-full w-1/2 bg-[#efffb0]"
            style={{
              animation: 'loaderProgress 1.4s ease-in-out infinite',
            }}
          />
        </div>

        {/* LOADING FACT */}
        <div className="mt-6 max-w-[340px]">
          <p className="text-[8px] font-semibold uppercase tracking-[0.32em] text-[#efffb0]/60">
            While we prepare your harvest
          </p>

          <p className="mt-3 text-sm leading-6 text-white/55">
            “{randomFact}”
          </p>
        </div>

      </div>
    </div>
  )
}