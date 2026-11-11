import { useRef } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'

const LINES = ['FIND YOURSELF', 'IN GLITCH.']

/**
 * Signature interaction: the slogan's weight is tied to scroll position.
 * weight = 300 + progress × 500, driven through the real `wght` axis of Inter Variable,
 * so it interpolates continuously and reverses when scrolling back up.
 *
 * The stage is sticky for one extra viewport of scroll. Lines never wrap (nowrap + a font
 * size chosen so the 800 weight still fits), so nothing reflows while the weight changes.
 */
export function WeightStatement() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const weight = useTransform(scrollYProgress, [0, 1], [300, 800], { clamp: true })
  const variation = useMotionTemplate`"wght" ${weight}`
  const readout = useTransform(weight, (w) => String(Math.round(w)).padStart(3, '0'))
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  const statement = (
    <p className="text-center font-sans uppercase leading-[0.92] tracking-[-0.045em] text-[clamp(1.9rem,9.6vw,8.5rem)]">
      <span className="sr-only">Find yourself in glitch.</span>
      {LINES.map((line) => (
        <span key={line} aria-hidden="true" className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </p>
  )

  if (reduce) {
    return (
      <section aria-label="Statement" className="section bg-ink">
        <div className="wrap" style={{ fontWeight: 650, fontVariationSettings: '"wght" 650' }}>
          {statement}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} aria-label="Statement" className="relative h-[220svh] bg-ink" data-weight-section>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="wrap flex items-center justify-between pt-24">
          <p className="label">[ Statement ]</p>
          <p className="label tabular-nums">
            wght <motion.span data-weight-readout>{readout}</motion.span>
          </p>
        </div>

        <motion.div
          className="wrap flex flex-1 items-center justify-center"
          style={{ fontWeight: weight, fontVariationSettings: variation }}
          data-weight-text
        >
          {statement}
        </motion.div>

        <div className="wrap pb-8">
          <div className="flex items-center gap-4">
            <span className="label">300</span>
            <div className="h-px flex-1 bg-line">
              <motion.div className="h-px origin-left bg-bone" style={{ scaleX: bar }} />
            </div>
            <span className="label">800</span>
          </div>
        </div>
      </div>
    </section>
  )
}
