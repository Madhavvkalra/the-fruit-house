/**
 * HAMPER STUDIO — FRUIT SELECTION CARD
 *
 * One festive-catalogue fruit. Mirrors the shop's ProductCard visual language
 * (rounded card, off-white fill, restrained shadow) without reusing it, since
 * the interaction is different: add/remove UNITS against a slot budget rather
 * than open a product popup.
 *
 * The card cannot add a unit that will not fit — `canAdd` is passed down from
 * the studio, which owns the slot engine. When full, the add control is
 * disabled and labelled, never silently ignored.
 */

import RollingNumber from '../RollingNumber'
import type { HamperFruit } from '../../data/hamperFruits'

type HamperFruitCardProps = {
  fruit: HamperFruit
  units: number
  canAddOne: boolean
  onAdd: (fruitId: string) => void
  onRemove: (fruitId: string) => void
}

export default function HamperFruitCard({
  fruit,
  units,
  canAddOne,
  onAdd,
  onRemove,
}: HamperFruitCardProps) {
  const inHamper = units > 0
  const addDisabled = !canAddOne

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-[18px] border bg-white/70 p-4 shadow-[0_6px_20px_rgba(8,21,11,0.05)] backdrop-blur-sm transition duration-300 sm:rounded-[22px] ${
        inHamper
          ? 'border-[#17351d]/40 ring-1 ring-[#17351d]/15'
          : 'border-[#17351d]/10'
      }`}
    >
      {/* SLOT COST CHIP */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-inner"
          style={{
            background: `radial-gradient(circle at 32% 28%, ${
              fruit.highlight ?? fruit.color
            } 0%, ${fruit.color} 62%, rgba(0,0,0,0.35) 130%)`,
          }}
          aria-hidden="true"
        />

        <span className="rounded-full bg-[#17351d]/6 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#17351d]/55">
          {fruit.slotsPerUnit === 1
            ? '1 slot'
            : `${fruit.slotsPerUnit} slots`}
        </span>
      </div>

      {/* NAME + ORIGIN */}
      <h4 className="font-playfair text-[19px] italic leading-tight text-[#17351d]">
        {fruit.name}
      </h4>

      <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#17351d]/40">
        {fruit.unit} · {fruit.origin}
      </p>

      {fruit.note && (
        <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#17351d]/50">
          {fruit.note}
        </p>
      )}

      {/* PRICE + CONTROL */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold tabular-nums text-[#17351d]">
          <RollingNumber value={fruit.pricePerUnit} prefix="₹" />
        </span>

        {inHamper ? (
          <div className="flex items-center rounded-full border border-[#17351d]/12 bg-white/80">
            <button
              type="button"
              onClick={() => onRemove(fruit.id)}
              aria-label={`Remove one ${fruit.name}`}
              className="flex h-8 w-8 items-center justify-center text-sm transition-all duration-200 hover:bg-[#17351d]/5 active:scale-75"
            >
              −
            </button>

            <span
              key={units}
              className="w-6 text-center text-xs font-semibold tabular-nums"
            >
              {units}
            </span>

            <button
              type="button"
              onClick={() => onAdd(fruit.id)}
              disabled={addDisabled}
              aria-label={`Add one ${fruit.name}`}
              className={`flex h-8 w-8 items-center justify-center text-sm transition-all duration-200 ${
                addDisabled
                  ? 'cursor-not-allowed text-[#17351d]/25'
                  : 'hover:bg-[#17351d]/5 active:scale-90'
              }`}
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAdd(fruit.id)}
            disabled={addDisabled}
            className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
              addDisabled
                ? 'cursor-not-allowed bg-[#17351d]/8 text-[#17351d]/30'
                : 'bg-[#17351d] text-white hover:bg-[#244b2b] active:scale-95'
            }`}
          >
            {addDisabled ? 'No room' : 'Add'}
          </button>
        )}
      </div>
    </div>
  )
}
