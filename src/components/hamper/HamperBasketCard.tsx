/**
 * HAMPER STUDIO — BASKET OPTION CARD (STEP 1)
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
      className={`
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        p-3
        text-left
        transition-all
        duration-300
        sm:rounded-[20px]
        sm:p-3.5

        ${
          disabled
            ? `
              cursor-not-allowed
              border-[#17351d]/8
              bg-white/40
              opacity-60
            `
            : isSelected
              ? `
                -translate-y-0.5
                border-[#17351d]/45
                bg-white/90
                shadow-[0_10px_30px_rgba(8,21,11,0.11)]
                ring-1
                ring-[#17351d]/20
              `
              : `
                border-[#17351d]/10
                bg-white/65
                shadow-[0_4px_16px_rgba(8,21,11,0.045)]
                hover:-translate-y-0.5
                hover:bg-white/85
                hover:shadow-[0_10px_26px_rgba(8,21,11,0.08)]
              `
        }
      `}
    >
      {/* =========================================================
          HEADER
          ========================================================= */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {/* SLOTS */}
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#536c3d]">
            {basket.capacity} slots
          </p>

          <h3 className="mt-1 font-playfair text-[20px] italic leading-[1.05] text-[#17351d] sm:text-[21px]">
            {basket.name}
          </h3>
        </div>

        {/* BADGE */}
        {basket.festiveBadge && !disabled && (
          <span
            className="
              shrink-0
              rounded-full
              bg-[#efffb0]
              px-2
              py-[5px]
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.11em]
              leading-none
              text-[#17351d]
            "
          >
            {basket.festiveBadge}
          </span>
        )}

        {disabled && (
          <span
            className="
              shrink-0
              rounded-full
              bg-[#17351d]/10
              px-2
              py-[5px]
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.11em]
              leading-none
              text-[#17351d]/50
            "
          >
            Unavailable
          </span>
        )}
      </div>

      {/* =========================================================
          LARGE BASKET IMAGE
          ========================================================= */}
      <div
        className="
          relative
          mt-2
          h-[145px]
          w-full
          overflow-hidden
          rounded-[14px]
          border
          border-[#17351d]/6
          bg-[#f1eee4]
          sm:h-[155px]
        "
      >
        {basket.image ? (
          <img
            src={basket.image}
            alt={`${basket.name} basket`}
            loading="lazy"
            className={`
              h-full
              w-full
              object-contain
              px-3
              py-1
              transition-transform
              duration-500
              ease-out
              ${
                disabled
                  ? 'grayscale opacity-60'
                  : 'group-hover:scale-[1.035]'
              }
            `}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#17351d]/30">
                Basket image
              </p>

              <p className="mt-0.5 text-[7px] text-[#17351d]/20">
                Image coming soon
              </p>
            </div>
          </div>
        )}

        {/* IMAGE FADE */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-8
            bg-gradient-to-t
            from-[#f1eee4]/45
            to-transparent
          "
          aria-hidden="true"
        />

        {/* SELECTED CHECK */}
        {isSelected && (
          <div
            className="
              absolute
              right-2.5
              top-2.5
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-[#17351d]
              text-[#efffb0]
              shadow-[0_4px_12px_rgba(8,21,11,0.18)]
            "
          >
            <span className="text-[11px] font-bold leading-none">
              ✓
            </span>
          </div>
        )}
      </div>

      {/* =========================================================
          DESCRIPTION
          MOVED UP + MORE VISIBLE
          ========================================================= */}
      {basket.description && (
        <p
          className="
            mt-1
            min-h-[28px]
            max-h-[28px]
            overflow-hidden
            text-[10px]
            leading-[14px]
            text-[#17351d]/60
          "
        >
          {basket.description}
        </p>
      )}

      {/* =========================================================
          PRICE
          ========================================================= */}
      <div
        className="
          mt-1.5
          flex
          min-h-[31px]
          items-end
          justify-between
          border-t
          border-[#17351d]/10
          pt-1.5
        "
      >
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#17351d]/55
            "
          >
            Basket only
          </span>

          {isSelected && (
            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-[#17351d]
                px-2
                py-[4px]
                text-[6.5px]
                font-semibold
                uppercase
                tracking-[0.14em]
                leading-none
                text-[#efffb0]
              "
            >
              Selected
            </span>
          )}
        </div>

        {/* PRICE */}
        <span
          className="
            shrink-0
            font-playfair
            text-[22px]
            font-medium
            italic
            leading-none
            tabular-nums
            text-[#17351d]
          "
        >
          <RollingNumber
            value={basket.price}
            prefix="₹"
          />
        </span>
      </div>
    </button>
  )
}