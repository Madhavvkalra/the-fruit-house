/**
 * HAMPER STUDIO — REVIEW STEP (STEP 3)
 *
 * Itemises the built hamper — basket line, each fruit line with units, slots
 * and subtotal, then the totals — before the customer commits. "Continue to
 * checkout" is the ONLY forward action, and it hands the hamper to the existing
 * cart. There is no separate hamper checkout on the other side of this button.
 */

import RollingNumber from '../RollingNumber'
import type { HamperTotals } from '../../lib/hamperSlots'

type HamperReviewProps = {
  totals: HamperTotals
  onEditBasket: () => void
  onEditFruits: () => void
  onContinueToCheckout: () => void
  onClear: () => void
}

export default function HamperReview({
  totals,
  onEditBasket,
  onEditFruits,
  onContinueToCheckout,
  onClear,
}: HamperReviewProps) {
  const { basket } = totals

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-[24px] border border-[#17351d]/10 bg-white/75 shadow-[0_14px_44px_rgba(8,21,11,0.08)] backdrop-blur-sm">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-[#17351d]/10 px-6 py-5">
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#71864d]">
              Review your hamper
            </p>
            <h3 className="mt-1.5 font-playfair text-[28px] italic leading-tight text-[#17351d]">
              {basket?.name ?? 'Your Hamper'}
            </h3>
            <p className="mt-1 text-[11px] text-[#17351d]/45">
              {totals.usedSlots} of {totals.capacity} slots ·{' '}
              {totals.unitCount}{' '}
              {totals.unitCount === 1 ? 'selection' : 'selections'}
            </p>
          </div>

          <button
            type="button"
            onClick={onEditBasket}
            className="shrink-0 rounded-full border border-[#17351d]/15 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#17351d] transition-all duration-300 hover:bg-[#17351d] hover:text-white"
          >
            Change basket
          </button>
        </div>

        {/* LINES */}
        <div className="px-6 py-4">
          {/* Basket line */}
          <div className="flex items-center justify-between border-b border-[#17351d]/8 py-3">
            <div>
              <p className="font-playfair text-[16px] italic text-[#17351d]">
                {basket?.name}
              </p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[#17351d]/40">
                Basket · {totals.capacity} slots
              </p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-[#17351d]">
              ₹{totals.basketPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Fruit lines */}
          {totals.lines.map((line) => (
            <div
              key={line.fruit.id}
              className="flex items-center justify-between border-b border-[#17351d]/8 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-7 w-7 shrink-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, ${
                      line.fruit.highlight ?? line.fruit.color
                    } 0%, ${line.fruit.color} 62%, rgba(0,0,0,0.35) 130%)`,
                  }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-playfair text-[16px] italic text-[#17351d]">
                    {line.units} × {line.fruit.name}
                  </p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[#17351d]/40">
                    {line.fruit.unit} · {line.slots}{' '}
                    {line.slots === 1 ? 'slot' : 'slots'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold tabular-nums text-[#17351d]">
                ₹{line.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          ))}

          {totals.isEmpty && (
            <p className="py-8 text-center text-[12px] text-[#17351d]/45">
              No fruit added yet. Head back and fill your basket.
            </p>
          )}
        </div>

        {/* TOTALS */}
        <div className="border-t border-[#17351d]/10 bg-[#f5f3e8]/70 px-6 py-5">
          <div className="flex items-center justify-between text-[12px] text-[#17351d]/55">
            <span>Basket</span>
            <span className="tabular-nums">
              ₹{totals.basketPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-[#17351d]/55">
            <span>Fruit</span>
            <span className="tabular-nums">
              ₹{totals.fruitSubtotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-[#17351d]/12 pt-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#17351d]/45">
              Hamper total
            </span>
            <span className="font-playfair text-[30px] italic tabular-nums text-[#17351d]">
              <RollingNumber value={totals.grandTotal} prefix="₹" />
            </span>
          </div>

          {/* ACTIONS */}
          <button
            type="button"
            onClick={onContinueToCheckout}
            disabled={totals.isEmpty}
            className={`mt-5 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
              totals.isEmpty
                ? 'cursor-not-allowed bg-[#17351d]/15 text-[#17351d]/40'
                : 'bg-[#17351d] text-white hover:bg-[#244b2b] active:scale-[0.98]'
            }`}
          >
            Continue to checkout
          </button>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onEditFruits}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#17351d]/55 underline-offset-4 transition hover:text-[#17351d] hover:underline"
            >
              Add more fruit
            </button>
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#17351d]/40 underline-offset-4 transition hover:text-[#17351d] hover:underline"
            >
              Start over
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] leading-5 text-[#17351d]/40">
        Your hamper goes to the same basket and checkout as everything else in
        the shop — delivery, verification and payment are unchanged.
      </p>
    </div>
  )
}
