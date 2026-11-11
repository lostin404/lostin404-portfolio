import { createElement, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  /** ms between characters (35–55 recommended) */
  stagger?: number
  /** ms before the first character moves */
  delay?: number
  /** start offset in % of the line — 110 for the hero, lower for quieter headings */
  distance?: number
  /** seconds */
  duration?: number
  id?: string
}

const segment = (word: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(word), (s) => s.segment)
  }
  return Array.from(word)
}

/**
 * Vertical text clip slide-down: every grapheme sits in its own overflow-hidden mask and
 * slides down out of it. The full string stays available to assistive tech, and the
 * heading box never changes size (only transforms animate).
 */
export function ClipReveal({
  text,
  as = 'h2',
  className,
  stagger = 45,
  delay = 0,
  distance = 110,
  duration = 0.95,
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  const words = useMemo(() => text.split(' ').map(segment), [text])

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  let index = 0
  const style = { '--clip-from': `-${distance}%`, '--clip-dur': `${duration}s` } as CSSProperties

  return createElement(
    as,
    { ref, id, className: `${className ?? ''} ${shown ? 'clip-in' : ''}`, style },
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((chars, w) => (
          <span key={w}>
            <span className="clip-word">
              {chars.map((char, c) => {
                const d = delay + index++ * stagger
                return (
                  <span className="clip-char" key={c}>
                    <span style={{ '--d': `${d}ms` } as CSSProperties}>{char}</span>
                  </span>
                )
              })}
            </span>
            {w < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </>,
  )
}
