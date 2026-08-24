/**
 * HAMPER STUDIO — FESTIVE FRUIT CATALOGUE
 *
 * A gifting-only fruit list, deliberately separate from the normal shop in
 * `src/data/products.ts`. The shop sells retail quantities; a hamper is built
 * from the SMALLEST SENSIBLE GIFTING UNIT of each fruit, so the pricing and
 * pack sizes here do not — and must not — match the shop.
 *
 * SLOT MODEL
 * ----------
 * Every basket has a slot capacity (see `hamperBaskets.ts`). Each fruit unit
 * consumes `slotsPerUnit` slots. Most fruit is one slot per unit; a larger or
 * showier item can cost two. The slot engine in `src/lib/hamperSlots.ts` is
 * the single place that decides whether another unit fits — nothing here
 * enforces capacity, it only declares cost.
 *
 *   unit        — the physical gifting unit ("4 pcs", "125g box")
 *   pricePerUnit— rupees for one unit
 *   slotsPerUnit— slots one unit occupies (>= 1)
 */

export type HamperFruit = {
  id: string
  name: string

  /** e.g. "Kenya", used as the `origin` line in the cart. */
  origin: string

  /** The gifting unit, e.g. "4 pcs" or "125g box". */
  unit: string

  /** Price for a single `unit`, in rupees. */
  pricePerUnit: number

  /** Slots one unit consumes. Must be >= 1. Even totals stay clean at 1 or 2. */
  slotsPerUnit: number

  /** Fruit-sphere colour used by the CSS 3D basket and the fruit card chip. */
  color: string

  /** Optional soft highlight colour for the sphere. */
  highlight?: string

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
