import { CharacterBlurReveal } from './CharacterBlurReveal'
import { Reveal } from './Reveal'
import { workflow } from '../data/site'

/** Services page: how an enquiry becomes a finished project, as numbered steps. */
export function WorkingProcess() {
  return (
    <section className="section bg-deep" aria-labelledby="process-title">
      <div className="wrap">
        <p className="label mb-5">[ How I work ]</p>
        <CharacterBlurReveal
          id="process-title"
          text="From first message to launch."
          className="display max-w-[18ch] text-[clamp(2rem,5vw,4rem)] font-extrabold"
        />
        <ol className="mt-12 grid gap-px border border-line bg-line lg:grid-cols-5">
          {workflow.map((s, i) => (
            <li key={s.title} className="bg-deep p-6 md:p-7">
              <Reveal delay={i * 0.06}>
                <span className="label">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-display text-xl font-bold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.55] text-mute">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
