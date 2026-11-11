import { PageHeader } from '../components/PageHeader'
import { ServiceCards } from '../components/About'
import { CtaBand } from '../components/CtaBand'
import { useSeo } from '../hooks/useSeo'
import { services } from '../data/site'

export default function ServicesPage() {
  useSeo(
    'Services — LOSTIN404',
    'LOSTIN404 services: web design and development, premium brand visuals, social media management, and UAE business setup assistance.',
  )
  return (
    <>
      <PageHeader
        label="[ Services ]"
        title="What I offer."
        lede="End-to-end creative solutions designed to elevate your brand's presence and drive results."
      >
        <p className="label">{String(services.length).padStart(2, '0')} services — one studio</p>
      </PageHeader>
      <ServiceCards />
      <CtaBand
        label="[ Enquiries ]"
        title="Get a custom quote."
        text="Have a project in mind? Let's connect and bring your vision to life."
        primary={{ label: 'Enquire now', to: '/contact' }}
        secondary={{ label: 'See the work', to: '/work' }}
      />
    </>
  )
}
