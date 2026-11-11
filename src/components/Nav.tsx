import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { brand, nav } from '../data/site'
import { EASE } from './Reveal'

const pageLinks = nav.filter((n) => n.path !== '/contact')

/** Shared navigation. Every item is a real route — no in-page anchors. */
export function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto max-w-[80rem] rounded-2xl border border-line bg-[rgba(10,12,14,0.62)] backdrop-blur-[16px]"
      >
        <div className="flex h-14 items-center justify-between pl-5 pr-2 md:pr-3">
          <Link
            to="/"
            className="font-display text-[1.0625rem] font-extrabold tracking-[-0.04em]"
            aria-label="LOSTIN404 — home"
          >
            LOSTIN<span className="text-mute">404</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {pageLinks.map((l) => (
              <li key={l.path}>
                <NavLink
                  to={l.path}
                  end={l.path === '/'}
                  className={({ isActive }) =>
                    `group relative block rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300 hover:text-bone ${
                      isActive ? 'text-bone' : 'text-mute'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <span
                        className={`absolute inset-x-4 bottom-1 h-px origin-left bg-bone transition-transform duration-300 ease-expo group-hover:scale-x-100 ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li className="pl-2">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `btn btn-primary !min-h-10 !px-4 !py-2 !text-[0.8125rem] ${isActive ? 'ring-2 ring-bone/70' : ''}`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>

          <button
            ref={toggle}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl text-bone md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="mobile-menu"
              className="overflow-hidden md:hidden"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <ul className="border-t border-line px-3 py-3">
                {nav.map((l, i) => (
                  <li key={l.path}>
                    <NavLink
                      to={l.path}
                      end={l.path === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex min-h-12 items-center justify-between rounded-xl px-3 font-display text-2xl font-bold tracking-[-0.04em] ${
                          isActive ? 'bg-white/[0.06] text-bone' : 'text-bone/70'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className="flex items-center gap-3">
                            {isActive && <span className="h-2 w-2 bg-lime" aria-hidden="true" />}
                            {l.label}
                          </span>
                          <span className="label">0{i + 1}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <p className="label border-t border-line px-6 py-4">
                {brand.location} — {brand.signature}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
