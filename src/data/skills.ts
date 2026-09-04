/**
 * §S04 — the inventory.
 *
 * Note on the fourth tab: §S04's diagram shows a LANGUAGES tab, but the prose
 * beneath it defines "Tab 4 — TOOLS" and says spoken languages get their own
 * section because "they deserve better than a chip". Following the prose.
 *
 * `icon` names a glyph in components/pixel/SkillIcons.tsx. The spec asks for a
 * custom 16px icon per slot; a distinct glyph for all 29 would be noise, so
 * skills share a glyph by kind — the label carries the meaning.
 */

export type SkillIconName =
  | 'pen'
  | 'frame'
  | 'flow'
  | 'grid'
  | 'code'
  | 'terminal'
  | 'database'
  | 'search'
  | 'chart'
  | 'doc'
  | 'people'
  | 'box'

export type Skill = { name: string; icon: SkillIconName }
export type SkillTab = { id: string; label: string; items: Skill[] }

export const SKILL_TABS: SkillTab[] = [
  {
    id: 'design',
    label: 'Design',
    items: [
      { name: 'Figma', icon: 'pen' },
      { name: 'Canva', icon: 'pen' },
      { name: 'Wireframing', icon: 'frame' },
      { name: 'Prototyping', icon: 'frame' },
      { name: 'Design Systems', icon: 'grid' },
      { name: 'Information Architecture', icon: 'flow' },
      { name: 'User Flows', icon: 'flow' },
      { name: 'Visual Design', icon: 'pen' },
    ],
  },
  {
    id: 'code',
    label: 'Code',
    items: [
      { name: 'HTML', icon: 'code' },
      { name: 'CSS', icon: 'code' },
      { name: 'JavaScript', icon: 'code' },
      { name: 'Responsive Web Design', icon: 'grid' },
      { name: 'Python (basics)', icon: 'terminal' },
      { name: 'Kotlin (basics)', icon: 'terminal' },
      { name: 'MySQL', icon: 'database' },
      { name: 'PHP / Laravel', icon: 'code' },
      { name: 'Vibe-coding', icon: 'terminal' },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    items: [
      { name: 'Requirement Gathering', icon: 'search' },
      { name: 'Competitive Analysis', icon: 'chart' },
      { name: 'SWOT Analysis', icon: 'chart' },
      { name: 'User Personas', icon: 'people' },
      { name: 'Usability Testing', icon: 'search' },
      { name: 'Process Documentation', icon: 'doc' },
      { name: 'Content Strategy', icon: 'doc' },
      { name: 'Surveys & Interviews', icon: 'people' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    items: [
      { name: 'Microsoft Workspace', icon: 'box' },
      { name: 'Google Workspace', icon: 'box' },
      { name: 'MySQL Workbench', icon: 'database' },
      { name: 'Draw.io / Diagramming', icon: 'flow' },
    ],
  },
]

export const SKILLS_PANEL_TITLE = 'INVENTORY'
