import { Link } from 'react-router-dom'
import { SocialIcon } from './SocialIcon'
import { brand, nav, socials } from '../data/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden border-t border-line bg-deep">
      <div className="wrap grid gap-10 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <p className="font-display text-2xl font-extrabold tracking-[-0.04em]">{brand.name}</p>
          <p className="mt-3 max-w-[24rem] text-[0.9375rem] text-mute">
            Dubai-based creative professional &amp; design brand. Premium brand visuals, cinematic content, and digital
            experiences.
          </p>
          <p className="label mt-6 flex items-center gap-2.5">
            <span className="h-2 w-2 bg-lime" aria-hidden="true" />
            {brand.signature}
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label mb-4">Navigation</p>
          <ul className="space-y-1">
            {nav.map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="link-underline inline-block py-1.5 text-[0.9375rem]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="label mb-4">Connect</p>
          <ul className="space-y-1 text-[0.9375rem]">
            <li>
              <a href={`mailto:${brand.email}`} className="link-underline inline-block break-all py-1.5">
                {brand.email}
              </a>
            </li>
            <li>
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-block py-1.5"
              >
                WhatsApp {brand.whatsappDisplay}
              </a>
            </li>
            <li className="py-1.5 text-mute">{brand.location}</li>
          </ul>
          <ul className="mt-5 flex gap-2">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-line text-mute transition-colors duration-300 ease-expo hover:border-line-strong hover:text-bone"
                >
                  <SocialIcon id={s.id} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap flex flex-wrap items-center justify-between gap-4 border-t border-line py-5">
        <p className="label">
          © {year} {brand.name}. Crafted with precision.
        </p>
        <button
          type="button"
          className="label link-underline"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top ↑
        </button>
      </div>

      {/* cropped typographic mark over a pixel grid */}
      <div
        aria-hidden="true"
        className="pixel-grid relative h-[clamp(2.4rem,8.2vw,7.4rem)] overflow-hidden border-t border-line"
      >
        <p className="display absolute inset-x-0 top-[-0.06em] select-none whitespace-nowrap text-center text-[clamp(2rem,10.6vw,9.6rem)] font-extrabold leading-none tracking-[-0.05em] text-bone/[0.09]">
          {brand.name}
        </p>
      </div>
    </footer>
  )
}
