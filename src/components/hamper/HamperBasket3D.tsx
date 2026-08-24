/**
 * HAMPER STUDIO — 3D REVOLVING BASKET
 *
 * Pure CSS 3D. A woven cylinder is faked with vertical staves rotated around
 * the Y axis; fruit is rendered as shaded spheres placed on a golden-angle
 * spiral so the arrangement looks natural and fills upward as slots are used.
 * No WebGL, no three.js — the whole thing is transforms and gradients.
 *
 * It reacts to the actual hamper: one sphere per used slot, coloured by the
 * fruit that occupies it, capped so a full 80-slot basket stays legible.
 */

import { useMemo } from 'react'

import type { HamperBasket } from '../../data/hamperBaskets'
import type { HamperLine } from '../../lib/hamperSlots'

type HamperBasket3DProps = {
  basket: HamperBasket | null
  lines: HamperLine[]
  usedSlots: number
  capacity: number
  /** Pause the revolve while the customer is actively choosing. */
  paused?: boolean
  /** Reference-size scale factor for smaller viewports. */
  scale?: number
}

const MAX_SPHERES = 34
const GOLDEN_ANGLE = 137.508

type Sphere = {
  key: string
  color: string
  highlight: string
  angle: number
  radius: number
  lift: number
  size: number
}

export default function HamperBasket3D({
  basket,
  lines,
  usedSlots,
  capacity,
  paused = false,
  scale = 1,
}: HamperBasket3DProps) {
  const visual = basket?.visual

  // One colour token per used slot, in selection order, then thinned to a
  // legible count for large baskets while preserving the colour mix.
  const spheres = useMemo<Sphere[]>(() => {
    if (!visual) return []

    const tokens: { color: string; highlight: string }[] = []

    for (const line of lines) {
      for (let i = 0; i < line.slots; i += 1) {
        tokens.push({
          color: line.fruit.color,
          highlight: line.fruit.highlight ?? line.fruit.color,
        })
      }
    }

    const step =
      tokens.length > MAX_SPHERES
        ? tokens.length / MAX_SPHERES
        : 1

    const picked: { color: string; highlight: string }[] = []
    for (let i = 0; i < tokens.length; i += step) {
      picked.push(tokens[Math.floor(i)])
    }

    const rimRadius = visual.width / 2 - 22

    return picked.map((token, index) => {
      const angle = index * GOLDEN_ANGLE
      // Spiral outward then wrap, so early fruit sits centre-low and later
      // fruit rises and spreads toward the rim.
      const t = picked.length <= 1 ? 0 : index / (picked.length - 1)
      const radius = rimRadius * (0.28 + 0.62 * Math.sqrt(t))
      const lift = t * (visual.height * 0.42)
      const size = 26 - t * 5

      return {
        key: `${index}-${token.color}`,
        color: token.color,
        highlight: token.highlight,
        angle,
        radius,
        lift,
        size,
      }
    })
  }, [visual, lines])

  if (!visual) {
    return (
      <div
        className="flex h-full w-full items-center justify-center text-center text-[11px] uppercase tracking-[0.28em] text-[#17351d]/35"
      >
        Choose a basket
        <br />
        to begin
      </div>
    )
  }

  const staveCount = visual.staves
  const rimRadius = visual.width / 2
  const staveWidth = Math.max(
    10,
    (2 * Math.PI * rimRadius) / staveCount + 2
  )

  return (
    <div
      className={`hamper-basket-3d ${
        paused ? 'hamper-basket-3d--paused' : ''
      }`}
      style={{
        width: visual.width * scale,
        height: (visual.height + 90) * scale,
      }}
      role="img"
      aria-label={`${basket.name}, ${usedSlots} of ${capacity} slots filled`}
    >
      <div
        className="hamper-basket-3d__spin"
        style={{
          width: visual.width,
          height: visual.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          margin: '0 auto',
        }}
      >
        {/* WOVEN STAVES */}
        {Array.from({ length: staveCount }).map((_, index) => {
          const rotation = (360 / staveCount) * index
          const lit =
            Math.cos((rotation * Math.PI) / 180) * 0.5 + 0.5

          return (
            <div
              key={`stave-${index}`}
              className="hamper-basket-3d__stave"
              style={{
                width: staveWidth,
                height: visual.height,
                left: `calc(50% - ${staveWidth / 2}px)`,
                top: 0,
                transform: `rotateY(${rotation}deg) translateZ(${rimRadius}px)`,
                background: `linear-gradient(90deg, ${visual.weaveDeep} 0%, ${visual.weave} 50%, ${visual.weaveDeep} 100%)`,
                filter: `brightness(${0.62 + lit * 0.55})`,
                borderRadius: '3px',
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.25)',
                // Horizontal weave lines.
                backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 2px, transparent 9px)`,
              }}
            />
          )
        })}

        {/* RIM */}
        <div
          className="hamper-basket-3d__rim"
          style={{
            width: visual.width + 14,
            height: (visual.width + 14) * 0.34,
            left: '50%',
            top: -8,
            transform: 'translateX(-50%) rotateX(74deg)',
            borderRadius: '50%',
            border: `9px solid ${visual.rim}`,
            boxShadow:
              'inset 0 0 22px rgba(0,0,0,0.35), 0 2px 10px rgba(0,0,0,0.2)',
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 62%, transparent 78%)',
          }}
        />

        {/* BASE */}
        <div
          className="hamper-basket-3d__base"
          style={{
            width: visual.width * 0.7,
            height: visual.width * 0.7 * 0.32,
            left: '50%',
            top: visual.height - 12,
            transform: 'translateX(-50%) rotateX(74deg)',
            borderRadius: '50%',
            background: visual.weaveDeep,
            boxShadow: '0 14px 26px rgba(0,0,0,0.32)',
          }}
        />

        {/* FRUIT */}
        {spheres.map((sphere) => {
          const rad = (sphere.angle * Math.PI) / 180
          const x = Math.cos(rad) * sphere.radius
          const z = Math.sin(rad) * sphere.radius
          const y = visual.height - 26 - sphere.lift

          return (
            <div
              key={sphere.key}
              className="hamper-basket-3d__fruit"
              style={{
                width: sphere.size,
                height: sphere.size,
                left: `calc(50% - ${sphere.size / 2}px)`,
                top: y,
                transform: `translateX(${x}px) translateZ(${z}px)`,
                background: `radial-gradient(circle at 32% 28%, ${sphere.highlight} 0%, ${sphere.color} 58%, rgba(0,0,0,0.4) 130%)`,
                boxShadow: '0 3px 8px rgba(0,0,0,0.35)',
              }}
            />
          )
        })}
      </div>

      {/* GROUND SHADOW */}
      <div
        style={{
          width: visual.width * 0.82 * scale,
          height: 26 * scale,
          margin: '0 auto',
          marginTop: -18 * scale,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(8,21,11,0.28) 0%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  )
}
