import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ClipReveal } from './ClipReveal'
import { Reveal, EASE } from './Reveal'
import { archive } from '../data/site'

type Item = (typeof archive)[number]

const THRESHOLD = 0.1 // share of the deck width a release must exceed to throw the card

function DeckCard({
  item,
  pos,
  total,
  deckWidth,
  onThrow,
}: {
  item: Item
  pos: number
  total: number
  deckWidth: () => number
  onThrow: () => void
}) {
  const reduce = useReducedMotion()
  const front = pos === 0
  const x = useMotionValue(0)
  const opacity = useMotionValue(1)
  const rotate = useTransform(x, [-320, 0, 320], [-11, 0, 11])
  const lift = useTransform(x, [-160, 0, 160], [1.03, 1, 1.03])
  const busy = useRef(false)

  const release = (_: unknown, info: PanInfo) => {
    const width = deckWidth()
    const travelled = Math.abs(info.offset.x)
    const flicked = Math.abs(info.velocity.x) > 650 && travelled > 24
    if (travelled > width * THRESHOLD || flicked) {
      const dir = info.offset.x >= 0 ? 1 : -1
      busy.current = true
      animate(x, dir * width * 1.35, { duration: reduce ? 0 : 0.34, ease: EASE }).then(() => {
        opacity.set(0)
        onThrow() // card moves to the back of the stack
        x.set(0)
        animate(opacity, 1, { duration: 0.4, delay: 0.12 })
        busy.current = false
      })
    } else {
      animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 })
    }
  }

  // resting pose in the stack: small offset, alternating tilt, slight scale-down
  const depth = Math.min(pos, 3)
  const tilt = pos === 0 ? 0 : (pos % 2 === 1 ? 1 : -1) * (2.4 + depth * 1.1)

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: total - pos }}
      initial={false}
      animate={{
        x: `${depth * 5.5}%`,
        y: `${depth * -2.6}%`,
        scale: 1 - depth * 0.045,
        rotate: tilt,
        opacity: pos > 3 ? 0 : 1,
      }}
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }}
      aria-hidden={!front}
    >
      <motion.figure
        className={`relative h-full w-full overflow-hidden rounded-[18px] border border-line-strong bg-panel shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] ${
          front ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{ x, rotate, scale: lift, opacity, touchAction: 'pan-y' }}
        drag={front ? 'x' : false}
        dragSnapToOrigin={false}
        dragElastic={0.9}
        dragMomentum={false}
        onDragEnd={release}
        data-deck-card={front ? 'front' : 'stack'}
      >
        <img
          src={item.image.src}
          alt={front ? item.image.alt : ''}
          width={item.image.w}
          height={item.image.h}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-cover"
        />
        <figcaption className="glass absolute inset-x-3 bottom-3 flex items-center justify-between gap-4 rounded-xl px-4 py-3">
          <span className="font-display text-base font-bold tracking-[-0.03em]">{item.title}</span>
          <span className="label">{item.category}</span>
        </figcaption>
      </motion.figure>
    </motion.div>
  )
}

/** Throwable deck for the visual archive. Drag, swipe, arrow keys or the buttons. */
export function Deck() {
  const [order, setOrder] = useState(() => archive.map((_, i) => i))
  const deck = useRef<HTMLDivElement>(null)
  const deckWidth = useCallback(() => deck.current?.offsetWidth ?? 360, [])

  const next = useCallback(() => setOrder(([first, ...rest]) => [...rest, first]), [])
  const prev = useCallback(() => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]), [])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  const current = archive[order[0]]

  return (
    <section className="section overflow-hidden bg-deep" aria-labelledby="deck-title">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="label mb-4">[ Visual archive ]</p>
          <ClipReveal
            id="deck-title"
            text="Throw a card."
            className="display h-section"
            distance={100}
            stagger={28}
            duration={0.8}
          />
          <Reveal>
            <p className="lede mt-6 max-w-[26rem]">
              Posters, portraits, identity and edits from the archive. Drag the top card aside, swipe it on touch, or
              use the arrow keys.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                className="btn btn-ghost !h-12 !w-12 !p-0"
                aria-label="Previous card"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={next} className="btn btn-ghost !h-12 !w-12 !p-0" aria-label="Next card">
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <p className="label ml-3 tabular-nums" aria-live="polite">
                {String(order[0] + 1).padStart(2, '0')} / {String(archive.length).padStart(2, '0')} — {current.title}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div
            ref={deck}
            role="group"
            aria-roledescription="carousel"
            aria-label="Visual archive deck. Use left and right arrow keys to change cards."
            tabIndex={0}
            onKeyDown={onKey}
            className="relative mx-auto aspect-square w-[min(78vw,30rem)] rounded-[18px] lg:ml-auto lg:mr-[8%]"
            data-deck
          >
            {order.map((id, pos) => (
              <DeckCard
                key={id}
                item={archive[id]}
                pos={pos}
                total={order.length}
                deckWidth={deckWidth}
                onThrow={next}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
