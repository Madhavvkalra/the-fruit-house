/**
 * HAMPER STUDIO — PREMIUM PRE-MADE HAMPERS
 *
 * Curated hampers are ordinary basket + selection pairs that the house has
 * already composed. They deliberately reuse the same basket ids and fruit ids
 * as the build-your-own flow, so the slot engine validates them with exactly
 * the same rules and a curated hamper can be opened in the builder and edited.
 *
 * Every `contents` list below fills its basket exactly to capacity.
 *
 * `price` is what the house charges. The struck-through comparison shown in
 * the UI is COMPUTED from the contents at runtime (see `curatedTotals`), never
 * hard-coded, so the advertised saving can never drift away from the data.
 */

export type CuratedHamperContent = {
  fruitId: string
  units: number
}

export type CuratedHamper = {
  id: string
  name: string
  tagline: string

  /** Basket this hamper ships in. Must exist in `hamperBaskets.ts`. */
  basketId: string

  contents: CuratedHamperContent[]

  /** House price in rupees, inclusive of the basket. */
  price: number

  description?: string
  festiveBadge?: string
  available: boolean
}

export const curatedHampers: CuratedHamper[] = [
  {
    id: 'petite-gesture',
    name: 'The Petite Gesture',
    tagline: 'Small, deliberate, and never mistaken for an afterthought.',
    basketId: 'petite-crate',
    contents: [
      { fruitId: 'gala-apple', units: 4 },
      { fruitId: 'american-cherries', units: 4 },
      { fruitId: 'blueberries', units: 4 },
      { fruitId: 'hass-kiwi', units: 4 },
      { fruitId: 'shine-muscat', units: 2 },
    ],
    price: 3990,
    description:
      'Five choices, twenty slots, nothing spare. For a thank-you that should still feel considered.',
    available: true,
  },
  {
    id: 'morning-table',
    name: 'The Morning Table',
    tagline: 'A week of good breakfasts, arranged in one basket.',
    basketId: 'classic-hamper',
    contents: [
      { fruitId: 'gala-apple', units: 4 },
      { fruitId: 'washington-pears', units: 4 },
      { fruitId: 'hass-kiwi', units: 4 },
      { fruitId: 'blueberries', units: 4 },
      { fruitId: 'american-cherries', units: 4 },
      { fruitId: 'hass-avocado', units: 4 },
      { fruitId: 'shine-muscat', units: 3 },
    ],
    price: 5690,
    description:
      'Balanced between sweet and tart on purpose, so it lasts the week instead of the weekend.',
    festiveBadge: 'Most gifted',
    available: true,
  },
  {
    id: 'celebration-hamper',
    name: 'The Celebration Hamper',
    tagline: 'Built to be opened in front of people.',
    basketId: 'signature-basket',
    contents: [
      { fruitId: 'shine-muscat', units: 4 },
      { fruitId: 'american-cherries', units: 6 },
      { fruitId: 'gala-apple', units: 6 },
      { fruitId: 'washington-pears', units: 4 },
      { fruitId: 'blueberries', units: 4 },
      { fruitId: 'dragon-fruit', units: 2 },
      { fruitId: 'hass-avocado', units: 4 },
      { fruitId: 'hass-kiwi', units: 4 },
    ],
    price: 7450,
    description:
      'Muscat and dragon fruit on top, orchard fruit beneath. Forty slots, filled to the rim.',
    festiveBadge: 'Festive',
    available: true,
  },
  {
    id: 'heritage-collection',
    name: 'The Heritage Collection',
    tagline: 'Our largest composition. For weddings, offices and apologies.',
    basketId: 'celebration-trunk',
    contents: [
      { fruitId: 'shine-muscat', units: 6 },
      { fruitId: 'dragon-fruit', units: 3 },
      { fruitId: 'american-cherries', units: 8 },
      { fruitId: 'blueberries', units: 8 },
      { fruitId: 'gala-apple', units: 8 },
      { fruitId: 'washington-pears', units: 6 },
      { fruitId: 'hass-avocado', units: 6 },
      { fruitId: 'hass-kiwi', units: 6 },
    ],
    price: 11450,
    description:
      'Sixty slots across eight varieties, layered so the showpieces sit where they can be seen.',
    available: true,
  },
]

/** Convert a curated hamper's contents into a slot-engine selection. */
export function curatedSelection(
  hamper: CuratedHamper
): Record<string, number> {
  const selection: Record<string, number> = {}

  for (const entry of hamper.contents) {
    selection[entry.fruitId] =
      (selection[entry.fruitId] ?? 0) + entry.units
  }

  return selection
}

export function getCuratedHamper(
  hamperId: string
): CuratedHamper | null {
  return (
    curatedHampers.find((hamper) => hamper.id === hamperId) ?? null
  )
}
