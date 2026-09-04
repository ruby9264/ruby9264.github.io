/**
 * §S09 — "Currently exploring", the band that ships instead of testimonials.
 *
 * §S09's edge case is explicit: "If there are fewer than 2 real testimonials,
 * do not build this section. Placeholder or invented testimonials are actively
 * damaging to credibility." Ruby is early-career and has none, so this is the
 * version that ships. The three topics are the ones the spec names.
 *
 * The spec names the topics but gives no card copy, so rather than invent a
 * voice for them each line states a fact the spec already establishes
 * elsewhere — the ongoing certification, and the two things EcoFootPrint
 * actually involved. Replace them with Ruby's own words whenever she likes.
 *
 * To swap in real quotes later, build S09 proper and drop this band.
 */

export type ExploringCard = {
  title: string
  line: string
}

export const EXPLORING_HEADING = 'Currently exploring'

export const EXPLORING: ExploringCard[] = [
  {
    title: 'BI & Analytics',
    // §S07: "BI & Analytics Skill Enhancement — Self-directed — 2026, ongoing"
    line: 'Self-directed skill enhancement, 2026 — ongoing.',
  },
  {
    title: 'Design systems at scale',
    // §S06: EcoFootPrint — "Built a cohesive design system"
    line: 'Built the design system for EcoFootPrint.',
  },
  {
    title: 'Front-end animation',
    // §S06: EcoFootPrint — "contributed vibe-coded front-end animation to the
    // shipped product"
    line: 'Vibe-coded the front-end animation shipped with EcoFootPrint.',
  },
]
