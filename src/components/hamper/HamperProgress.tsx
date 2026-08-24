/**
 * HAMPER STUDIO — FILL DISPLAY
 *
 * The primary fill indicator is the large slot count ("14 / 20 SLOTS"), backed
 * by a row of pips — one per slot for smaller baskets, or a proportional meter
 * for large ones. A plain full-width progress bar is deliberately NOT the hero
 * of this component; the number is.
 */

import RollingNumber from '../RollingNumber'

type HamperProgressProps = {
  usedSlots: number
  capacity: number
  remainingSlots: number
  percentageFilled: number
  isFull: boolean
}

// Above this, one-pip-per-slot becomes noise, so fall back to a meter.
const PIP_LIMIT = 40

export default function HamperProgress({
  usedSlots,
  capacity,
  remainingSlots,
  percentageFilled,
  isFull,
}: HamperProgressProps) {
  const usePips = capacity > 0 && capacity <= PIP_LIMIT

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#71864d]">
            Your hamper
          </p>

          <p className="mt-2 flex items-baseline gap-1 font-playfair italic leading-none text-[#17351d]">
            <span
              key={usedSlots}
              className="hamper-slot-count text-[46px] tabular-nums sm:text-[54px]"
            >
              <RollingNumber value={usedSlots} />
            </span>
            <span className="text-[22px] text-[#17351d]/40">
              / {capacity}
            </span>
            <span className="ml-1 self-end pb-2 text-[9px] font-semibold uppercase not-italic tracking-[0.28em] text-[#17351d]/40">
              slots
            </span>
          </p>
        </div>

        <div className="pb-1 text-right">
          {isFull ? (
            <span className="inline-flex items-center rounded-full bg-[#17351d] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#efffb0]">
              Basket full
            </span>
          ) : (
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#17351d]/45">
              <span className="font-semibold text-[#17351d]">
                {remainingSlots}
              </span>{' '}
              {remainingSlots === 1 ? 'slot' : 'slots'} left
            </p>
          )}
        </div>
      </div>

      {/* PIPS or METER */}
      {usePips ? (
        <div
          className="mt-4 grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${capacity}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: capacity }).map((_, index) => {
            const filled = index < usedSlots
            return (
              <span
                key={index}
                className={`hamper-pip h-3 rounded-full ${
                  filled
                    ? 'hamper-pip--filled bg-[#17351d]'
                    : 'bg-[#17351d]/12'
                }`}
              />
            )
          })}
        </div>
      ) : (
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#17351d]/12">
          <div
            className="hamper-fill-bar h-full rounded-full bg-[#17351d]"
            style={{ width: `${percentageFilled}%` }}
          />
        </div>
      )}
    </div>
  )
}
