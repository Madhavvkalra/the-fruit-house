/**
 * HAMPER STUDIO — FESTIVE FRUIT CATALOGUE
 *
 * A gifting-only fruit list, deliberately separate from the normal shop in
 * `src/data/products.ts`.
 *
 * The shop sells retail quantities; a hamper is built from the SMALLEST
 * SENSIBLE GIFTING UNIT of each fruit.
 *
 * SLOT MODEL
 * ----------
 * Every basket has a slot capacity (see `hamperBaskets.ts`).
 * Each fruit unit consumes `slotsPerUnit` slots.
 *
 * Capacity is enforced ONLY by `hamperSlots.ts`.
 */

export type HamperFruit = {
  id: string
  name: string
  origin: string
  unit: string
  pricePerUnit: number
  slotsPerUnit: number

  /**
   * Fallback visual colours.
   * These are kept for cases where an image is unavailable.
   */
  color: string
  highlight?: string

  /**
   * Actual fruit image used by HamperFruitCard.
   *
   * These paths assume the images live inside:
   * `public/fruits/`
   */
  image: string

  note?: string
}

export const hamperFruits: HamperFruit[] = [
  {
    id: 'gala-apple',
    name: 'Gala Apples',
    origin: 'New Zealand',
    unit: '4 pcs',
    pricePerUnit: 180,
    slotsPerUnit: 1,

    color: '#d64828',
    highlight: '#f08a5a',

    image: '/fruits/gala-apple.png',

    note: 'Crisp, sweet, forgiving. The safe centre of any hamper.',
  },

  {
    id: 'hass-avocado',
    name: 'Hass Avocado',
    origin: 'Kenya',
    unit: '2 pcs',
    pricePerUnit: 160,
    slotsPerUnit: 1,

    color: '#3f5d2a',
    highlight: '#6f8a48',

    image: '/fruits/hass-avocado.png',

    note: 'Ripens on the counter over a few days.',
  },

  {
    id: 'american-cherries',
    name: 'American Cherries',
    origin: 'USA',
    unit: '125g box',
    pricePerUnit: 240,
    slotsPerUnit: 1,

    color: '#7c1230',
    highlight: '#c03a56',

    image: '/fruits/american-cherries.png',

    note: 'Dark, firm and glossy. Chill before gifting.',
  },

  {
    id: 'shine-muscat',
    name: 'Shine Muscat Grapes',
    origin: 'China',
    unit: '250g bunch',
    pricePerUnit: 320,
    slotsPerUnit: 2,

    color: '#b7c74a',
    highlight: '#dce87e',

    image: '/fruits/shine-muscat.png',

    note: 'Seedless, floral, faintly sweet. A showpiece bunch.',
  },

  {
    id: 'hass-kiwi',
    name: 'Green Kiwi',
    origin: 'Chile',
    unit: '3 pcs',
    pricePerUnit: 140,
    slotsPerUnit: 1,

    color: '#6f7d24',
    highlight: '#9aa84a',

    image: '/fruits/green-kiwi.png',

    note: 'Tart and bright. A good foil for the sweeter fruit.',
  },

  {
    id: 'dragon-fruit',
    name: 'White Dragon Fruit',
    origin: 'Vietnam',
    unit: '2 pcs',
    pricePerUnit: 220,
    slotsPerUnit: 2,

    color: '#d23a6d',
    highlight: '#f06fa0',

    image: '/fruits/white-dragon-fruit.png',

    note: 'Mild and refreshing, with a dramatic cut face.',
  },

  {
    id: 'washington-pears',
    name: 'Washington Pears',
    origin: 'USA',
    unit: '3 pcs',
    pricePerUnit: 170,
    slotsPerUnit: 1,

    color: '#b6923a',
    highlight: '#d8b662',

    image: '/fruits/washington-pears.png',

    note: 'Best a day or two after arrival, when they yield to a thumb.',
  },

  {
    id: 'blueberries',
    name: 'Blueberries',
    origin: 'Peru',
    unit: '125g box',
    pricePerUnit: 260,
    slotsPerUnit: 1,

    color: '#2f3d78',
    highlight: '#5a6bb0',

    image: '/fruits/blueberries.png',

    note: 'Firm, uniform and quietly premium.',
  },
]

export function getHamperFruit(
  fruitId: string
): HamperFruit | null {
  return (
    hamperFruits.find((fruit) => fruit.id === fruitId) ?? null
  )
}