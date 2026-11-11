import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CharacterBlurReveal } from './CharacterBlurReveal'
import { Reveal } from './Reveal'

type Action = { label: string; to: string }

/** Closing call-to-action used at the foot of the inner pages. */
export function CtaBand({
  label,
  title,
  text,
  primary,
  secondary,
}: {
  label: string
  title: string
  text?: string
  primary: Action
  secondary?: Action
}) {
  return (
    <section className="section border-t border-line bg-deep" aria-label={label}>
      <div className="wrap grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="label mb-5">{label}</p>
          <CharacterBlurReveal
            text={title}
            className="display max-w-[16ch] text-[clamp(2rem,6vw,5rem)] font-extrabold"
          />
          {text && (
            <Reveal>
              <p className="lede mt-5 max-w-[32rem]">{text}</p>
            </Reveal>
          )}
        </div>
        <Reveal className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
          <Link to={primary.to} className="btn btn-primary">
            {primary.label}
            <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
          </Link>
          {secondary && (
            <Link to={secondary.to} className="btn btn-ghost">
              {secondary.label}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  )
}
