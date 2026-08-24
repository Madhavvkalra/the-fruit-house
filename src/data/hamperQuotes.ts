/**
 * HAMPER STUDIO — ROTATING QUOTES
 *
 * Rendering lives in `src/components/hamper/HamperQuoteRotator.tsx`; this file
 * is the only place the content is defined. Add, reword, reorder or switch a
 * line off here without touching a component.
 *
 * ATTRIBUTION POLICY
 * ------------------
 * Every line below is original The Fruit House copy, attributed to the house.
 * Do NOT add a quotation attributed to a real person unless it can be verified
 * against a primary source — an invented quote with a famous name on it is a
 * fabrication, and a gifting page is exactly where it would be believed.
 *
 *   active     — false hides the line without deleting it
 *   durationMs — how long this line stays on screen before the next one
 */

export type HamperQuote = {
  id: string
  quote: string
  author: string
  active: boolean
  durationMs: number
}

export const hamperQuotes: HamperQuote[] = [
  {
    id: 'sentence-in-fruit',
    quote: 'A hamper is a sentence you write in fruit.',
    author: 'The Fruit House',
    active: true,
    durationMs: 7000,
  },
  {
    id: 'assembled-not-grabbed',
    quote:
      'Choose slowly. The best gifts are assembled, not grabbed.',
    author: 'The Fruit House',
    active: true,
    durationMs: 7500,
  },
  {
    id: 'ripeness-luxury',
    quote:
      'Ripeness is the one luxury that cannot be faked.',
    author: 'The Fruit House',
    active: true,
    durationMs: 7000,
  },
  {
    id: 'weight-is-not-generosity',
    quote: 'Weight is not generosity. Care is.',
    author: 'The Fruit House',
    active: true,
    durationMs: 6500,
  },
  {
    id: 'someones-name',
    quote:
      'Every basket leaves here with someone’s name on it.',
    author: 'The Fruit House',
    active: true,
    durationMs: 7000,
  },
]

export const activeHamperQuotes = () =>
  hamperQuotes.filter((quote) => quote.active)
