import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { CharacterBlurReveal } from './CharacterBlurReveal'
import { Reveal } from './Reveal'
import { SocialIcon } from './SocialIcon'
import { brand, socials } from '../data/site'

export function Contact() {
  return (
    <section className="bg-ink pb-[var(--section-y)] pt-32 md:pt-44" aria-labelledby="contact-title">
      <div className="wrap">
        <p className="label mb-6 flex items-center gap-2.5">
          <span className="status-dot" aria-hidden="true" />[ Contact ] — Available for work
        </p>
        <CharacterBlurReveal
          as="h1"
          id="contact-title"
          text="Let's build something cinematic."
          delay={0.25}
          className="display max-w-[14ch] text-[clamp(2.5rem,8.2vw,7.5rem)] font-extrabold"
        />

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-6">
            <p className="font-display text-xl font-semibold tracking-[-0.02em]">{brand.slogan}.</p>
            <p className="lede mt-3 max-w-[30rem]">
              Have a project in mind? Let's connect and bring your vision to life.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${brand.email}`} className="btn btn-primary">
                Let's Connect
                <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
              </a>
              <Link to="/work" className="btn btn-ghost">
                Explore Work
              </Link>
            </div>
          </Reveal>

          <Reveal className="md:col-span-6" delay={0.08}>
            <ul className="border-t border-line">
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="group flex min-h-16 items-center justify-between gap-4 border-b border-line py-4"
                >
                  <span className="flex items-center gap-4">
                    <Mail size={18} strokeWidth={1.5} className="text-mute" aria-hidden="true" />
                    <span>
                      <span className="label block">Email — replies within 24 hours</span>
                      <span className="link-underline break-all font-medium">{brand.email}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-mute transition-transform duration-300 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li>
                <a
                  href={brand.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-16 items-center justify-between gap-4 border-b border-line py-4"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-mute">
                      <SocialIcon id="whatsapp" size={18} />
                    </span>
                    <span>
                      <span className="label block">WhatsApp — quick consultations</span>
                      <span className="link-underline font-medium">{brand.whatsappDisplay}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-mute transition-transform duration-300 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li className="flex min-h-16 items-center gap-4 border-b border-line py-4">
                <MapPin size={18} strokeWidth={1.5} className="text-mute" aria-hidden="true" />
                <span>
                  <span className="label block">Location</span>
                  <span className="font-medium">{brand.location} — available for global projects</span>
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        {/* Follow — verified accounts only */}
        <div className="mt-20 md:mt-28">
          <div className="mb-6 flex items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.03em]">
              Follow the work
            </h2>
            <p className="label hidden sm:block">Instagram · Pinterest · Spotify</p>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {socials.map((s, i) => (
              <li key={s.id}>
                <Reveal delay={i * 0.07} className="h-full">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} — ${s.handle} (opens in a new tab)`}
                    className="group flex h-full flex-col rounded-[14px] border border-line bg-panel p-5 transition-colors duration-300 ease-expo hover:border-line-strong hover:bg-raised"
                  >
                    <span className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-raised transition-colors duration-300 group-hover:border-volt-2 group-hover:bg-volt">
                        <SocialIcon id={s.id} />
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="text-mute transition-transform duration-300 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-8 font-display text-xl font-bold tracking-[-0.03em]">{s.label}</span>
                    <span className="label mt-1 normal-case tracking-[0.04em]">{s.handle}</span>
                    <span className="mt-3 text-sm text-mute">{s.note}</span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
