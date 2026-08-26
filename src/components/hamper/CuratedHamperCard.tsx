import { useEffect, useState, type SyntheticEvent } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import RollingNumber from '../RollingNumber'

import type { CuratedHamper } from '../../data/curatedHampers'
import type { HamperBasket } from '../../data/hamperBaskets'
import { getHamperFruit } from '../../data/hamperFruits'

type CuratedHamperCardProps = {
  hamper: CuratedHamper
  basket: HamperBasket | null
  itemCount: number
  compareAtPrice?: number
  onAdd: (hamperId: string) => void
}

const countryFlags: Record<string, string> = {
  'New Zealand': '🇳🇿', USA: '🇺🇸', China: '🇨🇳', Kenya: '🇰🇪',
  Vietnam: '🇻🇳', Chile: '🇨🇱', Peru: '🇵🇪', Japan: '🇯🇵', India: '🇮🇳',
  'South Africa': '🇿🇦', Egypt: '🇪🇬', Iran: '🇮🇷', Iraq: '🇮🇶',
  Tunisia: '🇹🇳', UAE: '🇦🇪',
}

const hamperImages: Record<string, string> = {
  'petite-gesture': '/hampers/petite-gesture.png',
  'morning-table': '/hampers/morning-table.png',
  'celebration-hamper': '/hampers/celebration-hamper.png',
  'heritage-collection': '/hampers/heritage-collection.png',
}

const FALLBACK_IMAGE = '/fruit-shop-placeholder.png'

function formatCustomerQuantity(unit: string, units: number) {
  const match = unit.trim().match(/^(\d+(?:\.\d+)?)\s*(kg|g|pcs?)\b/i)

  if (!match) {
    return {
      total: unit,
      breakdown: `${unit} × ${units}`,
    }
  }

  const amount = Number(match[1])
  const rawMeasure = match[2].toLowerCase()
  const measure = rawMeasure === 'pc' || rawMeasure === 'pcs' ? 'pcs' : rawMeasure
  const total = amount * units
  const formattedTotal = Number.isInteger(total) ? String(total) : total.toFixed(2).replace(/\.0+$/, '')
  const baseUnit = `${match[1]}${measure === 'pcs' ? ' pcs' : measure}`

  return {
    total: `${formattedTotal}${measure === 'pcs' ? ' pcs' : measure}`,
    breakdown: `${baseUnit} × ${units}`,
  }
}

function ModalActions({ onClose, onAdd, mobile = false }: { onClose: () => void; onAdd: () => void; mobile?: boolean }) {
  return (
    <div className="flex gap-3">
      <button type="button" onClick={onClose} className={`flex flex-1 items-center justify-center rounded-full border border-[#17351d]/15 bg-white/70 px-5 font-bold uppercase tracking-[0.12em] text-[#17351d] transition hover:bg-white active:scale-[0.98] ${mobile ? 'h-16 text-[12px]' : 'h-14 text-[11px]'}`}>
        Close
      </button>
      <button type="button" onClick={onAdd} className={`flex flex-1 items-center justify-center rounded-full bg-[#17351d] px-5 font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_25px_rgba(23,53,29,0.16)] transition hover:bg-[#244b2b] active:scale-[0.98] ${mobile ? 'h-16 text-[12px]' : 'h-14 text-[11px]'}`}>
        Add hamper
      </button>
    </div>
  )
}

export default function CuratedHamperCard({ hamper, basket, itemCount, compareAtPrice, onAdd }: CuratedHamperCardProps) {
  const [showContents, setShowContents] = useState(false)
  const image = hamperImages[hamper.id] ?? FALLBACK_IMAGE

  useEffect(() => {
    if (!showContents) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [showContents])

  useEffect(() => {
    if (!showContents) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowContents(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showContents])

  const addAndClose = () => {
    onAdd(hamper.id)
    setShowContents(false)
  }

  const imageFallback = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget
    if (!target.src.endsWith(FALLBACK_IMAGE)) target.src = FALLBACK_IMAGE
  }

  return (
    <>
      <article className="group flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-[#17351d]/10 bg-white/75 shadow-[0_10px_40px_rgba(8,21,11,0.07)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(8,21,11,0.12)]">
        <div className="relative aspect-[16/9] min-h-[175px] overflow-hidden bg-[#eef0e3] sm:min-h-[190px]">
          <img src={image} alt={hamper.name} className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]" onError={imageFallback} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
          {hamper.festiveBadge && <span className="absolute right-4 top-4 rounded-full bg-[#efffb0] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#17351d] shadow-sm">{hamper.festiveBadge}</span>}
        </div>

        <div className="flex flex-1 flex-col bg-[#f7f4ea] p-5 sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#71864d]">{basket ? `${basket.capacity} slots · ${itemCount} selections` : `${itemCount} selections`}</p>
          <div className="mt-4">
            <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#71864d]">Premium pre-made hamper</p>
            <h3 className="mt-2 font-playfair text-[30px] italic leading-[0.95] tracking-[-0.02em] text-[#17351d]">{hamper.name}</h3>
            <p className="mt-3 text-[13px] leading-6 text-[#17351d]/60">{hamper.tagline}</p>
            {hamper.description && <p className="mt-3 text-[11px] leading-5 text-[#17351d]/45">{hamper.description}</p>}
          </div>
          <div className="mt-6 border-t border-[#17351d]/10 pt-5">
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#17351d]/40">House price</p>
            <div className="mt-2 flex items-baseline gap-3"><span className="font-playfair text-[30px] italic leading-none tabular-nums text-[#17351d]"><RollingNumber value={hamper.price} prefix="₹" /></span>{compareAtPrice && <span className="text-[12px] tabular-nums text-[#17351d]/30 line-through">₹{compareAtPrice.toLocaleString('en-IN')}</span>}</div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => setShowContents(true)} className="flex h-12 w-full flex-1 items-center justify-center rounded-full border border-[#17351d]/15 bg-white/70 px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#17351d] transition hover:bg-white active:scale-[0.98]">What's inside</button>
            <button type="button" onClick={() => onAdd(hamper.id)} className="mt-1.5 flex h-12 w-full flex-1 items-center justify-center rounded-full bg-[#17351d] px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_10px_25px_rgba(23,53,29,0.16)] transition hover:bg-[#244b2b] active:scale-[0.98]">Add hamper</button>
          </div>
        </div>
      </article>

      {showContents && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#08150b]/55 p-4 backdrop-blur-md sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowContents(false) }}>
          <div className="relative flex h-[calc(100dvh-2rem)] max-h-[760px] w-full max-w-[1050px] flex-col overflow-hidden rounded-[28px] bg-[#f5f3e8] shadow-[0_30px_100px_rgba(8,21,11,0.35)] md:grid md:grid-cols-[0.9fr_1.1fr]">
            <button type="button" aria-label="Close hamper contents" onClick={() => setShowContents(false)} className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#17351d] shadow-lg backdrop-blur-md transition hover:bg-[#17351d] hover:text-white active:scale-90"><X size={18} strokeWidth={1.8} /></button>

            {/* One continuous scroll area on mobile; desktop restores two panels. */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] md:contents">
              <section className="shrink-0 bg-[#f7f4ea] md:flex md:min-h-0 md:flex-col md:overflow-hidden">
                <div className="hidden shrink-0 overflow-hidden bg-[#eef0e3] md:block"><img src={image} alt={hamper.name} className="h-[210px] w-full object-cover object-center" onError={imageFallback} /></div>
                <div className="p-5 pb-24 pt-14 sm:p-6 sm:pb-24 sm:pt-14 md:flex-1 md:overflow-hidden md:p-6 md:pb-5 md:pt-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#71864d]">{basket ? `${basket.capacity} slots · ${itemCount} selections` : `${itemCount} selections`}</p>
                   {hamper.festiveBadge && <span className="mt-2 inline-flex rounded-full bg-[#efffb0] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#17351d]">{hamper.festiveBadge}</span>}
                   <p className="mt-4 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#71864d]">Premium pre-made hamper</p>
                   <h2 className="mt-2 max-w-[420px] font-playfair text-[32px] italic leading-[0.94] tracking-[-0.02em] text-[#17351d] sm:text-[38px]">{hamper.name}</h2>
                   <p className="mt-3 max-w-[420px] text-[13px] leading-5 text-[#17351d]/60">{hamper.tagline}</p>
                   {hamper.description && <p className="mt-2 max-w-[420px] text-[11px] leading-5 text-[#17351d]/45">{hamper.description}</p>}
                   <div className="mt-5 border-t border-[#17351d]/10 pt-3">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#17351d]/40">House price</p>
                    <div className="mt-2 flex items-baseline gap-3"><span className="font-playfair text-[34px] italic leading-none tabular-nums text-[#17351d]"><RollingNumber value={hamper.price} prefix="₹" /></span>{compareAtPrice && <span className="text-[13px] tabular-nums text-[#17351d]/30 line-through">₹{compareAtPrice.toLocaleString('en-IN')}</span>}</div>
                  </div>
                </div>
                <div className="hidden shrink-0 border-t border-[#17351d]/10 bg-[#f7f4ea] p-6 md:mt-auto md:block"><ModalActions onClose={() => setShowContents(false)} onAdd={addAndClose} /></div>
              </section>

              <section className="shrink-0 bg-[#eef0e3] p-7 sm:p-9 md:min-h-0 md:overflow-y-auto md:p-10">
                <div className="flex items-end justify-between gap-4 border-b border-[#17351d]/10 pb-5"><div><p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#71864d]">What's inside</p><h3 className="mt-2 font-playfair text-[30px] italic leading-none text-[#17351d]">The composition</h3></div><p className="text-right text-[9px] font-semibold uppercase tracking-[0.16em] text-[#17351d]/35">{hamper.contents.length} varieties</p></div>
                <div className="mt-4 divide-y divide-[#17351d]/10">
                  {hamper.contents.map((entry) => {
                    const fruit = getHamperFruit(entry.fruitId)
                    if (!fruit) return null
                    const quantity = formatCustomerQuantity(fruit.unit, entry.units)
                    return <div key={entry.fruitId} className="flex items-center gap-3 py-4 sm:gap-4"><div className="h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[15px] bg-white shadow-[0_5px_18px_rgba(8,21,11,0.07)] sm:h-[68px] sm:w-[68px]"><img src={fruit.image} alt={fruit.name} loading="lazy" className="h-full w-full object-cover" /></div><div className="min-w-0 flex-1"><p className="font-playfair text-[16px] leading-tight text-[#17351d] sm:text-[18px]">{fruit.name}</p><div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] uppercase tracking-[0.1em] text-[#17351d]/40 sm:text-[9px]"><span className="text-sm">{countryFlags[fruit.origin] ?? '🌍'}</span><span>{fruit.origin}</span></div><p className="mt-2 text-[10px] font-semibold tracking-[0.04em] text-[#17351d]/55">{quantity.breakdown}</p></div><div className="shrink-0 text-right"><p className="font-playfair text-[23px] italic leading-none tabular-nums text-[#17351d]">{quantity.total}</p><p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.16em] text-[#17351d]/35">Gifting quantity</p></div></div>
                  })}
                </div>
                <div className="mt-5 rounded-[18px] border border-[#17351d]/10 bg-white/55 px-4 py-4"><div className="flex items-center justify-between gap-4"><div><p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#71864d]">Filled by the house</p><p className="mt-1 text-[11px] leading-5 text-[#17351d]/50">Every fruit is selected and arranged as one complete gifting composition.</p></div><div className="shrink-0 rounded-full bg-[#17351d] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#efffb0]">{basket ? `${basket.capacity} slots` : 'Premium'}</div></div></div>
              </section>
            </div>

            <div className="shrink-0 border-t border-[#17351d]/10 bg-[#f7f4ea] p-5 md:hidden"><ModalActions mobile onClose={() => setShowContents(false)} onAdd={addAndClose} /></div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
