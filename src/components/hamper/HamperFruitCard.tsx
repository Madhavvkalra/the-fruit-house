/**
 * HAMPER STUDIO — FRUIT CARD
 *
 * Compact quick-commerce style fruit card.
 * Mobile: 2 × 2 grid
 * Desktop: adapts naturally to the catalogue grid.
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
      className={`
        group
        relative
        flex
        h-full
        min-h-[250px]
        flex-col
        overflow-hidden
        rounded-[15px]
        border
        bg-white/80
        text-left
        shadow-[0_4px_14px_rgba(8,21,11,0.045)]
        transition-all
        duration-300

        sm:min-h-[280px]
        sm:rounded-[18px]

        ${
          inHamper
            ? 'border-[#17351d]/35 ring-1 ring-[#17351d]/10'
            : 'border-[#17351d]/10'
        }
      `}
    >
      {/* =========================================================
          FRUIT IMAGE
          FLUSH WITH CARD EDGES
          ========================================================= */}
      <div
        className="
          relative
          h-[140px]
          w-full
          shrink-0
          overflow-hidden
          bg-[#f2efe5]

          sm:h-[165px]
        "
      >
        {fruit.image ? (
          <img
            src={fruit.image}
            alt={fruit.name}
            loading="lazy"
            className="
              block
              h-full
              w-full
              object-contain
              p-0
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.035]
            "
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(
                circle at 32% 28%,
                ${fruit.highlight ?? fruit.color} 0%,
                ${fruit.color} 62%,
                rgba(0,0,0,0.35) 130%
              )`,
            }}
          />
        )}

        {/* Very subtle bottom fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-8
            bg-gradient-to-t
            from-black/5
            to-transparent
          "
        />

        {/* =====================================================
            ADD BUTTON
            ===================================================== */}
        {!inHamper ? (
          <button
            type="button"
            onClick={() => onAdd(fruit.id)}
            disabled={addDisabled}
            className={`
              absolute
              bottom-2
              right-2
              z-10
              flex
              h-9
              min-w-[50px]
              items-center
              justify-center
              rounded-[10px]
              border
              bg-white
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.08em]
              shadow-[0_3px_10px_rgba(8,21,11,0.15)]
              transition-all
              duration-200

              ${
                addDisabled
                  ? 'cursor-not-allowed border-[#17351d]/10 text-[#17351d]/25'
                  : 'border-[#17351d]/15 text-[#17351d] hover:bg-[#17351d] hover:text-white active:scale-95'
              }
            `}
          >
            {addDisabled ? 'Full' : 'ADD'}
          </button>
        ) : (
          /* =====================================================
             QUANTITY CONTROL
             ===================================================== */
          <div
            className="
              absolute
              bottom-2
              right-2
              z-10
              flex
              h-9
              items-center
              overflow-hidden
              rounded-[10px]
              border
              border-[#17351d]/15
              bg-white
              shadow-[0_3px_10px_rgba(8,21,11,0.15)]
            "
          >
            <button
              type="button"
              onClick={() => onRemove(fruit.id)}
              aria-label={`Remove one ${fruit.name}`}
              className="
                flex
                h-9
                w-8
                items-center
                justify-center
                text-[16px]
                font-medium
                text-[#17351d]/65
                transition
                hover:bg-[#17351d]/5
                active:scale-90
              "
            >
              −
            </button>

            <span
              className="
                flex
                h-9
                min-w-[25px]
                items-center
                justify-center
                border-x
                border-[#17351d]/8
                text-[11px]
                font-bold
                tabular-nums
                text-[#17351d]
              "
            >
              {units}
            </span>

            <button
              type="button"
              onClick={() => onAdd(fruit.id)}
              disabled={addDisabled}
              aria-label={`Add one ${fruit.name}`}
              className={`
                flex
                h-9
                w-8
                items-center
                justify-center
                text-[16px]
                font-medium
                transition
                active:scale-90

                ${
                  addDisabled
                    ? 'cursor-not-allowed text-[#17351d]/20'
                    : 'text-[#17351d]/65 hover:bg-[#17351d]/5'
                }
              `}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* =========================================================
          FRUIT INFORMATION
          ========================================================= */}
      <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3 sm:pt-2.5">
        {/* NAME */}
        <h4
          className="
            line-clamp-2
            font-playfair
            text-[15px]
            italic
            leading-[1.08]
            text-[#17351d]

            sm:text-[18px]
          "
        >
          {fruit.name}
        </h4>

        {/* UNIT / ORIGIN */}
        <p
          className="
            mt-1
            truncate
            text-[7px]
            font-semibold
            uppercase
            tracking-[0.1em]
            text-[#17351d]/45

            sm:text-[9px]
          "
        >
          {fruit.unit} · {fruit.origin}
        </p>

        {/* NOTE */}
        {fruit.note && (
          <p
            className="
              mt-1.5
              min-h-[30px]
              line-clamp-2
              text-[8px]
              leading-[13px]
              text-[#17351d]/50

              sm:min-h-[36px]
              sm:text-[10px]
              sm:leading-4
            "
          >
            {fruit.note}
          </p>
        )}

        {/* =====================================================
            PRICE — LOCKED TO BOTTOM
            ===================================================== */}
        <div
          className="
            mt-auto
            flex
            min-h-[30px]
            items-center
            justify-between
            gap-2
            border-t
            border-[#17351d]/8
            pt-2
          "
        >
          <span
            className="
              font-playfair
              text-[18px]
              font-medium
              italic
              leading-none
              tabular-nums
              text-[#17351d]

              sm:text-[21px]
            "
          >
            <RollingNumber
              value={fruit.pricePerUnit}
              prefix="₹"
            />
          </span>

          <span
            className="
              truncate
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#17351d]/35
            "
          >
            {fruit.slotsPerUnit}{' '}
            {fruit.slotsPerUnit === 1 ? 'slot' : 'slots'}
          </span>
        </div>
      </div>
    </div>
  )
}