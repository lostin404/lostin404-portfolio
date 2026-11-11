import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'
import type { ProjectDetails } from '../data/projectDetails'
import type { Img } from '../data/site'

/** One labelled row of a case study: number + label on the left, content on the right. */
function Section({ no, label, children }: { no: string; label: string; children: ReactNode }) {
  const id = `proj-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <Reveal>
      <section aria-labelledby={id} className="grid gap-4 border-t border-line py-8 md:grid-cols-12 md:gap-10 md:py-10">
        <h2 id={id} className="label md:col-span-3">
          <span className="mr-3 text-bone/50">{no}</span>
          {label}
        </h2>
        <div className="md:col-span-8 md:col-start-5">{children}</div>
      </section>
    </Reveal>
  )
}

const para = 'max-w-[40rem] text-[1.0625rem] leading-[1.6] text-bone/90'
const list = 'max-w-[40rem] divide-y divide-line border-y border-line text-[1.0625rem]'

const Bullets = ({ items, numbered }: { items: string[]; numbered?: boolean }) => {
  const Tag = numbered ? 'ol' : 'ul'
  return (
    <Tag className={list}>
      {items.map((s, i) => (
        <li key={s} className="flex gap-4 py-3">
          {numbered && <span className="label pt-1">{String(i + 1).padStart(2, '0')}</span>}
          {s}
        </li>
      ))}
    </Tag>
  )
}

/**
 * Reusable case-study sections: overview, challenge, role, process, solution, mobile screens,
 * deliverables, outcomes and the live link. A section renders only when the project has verified
 * content for it — empty ones are skipped and the numbering stays continuous.
 */
export function ProjectSections({
  details,
  mobile,
  live,
}: {
  details?: ProjectDetails
  mobile?: Img
  live?: { url: string; domain?: string; label: string }
}) {
  const d = details ?? {}
  const blocks: { label: string; node: ReactNode }[] = []

  if (d.overview) blocks.push({ label: 'Overview', node: <p className={para}>{d.overview}</p> })
  if (d.challenge) blocks.push({ label: 'Challenge', node: <p className={para}>{d.challenge}</p> })
  if (d.role?.length) blocks.push({ label: 'My role', node: <Bullets items={d.role} /> })
  if (d.process?.length) blocks.push({ label: 'Process', node: <Bullets items={d.process} numbered /> })
  if (d.solution) blocks.push({ label: 'Design solution', node: <p className={para}>{d.solution}</p> })
  if (mobile)
    blocks.push({
      label: 'On mobile',
      node: (
        <figure className="max-w-[18rem]">
          <div className="overflow-hidden rounded-[22px] border border-line-strong bg-panel">
            <img
              src={mobile.src}
              alt={mobile.alt}
              width={mobile.w}
              height={mobile.h}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="label mt-3">Live site at phone width (390px)</figcaption>
        </figure>
      ),
    })
  if (d.deliverables?.length) blocks.push({ label: 'Deliverables', node: <Bullets items={d.deliverables} /> })
  if (d.outcomes?.length) blocks.push({ label: 'Results', node: <Bullets items={d.outcomes} /> })
  if (live)
    blocks.push({
      label: 'Live',
      node: (
        <a href={live.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          {live.label}
          {live.domain && <span className="text-mute">— {live.domain}</span>}
          <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
        </a>
      ),
    })

  if (!blocks.length) return null
  return (
    <div className="mt-16 md:mt-24" data-project-sections>
      {blocks.map((b, i) => (
        <Section key={b.label} no={String(i + 1).padStart(2, '0')} label={b.label}>
          {b.node}
        </Section>
      ))}
    </div>
  )
}
