/** §S07 — education save-file slots and certifications, verbatim from the spec. */

export type EducationSlot = {
  slot: string
  status: 'IN PROGRESS' | 'COMPLETE'
  title: string
  /** Optional second title line, e.g. the diploma's subject. */
  subtitle?: string
  institution: string
  dates: string
  /** 0-100. Only the in-progress slot carries a bar. */
  progress?: number
}

export const EDUCATION: EducationSlot[] = [
  {
    slot: 'SAVE FILE 01',
    status: 'IN PROGRESS',
    title: 'BSc Business Computing & Information Systems',
    institution: 'Strategy First College — University of Lancashire',
    dates: 'Final year · expected early 2027',
    progress: 80,
  },
  {
    slot: 'SAVE FILE 02',
    status: 'COMPLETE',
    title: 'NCC Level 5 Advanced Diploma',
    subtitle: 'Computing with Business Management',
    institution: 'NMA College, Faculty of Information Technology',
    dates: '2023 – 2025',
  },
  {
    slot: 'SAVE FILE 03',
    status: 'COMPLETE',
    title: 'BA English Literature',
    institution: 'East Yangon University',
    dates: '2022 – 2025',
  },
]

export type Certification = {
  name: string
  provider: string
  year: string
  /** §S07 — ongoing items get a pulsing moss dot. */
  ongoing?: boolean
}

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'AI-Powered Youth Entrepreneurship',
    provider: 'Strategy First International College',
    year: '2026',
  },
  {
    name: 'Essential Skills for Business Careers (CSR)',
    provider: 'Strategy First International College',
    year: '2026',
  },
  { name: 'International Trade Basic Course', provider: 'Trade Training Institute', year: '2026' },
  {
    name: 'BI & Analytics Skill Enhancement',
    provider: 'Self-directed',
    year: '2026 — ongoing',
    ongoing: true,
  },
  { name: 'Crash Course: AI & Machine Learning', provider: 'VIT Chennai, India', year: '2024' },
  {
    name: 'Crash Course: Embedded Systems & IoT Design',
    provider: 'VIT Chennai, India',
    year: '2024',
  },
  { name: 'Youth Leadership & Wellbeing Program', provider: 'Art of Living Myanmar', year: '2023' },
]

export const EDUCATION_HEADING = 'Education & certifications'
export const CERTIFICATIONS_HEADING = 'Certifications'
