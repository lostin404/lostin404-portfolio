import { CharacterBlurReveal } from './CharacterBlurReveal'
import { Reveal } from './Reveal'
import { ElasticGallery } from './ui/elastic-gallery'
import { aboutGallery } from '../data/aboutGallery'

/** About page — "Beyond the Frame": the personal photo archive as an elastic accordion. */
export function AboutGallery() {
  return (
    <section className="section overflow-x-clip bg-ink" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="label mb-4">[ Personal archive ]</p>
            <CharacterBlurReveal
              id="gallery-title"
              text="BEYOND THE FRAME"
              className="display text-[clamp(2rem,6.4vw,5.25rem)] font-extrabold"
            />
          </div>
          <p className="label tabular-nums">{String(aboutGallery.length).padStart(2, '0')} photographs</p>
        </div>

        <Reveal>
          <ElasticGallery photos={aboutGallery} />
        </Reveal>
      </div>
    </section>
  )
}
