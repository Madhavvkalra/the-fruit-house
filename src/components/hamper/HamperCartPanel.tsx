import { Minus, Plus, ShoppingBasket } from 'lucide-react'
import RollingNumber from '../RollingNumber'

import type { HamperTotals } from '../../lib/hamperSlots'

type HamperCartPanelProps = {
  totals: HamperTotals
  onAdd: (fruitId: string) => void
  onRemove: (fruitId: string) => void
}

export default function HamperCartPanel({
  totals,
  onAdd,
  onRemove,
}: HamperCartPanelProps) {
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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-[#17351d]/10 bg-white/75 shadow-[0_10px_32px_rgba(8,21,11,0.06)] backdrop-blur-sm">

      {/* =========================================================
          HEADER — FIXED
      ========================================================= */}
      <div className="shrink-0 border-b border-[#17351d]/10 px-4 py-3 sm:px-5">

        <div className="flex items-center justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-1.5">
              <ShoppingBasket
                size={12}
                strokeWidth={1.6}
                className="shrink-0 text-[#71864d]"
              />

              <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[#71864d]">
                Your hamper
              </p>
            </div>

            <h3 className="mt-1 truncate font-playfair text-[26px] italic leading-tight text-[#17351d]">
              {basket?.name ?? 'Your Basket'}
            </h3>

            <p className="mt-0.5 text-[11px] text-[#17351d]/45">
              {unitCount}{' '}
              {unitCount === 1 ? 'selection' : 'selections'}
              {' · '}
              {usedSlots} of {capacity} slots used
            </p>

          </div>

          <div className="shrink-0 rounded-full bg-[#17351d]/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#17351d]/55">
            {remainingSlots} left
          </div>

        </div>
      </div>


      {/* =========================================================
          FRUIT LIST — ONLY THIS AREA SCROLLS
      ========================================================= */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-5">

        {lines.length === 0 ? (

          <div className="flex min-h-[150px] flex-col items-center justify-center text-center">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17351d]/6">
              <ShoppingBasket
                size={17}
                strokeWidth={1.4}
                className="text-[#17351d]/30"
              />
            </div>

            <p className="mt-2.5 font-playfair text-[18px] italic text-[#17351d]/65">
              Your hamper is waiting.
            </p>

            <p className="mt-1 max-w-[210px] text-[10px] leading-4 text-[#17351d]/35">
              Choose fruit from the catalogue and it will appear here in real
              time.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-[#17351d]/7">

            {lines.map((line) => (

              <div
                key={line.fruit.id}
                className="flex items-center gap-4 py-4"
              >

                {/* FRUIT VISUAL */}
                <div
                 className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full"
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

                  <p className="truncate font-playfair text-[17px] italic leading-tight text-[#17351d]">
                    {line.fruit.name}
                  </p>

                  <div className="mt-0.5 flex items-center gap-2">

                    <span className="text-[9px] font-semibold uppercase tracking-[0.11em] text-[#17351d]/38">
                      {line.fruit.unit}
                    </span>

                    <span className="text-[11px] text-[#17351d]/35">
                      {line.slots}{' '}
                      {line.slots === 1 ? 'slot' : 'slots'}
                    </span>

                  </div>

                </div>


                {/* QUANTITY */}
                <div className="flex shrink-0 items-center rounded-full border border-[#17351d]/10 bg-white/80">

                  <button
                    type="button"
                    onClick={() => onRemove(line.fruit.id)}
                    aria-label={`Remove one ${line.fruit.name}`}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[#17351d]/50 transition hover:bg-[#17351d]/6 hover:text-[#17351d] active:scale-90"
                  >
                    <Minus size={10} />
                  </button>

                  <span className="min-w-[18px] text-center text-[9px] font-semibold tabular-nums text-[#17351d]">
                    {line.units}
                  </span>

                  <button
                    type="button"
                    onClick={() => onAdd(line.fruit.id)}
                    aria-label={`Add one ${line.fruit.name}`}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[#17351d]/50 transition hover:bg-[#17351d]/6 hover:text-[#17351d] active:scale-90"
                  >
                    <Plus size={10} />
                  </button>

                </div>


                {/* PRICE */}
                <div className="w-[52px] shrink-0 text-right">

                  <p className="text-[11px] font-semibold tabular-nums text-[#17351d]">
                    ₹{line.subtotal.toLocaleString('en-IN')}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


{/* SLOT METER — COMPACT */}
<div className="shrink-0 border-t border-[#17351d]/10 bg-[#f5f3e8]/50 px-5 py-2.5 sm:px-6">

  <div className="flex items-center justify-between">
    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#17351d]/70">
      Hamper capacity
    </span>

    <span className="text-[12px] font-semibold tabular-nums text-[#17351d]/80">
      {usedSlots} / {capacity}
    </span>
  </div>

  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#17351d]/8">
    <div
      className="hamper-fill-bar h-full rounded-full bg-[#71864d]"
      style={{
        width: `${Math.min(percentageFilled, 100)}%`,
      }}
    />
  </div>

  <div className="mt-1 flex items-center justify-between">
    <span className="text-[10px] text-[#17351d]/60">
      {remainingSlots === 0
        ? 'Your hamper is full'
        : `${remainingSlots} ${
            remainingSlots === 1 ? 'slot' : 'slots'
          } remaining`}
    </span>

    <span className="text-[8px] uppercase tracking-[0.1em] text-[#17351d]/40">
      Every fruit counts
    </span>
  </div>

</div>

{/* TOTALS — COMPACT */}
<div className="shrink-0 border-t border-[#17351d]/10 px-5 py-2.5 sm:px-6">

  <div className="flex items-center justify-between text-[11px] text-[#17351d]/65">
    <span>Basket</span>

    <span className="font-semibold tabular-nums text-[#17351d]/80">
      ₹{basketPrice.toLocaleString('en-IN')}
    </span>
  </div>

  <div className="mt-1 flex items-center justify-between text-[11px] text-[#17351d]/65">
    <span>Fruit</span>

    <span className="font-semibold tabular-nums text-[#17351d]/80">
      ₹{fruitSubtotal.toLocaleString('en-IN')}
    </span>
  </div>

  <div className="mt-2 flex items-center justify-between border-t border-[#17351d]/10 pt-2">

    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/65">
      Hamper total
    </span>

    <span className="font-playfair text-[22px] italic font-semibold tabular-nums text-[#17351d]">
      <RollingNumber
        value={grandTotal}
        prefix="₹"
      />
    </span>

  </div>

</div>

    </div>
  )
}