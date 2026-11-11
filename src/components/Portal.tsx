import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { featuredProject } from '../data/site'

/**
 * Scroll-opening portal into Selected Work. Two opaque panels meet at the centre of a
 * sticky stage and slide apart with scroll, revealing the featured project underneath.
 * Everything is mapped from scroll progress, so scrolling back closes it again.
 * Geometry is proportional (%, vw) — no desktop-only pixel values.
 */
export function Portal() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const open = [0.06, 0.78]
  const leftX = useTransform(p, open, ['0%', '-101%'])
  const rightX = useTransform(p, open, ['0%', '101%'])
  const imgScale = useTransform(p, open, [1.18, 1])
  const imgDim = useTransform(p, [0.5, 0.9], [0.55, 0.25])
  const titleScale = useTransform(p, open, [1, 1.06])
  const tracking = useTransform(p, open, ['0em', '-0.05em'])
  const halfL = useTransform(p, open, ['0vw', '-4vw'])
  const halfR = useTransform(p, open, ['0vw', '4vw'])
  const markL = useTransform(p, open, ['0vw', '-46vw'])
  const markR = useTransform(p, open, ['0vw', '46vw'])
  const hintO = useTransform(p, [0, 0.12], [1, 0])
  const captionO = useTransform(p, [0.7, 0.9], [0, 1])
  const captionY = useTransform(p, [0.7, 0.9], [16, 0])

  const project = featuredProject
  // prefer the highest-resolution artwork for the full-bleed reveal
  const cover = project.gallery[0] ?? project.cover!

  const caption = (
    <div className="glass flex max-w-[30rem] items-end justify-between gap-6 rounded-2xl p-5">
      <div>
        <p className="label mb-2">Featured — {project.category}</p>
        <p className="font-display text-xl font-bold tracking-[-0.03em]">{project.title}</p>
        <p className="mt-1 text-sm text-mute">{project.summary}</p>
      </div>
      <Link
        to={`/work/${project.slug}`}
        aria-label={`View project: ${project.title}`}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bone text-ink transition-transform duration-300 ease-expo hover:translate-x-0.5 hover:-translate-y-0.5"
      >
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </div>
  )

  if (reduce) {
    return (
      <section aria-label="Selected work — featured project" className="relative bg-deep">
        <div className="relative h-[70svh] overflow-hidden">
          <img
            src={cover.src}
            alt={cover.alt}
            width={cover.w}
            height={cover.h}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-deep/40" />
          <div className="wrap absolute inset-x-0 bottom-6">{caption}</div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      aria-label="Selected work — featured project"
      className="relative h-[215svh] bg-deep"
      data-portal
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* featured artwork underneath */}
        <motion.img
          src={cover.src}
          alt={cover.alt}
          width={cover.w}
          height={cover.h}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale: imgScale }}
        />
        <motion.div aria-hidden="true" className="absolute inset-0 bg-deep" style={{ opacity: imgDim }} />

        {/* the two doors */}
        <motion.div
          aria-hidden="true"
          data-portal-panel="left"
          className="absolute inset-y-0 left-0 w-1/2 border-r border-line bg-ink"
          style={{ x: leftX }}
        />
        <motion.div
          aria-hidden="true"
          data-portal-panel="right"
          className="absolute inset-y-0 right-0 w-1/2 border-l border-line bg-ink"
          style={{ x: rightX }}
        />

        {/* accent markers riding the seam */}
        <motion.span
          aria-hidden="true"
          className="absolute left-1/2 top-[22%] -ml-[5px] h-[10px] w-[10px] bg-volt"
          style={{ x: markL }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute left-1/2 top-[78%] -ml-[5px] h-[10px] w-[10px] bg-lime"
          style={{ x: markR }}
        />

        {/* split title */}
        <motion.h2
          className="display pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[0.04em] whitespace-nowrap text-[9vw] font-extrabold leading-[0.95] sm:flex-row sm:gap-[0.22em] sm:text-[min(5.6vw,6.5rem)]"
          style={{ scale: titleScale, letterSpacing: tracking }}
        >
          <span className="sr-only">Selected Work</span>
          <motion.span aria-hidden="true" style={{ x: halfL }}>
            SELECTED
          </motion.span>
          <motion.span aria-hidden="true" style={{ x: halfR }}>
            WORK
          </motion.span>
        </motion.h2>

        {/* corner metadata */}
        <div className="wrap pointer-events-none absolute inset-x-0 top-24 flex justify-between">
          <p className="label">[ Portal ]</p>
          <p className="label">Featured / {project.category}</p>
        </div>
        <motion.p className="label absolute inset-x-0 bottom-8 text-center" style={{ opacity: hintO }}>
          Scroll to open ↓
        </motion.p>
        <motion.div className="wrap absolute inset-x-0 bottom-8" style={{ opacity: captionO, y: captionY }}>
          {caption}
        </motion.div>
      </div>
    </section>
  )
}
