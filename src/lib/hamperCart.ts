/**
 * HAMPER STUDIO — CART ADAPTER
 *
 * This is the ONLY bridge between the Hamper Studio and the rest of the shop,
 * and it is deliberately thin.
 *
 * A hamper enters the cart as an ordinary `Product` + `ProductVariant` pair, so
 * `App.addToBasket` accepts it unchanged and every downstream surface — the
 * floating basket, the basket drawer, the order summary, coupons, delivery,
 * payment and order confirmation — keeps working with no hamper-specific code.
 * There is no second cart, no second checkout and no hamper order pipeline.
 *
 * Consequences of that choice, stated plainly:
 *   - `product.id` is DERIVED DETERMINISTICALLY from the basket and contents.
 *     Two identical hampers therefore produce the same id, and the existing
 *     de-duplication in `addToBasket` merges them into one line with quantity 2
 *     instead of two identical lines. Two DIFFERENT hampers hash differently
 *     and stay separate. Nothing here uses Date.now() or Math.random(), so the
 *     id is stable across reloads and re-adds.
 *   - The basket drawer renders `variant.label · product.origin` and the order
 *     summary renders `variant.label · Qty n`, so the label carries the basket
 *     name and the slot fill. The itemised fruit list is carried on
 *     `product.description`, which no existing surface renders — the itemised
 *     view lives in the studio's own review step.
 */

import type { Product, ProductVariant } from '../data/products'

import { getHamperBasket } from '../data/hamperBaskets'
import {
  curatedSelection,
  type CuratedHamper,
} from '../data/curatedHampers'

import {
  computeTotals,
  sanitizeSelection,
  type HamperSelection,
  type HamperTotals,
} from './hamperSlots'

export type HamperCartEntry = {
  product: Product
  variant: ProductVariant
}

/**
 * djb2. Deterministic and dependency-free — the same contents must always
 * produce the same cart id so re-adding a hamper merges instead of duplicating.
 */
function stableHash(input: string): string {
  let hash = 5381

  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) + hash + input.charCodeAt(index)) | 0
  }

  return (hash >>> 0).toString(36)
}

/** Order-independent fingerprint of a selection. */
function selectionFingerprint(
  selection: HamperSelection
): string {
  return Object.entries(selection)
    .filter(([, units]) => units > 0)
    .map(([fruitId, units]) => `${fruitId}:${units}`)
    .sort()
    .join('|')
}

/** "4 × Gala Apples (4 pcs), 2 × Blueberries (125g box)" */
function describeContents(totals: HamperTotals): string {
  return totals.lines
    .map(
      (line) =>
        `${line.units} × ${line.fruit.name} (${line.fruit.unit})`
    )
    .join(', ')
}

function slotLabel(totals: HamperTotals): string {
  const basketName = totals.basket?.name ?? 'Hamper'
  return `${basketName} · ${totals.usedSlots}/${totals.capacity} slots`
}

/**
 * A build-your-own hamper. Returns null when the hamper is not orderable
 * (no basket chosen, or no fruit in it) so the caller cannot add an empty
 * basket to the cart by mistake.
 */
export function buildCustomHamperCartEntry(
  basketId: string | null,
  selection: HamperSelection
): HamperCartEntry | null {
  const basket = getHamperBasket(basketId)
  if (!basket) return null

  // Re-clamp at the boundary. Even if a caller somehow holds an over-capacity
  // selection, an invalid hamper can never reach the cart.
  const safeSelection = sanitizeSelection(basket.id, selection)
  const totals = computeTotals(basket.id, safeSelection)

  if (totals.isEmpty) return null

  const fingerprint = selectionFingerprint(safeSelection)
  const id = `hamper-custom-${basket.id}-${stableHash(fingerprint)}`

  const variant: ProductVariant = {
    label: slotLabel(totals),
    price: totals.grandTotal,
  }

  const product: Product = {
    id,
    name: 'Your Custom Hamper',
    origin: 'Hamper Studio',
    quantity: `${totals.unitCount} ${
      totals.unitCount === 1 ? 'selection' : 'selections'
    }`,
    description: describeContents(totals),
    badge: 'Hamper',
    variants: [variant],
  }

  return { product, variant }
}

/** A premium pre-made hamper, priced at the house price rather than à la carte. */
export function buildCuratedHamperCartEntry(
  hamper: CuratedHamper
): HamperCartEntry | null {
  const basket = getHamperBasket(hamper.basketId)
  if (!basket) return null

  const selection = sanitizeSelection(
    basket.id,
    curatedSelection(hamper)
  )
  const totals = computeTotals(basket.id, selection)

  if (totals.isEmpty) return null

  const variant: ProductVariant = {
    label: slotLabel(totals),
    price: hamper.price,
    // Only advertise a saving when the à-la-carte build genuinely costs more.
    compareAtPrice:
      totals.grandTotal > hamper.price
        ? totals.grandTotal
        : undefined,
  }

  const product: Product = {
    id: `hamper-curated-${hamper.id}`,
    name: hamper.name,
    origin: 'Premium Hamper',
    quantity: `${totals.unitCount} selections`,
    description: describeContents(totals),
    badge: hamper.festiveBadge ?? 'Hamper',
    variants: [variant],
  }

  return { product, variant }
}
