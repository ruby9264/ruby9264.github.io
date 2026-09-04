/**
 * §S06 — four projects. Titles, tags, context and overview are verbatim.
 *
 * ⚠ The case study overlay in §S06 is specified as "Problem · My Role ·
 * Process · Outcome · What I'd do differently", but the spec provides no copy
 * for those five headings — only the overview paragraph below. Writing them
 * would mean inventing claims about Ruby's work and her own reflections, so
 * `caseStudy` is left empty and the modal renders the overview instead.
 * Fill any of the five fields in and that section appears. See
 * docs/PHASE-5-NOTES.md.
 */

export type CaseStudy = {
  problem?: string
  role?: string
  process?: string
  outcome?: string
  differently?: string
}

/**
 * A tag is a plain label unless it carries an `href`, in which case it becomes
 * a link to the artefact it names — the Figma prototype for that slice of the
 * work. Tags without one stay non-interactive rather than pretending to be
 * clickable.
 */
export type ProjectTag = { label: string; href?: string }

export type Project = {
  id: string
  title: string
  /** Short line under the title in the card. */
  subtitle: string
  tags: ProjectTag[]
  context: string
  overview: string
  /** Path to a cover image. None exist yet, so every card uses the §S06
   *  fallback: a dither block with the project initial in Silkscreen. */
  cover?: string
  caseStudy?: CaseStudy
}

export const PROJECTS: Project[] = [
  {
    id: 'ecofootprint',
    title: 'EcoFootPrint',
    subtitle: 'Digital Eco-Tourism Platform',
    tags: [
      {
        label: 'UX Research',
        href: 'https://www.figma.com/proto/6DM2osnEMw0IVMFPxTkUjI/EcoFootPrint?node-id=123-94&t=PjBsLwwl7YoEA1Xz-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1',
      },
      {
        label: 'Prototyping',
        href: 'https://www.figma.com/proto/6DM2osnEMw0IVMFPxTkUjI/EcoFootPrint?node-id=300-5885&t=Q79P23MyYphGT2SG-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1',
      },
      { label: 'Design System' },
    ],
    context: 'DEEP Ideation Hackathon · 2026',
    overview:
      'Co-designed an end-to-end web platform tackling booking transparency and environmental preservation in Myanmar tourism. I ran full UX discovery and definition — competitive analysis, SWOT, personas, end-to-end user flows, plus primary research (surveys, interviews) and secondary findings. Built a cohesive design system and interactive high-fidelity prototypes, contributed vibe-coded front-end animation to the shipped product, and ran usability testing to validate the decisions.',
  },
  {
    id: 'infinitygames',
    title: 'InfinityGames',
    subtitle: 'Project Management Dashboard',
    tags: [
      {
        label: 'UI Design',
        href: 'https://www.figma.com/proto/R4kJnmh78PqPtCZ7V0WG9G/Project-Management-Dashboard--Infinity-Games?node-id=0-3&t=WkByrkJnzBxrqb2M-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=0%3A3',
      },
      { label: 'Business Analysis' },
      { label: 'Wireframing' },
    ],
    context: 'Business Analysis Module · 2024–2026',
    overview:
      'Mapped user requirement specifications (HSM) and a rich picture diagram using Soft Systems Methodology, then translated them into structured user flows. Designed the interface components and layout wireframes with a bias toward clean navigation and functional density over decoration.',
  },
  {
    id: 'retail-social',
    title: 'Retail Camping & Social Media Platforms',
    subtitle: 'Responsive front-end and full-stack builds',
    tags: [{ label: 'Front-End' }, { label: 'Full-Stack' }, { label: 'UI/UX' }],
    context: 'Web Development Module · 2023–2026',
    overview:
      'Designed and built responsive interfaces in HTML, CSS and JavaScript — and went full-stack with MySQL and PHP (Laravel) for the social media campaign site. Produced the supporting documentation too: user requirements, data flow diagrams, and ERDs.',
  },
  {
    id: 'relational-databases',
    title: 'Relational Database Designs',
    subtitle: 'Normalised schemas across five business scenarios',
    tags: [{ label: 'Systems Design' }, { label: 'Data Modelling' }, { label: 'Documentation' }],
    context: 'Database Modules · 2024–2026',
    overview:
      'Designed normalised 3NF schemas and EERDs across five business scenarios — game rental, talent recruitment, booking and transport management, and kitchen supply — implemented in MySQL with full CRUD. Produced use-case diagrams, system requirement specs, and stakeholder analysis alongside.',
  },
]

export const WORK_HEADING = 'Selected work'
export const OPEN_CASE_STUDY = 'Open case study'

/** §S06 case study headings, in the spec's order. */
export const CASE_STUDY_SECTIONS: Array<{ key: keyof CaseStudy; heading: string }> = [
  { key: 'problem', heading: 'Problem' },
  { key: 'role', heading: 'My role' },
  { key: 'process', heading: 'Process' },
  { key: 'outcome', heading: 'Outcome' },
  { key: 'differently', heading: "What I'd do differently" },
]
