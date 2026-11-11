import { PageHeader } from '../components/PageHeader'
import { AboutStory } from '../components/About'
import { Ribbons } from '../components/Ribbons'
import { Toolkit } from '../components/Toolkit'
import { CtaBand } from '../components/CtaBand'
import { useSeo } from '../hooks/useSeo'
import { brand } from '../data/site'

export default function AboutPage() {
  useSeo(
    'About — LOSTIN404',
    'Suhail Ameer is the Dubai-based creative director and designer behind LOSTIN404 — brand visuals, web design, cinematic content and social strategy.',
  )
  return (
    <>
      <PageHeader
        tone="bone"
        label="[ About ]"
        title="The story so far."
        lede={`${brand.person} — ${brand.role}. ${brand.location}.`}
      />
      <AboutStory />
      <Ribbons />
      <Toolkit />
      <CtaBand
        label="[ Next ]"
        title="See what that looks like in practice."
        primary={{ label: 'View the work', to: '/work' }}
        secondary={{ label: 'Get in touch', to: '/contact' }}
      />
    </>
  )
}
