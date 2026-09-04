/**
 * §4.4 — "Skip to main content", visually hidden until focused, and the first
 * tabbable element on the page. Non-negotiable, so it lives in the layout
 * rather than in each route.
 */
export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to main content
    </a>
  )
}
