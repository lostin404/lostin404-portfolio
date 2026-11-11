import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { ClipReveal } from './ClipReveal'
import { ProjectCard } from './ProjectCard'
import { EASE, Reveal } from './Reveal'
import { projects } from '../data/site'

/** Home page: three project previews and the way into the full Work page. */
export function SelectedPreviews() {
  const picks = projects.filter((p) => ['lacabite-uae', 'mealskart', 'aajel-business'].includes(p.slug))
  return (
    <section className="section bg-ink" aria-labelledby="previews-title">
      <div className="wrap">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="label mb-4">[ Selected work ]</p>
            <ClipReveal
              id="previews-title"
              text="Work that refuses to blend in."
              className="display h-section"
              distance={100}
              stagger={18}
              duration={0.8}
            />
          </div>
          <Reveal className="md:col-span-5 md:justify-self-end">
            <Link to="/work" className="btn btn-ghost">
              All {projects.length} projects
              <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <ul className="grid gap-x-6 gap-y-14 md:grid-cols-3">
          {picks.map((project, i) => (
            <li key={project.slug}>
              <Reveal delay={i * 0.08}>
                <ProjectCard project={project} index={projects.indexOf(project)} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'Web Design & Development', label: 'Web' },
  { id: 'Premium Brand Visuals', label: 'Identity' },
  { id: 'Social Media Management', label: 'Social' },
] as const

/** Work page: every project, filterable by discipline. */
export function ProjectGrid() {
  const [filter, setFilter] = useState<string>('all')
  const reduce = useReducedMotion()
  const shown = projects.filter((p) => filter === 'all' || p.discipline === filter)
  const count = (id: string) => (id === 'all' ? projects.length : projects.filter((p) => p.discipline === id).length)

  return (
    <section className="bg-ink pb-[var(--section-y)] pt-12 md:pt-16" aria-labelledby="projects-title">
      <div className="wrap">
        <h2 id="projects-title" className="sr-only">
          All projects
        </h2>
        <div
          role="group"
          aria-label="Filter projects by discipline"
          className="flex flex-wrap gap-2 border-t border-line pt-6"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`btn !min-h-11 !px-4 !py-2 !text-[0.8125rem] ${
                  active ? 'border border-bone bg-bone text-ink' : 'btn-ghost text-mute'
                }`}
              >
                {f.label}
                <span className={`font-mono text-[0.6875rem] ${active ? 'text-ink/60' : 'text-mute'}`}>
                  {String(count(f.id)).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {shown.length} of {projects.length} projects
        </p>

        <ul className="mt-12 grid gap-x-6 gap-y-14 md:mt-16 md:grid-cols-2 md:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((project, i) => {
              const wide = filter === 'all' && (i === 0 || i === shown.length - 1)
              return (
                <motion.li
                  key={project.slug}
                  layout={!reduce}
                  className={wide ? 'md:col-span-2' : ''}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  data-project-card={project.slug}
                >
                  <Reveal delay={wide ? 0 : i % 2 === 1 ? 0 : 0.08}>
                    <ProjectCard project={project} index={projects.indexOf(project)} wide={wide} />
                  </Reveal>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  )
}
