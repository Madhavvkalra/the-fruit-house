/**
 * HAMPER STUDIO — SLOT ENGINE
 *
 * Pure functions only. This module owns every capacity decision so the UI can
 * never disagree with itself about whether a fruit fits. Components must ask
 * `canAdd` before adding and clamp with `sanitizeSelection` on load — they must
 * NOT re-derive capacity rules of their own.
 *
 * INVARIANTS
 *   - usedSlots is never greater than capacity
 *   - remainingSlots is never negative
 *   - a unit is addable only if its full slot cost fits in remainingSlots
 */

import {
  getHamperBasket,
  type HamperBasket,
} from '../data/hamperBaskets'

import {
  getHamperFruit,
  type HamperFruit,
} from '../data/hamperFruits'

/** fruitId -> number of units selected. */
export type HamperSelection = Record<string, number>

export type HamperLine = {
  fruit: HamperFruit
  units: number
  slots: number
  subtotal: number
}

export type HamperTotals = {
  basket: HamperBasket | null
  capacity: number
  usedSlots: number
  remainingSlots: number
  percentageFilled: number
  isFull: boolean
  isEmpty: boolean
  unitCount: number
  lines: HamperLine[]
  fruitSubtotal: number
  basketPrice: number
  grandTotal: number
}

/** Slot cost of a single fruit, defaulting to 1 for unknown ids. */
export function slotsPerUnit(fruitId: string): number {
  const fruit = getHamperFruit(fruitId)
  return fruit ? Math.max(1, fruit.slotsPerUnit) : 1
}

/** Total slots a whole selection consumes. */
export function usedSlots(selection: HamperSelection): number {
  return Object.entries(selection).reduce(
    (total, [fruitId, units]) =>
      total + slotsPerUnit(fruitId) * Math.max(0, units),
    0
  )
}

/**
 * Whether `count` more units of `fruitId` fit in the basket. This is the ONLY
 * gate the UI should consult before adding — it guarantees usedSlots can never
 * exceed capacity and remainingSlots can never go negative.
 */
export function canAdd(
  basketId: string | null,
  selection: HamperSelection,
  fruitId: string,
  count = 1
): boolean {
  const basket = getHamperBasket(basketId)
  if (!basket) return false
  if (count <= 0) return false

  const cost = slotsPerUnit(fruitId) * count
  const remaining = basket.capacity - usedSlots(selection)

  return cost <= remaining
}

/**
 * Remove impossible entries and clamp the whole selection down until it fits
 * the basket. Used on load (localStorage) and whenever the basket changes, so
 * a smaller basket can never inherit an over-capacity selection.
 *
 * Fruit is kept in insertion order; the last entries are trimmed first, and a
 * single unit that still would not fit is dropped rather than partially kept.
 */
export function sanitizeSelection(
  basketId: string | null,
  selection: HamperSelection
): HamperSelection {
  const basket = getHamperBasket(basketId)
  if (!basket) return {}

  const clean: HamperSelection = {}
  let running = 0

  for (const [fruitId, rawUnits] of Object.entries(selection)) {
    const fruit = getHamperFruit(fruitId)
    if (!fruit) continue

    const units = Math.max(0, Math.floor(rawUnits))
    if (units === 0) continue

    const cost = fruit.slotsPerUnit
    let kept = 0

    while (kept < units && running + cost <= basket.capacity) {
      running += cost
      kept += 1
    }

    if (kept > 0) clean[fruitId] = kept
  }

  return clean
}

/** Everything the UI needs to render, derived from a basket + selection. */
export function computeTotals(
  basketId: string | null,
  selection: HamperSelection
): HamperTotals {
  const basket = getHamperBasket(basketId)
  const capacity = basket?.capacity ?? 0

  const lines: HamperLine[] = []
  let used = 0
  let fruitSubtotal = 0
  let unitCount = 0

  for (const [fruitId, rawUnits] of Object.entries(selection)) {
    const fruit = getHamperFruit(fruitId)
    if (!fruit) continue

    const units = Math.max(0, Math.floor(rawUnits))
    if (units === 0) continue

    const slots = fruit.slotsPerUnit * units
    const subtotal = fruit.pricePerUnit * units

    used += slots
    fruitSubtotal += subtotal
    unitCount += units

    lines.push({ fruit, units, slots, subtotal })
  }

  // Clamp defensively; computeTotals must never report an impossible state
  // even if handed a selection that skipped sanitizeSelection.
  const usedClamped = Math.min(used, capacity)
  const remaining = Math.max(0, capacity - usedClamped)
  const percentage =
    capacity === 0
      ? 0
      : Math.min(100, Math.round((usedClamped / capacity) * 100))

  const basketPrice = basket?.price ?? 0

  return {
    basket,
    capacity,
    usedSlots: usedClamped,
    remainingSlots: remaining,
    percentageFilled: percentage,
    isFull: capacity > 0 && remaining === 0,
    isEmpty: unitCount === 0,
    unitCount,
    lines,
    fruitSubtotal,
    basketPrice,
    grandTotal: basketPrice + fruitSubtotal,
  }
}
