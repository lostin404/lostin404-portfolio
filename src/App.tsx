import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { EASE } from './components/Reveal'
import Home from './pages/Home'

// Home ships in the main bundle; the other pages load on demand (and stay cached once visited).
const WorkPage = lazy(() => import('./pages/WorkPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Remembered scroll offsets per history entry, so Back / Forward land where you left. */
const offsets = new Map<string, number>()
let activeKey = 'default'

/**
 * Runs once per page, after the previous page has faded out and this one has mounted:
 * new navigations start at the top, history navigations return to their saved offset.
 */
function PageEnter({ historyKey }: { historyKey: string }) {
  const type = useNavigationType()
  useLayoutEffect(() => {
    const y = type === 'POP' ? (offsets.get(historyKey) ?? 0) : 0
    activeKey = historyKey
    window.scrollTo({ top: y, behavior: 'instant' })
    // the new page has a different height — let any pinned sections measure again
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

function Pages() {
  const location = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => {
    history.scrollRestoration = 'manual'
    const save = () => offsets.set(activeKey, window.scrollY)
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [])

  // No initial={false} on AnimatePresence: it would cascade and cancel every entrance animation in the page.
  return (
    <AnimatePresence mode="wait">
      {/* Opacity only: a transform here would break position: fixed pinning inside the page. */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
        data-page={location.pathname}
      >
        <PageEnter historyKey={location.key} />
        <Suspense fallback={<div className="min-h-[100svh] bg-ink" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bone focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">
          <Pages />
        </main>
        <Footer />
      </BrowserRouter>
    </MotionConfig>
  )
}
