import { Contact } from '../components/Contact'
import { useSeo } from '../hooks/useSeo'

export default function ContactPage() {
  useSeo('/contact')
  return <Contact />
}
