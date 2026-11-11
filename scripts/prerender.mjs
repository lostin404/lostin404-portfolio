// Post-build step (runs after `vite build`): writes a static HTML file per route with that route's
// own title, description, canonical, Open Graph / Twitter tags and JSON-LD, plus sitemap.xml.
//
// Why: the site is a client-rendered SPA, so crawlers and link-preview bots that do not run
// JavaScript would otherwise see the home page's metadata for every URL. Netlify serves a real
// file before applying the SPA fallback, so dist/work/index.html answers /work, and so on.
// The React app still boots normally on top and keeps the metadata current via useSeo.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, canonical, jsonLdFor, metaFor, routes } from '../src/seo/meta.js'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const template = await readFile(path.join(dist, 'index.html'), 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Replace the first match of `re`, failing loudly if the template changed and nothing matched. */
function swap(html, re, replacement) {
  if (!re.test(html)) throw new Error(`prerender: pattern not found in dist/index.html: ${re}`)
  return html.replace(re, () => replacement)
}

function render(route) {
  const m = metaFor(route)
  const url = canonical(route)
  let html = template
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`)
  html = swap(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(m.description)}" />`)
  html = swap(html, /<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${esc(m.title)}" />`)
  html = swap(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${esc(m.description)}" />`)
  html = swap(html, /<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${url}" />`)
  html = swap(html, /<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${esc(m.title)}" />`)
  html = swap(html, /<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${esc(m.description)}" />`)
  html = swap(html, /<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${url}" />`)
  const ld = jsonLdFor(route)
    .map((o) => `    <script type="application/ld+json" data-seo-jsonld>${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n')
  html = swap(html, /<\/head>/, `${ld}\n  </head>`)
  // no-JavaScript fallback text for this route
  html = swap(
    html,
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript>
      <div style="padding: 48px 24px; font-family: system-ui, sans-serif; color: #ede7dc; background: #0a0c0e">
        <h1>${esc(m.heading)}</h1>
        <p>${esc(m.description)}</p>
        <p>Email: lostin404ae@gmail.com · Instagram: instagram.com/lostin___404</p>
      </div>
    </noscript>`,
  )
  return html
}

let written = 0
for (const route of routes) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html')
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, render(route))
  written++
}

const today = new Date().toISOString().slice(0, 10)
const priority = (r) => (r === '/' ? '1.0' : r.startsWith('/work/') ? '0.6' : '0.8')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url>\n    <loc>${canonical(r)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority(r)}</priority>\n  </url>`).join('\n')}
</urlset>
`
await writeFile(path.join(dist, 'sitemap.xml'), sitemap)
console.log(`prerender: ${written} route files + sitemap.xml (${routes.length} URLs) for ${SITE_URL}`)
