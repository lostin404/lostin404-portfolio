import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ClipReveal } from './ClipReveal'
import { Reveal } from './Reveal'
import { drops, socials } from '../data/site'

const instagram = socials.find((s) => s.id === 'instagram')!
const pinterest = socials.find((s) => s.id === 'pinterest')!

/**
 * Home — "Latest Creative Drops": a small editorial selection of existing LOSTIN404 artwork.
 * Every piece is artwork already in this project; each links to its project page or to the
 * verified Instagram / Pinterest profile. No dates or metrics are claimed.
 */
export function CreativeDrops() {
  return (
    <section className="section bg-deep" aria-labelledby="drops-title">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="label mb-4">[ Creative drops ]</p>
            <ClipReveal id="drops-title" text="Latest Creative Drops" className="display h-section" distance={100} />
          </div>
          <p className="label flex flex-wrap gap-x-5 gap-y-2">
            <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="link-underline">
              Instagram {instagram.handle}
            </a>
            <a href={pinterest.url} target="_blank" rel="noopener noreferrer" className="link-underline">
              Pinterest {pinterest.handle}
            </a>
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6" data-creative-drops>
          {drops.map((d, i) => {
            const lead = i === 0
            const body = (
              <>
                <div className={`card-media ${lead ? 'aspect-[4/5]' : 'aspect-square'}`}>
                  <img
                    src={d.image.src}
                    alt={d.image.alt}
                    width={d.image.w}
                    height={d.image.h}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="label mb-1">{d.category}</p>
                    <h3 className="font-display text-[clamp(1rem,1.6vw,1.375rem)] font-bold leading-tight tracking-[-0.02em]">
                      {d.title}
                    </h3>
                  </div>
                  <span className="card-arrow mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:bg-bone group-hover:text-ink">
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </>
            )
            const label = `${d.title} — ${d.linkLabel}`
            return (
              <li
                key={d.title}
                className={lead ? 'col-span-2 md:col-span-6 md:row-span-2' : 'col-span-1 md:col-span-3'}
              >
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  {d.href.startsWith('/') ? (
                    <Link to={d.href} className="card group block" aria-label={label}>
                      {body}
                    </Link>
                  ) : (
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className="card group block" aria-label={label}>
                      {body}
                    </a>
                  )}
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
