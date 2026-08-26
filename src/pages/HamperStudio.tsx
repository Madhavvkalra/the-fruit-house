/**
 * HAMPER STUDIO — PAGE
 *
 * The full gifting experience at `/hamper-studio`. It owns the interaction
 * state (mode, build step, chosen basket, fruit selection) and defers every
 * capacity decision to the pure slot engine in `lib/hamperSlots`. It NEVER
 * touches the shop cart directly — the finished hamper is handed up to App via
 * `onCheckoutHamper`, which drops it into the existing basket and opens the
 * existing checkout. There is no hamper-specific checkout here or downstream.
 *
 * Two entry modes:
 *   - Premium Pre-Made — curated hampers, one click to add.
 *   - Build Your Own   — SELECT BASKET → SELECT FRUITS → REVIEW & CHECKOUT.
 *
 * Overfill is impossible by construction: `canAdd` gates every addition, add
 * controls disable at capacity, and switching to a smaller basket asks before
 * trimming — fruit is never silently removed.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'



import {
  availableHamperBaskets,
  getHamperBasket,
} from '../data/hamperBaskets'
import { hamperFruits } from '../data/hamperFruits'
import {
  curatedHampers,
  curatedSelection,
  getCuratedHamper,
} from '../data/curatedHampers'

import {
  canAdd,
  computeTotals,
  sanitizeSelection,
  type HamperSelection,
} from '../lib/hamperSlots'
import {
  buildCuratedHamperCartEntry,
  buildCustomHamperCartEntry,
  type HamperCartEntry,
} from '../lib/hamperCart'
import {
  clearHamperDraft,
  loadHamperDraft,
  saveHamperDraft,
} from '../lib/hamperStorage'

import HamperBasket3D from '../components/hamper/HamperBasket3D'
import HamperCartPanel from '../components/hamper/HamperCartPanel'
import HamperMobileCart from '../components/hamper/HamperMobileCart'
import HamperQuoteRotator from '../components/hamper/HamperQuoteRotator'
import HamperFruitCard from '../components/hamper/HamperFruitCard'
import HamperBasketCard from '../components/hamper/HamperBasketCard'
import CuratedHamperCard from '../components/hamper/CuratedHamperCard'
import HamperReview from '../components/hamper/HamperReview'

export type StudioMode = 'landing' | 'curated' | 'build'
type BuildStep = 1 | 2 | 3

type HamperStudioProps = {
  /** 'curated' | 'build' opens directly into that mode; anything else lands. */
  initialMode?: StudioMode
  /** Hands the finished hamper to the existing cart + checkout. */
  onCheckoutHamper: (entry: HamperCartEntry) => void
  /** Back to the home page. */
  onExit: () => void
}

export default function HamperStudio({
  initialMode = 'landing',
  onCheckoutHamper,
  onExit,
}: HamperStudioProps) {
  // Seed from any saved draft exactly once.
  const initialDraft = useRef(loadHamperDraft())

  const [mode, setMode] = useState<StudioMode>(() => {
    if (initialMode === 'curated') return 'curated'
    if (initialMode === 'build') return 'build'
    // A saved in-progress build resumes straight into the builder.
    return initialDraft.current.basketId ? 'build' : 'landing'
  })

  const [step, setStep] = useState<BuildStep>(() =>
    initialDraft.current.basketId ? 2 : 1
  )

  const [basketId, setBasketId] = useState<string | null>(
    initialDraft.current.basketId
  )
  const [selection, setSelection] = useState<HamperSelection>(
    initialDraft.current.selection
  )

  // Basket-switch confirmation when the new basket is too small for the
  // current selection. Never trims without this explicit choice.
  const [pendingBasketId, setPendingBasketId] = useState<string | null>(
    null
  )
 
  const baskets = availableHamperBaskets()
  const totals = useMemo(
    () => computeTotals(basketId, selection),
    [basketId, selection]
  )

  // Persist the build draft on every change; checkout/clear wipe it.
  useEffect(() => {
    saveHamperDraft({ basketId, selection })
  }, [basketId, selection])


  // ---- FRUIT ----------------------------------------------------------

const addFruit = (fruitId: string) => {
  if (!canAdd(basketId, selection, fruitId, 1)) {
    return
  }

  setSelection((prev) => {
    if (!canAdd(basketId, prev, fruitId, 1)) {
      return prev
    }

    return {
      ...prev,
      [fruitId]: (prev[fruitId] ?? 0) + 1,
    }
  })
}

  const removeFruit = (fruitId: string) => {
    setSelection((prev) => {
      const next = { ...prev }
      const units = (next[fruitId] ?? 0) - 1
      if (units <= 0) delete next[fruitId]
      else next[fruitId] = units
      return next
    })
  }

  // ---- BASKET ---------------------------------------------------------

  const selectBasket = (newId: string) => {
    const target = getHamperBasket(newId)
    if (!target) return

    if (newId === basketId) {
      setStep(2)
      return
    }

    // A basket that still fits the current selection switches immediately.
    if (target.capacity >= totals.usedSlots) {
      setBasketId(newId)
      setSelection((prev) => sanitizeSelection(newId, prev))
      setStep(2)
      return
    }

    // Too small — ask before trimming.
    setPendingBasketId(newId)
  }

  const confirmSwitchAndTrim = () => {
    if (!pendingBasketId) return
    const target = pendingBasketId
    setBasketId(target)
    setSelection((prev) => sanitizeSelection(target, prev))
    setPendingBasketId(null)
    setStep(2)
  }

  const cancelSwitch = () => setPendingBasketId(null)

  // ---- CHECKOUT / RESET ----------------------------------------------

  const checkoutCustom = () => {
    const entry = buildCustomHamperCartEntry(basketId, selection)
    if (!entry) return
    clearHamperDraft()
    onCheckoutHamper(entry)
  }

  const checkoutCurated = (hamperId: string) => {
    const hamper = getCuratedHamper(hamperId)
    if (!hamper) return
    const entry = buildCuratedHamperCartEntry(hamper)
    if (!entry) return
    onCheckoutHamper(entry)
  }

  const startOver = () => {
    clearHamperDraft()
    setSelection({})
    setBasketId(null)
    setStep(1)
    setMode('build')
  }

  // =====================================================================

  const pendingBasket = getHamperBasket(pendingBasketId)

  return (
    <div className="min-h-screen bg-[#f4f1e8] text-[#17351d]">
      {/* ================= TOP BAR ================= */}
      <header className="sticky top-0 z-30 border-b border-[#17351d]/10 bg-[#f4f1e8]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-2 rounded-full border border-[#17351d]/15 bg-white/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-[#17351d] hover:text-white"
          >
            <ArrowLeft size={14} />
            Shop
          </button>

          <div className="flex items-center gap-2 text-[#17351d]">
            <Sparkles size={15} className="text-[#71864d]" />
            <span className="font-playfair text-lg italic sm:text-xl">
              Hamper Studio
            </span>
          </div>

          <div className="w-[74px]" aria-hidden="true" />
        </div>
      </header>

      {/* ================= INTRO ================= */}
      {mode === 'landing' && (
        <LandingView
          onCurated={() => setMode('curated')}
          onBuild={() => {
            setMode('build')
            setStep(1)
          }}
        />
      )}

      {/* ================= CURATED ================= */}
{mode === 'curated' && (
  <section className="hamper-step-enter mx-auto w-full max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
    <ModeHeading
      eyebrow="Premium pre-made hampers"
      title="Chosen for you"
      blurb="Compositions the house has already balanced. Add one as-is, or start from scratch in Build Your Own."
      onSwitch={() => setMode('build')}
      switchLabel="Build your own"
    />

    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {curatedHampers
        .filter((hamper) => hamper.available)
        .map((hamper) => {
          const basket = getHamperBasket(hamper.basketId)
          const curatedTotals = computeTotals(
            hamper.basketId,
            curatedSelection(hamper)
          )
          const compareAt =
            curatedTotals.grandTotal > hamper.price
              ? curatedTotals.grandTotal
              : undefined

          return (
            <CuratedHamperCard
              key={hamper.id}
              hamper={hamper}
              basket={basket}
              itemCount={curatedTotals.unitCount}
              compareAtPrice={compareAt}
              onAdd={checkoutCurated}
            />
          )
        })}
    </div>
  </section>
)}

      {/* ================= BUILD ================= */}
      {mode === 'build' && (
     <section className="mx-auto w-full max-w-[1500px] px-6 py-4 lg:px-8">

         <div className="flex items-center justify-between gap-4">
  {/* LEFT — CHECKOUT JOURNEY */}
  <StepIndicator
    step={step}
    hasBasket={Boolean(basketId)}
  />

  {/* RIGHT — QUOTE */}
  <div className="hidden min-w-0 flex-1 justify-end lg:flex">
    <HamperQuoteRotator
      tone="light"
      align="center"
    />
  </div>
</div>

{/* STEP 1 — SELECT BASKET */}
{step === 1 && (
  <div
    className="
      hamper-step-enter
      mx-auto
      mt-4
      w-full
      max-w-[1400px]
    "
  >
    <div
      className="
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        lg:grid-cols-4
        lg:gap-4
      "
    >
      {baskets.map((basket) => (
        <HamperBasketCard
          key={basket.id}
          basket={basket}
          isSelected={basket.id === basketId}
          onSelect={selectBasket}
        />
      ))}
    </div>
  </div>
)}

{/* STEP 2 — SELECT FRUITS */}
{step === 2 && basketId && (
  <>
    {/* STEP 2 CONTENT */}
    <div className="mt-3 grid min-h-0 grid-cols-1 gap-5 lg:h-[calc(100vh-155px)] lg:grid-cols-[minmax(520px,0.9fr)_minmax(0,1.6fr)]">

      {/* LEFT — DESKTOP CART */}
      <div className="hidden min-h-0 lg:block lg:h-full">
        <div className="flex h-full min-h-0 flex-col">

          <div className="min-h-0 flex-1">
            <HamperCartPanel
              totals={totals}
              onAdd={addFruit}
              onRemove={removeFruit}
            />
          </div>

          <div className="mt-2 shrink-0">
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={totals.isEmpty}
              className={`flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                totals.isEmpty
                  ? 'cursor-not-allowed bg-[#17351d]/15 text-[#17351d]/40'
                  : 'bg-[#17351d] text-white hover:bg-[#244b2b] active:scale-[0.98]'
              }`}
            >
              Continue
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-1.5 w-full shrink-0 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-[#17351d]/45 underline-offset-4 transition hover:text-[#17351d] hover:underline"
          >
            Change basket
          </button>

        </div>
      </div>

      {/* RIGHT — FRUIT CATALOGUE */}
      <div className="min-h-0 lg:h-full lg:overflow-y-auto lg:pr-2">

        <div className="mb-3 flex items-center justify-between">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#71864d]">
            Festive fruit catalogue
          </p>

          <p className="text-[10px] text-[#17351d]/45">
            {totals.remainingSlots} of {totals.capacity} slots open
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {hamperFruits.map((fruit) => (
            <HamperFruitCard
              key={fruit.id}
              fruit={fruit}
              units={selection[fruit.id] ?? 0}
              canAddOne={canAdd(
                basketId,
                selection,
                fruit.id,
                1
              )}
              onAdd={addFruit}
              onRemove={removeFruit}
            />
          ))}
        </div>

      </div>

    </div>

    {/* MOBILE CART — OUTSIDE THE ANIMATED/GRID CONTAINER */}
    <HamperMobileCart
      totals={totals}
      onAdd={addFruit}
      onRemove={removeFruit}
      onContinue={() => setStep(3)}
      disabled={totals.isEmpty}
    />
  </>
)}


          {/* STEP 3 — REVIEW & CHECKOUT */}
         {step === 3 && (
  <div className="relative mt-6 min-h-[calc(100vh-150px)]">
              <HamperReview
                totals={totals}
                onEditBasket={() => setStep(1)}
                onEditFruits={() => setStep(2)}
                onContinueToCheckout={checkoutCustom}
                onClear={startOver}
              />
            </div>
          )}
        </section>
      )}

      {/* ================= BASKET-SWITCH CONFIRM ================= */}
      {pendingBasket && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#08150b]/40 px-5 pb-6 backdrop-blur-sm sm:items-center sm:pb-0">
          <div className="hamper-step-enter w-full max-w-sm rounded-[24px] border border-[#17351d]/10 bg-[#f5f3e8] p-6 shadow-[0_25px_80px_rgba(8,21,11,0.3)]">
            <h3 className="font-playfair text-[22px] italic text-[#17351d]">
              Smaller basket
            </h3>
            <p className="mt-2 text-[13px] leading-6 text-[#17351d]/60">
              The {pendingBasket.name} holds {pendingBasket.capacity}{' '}
              slots, but your selection uses {totals.usedSlots}. Switching
              will trim your hamper down to fit — nothing is added, and
              you can top it back up afterwards.
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={confirmSwitchAndTrim}
                className="flex h-11 w-full items-center justify-center rounded-full bg-[#17351d] text-sm font-semibold text-white transition-all duration-300 hover:bg-[#244b2b] active:scale-[0.98]"
              >
                Switch &amp; trim to fit
              </button>
              <button
                type="button"
                onClick={cancelSwitch}
                className="flex h-11 w-full items-center justify-center rounded-full border border-[#17351d]/15 bg-white/60 text-sm font-semibold text-[#17351d] transition-all duration-300 hover:bg-white"
              >
                Keep current basket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* =====================================================================
   INTERNAL SUB-VIEWS
===================================================================== */

function LandingView({
  onCurated,
  onBuild,
}: {
  onCurated: () => void
  onBuild: () => void
}) {
  // A showcase fill so the revolving basket reads as full and inviting.
  const showcaseBasket = getHamperBasket('signature-basket')
  const showcaseTotals = computeTotals('signature-basket', {
    'american-cherries': 8,
    'gala-apple': 8,
    'shine-muscat': 4,
    blueberries: 6,
    'washington-pears': 6,
    'dragon-fruit': 2,
  })

  return (
    <section className="hamper-step-enter relative overflow-y-auto
md:overflow-hidden bg-[#0b1b0e] text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-2 lg:py-20">
        {/* COPY */}
        <div className="hamper-rise">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#efffb0]">
            The Hamper Studio
          </p>

          <h1 className="mt-4 font-playfair text-[46px] italic leading-[0.95] sm:text-6xl md:text-[68px]">
            Build something
            <br />
            worth gifting.
          </h1>

          <p className="mt-6 max-w-md text-[14px] leading-7 text-white/65">
            Start from a basket, fill it with the season’s best, and watch
            it come together. Or let us hand you one we’ve already composed.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBuild}
              className="flex items-center justify-center gap-2 rounded-full bg-[#efffb0] px-7 py-4 text-sm font-semibold text-[#17351d] transition-all duration-300 hover:brightness-105 active:scale-[0.98]"
            >
              Build your own hamper
            </button>
            <button
              type="button"
              onClick={onCurated}
              className="flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white hover:text-[#17351d] active:scale-[0.98]"
            >
              Premium pre-made hampers
            </button>
          </div>

          <div className="mt-10 border-t border-white/12 pt-6">
            <HamperQuoteRotator tone="dark" align="left" />
          </div>
        </div>

        {/* BASKET */}
        <div className="flex items-center justify-center">
          <HamperBasket3D
            basket={showcaseBasket}
            lines={showcaseTotals.lines}
            usedSlots={showcaseTotals.usedSlots}
            capacity={showcaseTotals.capacity}
            paused={false}
            scale={1}
          />
        </div>
      </div>
    </section>
  )
}

function ModeHeading({
  eyebrow,
  title,
  blurb,
  onSwitch,
  switchLabel,
}: {
  eyebrow: string
  title: string
  blurb: string
  onSwitch: () => void
  switchLabel: string
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#17351d]/10 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xl">
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#71864d]">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-playfair text-[38px] italic leading-[0.95] text-[#17351d] sm:text-5xl">
          {title}
        </h2>
        <p className="mt-3 max-w-md text-[13px] leading-6 text-[#17351d]/55">
          {blurb}
        </p>
      </div>

      <button
        type="button"
        onClick={onSwitch}
        className="w-fit rounded-full border border-[#17351d]/15 bg-white/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#17351d] transition-all duration-300 hover:bg-[#17351d] hover:text-white"
      >
        {switchLabel}
      </button>
    </div>
  )
}

function StepIndicator({
  step,
  hasBasket,
}: {
  step: BuildStep
  hasBasket: boolean
}) {
  const steps = [
    { n: 1 as const, label: 'Select basket' },
    { n: 2 as const, label: 'Select fruits' },
    { n: 3 as const, label: 'Review' },
  ]

  return (
    <div className="mt-2 flex items-center gap-2 sm:gap-4">
      {steps.map((entry, index) => {
        const done =
          entry.n < step && (entry.n > 1 || hasBasket)
        const active = entry.n === step

        return (
          <div key={entry.n} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-300 ${
                  active
                    ? 'bg-[#17351d] text-white'
                    : done
                      ? 'bg-[#71864d] text-white'
                      : 'bg-[#17351d]/10 text-[#17351d]/45'
                }`}
              >
                {done ? <Check size={13} /> : entry.n}
              </span>
              <span
                className={`hidden text-[10px] font-semibold uppercase tracking-[0.14em] sm:inline ${
                  active
                    ? 'text-[#17351d]'
                    : 'text-[#17351d]/40'
                }`}
              >
                {entry.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <span className="h-px w-6 bg-[#17351d]/15 sm:w-10" />
            )}
          </div>
        )
      })}
    </div>
  )
}
