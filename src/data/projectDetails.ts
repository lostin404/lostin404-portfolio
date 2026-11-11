// Structured case-study content for each project page, keyed by project slug.
//
// RULE: only facts already published on this portfolio or visible on the client's live site belong
// here. A section with no entry simply does not render — nothing is padded or invented.
// Still needed from the studio (left empty on purpose until supplied):
//   challenge  — the problem the client brought, in one or two sentences
//   process    — the steps actually taken on this project, as a short list
//   outcomes   — real, verifiable results only (launch date, traffic, enquiries, quotes)

export type ProjectDetails = {
  overview?: string
  challenge?: string
  /** what LOSTIN404 was responsible for */
  role?: string[]
  process?: string[]
  /** the delivered design, described from the live site */
  solution?: string
  deliverables?: string[]
  outcomes?: string[]
}

export const projectDetails: Record<string, ProjectDetails> = {
  'lostin404-branding': {
    overview:
      'The identity for LOSTIN404 itself: a complete system with a poster series, typography experiments and social creatives, shown here in red and black.',
    deliverables: ['Identity system', 'Poster series', 'Typography experiments', 'Social creatives'],
  },
  'lacabite-uae': {
    overview:
      'A website for a premium bakery and Arabic sweets brand in Dubai, with a homepage that leads with the brand and opens into its Dubai collections.',
    role: ['Website design', 'Website development', 'Responsive layout for desktop and mobile'],
    solution:
      'A dark, warm-gold homepage that introduces Lacabite as “Dubai’s atelier of sweet craft”, with two clear next steps — Explore Menu and Get A Quotation — and a running strip of the product ranges. Further down, the Dubai collections are laid out for browsing.',
    deliverables: ['Web design', 'Web development', 'Live website at lacabiteuae.ae'],
  },
  mealskart: {
    overview:
      'A website for a UAE meal service offering South Indian / Kerala-style food. The homepage introduces the service and presents its monthly meal plans.',
    role: ['Website design', 'Website development', 'Responsive layout for desktop and mobile'],
    solution:
      'The homepage opens on the promise “The Taste of Home, Delivered Every Day”, highlights free home delivery, and offers two direct actions: View Meal Plans and Order on WhatsApp. The monthly plans follow in their own section.',
    deliverables: ['Web design', 'Web development', 'Live website at mealskart.ae'],
  },
  'aajel-business': {
    overview:
      'A corporate website for a UAE business-setup consultancy. It presents PRO services, visa and document clearing in one clear, professional layout.',
    role: ['Website design', 'Website development', 'Responsive layout for desktop and mobile'],
    solution:
      'A corporate navy-and-white homepage headed “Business Growth With Expert Consultancy”, summarising company formation, trade licences, visas, document clearing and PRO support, with Start Your Business Setup and Get Free Consultation as the main actions and a WhatsApp shortcut on mobile.',
    deliverables: ['Web design', 'Web development', 'Live website at aajelbusiness.com'],
  },
  'nelta-tech': {
    overview: 'A clean, professional company website. The homepage headline reads “Design. Build. Maintain.”',
    deliverables: ['Web design', 'Web development', 'Live website at neltatech.com'],
  },
  'lostin404-social': {
    overview:
      'Content creation and posting for the LOSTIN404 channels, with a growth focus across Instagram, Pinterest and YouTube.',
    deliverables: ['Content creation', 'Posting strategy', 'Instagram, Pinterest and YouTube'],
  },
}
