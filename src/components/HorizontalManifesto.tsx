import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'

gsap.registerPlugin(ScrollTrigger)

/** How much vertical scroll one pixel of horizontal travel costs (lower = faster read). */
const SCROLL_PER_PX = 0.3

const SENTENCE =
  'Beyond the ordinary, beyond the expected, FIND YOURSELF IN GLITCH, explore a world where creativity meets experimentation, ideas become experiences, and every pixel tells a different story. BEYOND_404'

/* ── Inline glyphs: they sit in the sentence like punctuation ───────────────── */
const glyph = 'inline-block h-[0.62em] w-auto shrink-0 align-middle'

const Curve = () => (
  <svg viewBox="0 0 160 60" className={glyph} fill="none" aria-hidden="true">
    <path d="M4 44C30 4 52 4 78 30s48 26 78-14" stroke="#3A29FF" strokeWidth="7" strokeLinecap="round" />
  </svg>
)

const PixelArrow = () => (
  <svg viewBox="0 0 110 70" className={glyph} fill="#EDE7DC" aria-hidden="true" shapeRendering="crispEdges">
    <rect x="0" y="30" width="70" height="10" />
    <rect x="60" y="10" width="10" height="10" />
    <rect x="70" y="20" width="10" height="10" />
    <rect x="80" y="30" width="10" height="10" />
    <rect x="70" y="40" width="10" height="10" />
    <rect x="60" y="50" width="10" height="10" />
    <rect x="96" y="30" width="10" height="10" fill="#BFFF00" />
  </svg>
)

const Asterisk = () => (
  <svg
    viewBox="0 0 70 70"
    className={glyph}
    fill="none"
    stroke="#BFFF00"
    strokeWidth="7"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M35 6v58M10 20l50 30M60 20L10 50" />
  </svg>
)

const Wave = () => (
  <svg viewBox="0 0 190 60" className={glyph} fill="none" strokeLinecap="round" aria-hidden="true">
    <path d="M4 22c20-22 40-22 60 0s40 22 60 0 40-22 60 0" stroke="#EDE7DC" strokeWidth="5" />
    <path d="M4 42c20-22 40-22 60 0s40 22 60 0 40-22 60 0" stroke="#3A29FF" strokeWidth="5" />
  </svg>
)

const CircleMark = () => (
  <svg viewBox="0 0 70 70" className={glyph} fill="none" aria-hidden="true">
    <circle cx="35" cy="35" r="29" stroke="#9EA5A8" strokeWidth="4" />
    <circle cx="35" cy="35" r="11" fill="#3A29FF" />
  </svg>
)

const GlitchGlyph = () => (
  <svg viewBox="0 0 90 70" className={glyph} fill="#EDE7DC" aria-hidden="true" shapeRendering="crispEdges">
    <rect x="0" y="6" width="56" height="12" />
    <rect x="22" y="29" width="68" height="12" fill="#3A29FF" />
    <rect x="8" y="52" width="40" height="12" />
    <rect x="60" y="52" width="14" height="12" fill="#BFFF00" />
  </svg>
)

/* ── Sentence parts ─────────────────────────────────────────────────────────── */
const Light = ({ children }: { children: ReactNode }) => (
  <span className="shrink-0 whitespace-nowrap font-normal text-mute">{children}</span>
)
const Bold = ({ children }: { children: ReactNode }) => (
  <span className="shrink-0 whitespace-nowrap font-extrabold text-bone">{children}</span>
)

/** One sentence, one flex row. Gaps vary so the line breathes like set type, not a grid. */
function Sentence() {
  return (
    <>
      <Light>Beyond the ordinary,</Light>
      <span className="mx-[0.1em]">
        <Curve />
      </span>
      <Light>beyond the expected,</Light>
      <span className="mx-[0.28em]">
        <PixelArrow />
      </span>
      <span className="shrink-0 whitespace-nowrap font-extrabold text-bone underline decoration-volt decoration-[0.07em] underline-offset-[0.14em]">
        FIND YOURSELF IN GLITCH,
      </span>
      <span className="mx-[0.18em]">
        <Asterisk />
      </span>
      <Light>explore a world where</Light>
      <Bold>creativity meets experimentation,</Bold>
      <span className="mx-[0.3em]">
        <Wave />
      </span>
      <Light>ideas become</Light>
      <Bold>experiences,</Bold>
      <span className="mx-[0.12em]">
        <CircleMark />
      </span>
      <Light>and every pixel tells</Light>
      <Bold>a different story.</Bold>
      <span className="mx-[0.34em]">
        <GlitchGlyph />
      </span>
      <span className="shrink-0 whitespace-nowrap font-mono text-[0.5em] font-medium tracking-[0.02em] text-lime">
        BEYOND_404
      </span>
    </>
  )
}

/**
 * Horizontal manifesto: one long editorial sentence that travels sideways as the page
 * scrolls. GSAP ScrollTrigger pins the stage and scrubs the track from x = 0 to
 * x = -(track.scrollWidth - viewportWidth). Native scrolling is never intercepted, so the
 * page carries on normally once the sentence ends, and scrolling up plays it backwards.
 *
 * Under prefers-reduced-motion the sentence is set as ordinary wrapping text, unpinned.
 */
export function HorizontalManifesto() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Layout effect so the pin spacer is removed before React detaches the DOM on unmount.
  useLayoutEffect(() => {
    if (reduce || !section.current || !stage.current || !track.current) return

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.current!.scrollWidth - stage.current!.clientWidth)

      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          id: 'horizontal-manifesto',
          trigger: section.current,
          pin: stage.current,
          start: 'top top',
          end: () => `+=${distance() * SCROLL_PER_PX}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
    }, section)

    // Widths change once the display font has loaded — measure again.
    let alive = true
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh())

    return () => {
      alive = false
      ctx.revert()
    }
  }, [reduce])

  if (reduce) {
    return (
      <section aria-label="Manifesto" className="section bg-ink">
        <div className="wrap">
          <p className="label mb-6">[ Manifesto ]</p>
          <p className="sr-only">{SENTENCE}</p>
          <div
            aria-hidden="true"
            className="flex flex-wrap items-center gap-x-[0.3em] gap-y-2 font-display text-[clamp(1.5rem,4.4vw,3.25rem)] leading-[1.15] tracking-[-0.04em] [&>span]:!shrink [&>span]:!whitespace-normal"
          >
            <Sentence />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={section} aria-label="Manifesto" className="relative bg-ink" data-manifesto>
      <div ref={stage} className="flex h-[100svh] flex-col overflow-hidden">
        <div className="wrap flex items-center justify-between pt-24">
          <p className="label">[ Manifesto ]</p>
          <p className="label">Keep scrolling →</p>
        </div>

        <div className="flex flex-1 items-center">
          <p className="sr-only">{SENTENCE}</p>
          <div
            ref={track}
            aria-hidden="true"
            data-manifesto-track
            className="flex w-max flex-nowrap items-center gap-[0.32em] pl-[8vw] pr-[14vw] font-display text-[clamp(40px,11vw,60px)] leading-none tracking-[-0.045em] will-change-transform md:text-[clamp(60px,8vw,140px)]"
          >
            <Sentence />
          </div>
        </div>

        <div className="wrap pb-8">
          <div className="h-px bg-line">
            <div ref={bar} className="h-px origin-left bg-bone" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
