import { Minus, Plus, ShoppingBasket, X, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import RollingNumber from '../RollingNumber'

import type { HamperTotals } from '../../lib/hamperSlots'

type HamperMobileCartProps = {
  totals: HamperTotals
  onAdd: (fruitId: string) => void
  onRemove: (fruitId: string) => void
  onContinue: () => void
  disabled: boolean
}

export default function HamperMobileCart({
  totals,
  onAdd,
  onRemove,
  onContinue,
  disabled,
}: HamperMobileCartProps) {
  const [open, setOpen] = useState(false)

  const {
    basket,
    lines,
    usedSlots,
    capacity,
    remainingSlots,
    percentageFilled,
    basketPrice,
    fruitSubtotal,
    grandTotal,
    unitCount,
  } = totals

  const handleContinue = () => {
    if (disabled) return

    // Close the drawer first.
    setOpen(false)

    // Then move Hamper Studio to Step 3.
    onContinue()
  }

  return (
    <>
      {/* =========================================================
          MOBILE COMPACT CART
          ========================================================= */}
      {!open && (
        <div className="fixed left-0 right-0 bottom-3 z-[100] px-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="
              hamper-drop-in
              w-full
              rounded-[20px]
              border
              border-[#17351d]/20
              bg-[#17351d]/95
              px-4
              py-3.5
              text-left
              text-white
              shadow-[0_10px_35px_rgba(8,21,11,0.22)]
              backdrop-blur-xl
            "
          >
            {/* TOP ROW */}
            <div className="flex items-center justify-between gap-3">

              {/* LEFT */}
              <div className="flex min-w-0 items-center gap-2.5">
                <ShoppingBasket
                  size={17}
                  strokeWidth={1.6}
                  className="shrink-0 text-[#efffb0]"
                />

                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-white">
                    {basket?.name ?? 'Your Basket'}
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/60">
                    {unitCount}{' '}
                    {unitCount === 1 ? 'fruit' : 'fruits'} · {usedSlots}/{capacity} slots
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-playfair text-[21px] italic tabular-nums text-[#efffb0]">
                  <RollingNumber
                    value={grandTotal}
                    prefix="₹"
                  />
                </span>

                <ChevronUp
                  size={17}
                  className="text-white/65"
                />
              </div>

            </div>

            {/* CAPACITY BAR */}
            <div className="mt-2.5">

              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="hamper-fill-bar h-full rounded-full bg-[#efffb0]"
                  style={{
                    width: `${Math.min(percentageFilled, 100)}%`,
                  }}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[9px] text-white/65">
                  {remainingSlots === 0
                    ? 'Your hamper is full'
                    : `${remainingSlots} ${
                        remainingSlots === 1 ? 'slot' : 'slots'
                      } remaining`}
                </span>

                <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/45">
                  View hamper
                </span>
              </div>

            </div>
          </button>
        </div>
      )}

      {/* =========================================================
          MOBILE CART DRAWER
          ========================================================= */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* BACKDROP */}
          <button
            type="button"
            aria-label="Close hamper"
            onClick={() => setOpen(false)}
            className="
              absolute
              inset-0
              bg-[#08150b]/40
              backdrop-blur-[3px]
            "
          />

          {/* =====================================================
              BOTTOM SHEET
              ===================================================== */}
          <div
            className="
              hamper-step-enter
              absolute
              inset-x-0
              bottom-0
              flex
              max-h-[88vh]
              min-h-0
              flex-col
              overflow-hidden
              rounded-t-[28px]
              border
              border-[#17351d]/15
              bg-[#f5f3e8]
              shadow-[0_-20px_70px_rgba(8,21,11,0.28)]
            "
          >

            {/* HANDLE */}
            <div className="flex shrink-0 justify-center pb-1 pt-3">
              <div className="h-1 w-10 rounded-full bg-[#17351d]/25" />
            </div>

            {/* =================================================
                HEADER
                ================================================= */}
            <div
              className="
                shrink-0
                border-b
                border-[#17351d]/10
                px-5
                pb-3
                pt-2
              "
            >
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <div className="flex items-center gap-2">
                    <ShoppingBasket
                      size={15}
                      strokeWidth={1.6}
                      className="text-[#71864d]"
                    />

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#71864d]">
                      Your hamper
                    </p>
                  </div>

                  <h3 className="mt-1.5 font-playfair text-[24px] italic leading-tight text-[#17351d]">
                    {basket?.name ?? 'Your Basket'}
                  </h3>

                  <p className="mt-1 text-[11px] text-[#17351d]/55">
                    {unitCount}{' '}
                    {unitCount === 1 ? 'selection' : 'selections'} · {usedSlots}{' '}
                    of {capacity} slots used
                  </p>

                </div>

                {/* CLOSE */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close hamper"
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#17351d]/10
                    bg-white/70
                    text-[#17351d]/60
                    transition
                    active:scale-90
                  "
                >
                  <X size={14} />
                </button>

              </div>
            </div>

            {/* =================================================
                FRUIT LIST
                ONLY THIS AREA SCROLLS
                ================================================= */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5">

              {lines.length === 0 ? (

                <div
                  className="
                    flex
                    min-h-[180px]
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-[#17351d]/6
                    "
                  >
                    <ShoppingBasket
                      size={21}
                      strokeWidth={1.4}
                      className="text-[#17351d]/35"
                    />
                  </div>

                  <p className="mt-3 font-playfair text-[19px] italic text-[#17351d]/70">
                    Your hamper is waiting.
                  </p>

                  <p className="mt-1 max-w-[220px] text-[11px] leading-5 text-[#17351d]/45">
                    Choose fruit from the catalogue and it will appear here.
                  </p>
                </div>

              ) : (

                <div>
                  {lines.map((line) => (
                    <div
                      key={line.fruit.id}
                      className="
                        flex
                        items-center
                        gap-3
                        border-b
                        border-[#17351d]/8
                        py-3.5
                      "
                    >

                      {/* FRUIT VISUAL */}
                      <div
                        className="
                          relative
                          h-11
                          w-11
                          shrink-0
                          overflow-hidden
                          rounded-full
                        "
                        style={{
                          background: `radial-gradient(
                            circle at 32% 28%,
                            ${line.fruit.highlight ?? line.fruit.color} 0%,
                            ${line.fruit.color} 62%,
                            rgba(0,0,0,0.32) 130%
                          )`,
                        }}
                        aria-hidden="true"
                      >
                        <div className="absolute inset-0 rounded-full bg-white/10" />
                      </div>

                      {/* FRUIT INFORMATION */}
                      <div className="min-w-0 flex-1">

                        <p className="truncate font-playfair text-[16px] italic leading-tight text-[#17351d]">
                          {line.fruit.name}
                        </p>

                        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#17351d]/50">
                          {line.fruit.unit}
                        </p>

                        <p className="mt-0.5 text-[9px] text-[#17351d]/45">
                          {line.slots}{' '}
                          {line.slots === 1 ? 'slot' : 'slots'}
                        </p>

                      </div>

                      {/* QUANTITY */}
                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          rounded-full
                          border
                          border-[#17351d]/12
                          bg-white/80
                        "
                      >

                        <button
                          type="button"
                          onClick={() => onRemove(line.fruit.id)}
                          aria-label={`Remove one ${line.fruit.name}`}
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            text-[#17351d]/60
                            transition
                            active:scale-90
                          "
                        >
                          <Minus size={12} />
                        </button>

                        <span
                          className="
                            min-w-[22px]
                            text-center
                            text-[11px]
                            font-semibold
                            tabular-nums
                            text-[#17351d]
                          "
                        >
                          {line.units}
                        </span>

                        <button
                          type="button"
                          onClick={() => onAdd(line.fruit.id)}
                          aria-label={`Add one ${line.fruit.name}`}
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            text-[#17351d]/60
                            transition
                            active:scale-90
                          "
                        >
                          <Plus size={12} />
                        </button>

                      </div>

                      {/* PRICE */}
                      <div className="w-[58px] shrink-0 text-right">
                        <p className="text-[11px] font-semibold tabular-nums text-[#17351d]/80">
                          ₹{line.subtotal.toLocaleString('en-IN')}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>

              )}

            </div>

            {/* =================================================
                CAPACITY
                ================================================= */}
            <div
              className="
                shrink-0
                border-t
                border-[#17351d]/10
                bg-[#17351d]/[0.035]
                px-5
                py-3
              "
            >

              <div className="flex items-center justify-between">

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-[#17351d]/65
                  "
                >
                  Hamper capacity
                </span>

                <span
                  className="
                    text-[12px]
                    font-semibold
                    tabular-nums
                    text-[#17351d]/80
                  "
                >
                  {usedSlots} / {capacity}
                </span>

              </div>

              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#17351d]/10">
                <div
                  className="hamper-fill-bar h-full rounded-full bg-[#71864d]"
                  style={{
                    width: `${Math.min(percentageFilled, 100)}%`,
                  }}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between">

                <span className="text-[10px] text-[#17351d]/60">
                  {remainingSlots === 0
                    ? 'Your hamper is full'
                    : `${remainingSlots} ${
                        remainingSlots === 1 ? 'slot' : 'slots'
                      } remaining`}
                </span>

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-[#17351d]/40
                  "
                >
                  Every fruit counts
                </span>

              </div>

            </div>

            {/* =================================================
                TOTALS + CONTINUE
                ================================================= */}
            <div
              className="
                shrink-0
                border-t
                border-[#17351d]/10
                bg-[#f5f3e8]
                px-5
                pb-[max(14px,env(safe-area-inset-bottom))]
                pt-3
              "
            >

              {/* BASKET */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-[11px]
                  text-[#17351d]/65
                "
              >
                <span>Basket</span>

                <span className="font-semibold tabular-nums text-[#17351d]/80">
                  ₹{basketPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* FRUIT */}
              <div
                className="
                  mt-1.5
                  flex
                  items-center
                  justify-between
                  text-[11px]
                  text-[#17351d]/65
                "
              >
                <span>Fruit</span>

                <span className="font-semibold tabular-nums text-[#17351d]/80">
                  ₹{fruitSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* TOTAL */}
              <div
                className="
                  mt-2.5
                  flex
                  items-end
                  justify-between
                  border-t
                  border-[#17351d]/10
                  pt-2.5
                "
              >
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#17351d]/65
                  "
                >
                  Hamper total
                </span>

                <span
                  className="
                    font-playfair
                    text-[25px]
                    italic
                    font-semibold
                    tabular-nums
                    text-[#17351d]
                  "
                >
                  <RollingNumber
                    value={grandTotal}
                    prefix="₹"
                  />
                </span>
              </div>

              {/* CONTINUE */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={disabled}
                className={`
                  mt-3
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  text-[13px]
                  font-semibold
                  transition-all
                  duration-300
                  ${
                    disabled
                      ? 'cursor-not-allowed bg-[#17351d]/15 text-[#17351d]/40'
                      : 'bg-[#17351d] text-white shadow-[0_8px_24px_rgba(23,53,29,0.18)] active:scale-[0.98]'
                  }
                `}
              >
                Continue
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}