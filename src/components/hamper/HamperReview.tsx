/**
 * HAMPER STUDIO — REVIEW STEP (STEP 3)
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
    <div className="w-full pb-24 sm:pb-0">

      {/* =========================================================
          REVIEW CONTENT
          ========================================================= */}
      <div className="mx-auto w-[calc(100%+16px)] max-w-2xl -translate-x-2 sm:w-full sm:translate-x-0">

        {/* =======================================================
            REVIEW CARD
            ======================================================= */}
        <div
          className="
            overflow-hidden
            rounded-[24px]
            border
            border-[#17351d]/10
            bg-white/75
            shadow-[0_14px_44px_rgba(8,21,11,0.08)]
            backdrop-blur-sm
          "
        >

          {/* =====================================================
              HEADER
              ===================================================== */}
          <div
            className="
              border-b
              border-[#17351d]/10
              px-4
              py-5
              sm:px-6
            "
          >

            {/* HEADER TOP */}
            <div className="flex items-start justify-between gap-4">

              {/* TITLE */}
              <div className="min-w-0">

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#71864d]
                  "
                >
                  Review your hamper
                </p>

                <h3
                  className="
                    mt-1.5
                    font-playfair
                    text-[28px]
                    italic
                    leading-tight
                    text-[#17351d]
                  "
                >
                  {basket?.name ?? 'Your Hamper'}
                </h3>

                <p className="mt-1 text-[11px] text-[#17351d]/45">
                  {totals.usedSlots} of {totals.capacity} slots ·{' '}
                  {totals.unitCount}{' '}
                  {totals.unitCount === 1
                    ? 'selection'
                    : 'selections'}
                </p>

              </div>

            </div>

            {/* =================================================
                ACTIONS — HORIZONTAL LINE
                ================================================= */}
            <div
              className="
                mt-4
                flex
                w-full
                items-center
                gap-2
                overflow-x-auto
                pb-0.5
              "
            >

{/* CHANGE BASKET */}
<button
  type="button"
  onClick={onEditBasket}
  className="
    flex min-w-0 flex-1 items-center justify-center
    whitespace-nowrap rounded-full
    border border-[#17351d]
    bg-[#17351d]
    px-2 py-2
    text-[8px] font-semibold uppercase
    tracking-[0.06em] text-white
    transition-all duration-300
    hover:bg-[#244b2b]
    active:scale-[0.97]
    sm:px-3.5 sm:text-[9px] sm:tracking-[0.1em]
  "
>
  Change Basket
</button>

{/* ADD MORE */}
<button
  type="button"
  onClick={onEditFruits}
  className="
    flex min-w-0 flex-1 items-center justify-center
    whitespace-nowrap rounded-full
    border border-[#71864d]
    bg-[#71864d]
    px-2 py-2
    text-[8px] font-semibold uppercase
    tracking-[0.06em] text-white
    transition-all duration-300
    hover:bg-[#5f713f]
    active:scale-[0.97]
    sm:px-3.5 sm:text-[9px] sm:tracking-[0.1em]
  "
>
  Add More
</button>

{/* START OVER */}
<button
  type="button"
  onClick={onClear}
  className="
    flex min-w-0 flex-1 items-center justify-center
    whitespace-nowrap rounded-full
    border border-[#17351d]/70
    bg-[#17351d]/10
    px-2 py-2
    text-[8px] font-semibold uppercase
    tracking-[0.06em] text-[#17351d]
    transition-all duration-300
    hover:bg-[#17351d]/20
    active:scale-[0.97]
    sm:px-3.5 sm:text-[9px] sm:tracking-[0.1em]
  "
>
  Start Over
</button>

</div>

          </div>

          {/* =====================================================
              LINES
              ===================================================== */}
          <div className="px-5 py-4 sm:px-6">

            {/* BASKET */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-[#17351d]/8
                py-3
              "
            >

              <div className="min-w-0">

                <p className="font-playfair text-[16px] italic text-[#17351d]">
                  {basket?.name}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    uppercase
                    tracking-[0.14em]
                    text-[#17351d]/40
                  "
                >
                  Basket · {totals.capacity} slots
                </p>

              </div>

              <span
                className="
                  shrink-0
                  text-sm
                  font-semibold
                  tabular-nums
                  text-[#17351d]
                "
              >
                ₹{totals.basketPrice.toLocaleString('en-IN')}
              </span>

            </div>

            {/* FRUITS */}
            {totals.lines.map((line) => (
              <div
                key={line.fruit.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-[#17351d]/8
                  py-3
                "
              >

                <div className="flex min-w-0 items-center gap-3">

                  {/* FRUIT DOT */}
                  <span
                    className="
                      h-7
                      w-7
                      shrink-0
                      rounded-full
                    "
                    style={{
                      background: `radial-gradient(
                        circle at 32% 28%,
                        ${line.fruit.highlight ?? line.fruit.color} 0%,
                        ${line.fruit.color} 62%,
                        rgba(0,0,0,0.35) 130%
                      )`,
                    }}
                    aria-hidden="true"
                  />

                  <div className="min-w-0">

                    <p
                      className="
                        truncate
                        font-playfair
                        text-[16px]
                        italic
                        text-[#17351d]
                      "
                    >
                      {line.units} × {line.fruit.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        uppercase
                        tracking-[0.14em]
                        text-[#17351d]/40
                      "
                    >
                      {line.fruit.unit} · {line.slots}{' '}
                      {line.slots === 1 ? 'slot' : 'slots'}
                    </p>

                  </div>

                </div>

                <span
                  className="
                    shrink-0
                    text-sm
                    font-semibold
                    tabular-nums
                    text-[#17351d]
                  "
                >
                  ₹{line.subtotal.toLocaleString('en-IN')}
                </span>

              </div>
            ))}

            {/* EMPTY */}
            {totals.isEmpty && (
              <p className="py-8 text-center text-[12px] text-[#17351d]/45">
                No fruit added yet. Head back and fill your basket.
              </p>
            )}

          </div>

          {/* =====================================================
              TOTALS
              ===================================================== */}
          <div
            className="
              border-t
              border-[#17351d]/10
              bg-[#f5f3e8]/70
              px-5
              py-5
              sm:px-6
            "
          >

            {/* BASKET */}
            <div className="flex items-center justify-between text-[12px] text-[#17351d]/55">

              <span>Basket</span>

              <span className="tabular-nums">
                ₹{totals.basketPrice.toLocaleString('en-IN')}
              </span>

            </div>

            {/* FRUIT */}
            <div className="mt-2 flex items-center justify-between text-[12px] text-[#17351d]/55">

              <span>Fruit</span>

              <span className="tabular-nums">
                ₹{totals.fruitSubtotal.toLocaleString('en-IN')}
              </span>

            </div>

            {/* GRAND TOTAL */}
            <div
              className="
                mt-4
                flex
                items-end
                justify-between
                border-t
                border-[#17351d]/12
                pt-4
              "
            >

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-[#17351d]/45
                "
              >
                Hamper total
              </span>

              <span
                className="
                  font-playfair
                  text-[30px]
                  italic
                  tabular-nums
                  text-[#17351d]
                "
              >
                <RollingNumber
                  value={totals.grandTotal}
                  prefix="₹"
                />
              </span>

            </div>

          </div>

        </div>

        {/* =======================================================
            INFO
            ======================================================= */}
        <p
          className="
            mt-4
            px-4
            text-center
            text-[10px]
            leading-5
            text-[#17351d]/40
          "
        >
          Your hamper goes to the same basket and checkout as everything
          else in the shop — delivery, verification and payment are unchanged.
        </p>

      </div>

      {/* =========================================================
          MOBILE FIXED CHECKOUT BAR

          IMPORTANT:
          This is a direct child of the review page.
          It is NOT inside the card.
          ========================================================= */}
{/* =========================================================
    MOBILE FIXED CHECKOUT BAR
    ========================================================= */}
<div
  className="
    !fixed
    !bottom-0
    !left-0
    !right-0
    !z-[9999]
    !block
    !w-full
    border-t
    border-[#17351d]/10
    bg-[#f4f1e8]/98
    px-4
    pt-3
    shadow-[0_-12px_35px_rgba(8,21,11,0.12)]
    sm:!hidden
  "
  style={{
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    zIndex: 99999,
    paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
  }}
>
  <button
    type="button"
    onClick={onContinueToCheckout}
    disabled={totals.isEmpty}
    className={`
      flex
      h-12
      w-full
      items-center
      justify-center
      rounded-full
      text-sm
      font-semibold
      transition-all
      duration-300
      ${
        totals.isEmpty
          ? 'cursor-not-allowed bg-[#17351d]/15 text-[#17351d]/40'
          : 'bg-[#17351d] text-white shadow-[0_8px_24px_rgba(23,53,29,0.18)] hover:bg-[#244b2b] active:scale-[0.98]'
      }
    `}
  >
    Continue to checkout
  </button>
</div>

      {/* =========================================================
          DESKTOP CHECKOUT
          ========================================================= */}
      <div className="mx-auto mt-5 hidden w-full max-w-2xl sm:block">

        <button
          type="button"
          onClick={onContinueToCheckout}
          disabled={totals.isEmpty}
          className={`
            flex
            h-12
            w-full
            items-center
            justify-center
            rounded-full
            text-sm
            font-semibold
            transition-all
            duration-300
            ${
              totals.isEmpty
                ? 'cursor-not-allowed bg-[#17351d]/15 text-[#17351d]/40'
                : 'bg-[#17351d] text-white shadow-[0_8px_24px_rgba(23,53,29,0.18)] hover:bg-[#244b2b] active:scale-[0.98]'
            }
          `}
        >
          Continue to checkout
        </button>

      </div>

    </div>
  )
}