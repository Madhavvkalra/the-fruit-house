import { useEffect, useRef, useState } from 'react'

type RollingNumberProps = {
  value: number
  prefix?: string
}

export default function RollingNumber({
  value,
  prefix = '',
}: RollingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)

  useEffect(() => {
    const from = previousValue.current
    const to = value

    if (from === to) return

    const duration = 520
    const startTime = performance.now()

    let animationFrame = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smooth ease-out
      const eased =
        1 - Math.pow(1 - progress, 3)

      const nextValue = Math.round(
        from + (to - from) * eased
      )

      setDisplayValue(nextValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setDisplayValue(to)
        previousValue.current = to
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [value])

  return (
    <span className="inline-flex overflow-hidden">
      <span
        key={displayValue}
        className="inline-block tabular-nums"
      >
        {prefix}
        {displayValue.toLocaleString('en-IN')}
      </span>
    </span>
  )
}