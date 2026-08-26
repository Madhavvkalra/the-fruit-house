/**
 * HAMPER STUDIO — BASKET CATALOGUE
 *
 * This is a hamper-only data layer. It is intentionally separate from
 * `src/data/products.ts` so the normal fruit shop is never affected by
 * gifting configuration.
 *
 * CAPACITY RULE
 * -------------
 * `capacity` is measured in SLOTS and MUST ALWAYS BE AN EVEN NUMBER.
 *
 * `price` is the price of the basket ITSELF.
 * Fruit is priced separately in `hamperFruits.ts` and added on top.
 */

export type HamperBasket = {
  id: string
  name: string

  /**
   * Total slots this basket can hold.
   * MUST be an even number.
   */
  capacity: number

  /**
   * Price of the empty basket, in rupees.
   * Fruit is charged separately.
   */
  price: number

  description?: string
  festiveBadge?: string

  /**
   * Set to false to take a basket out of circulation
   * without deleting it.
   */
  available: boolean

  /**
   * Optional real basket image used by the basket catalogue.
   *
   * These files should live inside:
   *
   * public/hamper-baskets/
   */
  image?: string

  /**
   * Visual configuration for the CSS 3D basket.
   *
   * Kept in the data layer so the existing 3D basket
   * renderer continues to work elsewhere.
   */
  visual: {
    /** Weave colour, lit side. */
    weave: string

    /** Weave colour, shadowed side. */
    weaveDeep: string

    /** Rim / handle colour. */
    rim: string

    /** Rendered basket width in px at reference size. */
    width: number

    /** Rendered basket height in px at reference size. */
    height: number

    /** Number of vertical staves used to fake the cylinder. */
    staves: number
  }
}

export const hamperBaskets: HamperBasket[] = [
  {
    id: 'petite-crate',
    name: 'Petite Crate',
    capacity: 20,
    price: 450,

    description:
      'A small, considered gesture. Enough room for five careful choices.',

    available: true,

    image: '/hamper-baskets/petite-crate.png',

    visual: {
      weave: '#c9a86a',
      weaveDeep: '#8a6d3c',
      rim: '#e0c489',
      width: 210,
      height: 128,
      staves: 18,
    },
  },

  {
    id: 'classic-hamper',
    name: 'Classic Hamper',
    capacity: 30,
    price: 650,

    description:
      'Our most-gifted basket. Generous without being ceremonial.',

    festiveBadge: 'Most gifted',
    available: true,

    image: '/hamper-baskets/classic-hamper.png',

    visual: {
      weave: '#c8a163',
      weaveDeep: '#846434',
      rim: '#dfbd7f',
      width: 240,
      height: 142,
      staves: 20,
    },
  },

  {
    id: 'signature-basket',
    name: 'Signature Basket',
    capacity: 40,
    price: 900,

    description:
      'The house standard. Deep enough to layer stone fruit over vine fruit.',

    available: true,

    image: '/hamper-baskets/signature-basket.png',

    visual: {
      weave: '#bf9557',
      weaveDeep: '#7a5a2d',
      rim: '#d9b273',
      width: 272,
      height: 158,
      staves: 22,
    },
  },

  {
    id: 'grand-hamper',
    name: 'Grand Hamper',
    capacity: 50,
    price: 1250,

    description:
      'For a household rather than a person. Arrives with a linen liner.',

    available: true,

    image: '/hamper-baskets/grand-hamper.png',

    visual: {
      weave: '#b98d4d',
      weaveDeep: '#6f5127',
      rim: '#d3a967',
      width: 300,
      height: 172,
      staves: 24,
    },
  },

  {
    id: 'celebration-trunk',
    name: 'Celebration Trunk',
    capacity: 60,
    price: 1650,

    description:
      'A festive centrepiece. Built to be opened in front of everyone.',

    festiveBadge: 'Festive',
    available: true,

    image: '/hamper-baskets/celebration-trunk.png',

    visual: {
      weave: '#ad7f42',
      weaveDeep: '#644720',
      rim: '#c99d5c',
      width: 328,
      height: 186,
      staves: 26,
    },
  },

  {
    id: 'heritage-chest',
    name: 'The Heritage Chest',
    capacity: 80,
    price: 2400,

    description:
      'Our largest. Corporate gifting, weddings, and the occasional apology.',

    festiveBadge: 'Limited',
    available: true,

    image: '/hamper-baskets/heritage-chest.png',

    visual: {
      weave: '#9d7139',
      weaveDeep: '#573d1b',
      rim: '#bd8f50',
      width: 356,
      height: 202,
      staves: 28,
    },
  },
]

export function getHamperBasket(
  basketId: string | null
): HamperBasket | null {
  if (!basketId) return null

  return (
    hamperBaskets.find((basket) => basket.id === basketId) ?? null
  )
}

export const availableHamperBaskets = () =>
  hamperBaskets.filter((basket) => basket.available)