/**
 * HAMPER STUDIO — CURATED HAMPER CARD
 *
 * A premium pre-made hamper. The struck-through comparison price is COMPUTED
 * from the contents by the caller (never hard-coded), so it only appears when
 * the à-la-carte build genuinely costs more than the house price.
 */

import RollingNumber from '../RollingNumber'
import type { CuratedHamper } from '../../data/curatedHampers'
import type { HamperBasket } from '../../data/hamperBaskets'

type CuratedHamperCardProps = {
  hamper: CuratedHamper
  basket: HamperBasket | null
  itemCount: number
  compareAtPrice?: number
  onAdd: (hamperId: string) => void
}

export default function CuratedHamperCard({
  hamper,
  basket,
  itemCount,
  compareAtPrice,
  onAdd,
}: CuratedHamperCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[22px] border border-[#17351d]/10 bg-white/70 p-5 shadow-[0_8px_28px_rgba(8,21,11,0.06)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(8,21,11,0.1)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-[#71864d]">
          {basket ? `${basket.capacity} slots · ${itemCount} selections` : ''}
        </p>

        {hamper.festiveBadge && (
          <span className="shrink-0 rounded-full bg-[#efffb0] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#17351d]">
            {hamper.festiveBadge}
          </span>
        )}
      </div>

      <h3 className="mt-2 font-playfair text-[27px] italic leading-tight text-[#17351d]">
        {hamper.name}
      </h3>

      <p className="mt-2 text-[12px] leading-6 text-[#17351d]/55">
        {hamper.tagline}
      </p>

      {hamper.description && (
        <p className="mt-3 flex-1 text-[11px] leading-5 text-[#17351d]/45">
          {hamper.description}
        </p>
      )}

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#17351d]/10 pt-4">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#17351d]/40">
            House price
          </p>

          <p className="mt-1 flex items-baseline gap-2">
            <span className="font-playfair text-[26px] italic tabular-nums text-[#17351d]">
              <RollingNumber value={hamper.price} prefix="₹" />
            </span>

            {compareAtPrice && (
              <span className="text-[12px] tabular-nums text-[#17351d]/35 line-through">
                ₹{compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAdd(hamper.id)}
          className="shrink-0 rounded-full bg-[#17351d] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#244b2b] active:scale-95"
        >
          Add hamper
        </button>
      </div>
    </div>
  )
}
