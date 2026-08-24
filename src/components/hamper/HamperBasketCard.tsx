/**
 * HAMPER STUDIO — BASKET OPTION CARD (STEP 1)
 *
 * Shows capacity, basket price and a small woven preview. Capacity is always
 * rendered from the data, so an even-number capacity is displayed and never
 * recomputed or rounded here.
 *
 * An unavailable basket renders as a disabled card rather than disappearing, so
 * the catalogue stays stable and the customer understands why they cannot pick
 * it. `available: false` in `hamperBaskets.ts` is the only switch.
 */

import RollingNumber from '../RollingNumber'
import type { HamperBasket } from '../../data/hamperBaskets'

type HamperBasketCardProps = {
  basket: HamperBasket
  isSelected: boolean
  onSelect: (basketId: string) => void
}

export default function HamperBasketCard({
  basket,
  isSelected,
  onSelect,
}: HamperBasketCardProps) {
  const disabled = !basket.available

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(basket.id)}
      aria-pressed={isSelected}
      className={`relative flex h-full flex-col overflow-hidden rounded-[20px] border p-5 text-left transition-all duration-300 sm:rounded-[24px] ${
        disabled
          ? 'cursor-not-allowed border-[#17351d]/8 bg-white/40 opacity-60'
          : isSelected
            ? '-translate-y-0.5 border-[#17351d]/45 bg-white/85 shadow-[0_14px_40px_rgba(8,21,11,0.12)] ring-1 ring-[#17351d]/20'
            : 'border-[#17351d]/10 bg-white/65 shadow-[0_6px_20px_rgba(8,21,11,0.05)] hover:-translate-y-0.5 hover:bg-white/80'
      }`}
    >
      {/* BADGES */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[#71864d]">
            {basket.capacity} slots
          </p>

          <h3 className="mt-1.5 font-playfair text-[23px] italic leading-tight text-[#17351d]">
            {basket.name}
          </h3>
        </div>

        {basket.festiveBadge && !disabled && (
          <span className="shrink-0 rounded-full bg-[#efffb0] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#17351d]">
            {basket.festiveBadge}
          </span>
        )}

        {disabled && (
          <span className="shrink-0 rounded-full bg-[#17351d]/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#17351d]/50">
            Unavailable
          </span>
        )}
      </div>

      {/* WOVEN PREVIEW */}
      <div
        className="mt-4 h-16 w-full rounded-[12px]"
        style={{
          background: `linear-gradient(180deg, ${basket.visual.rim} 0%, ${basket.visual.weave} 22%, ${basket.visual.weaveDeep} 100%)`,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 2px, transparent 2px, transparent 8px), linear-gradient(180deg, ${basket.visual.rim} 0%, ${basket.visual.weave} 22%, ${basket.visual.weaveDeep} 100%)`,
          boxShadow: 'inset 0 0 18px rgba(0,0,0,0.22)',
        }}
        aria-hidden="true"
      />

      {basket.description && (
        <p className="mt-3 flex-1 text-[11px] leading-5 text-[#17351d]/50">
          {basket.description}
        </p>
      )}

      {/* PRICE */}
      <div className="mt-4 flex items-end justify-between border-t border-[#17351d]/10 pt-3">
        <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#17351d]/40">
          Basket only
        </span>

        <span className="font-playfair text-[21px] italic tabular-nums text-[#17351d]">
          <RollingNumber value={basket.price} prefix="₹" />
        </span>
      </div>

      {isSelected && (
        <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#17351d] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#efffb0]">
          Selected
        </span>
      )}
    </button>
  )
}
