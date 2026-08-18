import { useEffect, useState } from 'react'

type RollingNumberProps = {
  value: number
  prefix?: string
}

export default function RollingNumber({
  value,
  prefix = '',
}: RollingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (displayValue === value) return

    const start = displayValue
    const difference = value - start
    const duration = 380
    const startTime = performance.now()

    let frame: number

    const animate = (time: number) => {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      )

      const eased =
        1 - Math.pow(1 - progress, 3)

      setDisplayValue(
        Math.round(start + difference * eased)
      )

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <span className="inline-flex overflow-hidden">
      <span className="inline-block tabular-nums">
        {prefix}
        {displayValue.toLocaleString('en-IN')}
      </span>
    </span>
  )
}