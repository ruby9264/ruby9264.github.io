/**
 * §S05 — four stations, chronological. Copy verbatim from the spec.
 *
 * §12: the hedged figures ("~20%", "30-40%") are kept exactly as written.
 * They are more credible than false precision, and they are honest.
 */

export type Station = {
  role: string
  organisation: string
  period: string
  mode: string
  /** Short label for the timeline marker. */
  year: string
  bullets: string[]
}

export const EXPERIENCE: Station[] = [
  {
    role: 'Digital Media Management Volunteer',
    organisation: 'Art of Living Myanmar',
    period: '2023',
    year: '2023',
    mode: 'In-person & Remote',
    bullets: [
      'Co-designed a structured content calendar and produced assets in Canva, contributing to an estimated 30–40% lift in campaign engagement',
      'Ran ads and built relationships with prospective participants',
      'Expanded reach across 3 multilingual communities (English, Burmese, Hindi) through translation and content writing',
    ],
  },
  {
    role: 'Content Writer & Researcher Volunteer',
    organisation: 'Standfirst Institute',
    period: '2024',
    year: '2024',
    mode: 'Remote',
    bullets: [
      'Delivered 10+ research reports, blog content, and business assets for the Business Development Department, on time, using structured multi-source research',
      'Cut average report length ~20% by restructuring information hierarchy — without losing analytical depth',
    ],
  },
  {
    role: 'Virtual Assistant & Academic Guide',
    organisation: 'Private tutoring clients',
    period: 'Jan 2024 – 2026',
    year: '2024–26',
    mode: 'Online & In-person',
    bullets: [
      'Supported 5+ clients with structured research and academic workflows, reducing per-session prep through standardised research frameworks',
      'Tutored primary, secondary and adult learners in Maths, English and digital skills across state and international curricula, with lesson plans paced to the individual',
      'Cut weekly prep time ~30% by building a reusable digital template library',
    ],
  },
  {
    role: 'Volunteer Coordinator',
    organisation: 'Green Go Environmental Initiative, NMA University',
    period: '2024',
    year: '2024',
    mode: 'In-person',
    bullets: [
      'Coordinated 3 community environmental campaigns reaching 50+ student participants, handling logistics, stakeholder comms, and on-ground execution in a cross-functional team',
    ],
  },
]

export const EXPERIENCE_HEADING = 'Experience'
