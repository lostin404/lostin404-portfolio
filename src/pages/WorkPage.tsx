import { PageHeader } from '../components/PageHeader'
import { ProjectGrid } from '../components/Work'
import { Deck } from '../components/Deck'
import { CtaBand } from '../components/CtaBand'
import { useSeo } from '../hooks/useSeo'
import { projects } from '../data/site'

export default function WorkPage() {
  useSeo('/work')
  return (
    <>
      <PageHeader
        label="[ Work ]"
        title="Work that refuses to blend in."
        lede="Identity systems, live client websites and social content. Filter by discipline, then open any project for the full page."
      >
        <p className="label">{String(projects.length).padStart(2, '0')} projects</p>
      </PageHeader>
      <ProjectGrid />
      <Deck />
      <CtaBand
        label="[ Next ]"
        title="Have a project like these?"
        primary={{ label: 'Start a project', to: '/contact' }}
        secondary={{ label: 'View services', to: '/services' }}
      />
    </>
  )
}
