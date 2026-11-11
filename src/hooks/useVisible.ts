import { useEffect, useState, type RefObject } from 'react'

/** True while the element intersects the viewport (and the tab is visible when `withTab` is set). */
export function useVisible<T extends Element>(ref: RefObject<T | null>, rootMargin = '0px', withTab = true) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    let inView = false
    const sync = () => setVisible(inView && (!withTab || document.visibilityState === 'visible'))
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        sync()
      },
      { rootMargin },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [ref, rootMargin, withTab])

  return visible
}
