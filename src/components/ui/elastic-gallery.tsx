import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import type { GalleryPhoto } from '../../data/aboutGallery'

const VISIBLE = 5 // photos shown at once in the desktop accordion
const DEFAULT_POSITION = 'center 28%'
const pad = (n: number) => String(n).padStart(2, '0')
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/* ───────────────────────── Lightbox ───────────────────────── */

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: GalleryPhoto[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const photo = photos[index]

  // Focus the close button on open, lock page scroll, and hand focus back on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
    } else if (e.key === 'ArrowRight') {
      onIndex((index + 1) % photos.length)
    } else if (e.key === 'ArrowLeft') {
      onIndex((index - 1 + photos.length) % photos.length)
    } else if (e.key === 'Tab') {
      // keep focus inside the dialog
      const focusable = dialog.current?.querySelectorAll<HTMLElement>('button')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return createPortal(
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title ?? 'Photo'} — ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-[70] flex flex-col bg-deep/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onKeyDown={onKeyDown}
      onClick={onClose}
      data-lightbox
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-6" onClick={(e) => e.stopPropagation()}>
        <p className="label tabular-nums" aria-live="polite">
          {pad(index + 1)} / {pad(photos.length)} — {photo.title}
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-bone transition-colors duration-300 hover:bg-bone hover:text-ink"
          aria-label="Close photo"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-20">
        <img
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-h-full max-w-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onIndex((index - 1 + photos.length) % photos.length)
          }}
          className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-ink/70 text-bone transition-colors duration-300 hover:bg-bone hover:text-ink md:left-6"
          aria-label="Previous photo"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onIndex((index + 1) % photos.length)
          }}
          className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-ink/70 text-bone transition-colors duration-300 hover:bg-bone hover:text-ink md:right-6"
          aria-label="Next photo"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </motion.div>,
    document.body,
  )
}

/* ───────────────────────── Shared panel content ───────────────────────── */

function PanelOverlay({ photo, index, active }: { photo: GalleryPhoto; index: number; active: boolean }) {
  return (
    <>
      {/* gradient over the selected photo */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-700 motion-reduce:transition-none ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* caption: revealed on the selected photo */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4 transition-[opacity,transform] duration-500 ease-expo motion-reduce:transition-none md:p-6 ${
          active ? 'translate-y-0 opacity-100 delay-150' : 'translate-y-4 opacity-0'
        }`}
      >
        <span>
          <span className="label block whitespace-nowrap !text-bone/70">
            {pad(index + 1)} — {photo.category ?? 'Personal archive'}
          </span>
          <span className="mt-1 block whitespace-nowrap font-display text-2xl font-bold tracking-[-0.03em] text-bone md:text-3xl">
            {photo.title}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-black/30 px-3.5 py-2 text-[0.8125rem] font-medium text-bone backdrop-blur-md">
          View Photo
          <Maximize2 size={14} />
        </span>
      </span>
    </>
  )
}

/* ───────────────────────── Gallery ───────────────────────── */

/**
 * ElasticGallery — a horizontal photo accordion.
 *
 * Desktop: five photos share the row; the active one takes flex 4, the rest flex 1, and the
 * whole collection is browsed with the arrows (photos outside the window collapse to flex 0,
 * so the row slides as one continuous strip). Hover or click selects; clicking the selected
 * photo opens it full screen.
 *
 * Mobile: the same photos become a native swipeable, snap-scrolling strip — one prominent
 * photo with the next peeking in. No hover needed; vertical page scrolling is untouched.
 */
export function ElasticGallery({ photos, initialIndex = 2 }: { photos: GalleryPhoto[]; initialIndex?: number }) {
  const count = photos.length
  const window5 = Math.min(VISIBLE, count)
  const desktop = useMediaQuery('(min-width: 768px)')
  const [active, setActive] = useState(() => clamp(initialIndex, 0, count - 1))
  const [start, setStart] = useState(() => clamp(initialIndex - 2, 0, Math.max(0, count - window5)))
  const [lightbox, setLightbox] = useState<number | null>(null)
  // photos whose <img> has been mounted — only what has been near the window gets downloaded
  const [mounted, setMounted] = useState<Set<number>>(() => new Set())
  const strip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted((prev) => {
      const next = new Set(prev)
      for (let i = start - 1; i <= start + window5; i++) if (i >= 0 && i < count) next.add(i)
      return next.size === prev.size ? prev : next
    })
  }, [start, window5, count])

  /* desktop: select a photo and slide the window so it stays in view (centred when possible) */
  const select = useCallback(
    (i: number) => {
      const next = clamp(i, 0, count - 1)
      setActive(next)
      setStart(clamp(next - Math.floor(window5 / 2), 0, Math.max(0, count - window5)))
    },
    [count, window5],
  )

  /* mobile: scroll a photo to the centre of the strip */
  const scrollToPhoto = useCallback((i: number) => {
    const el = strip.current?.children[i] as HTMLElement | undefined
    if (!el || !strip.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    strip.current.scrollTo({
      left: el.offsetLeft - (strip.current.clientWidth - el.clientWidth) / 2,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }, [])

  const go = (delta: number) => {
    const next = clamp(active + delta, 0, count - 1)
    if (desktop) select(next)
    else scrollToPhoto(next)
  }

  /* mobile: the photo nearest the centre of the strip is the active one */
  useEffect(() => {
    const el = strip.current
    if (desktop || !el) return
    let raf = 0
    const measure = () => {
      raf = 0
      const mid = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement
        const dist = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    // start on the same photo the desktop layout would show
    const first = el.children[active] as HTMLElement | undefined
    if (first) el.scrollLeft = first.offsetLeft - (el.clientWidth - first.clientWidth) / 2
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  // hover selects — but only for a real mouse, so a tap never "hovers" then opens in one go
  const onPanelEnter = (i: number) => (e: PointerEvent) => {
    if (e.pointerType === 'mouse') setActive(i)
  }

  const onPanelClick = (i: number) => {
    if (i === active) setLightbox(i)
    else if (desktop) setActive(i)
    else scrollToPhoto(i)
  }

  const controls = (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => go(-1)}
        disabled={active === 0}
        className="btn btn-ghost !h-12 !w-12 !p-0 disabled:opacity-35"
        aria-label="Previous photo"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        disabled={active === count - 1}
        className="btn btn-ghost !h-12 !w-12 !p-0 disabled:opacity-35"
        aria-label="Next photo"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
      <p className="label ml-2 tabular-nums" aria-live="polite" data-gallery-counter>
        <span className="text-bone">{pad(active + 1)}</span> / {pad(count)}
      </p>
    </div>
  )

  return (
    <div data-elastic-gallery={desktop ? 'accordion' : 'strip'}>
      {desktop ? (
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={`Personal photo archive, ${count} photos. Use the left and right arrow keys to browse.`}
          onKeyDown={onKeyDown}
          className="flex h-[clamp(26rem,80svh,44rem)] w-full"
        >
          {photos.map((photo, i) => {
            const visible = i >= start && i < start + window5
            const isActive = i === active
            return (
              <div
                key={photo.id}
                data-gallery-panel={isActive ? 'active' : visible ? 'inactive' : 'hidden'}
                aria-hidden={!visible}
                onPointerEnter={visible ? onPanelEnter(i) : undefined}
                style={{ flex: `${!visible ? 0 : isActive ? 4 : 1} 1 0%` }}
                className={`relative min-w-0 overflow-hidden transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${
                  isActive ? 'brightness-100' : 'brightness-50 hover:brightness-75'
                }`}
              >
                <button
                  type="button"
                  tabIndex={visible ? 0 : -1}
                  onClick={() => onPanelClick(i)}
                  aria-label={isActive ? `${photo.title} — view full screen` : `Show ${photo.title}`}
                  aria-current={isActive || undefined}
                  className={`group absolute inset-y-0 left-1 right-1 overflow-hidden rounded-[14px] border border-line bg-panel ${
                    isActive ? 'cursor-zoom-in' : 'cursor-pointer'
                  }`}
                >
                  {mounted.has(i) && (
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      style={{ objectPosition: photo.objectPosition ?? DEFAULT_POSITION }}
                      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${
                        isActive ? 'scale-100' : 'scale-110'
                      }`}
                    />
                  )}
                  <PanelOverlay photo={photo} index={i} active={isActive} />
                  {/* vertical label on the collapsed photos */}
                  <span
                    aria-hidden="true"
                    className={`label pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap !text-bone transition-opacity duration-500 [writing-mode:vertical-rl] motion-reduce:transition-none ${
                      isActive ? 'opacity-0' : 'opacity-100 delay-200'
                    }`}
                  >
                    {photo.title}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div
          ref={strip}
          role="group"
          aria-roledescription="carousel"
          aria-label={`Personal photo archive, ${count} photos. Swipe to browse.`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[var(--gutter)] pb-1"
        >
          {photos.map((photo, i) => {
            const isActive = i === active
            return (
              <button
                key={photo.id}
                type="button"
                data-gallery-panel={isActive ? 'active' : 'inactive'}
                onClick={() => onPanelClick(i)}
                aria-label={isActive ? `${photo.title} — view full screen` : `Show ${photo.title}`}
                aria-current={isActive || undefined}
                className={`relative aspect-[3/4] w-[76vw] max-w-[26rem] shrink-0 snap-center overflow-hidden rounded-[14px] border border-line bg-panel transition-[filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${
                  isActive ? 'brightness-100' : 'brightness-50'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ objectPosition: photo.objectPosition ?? DEFAULT_POSITION }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <PanelOverlay photo={photo} index={i} active={isActive} />
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-6">
        {controls}
        <div className="hidden h-px flex-1 bg-line sm:block" aria-hidden="true">
          <div
            className="h-px origin-left bg-bone transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
            style={{ transform: `scaleX(${(active + 1) / count})` }}
          />
        </div>
        <p className="label hidden lg:block">{desktop ? 'Hover to expand · click to view' : 'Swipe · tap to view'}</p>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            photos={photos}
            index={lightbox}
            onIndex={(i) => {
              setLightbox(i)
              if (desktop) select(i)
              else scrollToPhoto(i)
            }}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
