// Single source for page metadata. Read by the app (src/hooks/useSeo.ts) AND by the
// post-build step (scripts/prerender.mjs), so crawlers and visitors see the same text.
// Plain JS on purpose: Node can import it directly without a TypeScript build.

export const SITE_URL = 'https://lostin404space.netlify.app'
export const SITE_NAME = 'LOSTIN404'
export const OG_IMAGE = `${SITE_URL}/og-image.png`

const SOCIALS = [
  'https://www.instagram.com/lostin___404',
  'https://www.pinterest.com/lost_in404/',
  'https://open.spotify.com/playlist/42sNIpZAmqJMUsQkGiqIdp',
]

export const pages = {
  '/': {
    title: 'LOSTIN404 — Find Yourself in Glitch',
    description:
      'LOSTIN404 is the Dubai-based design brand of Suhail Ameer — premium brand visuals, cinematic content, web experiences and social media strategy.',
    heading: 'LOSTIN404',
  },
  '/work': {
    title: 'Work — LOSTIN404',
    description:
      'Selected LOSTIN404 projects: brand identity, live client websites for LACABITE UAE, MealsKart, AAJEL Business and Nelta Tech, and social content.',
    heading: 'Work that refuses to blend in.',
  },
  '/about': {
    title: 'About — LOSTIN404',
    description:
      'Suhail Ameer is the Dubai-based creative director and designer behind LOSTIN404 — brand visuals, web design, cinematic content and social strategy.',
    heading: 'The story so far.',
  },
  '/services': {
    title: 'Services — LOSTIN404',
    description:
      'LOSTIN404 services: web design and development, premium brand visuals, social media management, and UAE business setup assistance.',
    heading: 'What I offer.',
  },
  '/contact': {
    title: 'Contact — LOSTIN404',
    description:
      'Start a project with LOSTIN404. Email, WhatsApp, Instagram and Pinterest — based in Dubai, available for global projects.',
    heading: "Let's build something cinematic.",
  },
}

/** Project pages. Titles and descriptions mirror the summaries in src/data/site.ts. */
export const projectMeta = {
  'lostin404-branding': {
    title: 'LOSTIN404 Branding',
    description: 'Complete identity system with poster series, typography experiments and social creatives.',
  },
  'lacabite-uae': {
    title: 'LACABITE UAE',
    description: 'A premium bakery and Arabic sweets website with a clean, elegant, brand-focused experience.',
    url: 'https://lacabiteuae.ae/',
  },
  mealskart: {
    title: 'MealsKart',
    description: 'A modern UAE food and meal plan website designed for South Indian / Kerala-style meal services.',
    url: 'https://www.mealskart.ae/',
  },
  'aajel-business': {
    title: 'AAJEL Business',
    description: 'A corporate website for UAE business setup, PRO services, visa and document clearing services.',
    url: 'https://aajelbusiness.com/',
  },
  'nelta-tech': {
    title: 'Nelta Tech',
    description: 'A clean and professional website for a technology-focused company.',
    url: 'https://neltatech.com/',
  },
  'lostin404-social': {
    title: 'LOSTIN404 Social',
    description: 'Growth-focused content creation for Instagram, Pinterest and YouTube.',
    url: 'https://www.instagram.com/lostin___404',
  },
}

export const routes = [...Object.keys(pages), ...Object.keys(projectMeta).map((s) => `/work/${s}`)]

export const canonical = (path) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`)

/** Resolve title / description for any known route; undefined for unknown routes. */
export function metaFor(path) {
  if (pages[path]) return { path, ...pages[path] }
  const m = path.match(/^\/work\/([^/]+)$/)
  const p = m && projectMeta[m[1]]
  if (p) return { path, title: `${p.title} — ${SITE_NAME}`, description: p.description, heading: p.title, project: p }
  return undefined
}

const address = { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' }

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Suhail Ameer',
  jobTitle: 'Creative Director & Designer',
  url: `${SITE_URL}/`,
  sameAs: SOCIALS,
  address,
  worksFor: { '@id': `${SITE_URL}/#brand` },
}

const brand = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#brand`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.svg`,
  image: OG_IMAGE,
  slogan: 'Find yourself in glitch',
  founder: { '@id': `${SITE_URL}/#person` },
  sameAs: SOCIALS,
  address,
}

const crumb = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: canonical(path),
  })),
})

/** Structured data for a route, as an array of JSON-LD objects. Only facts already on the site. */
export function jsonLdFor(path) {
  const m = metaFor(path)
  if (!m) return []
  const ctx = { '@context': 'https://schema.org' }
  if (path === '/')
    return [
      {
        ...ctx,
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: SITE_NAME,
            publisher: { '@id': `${SITE_URL}/#brand` },
          },
          brand,
          person,
        ],
      },
    ]
  if (path === '/about')
    return [
      { ...ctx, '@type': 'AboutPage', url: canonical(path), name: m.title, mainEntity: person },
      { ...ctx, ...crumb([['Home', '/'], ['About', path]]) },
    ]
  if (path === '/contact')
    return [
      { ...ctx, '@type': 'ContactPage', url: canonical(path), name: m.title, about: brand },
      { ...ctx, ...crumb([['Home', '/'], ['Contact', path]]) },
    ]
  if (path === '/work') return [{ ...ctx, ...crumb([['Home', '/'], ['Work', path]]) }]
  if (path === '/services') return [{ ...ctx, ...crumb([['Home', '/'], ['Services', path]]) }]
  if (m.project)
    return [
      {
        ...ctx,
        '@type': 'CreativeWork',
        name: m.project.title,
        description: m.project.description,
        url: canonical(path),
        creator: { '@id': `${SITE_URL}/#person` },
        ...(m.project.url ? { sameAs: m.project.url } : {}),
      },
      { ...ctx, ...crumb([['Home', '/'], ['Work', '/work'], [m.project.title, path]]) },
    ]
  return []
}
