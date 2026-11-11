import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { ClipReveal } from '../components/ClipReveal'
import { TypeCover } from '../components/ProjectCard'
import { Reveal } from '../components/Reveal'
import { brand, projects } from '../data/site'
import NotFound from './NotFound'

export default function ProjectPage() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]

  useEffect(() => {
    if (project) document.title = `${project.title} — ${brand.name}`
    return () => {
      document.title = `${brand.name} — Find Yourself in Glitch`
    }
  }, [project])

  if (!project) return <NotFound />

  const next = projects[(index + 1) % projects.length]
  const external = project.url
  const isSite = project.discipline.startsWith('Web')

  return (
    <article className="bg-ink pt-28 md:pt-36">
      <header className="wrap">
        <Link to="/work" className="label link-underline inline-flex items-center gap-2 py-2">
          <ArrowLeft size={14} aria-hidden="true" /> All work
        </Link>

        <p className="label mt-10">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} — {project.category}
        </p>
        <ClipReveal
          as="h1"
          key={project.slug}
          text={project.title}
          className="display mt-4 text-[clamp(2rem,8.4vw,7rem)] font-extrabold"
          stagger={40}
          delay={120}
        />

        <div className="mt-10 grid gap-10 border-t border-line pt-8 md:grid-cols-12">
          <p className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-[1.35] tracking-[-0.015em] md:col-span-7">
            {project.summary}
          </p>
          <dl className="md:col-span-4 md:col-start-9">
            {[
              ['Category', project.category],
              ['Discipline', project.discipline],
              ['Studio', brand.name],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-line py-3">
                <dt className="label pt-0.5">{k}</dt>
                <dd className="text-right text-[0.9375rem] font-medium">{v}</dd>
              </div>
            ))}
            {external && (
              <a href={external} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6 w-full">
                {isSite ? 'View live website' : 'View on Instagram'}
                <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
              </a>
            )}
          </dl>
        </div>
      </header>

      <div className="wrap mt-14 md:mt-20">
        <Reveal>
          <div className="card-media aspect-[4/3] md:aspect-[16/9]">
            {project.cover ? (
              <img
                style={{ objectPosition: project.cover.position }}
                src={project.cover.src}
                alt={project.cover.alt}
                width={project.cover.w}
                height={project.cover.h}
              />
            ) : (
              <TypeCover project={project} />
            )}
          </div>
        </Reveal>

        {project.gallery.length > 0 && (
          <ul className={`mt-6 grid gap-6 ${project.gallery.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {project.gallery.map((img, i) => (
              <li key={img.src}>
                <Reveal delay={i * 0.08}>
                  <div
                    className={`card-media ${project.gallery.length > 1 ? 'aspect-square' : 'aspect-[4/3] md:aspect-[16/9]'}`}
                  >
                    <img
                      style={{ objectPosition: img.position }}
                      src={img.src}
                      alt={img.alt}
                      width={img.w}
                      height={img.h}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        {!project.cover && external && (
          <p className="label mt-6">
            Screens for this project are on the live site —{' '}
            <a href={external} target="_blank" rel="noopener noreferrer" className="link-underline text-bone">
              {project.domain}
            </a>
          </p>
        )}
      </div>

      <div className="wrap mt-20 md:mt-28">
        <Link to={`/work/${next.slug}`} className="group block border-t border-line py-10 md:py-14">
          <p className="label">Next project</p>
          <p className="mt-3 flex items-center justify-between gap-6">
            <span className="display text-[clamp(2rem,6.5vw,5rem)] font-extrabold">{next.title}</span>
            <ArrowRight
              className="h-8 w-8 shrink-0 transition-transform duration-500 ease-expo group-hover:translate-x-2 md:h-12 md:w-12"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </p>
        </Link>
      </div>
    </article>
  )
}
