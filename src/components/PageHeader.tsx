import type { ReactNode } from 'react'
import { CharacterBlurReveal } from './CharacterBlurReveal'
import { Reveal } from './Reveal'

/** Shared opening block for the inner pages: mono label, blur-revealed H1, short lede. */
export function PageHeader({
  label,
  title,
  lede,
  tone = 'dark',
  children,
}: {
  label: string
  title: string
  lede?: string
  tone?: 'dark' | 'bone'
  children?: ReactNode
}) {
  const bone = tone === 'bone'
  return (
    <header className={`${bone ? 'bg-bone text-ink' : 'bg-ink'} pt-32 md:pt-44`}>
      <div className="wrap">
        <p className={`label mb-5 ${bone ? '!text-ink/60' : ''}`}>{label}</p>
        <CharacterBlurReveal
          as="h1"
          text={title}
          delay={0.25}
          className="display max-w-[15ch] text-[clamp(2.5rem,8.4vw,7.5rem)] font-extrabold"
        />
        {(lede || children) && (
          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
            {lede && (
              <Reveal className="md:col-span-6" delay={0.2}>
                <p className={`lede ${bone ? '!text-ink/70' : ''}`}>{lede}</p>
              </Reveal>
            )}
            {children && <div className="md:col-span-6 md:justify-self-end">{children}</div>}
          </div>
        )}
      </div>
    </header>
  )
}
