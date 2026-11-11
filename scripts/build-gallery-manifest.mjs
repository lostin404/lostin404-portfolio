// Scans public/gallery and writes src/data/aboutGallery.ts.
// Run with: npm run gallery   (re-run whenever photos are added or removed)
//
// The photos themselves are never touched — this only reads their names and dimensions.
// Hand-written details (title, category, objectPosition) live in OVERRIDES below and are
// keyed by file name, so they survive regeneration.
import sharp from 'sharp'
import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const galleryDir = path.join(root, 'public', 'gallery')
const outFile = path.join(root, 'src', 'data', 'aboutGallery.ts')

const IMAGE = /\.(jpe?g|png|webp|avif)$/i

/** Per-file details: { title, category, alt, objectPosition } — keyed by exact file name */
const OVERRIDES = {
  // Captions and alt text describe what is visible in each photo (checked by eye, not guessed from file names).
  // objectPosition keeps the face in view when the photo is cropped.
  '1770055752365~3.png': {
    title: 'Teal sky, beige sweater',
    category: 'Portrait',
    alt: 'Low-angle portrait of a man in a beige sweater leaning on a ledge against a bright teal wall, looking off to the side',
  },
  '1772594748050~2.png': {
    title: 'Steel lift',
    category: 'Portrait',
    objectPosition: 'center 40%',
    alt: 'A man in a white t-shirt and black trousers leaning on the handrail of a grey steel lift under a skylight',
  },
  '1773808108325~2.png': {
    title: 'Concrete and shadow',
    category: 'Portrait',
    alt: 'Moody portrait of a bearded man in a black coat, head bowed, against a green-grey concrete wall',
  },
  '1776161051326.png': {
    title: 'Wood panel, red jersey',
    category: 'Portrait',
    alt: 'A man in a red, white and black retro football-style jersey standing against a warm wood-panelled wall',
  },
  '1781916206050.png': {
    title: 'Green hoodie',
    category: 'Portrait',
    alt: 'A bearded man in a green hooded sweatshirt and matching joggers, seated and looking at the camera against a grey backdrop',
  },
  '1785277130511~2.png': {
    title: 'Window light',
    category: 'Lifestyle',
    alt: 'A man in a striped shirt and jeans standing beside a tall window with garden greenery outside, looking away from the camera',
  },
  '1787101110865~2.jpg': {
    title: 'Black knit, white wall',
    category: 'Headshot',
    alt: 'Headshot of a smiling bearded man in a black knit sweater against a plain white wall',
  },
  '1787873395738~3.jpg': {
    title: 'Dusk skyline',
    category: 'Portrait',
    alt: 'A man in a pink washed hoodie standing on a rooftop at dusk with power lines and a distant city skyline behind him',
  },
  '1788996841797~2.jpg': {
    title: 'Crows and snow',
    category: 'Cinematic',
    alt: 'Cinematic portrait of a man in a dark coat looking up, with a flock of crows and falling snow in a grey sky',
  },
  '1790948144385.jpg': {
    title: 'Street style',
    category: 'Lifestyle',
    objectPosition: 'center 32%',
    alt: 'A man in dark clothes and sunglasses adjusting his glasses as he walks in front of a parked black car',
  },
  'file_00000000129c71f484861951cfc5dfdf.png': {
    title: 'Studio, green set',
    category: 'Portrait',
    alt: 'Studio portrait of a bearded man in a green hoodie and tracksuit seated on a wooden stool, white trainers on the floor',
  },
  'file_000000006e9c8246af87e0ac813a3626.png': {
    title: 'RELENTLESS poster',
    category: 'Poster design',
    alt: 'Red, black and white poster with a grayscale portrait of a bearded man and the headline RELENTLESS, with the line Control the noise. Own the moment.',
  },
  'file_0000000089688246a5723a0f7d5b0700.png': {
    title: 'Plaid shirt',
    category: 'Lifestyle',
    alt: 'A man in an orange and yellow plaid shirt and light jeans leaning against a ribbed metal wall with plants beside it',
  },
  'file_000000009738720a85c9c3447cc1ccd5.png': {
    title: 'Under the blue',
    category: 'Portrait',
    objectPosition: 'center 92%',
    alt: 'A man in a striped shirt looking up at a deep blue sky, framed low at the bottom of the photo',
  },
  'file_00000000b6f882468bc9103d6df58ba2.png': {
    title: 'Monochrome',
    category: 'Portrait',
    objectPosition: 'center 62%',
    alt: 'Black and white portrait of a bearded man in a black knit sweater with a hard shadow on the wall behind him',
  },
}

const files = (await readdir(galleryDir)).filter((f) => IMAGE.test(f)).sort((a, b) => a.localeCompare(b, 'en'))

const items = []
for (const [i, file] of files.entries()) {
  const { width, height } = await sharp(path.join(galleryDir, file)).metadata()
  const no = String(i + 1).padStart(2, '0')
  const extra = OVERRIDES[file] ?? {}
  items.push({
    id: `photo-${no}`,
    // encodeURI keeps the exact file name while making it a valid URL path
    src: `/gallery/${encodeURI(file)}`,
    file,
    alt: extra.alt ?? `Personal photo ${no} from the LOSTIN404 archive`,
    title: extra.title ?? `Photo ${no}`,
    ...(extra.category ? { category: extra.category } : {}),
    ...(extra.objectPosition ? { objectPosition: extra.objectPosition } : {}),
    width,
    height,
  })
}

const body = `// AUTO-GENERATED by scripts/build-gallery-manifest.mjs — do not edit by hand.
// Source: public/gallery (${items.length} photos). Regenerate with: npm run gallery

export type GalleryPhoto = {
  id: string
  /** public URL path, served as-is from public/gallery */
  src: string
  /** exact file name on disk */
  file: string
  alt: string
  title?: string
  category?: string
  objectPosition?: string
  width: number
  height: number
}

export const aboutGallery: GalleryPhoto[] = ${JSON.stringify(items, null, 2)}
`

await writeFile(outFile, body)
console.log(`aboutGallery.ts written with ${items.length} photos`)
for (const it of items) console.log(`  ${it.id}  ${it.width}x${it.height}  ${it.file}`)
