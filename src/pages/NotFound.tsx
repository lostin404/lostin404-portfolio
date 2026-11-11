import { Link } from 'react-router-dom'
import { ClipReveal } from '../components/ClipReveal'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  useSeo('/404', { noindex: true })
  return (
    <section className="grid min-h-[100svh] place-items-center bg-deep px-6 text-center">
      <div>
        <p className="label mb-6">Error — page not found</p>
        <ClipReveal
          as="h1"
          text="404"
          className="display text-[clamp(6rem,30vw,20rem)] font-extrabold leading-[0.85]"
          stagger={70}
        />
        <p className="lede mx-auto mt-6 max-w-[26rem]">
          You found the glitch. This page doesn't exist — the work does.
        </p>
        <Link to="/work" className="btn btn-primary mt-8">
          Explore Work
        </Link>
      </div>
    </section>
  )
}
