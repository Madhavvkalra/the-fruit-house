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
    setDisplayValue(value)
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