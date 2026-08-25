/**
 * HAMPER STUDIO — QUOTE ROTATOR
 *
 * Renders whatever `hamperQuotes` contains. No quote text or attribution is
 * hard-coded here: the content, the on-screen duration and the on/off switch
 * all live in `src/data/hamperQuotes.ts`.
 *
 * Each quote is shown for its own `durationMs`, then crossfades out and the
 * next fades in. With one active quote it simply holds. With none, it renders
 * nothing rather than leaving an empty gap.
 */

import { useEffect, useState } from 'react'

import { activeHamperQuotes } from '../../data/hamperQuotes'

const EXIT_MS = 620

type HamperQuoteRotatorProps = {
  /** 'light' for warm off-white panels, 'dark' for the deep green sections. */
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
}

export default function HamperQuoteRotator({
  tone = 'light',
  align = 'left',
}: HamperQuoteRotatorProps) {
  const quotes = activeHamperQuotes()

  const [index, setIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (quotes.length < 2) return

    const current = quotes[index % quotes.length]
    const hold = current?.durationMs ?? 7000

    let swapTimer = 0

    const holdTimer = window.setTimeout(() => {
      setIsExiting(true)

      swapTimer = window.setTimeout(() => {
        setIndex((value) => (value + 1) % quotes.length)
        setIsExiting(false)
      }, EXIT_MS)
    }, hold)

    return () => {
      window.clearTimeout(holdTimer)
      window.clearTimeout(swapTimer)
    }
    // `quotes` is derived from a module constant, so its identity changing each
    // render must not restart the timer — length is the only part that matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, quotes.length])

  if (quotes.length === 0) return null

  const quote = quotes[index % quotes.length]

  const quoteColor =
    tone === 'dark' ? 'text-white/85' : 'text-[#17351d]/85'
  const authorColor =
    tone === 'dark' ? 'text-[#efffb0]/70' : 'text-[#71864d]'
  const ruleColor =
    tone === 'dark' ? 'bg-white/25' : 'bg-[#17351d]/20'

  return (
    <figure
      className={
        align === 'center'
          ? 'mx-auto max-w-md text-center'
          : 'max-w-md'
      }
    >
      <div
        key={quote.id}
        className={isExiting ? 'hamper-quote-exit' : 'hamper-quote-enter'}
      >
        <blockquote
  className={`font-playfair text-[14px] italic leading-[1.4] sm:text-[16px] ${quoteColor}`}
>
          {quote.quote}
        </blockquote>

        <figcaption
         className={`mt-2 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.22em] ${authorColor} ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          <span className={`h-px w-6 ${ruleColor}`} />
          {quote.author}
        </figcaption>
      </div>
    </figure>
  )
}
