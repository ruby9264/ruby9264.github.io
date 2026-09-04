import type { SVGProps } from 'react'

/**
 * 16px nav glyphs (§4.4). Built from whole 2-unit squares on a 16x16 grid
 * with crispEdges, and drawn as outlines rather than solids with holes — a
 * knocked-out shape would need to know its background, and the nav sits on
 * three different surfaces depending on scroll position.
 */

type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps) {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 16 16',
    width: 16,
    height: 16,
    fill: 'currentColor',
    shapeRendering: 'crispEdges' as const,
    focusable: false,
    'aria-hidden': true,
    ...props,
  }
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="6" y="0" width="4" height="2" />
      <rect x="4" y="2" width="8" height="2" />
      <rect x="2" y="4" width="12" height="2" />
      <rect x="0" y="6" width="16" height="2" />
      <rect x="2" y="8" width="2" height="8" />
      <rect x="12" y="8" width="2" height="8" />
      <rect x="2" y="14" width="12" height="2" />
      <rect x="6" y="10" width="4" height="6" />
    </svg>
  )
}

export function IconAbout(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="6" y="1" width="4" height="4" />
      <rect x="5" y="7" width="6" height="2" />
      <rect x="3" y="9" width="10" height="2" />
      <rect x="2" y="11" width="12" height="4" />
    </svg>
  )
}

export function IconSkills(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="1" y="1" width="6" height="6" />
      <rect x="9" y="1" width="6" height="6" />
      <rect x="1" y="9" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  )
}

export function IconWork(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="6" y="1" width="4" height="2" />
      <rect x="5" y="3" width="6" height="2" />
      <rect x="1" y="5" width="14" height="2" />
      <rect x="1" y="7" width="2" height="8" />
      <rect x="13" y="7" width="2" height="8" />
      <rect x="1" y="13" width="14" height="2" />
      <rect x="7" y="8" width="2" height="4" />
    </svg>
  )
}

export function IconContact(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="1" y="3" width="14" height="2" />
      <rect x="1" y="5" width="2" height="8" />
      <rect x="13" y="5" width="2" height="8" />
      <rect x="1" y="11" width="14" height="2" />
      <rect x="3" y="5" width="2" height="2" />
      <rect x="5" y="7" width="2" height="2" />
      <rect x="7" y="9" width="2" height="2" />
      <rect x="9" y="7" width="2" height="2" />
      <rect x="11" y="5" width="2" height="2" />
    </svg>
  )
}

/**
 * Location pin — before the address in the contact and footer lists.
 * Same 2-unit grid as the other nav glyphs, and the hole is left transparent
 * rather than knocked out, so it needs no knowledge of its background.
 */
export function IconPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="2" width="8" height="2" />
      <rect x="2" y="4" width="12" height="2" />
      <rect x="2" y="6" width="4" height="2" />
      <rect x="10" y="6" width="4" height="2" />
      <rect x="2" y="8" width="12" height="2" />
      <rect x="4" y="10" width="8" height="2" />
      <rect x="6" y="12" width="4" height="2" />
    </svg>
  )
}

/** Document — before the CV download. A page with a folded corner. */
export function IconDoc(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="0" width="8" height="2" />
      <rect x="2" y="0" width="2" height="16" />
      <rect x="12" y="4" width="2" height="12" />
      <rect x="2" y="14" width="12" height="2" />
      {/* folded corner */}
      <rect x="10" y="0" width="2" height="2" />
      <rect x="10" y="2" width="4" height="2" />
      {/* ruled lines */}
      <rect x="5" y="6" width="6" height="2" />
      <rect x="5" y="10" width="6" height="2" />
    </svg>
  )
}

/**
 * LinkedIn — a bordered square holding a lowercase "in".
 * Outline rather than a filled square with a knocked-out mark, so it needs no
 * knowledge of the surface behind it and works in both themes.
 */
export function IconLinkedIn(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="0" y="0" width="16" height="2" />
      <rect x="0" y="14" width="16" height="2" />
      <rect x="0" y="0" width="2" height="16" />
      <rect x="14" y="0" width="2" height="16" />
      {/* i */}
      <rect x="4" y="4" width="2" height="2" />
      <rect x="4" y="8" width="2" height="4" />
      {/* n */}
      <rect x="8" y="8" width="4" height="2" />
      <rect x="8" y="8" width="2" height="4" />
      <rect x="12" y="8" width="1" height="4" />
    </svg>
  )
}

/** GitHub — the cat head, reduced to ears, a ring and two eyes. */
export function IconGitHub(props: IconProps) {
  return (
    <svg {...base(props)}>
      {/* ears */}
      <rect x="2" y="0" width="4" height="2" />
      <rect x="10" y="0" width="4" height="2" />
      {/* head outline */}
      <rect x="2" y="2" width="12" height="2" />
      <rect x="0" y="4" width="2" height="8" />
      <rect x="14" y="4" width="2" height="8" />
      <rect x="2" y="12" width="12" height="2" />
      {/* eyes */}
      <rect x="4" y="6" width="2" height="2" />
      <rect x="10" y="6" width="2" height="2" />
    </svg>
  )
}

/** Settings gear — a hollow ring with four teeth. */
export function IconGear(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="8" height="2" />
      <rect x="4" y="10" width="8" height="2" />
      <rect x="4" y="4" width="2" height="8" />
      <rect x="10" y="4" width="2" height="8" />
      <rect x="6" y="1" width="4" height="2" />
      <rect x="6" y="13" width="4" height="2" />
      <rect x="1" y="6" width="2" height="4" />
      <rect x="13" y="6" width="2" height="4" />
    </svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="2" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="2" y="12" width="2" height="2" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
    </svg>
  )
}

export const NAV_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  home: IconHome,
  about: IconAbout,
  skills: IconSkills,
  work: IconWork,
  contact: IconContact,
}
