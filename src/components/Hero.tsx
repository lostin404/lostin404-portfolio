import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Aurora } from './Aurora'
import { CharacterBlurReveal } from './CharacterBlurReveal'
import { ClipReveal } from './ClipReveal'
import { EASE } from './Reveal'
import { brand, projects } from '../data/site'

const FEATURED = projects.filter((p) => ['lacabite-uae', 'mealskart', 'aajel-business'].includes(p.slug))

export function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        }

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-deep">
      {/* Aurora sits behind the type; veil + vignette keep the text contrast */}
      <Aurora className="opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,5,.28) 0%, rgba(5,5,5,.5) 42%, #0a0c0e 96%), radial-gradient(120% 80% at 50% 0%, transparent 40%, rgba(5,5,5,.75) 100%)',
        }}
      />

      <div className="wrap relative z-10 flex flex-1 flex-col justify-end pb-8 pt-28 md:pb-10">
        <motion.div {...rise(0.1)} className="mb-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-2 pt-4">
          <p className="label flex items-center gap-2.5">
            <span className="status-dot" aria-hidden="true" />
            Available for work
          </p>
          <p className="label">
            {brand.person} — {brand.role}
          </p>
        </motion.div>

        <div className="mt-16">
          <motion.p {...rise(0.15)} className="label mb-4 md:mb-6">
            [ {brand.location} ] — Creative professional &amp; design brand
          </motion.p>

          <ClipReveal
            as="h1"
            text={brand.name}
            delay={250}
            stagger={50}
            className="display select-none text-[clamp(2rem,9.8vw,8.9rem)] font-extrabold leading-[0.86] tracking-[-0.05em]"
          />

          <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6 lg:col-span-5">
              {/* supporting heading: blur reveal, sequenced after the wordmark has landed */}
              <CharacterBlurReveal
                as="p"
                text={`${brand.slogan}.`}
                delay={0.9}
                className="font-display text-[clamp(1.125rem,2vw,1.5rem)] font-semibold tracking-[-0.02em]"
              />
              <motion.p {...rise(0.95)} className="lede mt-3 max-w-[34rem]">
                {brand.intro}
              </motion.p>
            </div>

            <motion.div {...rise(0.95)} className="flex flex-wrap gap-3 md:col-span-6 md:justify-end lg:col-span-7">
              <Link to="/work" className="btn btn-primary">
                Explore Work
                <ArrowDown size={16} className="arrow" aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                Contact
                <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* shortcut to the selected work, so it is one tap away instead of several screens of scroll */}
        <motion.nav
          {...rise(1)}
          aria-label="Featured projects"
          className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 md:justify-end"
        >
          <span className="label">Featured —</span>
          {FEATURED.map((p) => (
            <Link key={p.slug} to={`/work/${p.slug}`} className="label link-underline !text-bone/85 py-1.5">
              {p.title}
            </Link>
          ))}
        </motion.nav>

        <motion.div {...rise(1.05)} className="hairline mt-6 flex items-center justify-between gap-6 pt-5">
          <p className="label">Brand visuals · Cinematic content · Web · Social</p>
          <p className="label hidden sm:block">{brand.signature}</p>
          <p className="label">Scroll ↓</p>
        </motion.div>
      </div>
    </section>
  )
}
