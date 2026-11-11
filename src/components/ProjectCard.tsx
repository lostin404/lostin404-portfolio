import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/site'

/** Typographic cover for projects that have no artwork yet — never a stock placeholder. */
export function TypeCover({ project }: { project: Project }) {
  return (
    <div className="type-cover">
      <div className="flex items-center justify-between">
        <span className="label">{project.category}</span>
        <span className="label">Live site</span>
      </div>
      <div>
        <p className="display text-[clamp(1.75rem,4.6vw,3.5rem)] font-extrabold">{project.title}</p>
        {project.domain && <p className="label mt-3 normal-case tracking-[0.04em]">{project.domain}</p>}
      </div>
    </div>
  )
}

export function ProjectCard({ project, index, wide = false }: { project: Project; index: number; wide?: boolean }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="card group block"
      aria-label={`${project.title} — ${project.category} project`}
    >
      <div className={`card-media ${wide ? 'aspect-[4/3] md:aspect-[21/9]' : 'aspect-[16/10]'}`}>
        {project.cover ? (
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.w}
            height={project.cover.h}
            style={{ objectPosition: project.cover.position }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <TypeCover project={project} />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-6">
        <div>
          <p className="label mb-2">
            {String(index + 1).padStart(2, '0')} — {project.category}
          </p>
          <h3 className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold leading-tight tracking-[-0.03em]">
            {project.title}
          </h3>
          <p className="card-desc mt-2 max-w-[34rem] text-[0.9375rem]">{project.summary}</p>
        </div>
        <span
          aria-hidden="true"
          className="card-arrow mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong"
        >
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  )
}
