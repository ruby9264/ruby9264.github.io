/**
 * §S01 — the station module MOCHI lives on, with the R window from the
 * layout sketch. Whole units on an integer grid, crispEdges, no gradients.
 * Decorative: the hero's meaning is entirely in its text.
 */
export function StationScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 32"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* antenna */}
      <rect x="20" y="0" width="8" height="2" fill="var(--line)" />
      <rect x="21" y="2" width="6" height="2" fill="var(--mochi-helmet)" />
      <rect x="23" y="4" width="2" height="4" fill="var(--line)" />

      {/* solar panels */}
      <rect x="8" y="15" width="4" height="2" fill="var(--line)" />
      <rect x="1" y="9" width="8" height="14" fill="var(--line)" />
      <rect x="2" y="10" width="6" height="12" fill="var(--brand)" />
      <rect x="2" y="13" width="6" height="1" fill="var(--line)" />
      <rect x="2" y="17" width="6" height="1" fill="var(--line)" />

      <rect x="36" y="15" width="4" height="2" fill="var(--line)" />
      <rect x="39" y="9" width="8" height="14" fill="var(--line)" />
      <rect x="40" y="10" width="6" height="12" fill="var(--brand)" />
      <rect x="40" y="13" width="6" height="1" fill="var(--line)" />
      <rect x="40" y="17" width="6" height="1" fill="var(--line)" />

      {/* hull */}
      <rect x="12" y="8" width="24" height="18" fill="var(--line)" />
      <rect x="14" y="10" width="20" height="14" fill="var(--mochi-helmet)" />

      {/* window with the R wordmark */}
      <rect x="18" y="12" width="12" height="10" fill="var(--line)" />
      <rect x="20" y="13" width="8" height="8" fill="var(--mochi-visor)" />
      {/* A 3x5 R: stem, bowl, leg. Drawn as separate strokes rather than
          overlapping blocks — overlapping them turned it into an "A". */}
      <rect x="22" y="14" width="1" height="5" fill="var(--mochi-dark)" />
      <rect x="23" y="14" width="1" height="1" fill="var(--mochi-dark)" />
      <rect x="24" y="15" width="1" height="1" fill="var(--mochi-dark)" />
      <rect x="23" y="16" width="1" height="1" fill="var(--mochi-dark)" />
      <rect x="24" y="17" width="1" height="2" fill="var(--mochi-dark)" />

      {/* landing legs */}
      <rect x="16" y="26" width="2" height="4" fill="var(--line)" />
      <rect x="14" y="30" width="6" height="2" fill="var(--line)" />
      <rect x="30" y="26" width="2" height="4" fill="var(--line)" />
      <rect x="28" y="30" width="6" height="2" fill="var(--line)" />
    </svg>
  )
}
