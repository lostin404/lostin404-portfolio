// Generates public/og-image.png (1200x630) — the social share card.
// Run with: node scripts/make-og-image.mjs
// Brand tokens only (ink / bone / volt / lime); text is rendered with a system bold sans.
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const font = "'Arial Black', 'Segoe UI Black', Arial, sans-serif"
const mono = "'Consolas', 'Courier New', monospace"

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx="18%" cy="85%" r="60%"><stop offset="0" stop-color="#3A29FF" stop-opacity=".55"/><stop offset="1" stop-color="#3A29FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="88%" cy="12%" r="50%"><stop offset="0" stop-color="#5227FF" stop-opacity=".4"/><stop offset="1" stop-color="#5227FF" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0A0C0E"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#EDE7DC" stroke-opacity=".18"/>
  <text x="80" y="108" font-family="${mono}" font-size="22" letter-spacing="4" fill="#9EA5A8">DUBAI, UAE — DESIGN BRAND OF SUHAIL AMEER</text>
  <text x="74" y="370" font-family="${font}" font-size="176" letter-spacing="-8" fill="#EDE7DC">LOSTIN404</text>
  <rect x="80" y="418" width="96" height="8" fill="#BFFF00"/>
  <text x="80" y="492" font-family="${font}" font-size="40" letter-spacing="1" fill="#EDE7DC">FIND YOURSELF IN GLITCH</text>
  <text x="80" y="548" font-family="${mono}" font-size="24" letter-spacing="3" fill="#9EA5A8">BRAND  /  WEB  /  CINEMATIC  /  SOCIAL</text>
</svg>`

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(root, 'public', 'og-image.png'))
console.log('public/og-image.png written (1200x630)')
