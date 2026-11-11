import { PageHeader } from '../components/PageHeader'
import { AboutStory } from '../components/About'
import { AboutGallery } from '../components/AboutGallery'
import { Ribbons } from '../components/Ribbons'
import { Toolkit } from '../components/Toolkit'
import { CtaBand } from '../components/CtaBand'
import { useSeo } from '../hooks/useSeo'
import { brand } from '../data/site'

export default function AboutPage() {
  useSeo('/about')
  return (
    <>
      <PageHeader
        tone="bone"
        label="[ About ]"
        title="The story so far."
        lede={`${brand.person} — ${brand.role}. ${brand.location}.`}
      />
      <AboutStory />
      <AboutGallery />
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
