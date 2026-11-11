import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Hero } from '../components/Hero'
import { WeightStatement } from '../components/WeightStatement'
import { HorizontalManifesto } from '../components/HorizontalManifesto'
import { Portal } from '../components/Portal'
import { SelectedPreviews } from '../components/Work'
import { CharacterBlurReveal } from '../components/CharacterBlurReveal'
import { CreativeDrops } from '../components/CreativeDrops'
import { CtaBand } from '../components/CtaBand'
import { Reveal } from '../components/Reveal'
import { useSeo } from '../hooks/useSeo'
import { about, brand } from '../data/site'

/** Short introduction — also the breathing room between the two pinned scroll pieces. */
function Intro() {
  return (
    <section className="section bg-ink" aria-labelledby="intro-title">
      <div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label mb-5">[ Introduction ]</p>
          <CharacterBlurReveal
            id="intro-title"
            text="A design brand built in Dubai."
            className="display text-[clamp(2rem,4.6vw,3.75rem)]"
          />
        </div>
        <Reveal className="md:col-span-6 md:col-start-7">
          <p className="text-[clamp(1.125rem,1.8vw,1.375rem)] leading-[1.5] text-bone/90">{about.story}</p>
          <p className="label mt-8">
            {brand.person} — {brand.role}
          </p>
          <Link to="/about" className="btn btn-ghost mt-8">
            About LOSTIN404
            <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

const PAGES = [
  { to: '/work', label: 'Work', note: 'Identity, web and social projects' },
  { to: '/about', label: 'About', note: 'The story, the journey, the toolkit' },
  { to: '/services', label: 'Services', note: 'Web, brand, social and business setup' },
  { to: '/contact', label: 'Contact', note: 'Email, WhatsApp and social' },
]

/** Site index — clear routes into the other pages, and a pause before the portal. */
function Explore() {
  return (
    <section className="section bg-deep" aria-labelledby="explore-title">
      <div className="wrap">
        <p className="label mb-5">[ Explore ]</p>
        <h2 id="explore-title" className="sr-only">
          Explore the site
        </h2>
        <ul className="border-t border-line">
          {PAGES.map((p, i) => (
            <li key={p.to}>
              <Reveal delay={i * 0.06}>
                <Link
                  to={p.to}
                  className="group flex items-center justify-between gap-6 border-b border-line py-6 transition-colors duration-300 hover:border-line-strong md:py-8"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="label">0{i + 1}</span>
                    <span className="display text-[clamp(2rem,6vw,4.5rem)] font-extrabold text-bone/70 transition-colors duration-300 group-hover:text-bone">
                      {p.label}
                    </span>
                  </span>
                  <span className="flex items-center gap-5">
                    <span className="hidden text-sm text-mute md:block">{p.note}</span>
                    <span className="card-arrow grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:bg-bone group-hover:text-ink">
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Home() {
  useSeo('/')
  return (
    <>
      <Hero />
      <WeightStatement />
      <Intro />
      <HorizontalManifesto />
      <Explore />
      <Portal />
      <SelectedPreviews />
      <CreativeDrops />
      <CtaBand
        label="[ Contact ]"
        title="Let's build something cinematic."
        text="Have a project in mind? Let's connect and bring your vision to life."
        primary={{ label: "Let's Connect", to: '/contact' }}
        secondary={{ label: 'View services', to: '/services' }}
      />
    </>
  )
}
