import { useRef, type CSSProperties } from 'react'
import { useVisible } from '../hooks/useVisible'

/** Lines per direction. The reference used 36; 24 keeps the look at half the paint cost. */
const COUNT = 24

type Path = { d: string; width: number; opacity: number; color: string; duration: number; delay: number }

/**
 * Same curve family as the reference: each line sweeps from top-left, bows through the
 * middle and exits bottom-right; `position` mirrors the family for the second layer.
 * Everything is derived from the index, so timings never change between renders.
 */
function buildPaths(position: 1 | -1): Path[] {
  return Array.from({ length: COUNT }, (_, n) => {
    const i = Math.round(n * 1.5) // spread 24 lines across the reference's 36 slots
    const x = (v: number) => v - i * 5 * position
    const d =
      `M-${x(380)} -${189 + i * 6}` +
      `C-${x(380)} -${189 + i * 6} -${x(312)} ${216 - i * 6} ${x(152)} ${343 - i * 6}` +
      `C${x(616)} ${470 - i * 6} ${x(684)} ${875 - i * 6} ${x(684)} ${875 - i * 6}`
    // every fourth line carries the electric-blue accent
    const blue = n % 4 === 1
    return {
      d,
      width: 0.7 + i * 0.035,
      opacity: 0.14 + n * 0.02,
      color: blue ? (n % 8 === 1 ? '#3A29FF' : '#5227FF') : '#EDE7DC',
      // deterministic spread of 20–30s, offset so the lines never move in lockstep
      duration: 20 + ((n * 7 + (position === 1 ? 0 : 3)) % 11),
      delay: -((n * 13 + (position === 1 ? 0 : 5)) % 23),
    }
  })
}

const ALL = [...buildPaths(1), ...buildPaths(-1)]
/** Only every fourth curve carries a moving highlight — enough motion, a fraction of the paint. */
const FLOW = ALL.filter((_, i) => i % 4 === 1)

const SVG_PROPS = {
  className: 'absolute inset-0 h-full w-full',
  viewBox: '0 0 696 316',
  preserveAspectRatio: 'xMidYMid slice',
  fill: 'none',
} as const

/**
 * Decorative floating SVG paths (adapted from the "background paths" reference).
 * Each curve rests as a faint line while a brighter highlight travels along it. The motion is plain CSS on
 * stroke-dashoffset, so it can be paused cheaply: it runs only while the layer is on screen,
 * and under prefers-reduced-motion the curves are drawn once and stay still.
 * Purely decorative — no pointer events, hidden from assistive tech.
 */
export function BackgroundPaths({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useVisible(ref, '100px')

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-background-paths={visible ? 'running' : 'paused'}
      className={`bg-paths pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ '--paths-state': visible ? 'running' : 'paused' } as CSSProperties}
    >
      {/* Static layer: every curve, drawn once and never repainted. */}
      <svg {...SVG_PROPS}>
        {ALL.map((p, i) => (
          <path key={i} d={p.d} stroke={p.color} strokeWidth={p.width} strokeOpacity={p.opacity * 0.32} />
        ))}
      </svg>
      {/* Animated layer: highlights on a subset of the curves, isolated on its own compositor
          layer so the repaint never touches the heading or the static curves. */}
      <svg {...SVG_PROPS} style={{ willChange: 'transform', contain: 'strict' }}>
        {FLOW.map((p, i) => (
          <path
            key={i}
            className="bg-path-flow"
            d={p.d}
            pathLength={1}
            stroke={p.color}
            strokeWidth={p.width}
            strokeOpacity={p.opacity}
            strokeLinecap="round"
            style={{ animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
          />
        ))}
      </svg>
    </div>
  )
}
