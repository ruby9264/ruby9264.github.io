/** §S03 — copy verbatim from the spec. */

export const ABOUT = {
  heading: 'Design, but make it human',
  panelTitle: 'about.txt',
  body: [
    'I’m a UI/UX designer and research analyst who came to design through English literature, business computing, and a lot of curiosity about why people give up on interfaces.',
    'My work runs the whole cycle — competitive analysis, personas, user flows, high-fidelity prototypes, usability testing — grounded in the Design Thinking process. I care most about the unglamorous parts: information architecture that doesn’t need explaining, and copy that tells you what just happened.',
    'Outside of design I tutor, translate across three languages, and reorganise things that don’t need reorganising. I’m happiest helping people find the shorter path.',
  ],
} as const

export type ProcessStage = {
  number: string
  stage: string
  line: string
}

/**
 * §S03 — "This IS a genuine sequence, so numbered markers are appropriate
 * here (unlike elsewhere)."
 */
export const PROCESS: ProcessStage[] = [
  { number: '01', stage: 'Empathise', line: 'Talk to people. Read the room. Collect the messy truth.' },
  { number: '02', stage: 'Define', line: 'Turn noise into one clear problem statement.' },
  {
    number: '03',
    stage: 'Ideate & Prototype',
    line: 'Sketch fast, build in Figma, break it early.',
  },
  { number: '04', stage: 'Test & Refine', line: 'Watch someone use it. Fix what I got wrong.' },
]

export const PROCESS_HEADING = 'How I work'
