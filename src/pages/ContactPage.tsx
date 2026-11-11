import { Contact } from '../components/Contact'
import { useSeo } from '../hooks/useSeo'

export default function ContactPage() {
  useSeo(
    'Contact — LOSTIN404',
    'Start a project with LOSTIN404. Email, WhatsApp, Instagram and Pinterest — based in Dubai, available for global projects.',
  )
  return <Contact />
}
