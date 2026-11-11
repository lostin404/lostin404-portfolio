// Converts the original artwork in src/assets/raw into web-sized WebP files in src/assets/img.
// Run with: npm run images
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const rawDir = path.join(root, 'src', 'assets', 'raw')
const outDir = path.join(root, 'src', 'assets', 'img')

// Lovable appended build hashes to some file names; map every source to a clean name.
const cleanName = (file) =>
  file
    .replace(/\.(jpe?g|png)$/i, '')
    .replace(/^(gallery-\d|feed-\d|project-[a-z]+).*$/, '$1')

await mkdir(outDir, { recursive: true })

for (const file of await readdir(rawDir)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue
  const out = path.join(outDir, `${cleanName(file)}.webp`)
  const info = await sharp(path.join(rawDir, file))
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out)
  console.log(`${file} -> ${path.basename(out)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}kB`)
}
