// Single source of truth for LOSTIN404 content.
// Everything here comes from the existing portfolio (lostin404.lovable.app) — nothing is invented.
import projectBranding from '../assets/img/project-branding.webp'
import lacabite1 from '../assets/img/site-lacabite-1.webp'
import lacabite2 from '../assets/img/site-lacabite-2.webp'
import mealskart1 from '../assets/img/site-mealskart-1.webp'
import mealskart2 from '../assets/img/site-mealskart-2.webp'
import aajel1 from '../assets/img/site-aajel-1.webp'
import aajel2 from '../assets/img/site-aajel-2.webp'
import nelta1 from '../assets/img/site-nelta-1.webp'
import projectSocial from '../assets/img/project-social.webp'
import gallery1 from '../assets/img/gallery-1.webp'
import gallery2 from '../assets/img/gallery-2.webp'
import gallery3 from '../assets/img/gallery-3.webp'
import gallery4 from '../assets/img/gallery-4.webp'
import gallery5 from '../assets/img/gallery-5.webp'
import gallery6 from '../assets/img/gallery-6.webp'
import portrait from '../assets/img/feed-1.webp'

/** `position` sets object-position when the image is cropped (used for site screenshots). */
export type Img = { src: string; alt: string; w: number; h: number; position?: string }

export const brand = {
  name: 'LOSTIN404',
  slogan: 'FIND YOURSELF IN GLITCH',
  signature: 'BEYOND_404',
  person: 'Suhail Ameer',
  role: 'Creative Director & Designer',
  location: 'Dubai, UAE',
  intro:
    'Dubai-based creative professional and design brand — premium brand visuals, cinematic content, web experiences and social media strategy for brands that refuse to blend in.',
  email: 'lostin404ae@gmail.com',
  /** WhatsApp in international format without '+', as wa.me expects */
  whatsappNumber: '971581598055',
  whatsappDisplay: '+971 58 159 8055',
  whatsappUrl: 'https://wa.me/971581598055',
  founded: 2023,
}

export const socials = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@lostin___404',
    url: 'https://www.instagram.com/lostin___404',
    note: 'Edits, posters and work in progress',
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    handle: '@lost_in404',
    url: 'https://www.pinterest.com/lost_in404/',
    note: 'Boards, references and visual research',
  },
  {
    id: 'spotify',
    label: 'Spotify',
    handle: 'Studio playlist',
    url: 'https://open.spotify.com/playlist/42sNIpZAmqJMUsQkGiqIdp',
    note: 'What plays while the work gets made',
  },
] as const

export type Project = {
  slug: string
  title: string
  category: string
  discipline: string
  summary: string
  cover?: Img
  gallery: Img[]
  url?: string
  domain?: string
}

export const projects: Project[] = [
  {
    slug: 'lostin404-branding',
    title: 'LOSTIN404 Branding',
    category: 'Identity',
    discipline: 'Premium Brand Visuals',
    summary: 'Complete identity system with poster series, typography experiments and social creatives.',
    cover: { src: projectBranding, alt: 'LOSTIN404 brand identity stationery on a dark surface', w: 640, h: 512 },
    gallery: [
      { src: gallery2, alt: 'Brand identity system — red and black business cards', w: 1024, h: 1024 },
      { src: gallery5, alt: 'Typography poster experiment in red and white', w: 1024, h: 1024 },
    ],
  },
  {
    slug: 'lacabite-uae',
    title: 'LACABITE UAE',
    category: 'Web',
    discipline: 'Web Design & Development',
    summary: 'A premium bakery and Arabic sweets website with a clean, elegant, brand-focused experience.',
    cover: {
      src: lacabite1,
      alt: 'Lacabite homepage — Premium Bakery and Sweets in Dubai',
      w: 1400,
      h: 706,
      position: 'left top',
    },
    gallery: [
      {
        src: lacabite2,
        alt: 'Lacabite homepage — Explore Our Dubai Collections section',
        w: 1400,
        h: 706,
        position: 'left top',
      },
    ],
    url: 'https://lacabiteuae.ae/',
    domain: 'lacabiteuae.ae',
  },
  {
    slug: 'mealskart',
    title: 'MealsKart',
    category: 'Food',
    discipline: 'Web Design & Development',
    summary: 'A modern UAE food and meal plan website designed for South Indian / Kerala-style meal services.',
    cover: {
      src: mealskart1,
      alt: 'MealsKart homepage — The Taste of Home, Delivered Every Day',
      w: 1260,
      h: 637,
      position: 'left top',
    },
    gallery: [
      {
        src: mealskart2,
        alt: 'MealsKart homepage — monthly meal plans section',
        w: 1260,
        h: 637,
        position: 'left top',
      },
    ],
    url: 'https://www.mealskart.ae/',
    domain: 'mealskart.ae',
  },
  {
    slug: 'aajel-business',
    title: 'AAJEL Business',
    category: 'Business',
    discipline: 'Web Design & Development',
    summary: 'A corporate website for UAE business setup, PRO services, visa and document clearing services.',
    cover: {
      src: aajel1,
      alt: 'AAJEL homepage — Business Growth With Expert Consultancy',
      w: 1400,
      h: 706,
      position: 'left top',
    },
    gallery: [
      {
        src: aajel2,
        alt: 'AAJEL homepage — UAE business setup and PRO services section',
        w: 1400,
        h: 706,
        position: 'left top',
      },
    ],
    url: 'https://aajelbusiness.com/',
    domain: 'aajelbusiness.com',
  },
  {
    slug: 'nelta-tech',
    title: 'Nelta Tech',
    category: 'Tech',
    discipline: 'Web Design & Development',
    summary: 'A clean and professional website for a technology-focused company.',
    cover: {
      src: nelta1,
      alt: 'Nelta Tech homepage — Design. Build. Maintain.',
      w: 1260,
      h: 637,
      position: 'left top',
    },
    gallery: [],
    url: 'https://neltatech.com/',
    domain: 'neltatech.com',
  },
  {
    slug: 'lostin404-social',
    title: 'LOSTIN404 Social',
    category: 'Social',
    discipline: 'Social Media Management',
    summary: 'Growth-focused content creation for Instagram, Pinterest and YouTube.',
    cover: { src: projectSocial, alt: 'Social media feeds displayed on three phones', w: 640, h: 512 },
    gallery: [{ src: gallery6, alt: 'Social media kit — phones and stationery in red and black', w: 1024, h: 1024 }],
    url: 'https://www.instagram.com/lostin___404',
    domain: 'instagram.com/lostin___404',
  },
]

/** The portal opens onto this project. */
export const featuredProject = projects[0]

/** Visual archive — shown as the throwable deck. */
export const archive: { title: string; category: string; image: Img }[] = [
  {
    title: 'Typography Poster',
    category: 'Typography',
    image: { src: gallery5, alt: 'Typography poster in red and white on charcoal', w: 1024, h: 1024 },
  },
  {
    title: 'Cinematic Portrait',
    category: 'Cinematic',
    image: { src: gallery1, alt: 'Portrait lit in deep red light', w: 1024, h: 1024 },
  },
  {
    title: 'Brand Identity System',
    category: 'Branding',
    image: { src: gallery2, alt: 'Red and black business card set', w: 1024, h: 1024 },
  },
  {
    title: 'Web Experience Design',
    category: 'Web Design',
    image: { src: gallery3, alt: 'Website design on a laptop at a dark desk', w: 1024, h: 1024 },
  },
  {
    title: 'Dubai Nightscape',
    category: 'Photo Edits',
    image: { src: gallery4, alt: 'Dubai skyline at night with red-lit towers', w: 1024, h: 1024 },
  },
  {
    title: 'Social Media Kit',
    category: 'Social Media',
    image: { src: gallery6, alt: 'Social media kit with phones and red stationery', w: 1024, h: 1024 },
  },
]

export const services = [
  {
    no: '01',
    title: 'Web Design & Development',
    text: 'Modern responsive websites, portfolio sites, business websites. Fast, clean, and built to perform.',
    tags: ['Custom Design', 'Responsive Build', 'SEO Optimized', 'Fast Loading'],
  },
  {
    no: '02',
    title: 'Premium Brand Visuals',
    text: 'Logos, posters, mockups, and high-end visual identity assets that define your brand.',
    tags: ['Logo Design', 'Brand Identity', 'Print Design', 'Mockups'],
  },
  {
    no: '03',
    title: 'Social Media Management',
    text: 'Content creation, optimization, posting strategy for Instagram, Pinterest & YouTube.',
    tags: ['Content Creation', 'Growth Strategy', 'Analytics', 'Community'],
  },
  {
    no: '04',
    title: 'Business Setup Services',
    text: 'Document clearing and business setup assistance for UAE-based ventures.',
    tags: ['Trade License', 'Document Clearing', 'PRO Services', 'Consultation'],
  },
]

export const about = {
  portrait: { src: portrait, alt: 'Suhail Ameer seated on a wall against a clear blue sky', w: 1173, h: 1286 } as Img,
  story:
    "I'm a Dubai-based creative professional and design brand specializing in premium brand visuals, cinematic content, web design, and social media strategy. Every project is crafted with a sharp eye for detail and a passion for bold, cinematic storytelling.",
  philosophy:
    "Bold visuals. Cinematic storytelling. Strong typography. Performance-driven content that doesn't just look premium — it converts. Every pixel, every frame, every word is deliberate.",
  facts: [
    { k: 'Experience', v: '3 years at Claygraphik Agency, UAE' },
    { k: 'Education', v: 'B.Com + Intl. School of Accounting' },
    { k: 'Specialties', v: 'Brand, Web, Cinema, Social' },
    { k: 'Based in', v: 'Dubai, UAE — available for global projects' },
  ],
  journey: [
    { year: '2021', title: 'Started Web Development', text: 'Began professional journey at Claygraphik Agency, UAE' },
    { year: '2022', title: 'Brand Design Expansion', text: 'Expanded into premium brand visuals and identity systems' },
    {
      year: '2023',
      title: 'LOSTIN404 Founded',
      text: 'Launched personal design brand, offering full creative services',
    },
    {
      year: '2024',
      title: 'Cinematic Content',
      text: 'Added cinematic photography & videography to the creative arsenal',
    },
  ],
}

/** Disciplines listed across the existing site — row one / row two of the toolkit carousel. */
export const toolkit: { label: string; icon: string }[][] = [
  [
    { label: 'Brand Identity', icon: 'fingerprint' },
    { label: 'Logo Design', icon: 'pen-tool' },
    { label: 'Typography', icon: 'type' },
    { label: 'Poster Design', icon: 'frame' },
    { label: 'Print Design', icon: 'printer' },
    { label: 'Mockups', icon: 'box' },
    { label: 'Web Design', icon: 'layout' },
    { label: 'Responsive Build', icon: 'smartphone' },
    { label: 'SEO', icon: 'search' },
  ],
  [
    { label: 'Cinematic Photography', icon: 'camera' },
    { label: 'Videography', icon: 'clapperboard' },
    { label: 'Photo Editing', icon: 'sliders' },
    { label: 'Content Creation', icon: 'sparkles' },
    { label: 'Social Strategy', icon: 'share' },
    { label: 'Growth Strategy', icon: 'trending-up' },
    { label: 'Analytics', icon: 'bar-chart' },
    { label: 'Community', icon: 'users' },
    { label: 'Performance', icon: 'gauge' },
  ],
]

export const nav = [
  { label: 'Home', path: '/' },
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
]
