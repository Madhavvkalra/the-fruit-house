/**
 * HAMPER STUDIO — DRAFT PERSISTENCE
 *
 * Keeps an in-progress hamper across reloads and across navigation away from
 * the studio, following the same localStorage convention already used for the
 * recipient-location request in `CheckoutDelivery.tsx`.
 *
 * Loading is deliberately paranoid: a stored draft is untrusted input. The
 * basket must still exist and still be available, unknown fruit ids are
 * dropped, and the selection is clamped by the slot engine. A draft saved
 * against a basket that has since shrunk or been withdrawn can therefore never
 * restore an over-capacity hamper.
 */

import { getHamperBasket } from '../data/hamperBaskets'

import {
  sanitizeSelection,
  type HamperSelection,
} from './hamperSlots'

const STORAGE_KEY = 'fruit-house-hamper-draft-v1'

export type HamperDraft = {
  basketId: string | null
  selection: HamperSelection
}

export const emptyHamperDraft: HamperDraft = {
  basketId: null,
  selection: {},
}

export function loadHamperDraft(): HamperDraft {
  if (typeof window === 'undefined') return emptyHamperDraft

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyHamperDraft

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return emptyHamperDraft
    }

    const basket = getHamperBasket(
      typeof parsed.basketId === 'string' ? parsed.basketId : null
    )

    // A withdrawn or deleted basket invalidates the whole draft rather than
    // silently falling back to a different basket at a different price.
    if (!basket || !basket.available) return emptyHamperDraft

    const rawSelection =
      parsed.selection && typeof parsed.selection === 'object'
        ? (parsed.selection as Record<string, unknown>)
        : {}

    const numeric: HamperSelection = {}

    for (const [fruitId, units] of Object.entries(rawSelection)) {
      const value = Number(units)
      if (Number.isFinite(value) && value > 0) {
        numeric[fruitId] = Math.floor(value)
      }
    }

    return {
      basketId: basket.id,
      selection: sanitizeSelection(basket.id, numeric),
    }
  } catch {
    // Corrupt or unreadable storage must never break the studio.
    return emptyHamperDraft
  }
}

export function saveHamperDraft(draft: HamperDraft): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        basketId: draft.basketId,
        selection: draft.selection,
      })
    )
  } catch {
    // Private-mode / quota failures are non-fatal; the draft just won't persist.
  }
}

export function clearHamperDraft(): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore.
  }
}
