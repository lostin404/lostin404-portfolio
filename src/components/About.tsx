import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { about, brand, services } from '../data/site'

/** About page body — the warm-bone editorial surface. */
export function AboutStory() {
  return (
    <section className="bg-bone pb-[var(--section-y)] pt-12 text-ink md:pt-16" aria-label="Story">
      <div className="wrap">
        <div className="grid gap-12 border-t border-line-ink pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <figure className="overflow-hidden rounded-[14px] border border-line-ink">
                <img
                  src={about.portrait.src}
                  alt={about.portrait.alt}
                  width={about.portrait.w}
                  height={about.portrait.h}
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
                <figcaption className="label flex justify-between border-t border-line-ink px-4 py-3 !text-ink/70">
                  <span>{brand.person}</span>
                  <span>{brand.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="max-w-[40rem] text-[clamp(1.25rem,2.1vw,1.625rem)] font-medium leading-[1.4] tracking-[-0.015em]">
                {about.story}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="label mb-2 mt-12 !text-ink/60">Experience</h2>
              <dl className="border-t border-line-ink">
                {about.facts.map((f) => (
                  <div
                    key={f.k}
                    className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line-ink py-4 sm:grid-cols-[10rem_1fr]"
                  >
                    <dt className="label pt-0.5 !text-ink/60">{f.k}</dt>
                    <dd className="text-[0.9375rem] font-medium">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal>
              <h2 className="label mb-2 mt-14 !text-ink/60">The journey</h2>
              <ol className="border-t border-line-ink">
                {about.journey.map((j) => (
                  <li
                    key={j.year}
                    className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line-ink py-5 sm:grid-cols-[10rem_1fr]"
                  >
                    <span className="font-display text-xl font-bold tracking-[-0.03em]">{j.year}</span>
                    <div>
                      <p className="font-semibold">{j.title}</p>
                      <p className="mt-0.5 text-[0.9375rem] text-ink/70">{j.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-10">
              <Link to="/contact" className="btn btn-ink">
                Work with me
                <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Services page body — glass cards over a restrained colour field. */
export function ServiceCards() {
  return (
    <section
      className="relative isolate overflow-hidden bg-ink pb-[var(--section-y)] pt-12 md:pt-16"
      aria-label="Services"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(38% 46% at 18% 52%, rgba(58,41,255,.36), transparent 70%), radial-gradient(30% 40% at 84% 24%, rgba(82,39,255,.24), transparent 70%)',
        }}
      />
      <div className="wrap">
        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.no}>
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <Link
                  to={`/contact?service=${s.id}`}
                  aria-label={`${s.title} — enquire about this service`}
                  className="glass glass-hover group flex h-full min-h-[22rem] flex-col rounded-[14px] p-6 md:p-8"
                  data-service-card
                >
                  <span className="flex items-center justify-between">
                    <span className="label">{s.no}</span>
                    <span className="card-arrow grid h-11 w-11 place-items-center rounded-full border border-line-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:bg-bone group-hover:text-ink">
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </span>
                  <h2 className="mt-10 font-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold leading-tight tracking-[-0.03em]">
                    {s.title}
                  </h2>
                  <p className="mt-3 max-w-[30rem] text-mute">{s.text}</p>
                  <p className="label mt-auto pt-10">What you get</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li key={t} className="label rounded-full border border-line px-3 py-1.5 !text-bone/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
