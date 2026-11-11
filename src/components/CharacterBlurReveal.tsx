import { createElement, useMemo, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  /** seconds between characters */
  stagger?: number
  /** seconds each character takes to come into focus */
  duration?: number
  /** seconds before the first character starts */
  delay?: number
  id?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

const segment = (word: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(word), (s) => s.segment)
  }
  return Array.from(word)
}

/**
 * Character-by-character blur reveal: each grapheme starts at 50% opacity, 5px blur and
 * 8px low, then sharpens into place one after another when the heading enters the viewport.
 *
 * It animates opacity / filter / transform on its own character spans, so it never competes
 * with ClipReveal (which owns the hero wordmark). Screen readers get the full string once.
 */
export function CharacterBlurReveal({
  text,
  as = 'h2',
  className,
  stagger = 0.02,
  duration = 0.7,
  delay = 0,
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const words = useMemo(() => text.split(' ').map(segment), [text])

  if (reduce) return createElement(as, { id, className }, text)

  let index = 0
  return createElement(
    as,
    { ref, id, className, 'data-blur-reveal': inView ? 'in' : 'idle' },
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((chars, w) => (
          <span key={w}>
            <span className="inline-block whitespace-nowrap">
              {chars.map((char, c) => {
                const i = index++
                return (
                  <motion.span
                    key={c}
                    data-blur-char
                    className="inline-block will-change-[filter,opacity,transform]"
                    initial={{ opacity: 0.5, filter: 'blur(5px)', y: 8 }}
                    animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : undefined}
                    transition={{ duration, ease: EASE, delay: delay + i * stagger }}
                  >
                    {char}
                  </motion.span>
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
