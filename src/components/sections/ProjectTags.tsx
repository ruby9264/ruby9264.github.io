import { cx } from '@/lib/cx'
import { GlyphExternal } from '@/components/pixel/PixelGlyph'
import type { ProjectTag } from '@/data/projects'

type ProjectTagsProps = {
  tags: ProjectTag[]
  /** Larger targets in the case study overlay, where there is room. */
  size?: 'card' | 'overlay'
  /**
   * The card deck is draggable, and a browser still fires `click` on whatever
   * sat under the pointer when a drag ends. Returning true here swallows that
   * click so finishing a swipe over a tag never navigates away.
   */
  shouldSuppressClick?: () => boolean
  className?: string
}

/**
 * §S06's tag chips. A tag that carries an `href` links to the Figma prototype
 * for that slice of the work; the rest stay plain labels rather than
 * pretending to be clickable.
 */
export function ProjectTags({
  tags,
  size = 'card',
  shouldSuppressClick,
  className,
}: ProjectTagsProps) {
  const pad = size === 'overlay' ? 'px-3 py-2' : 'px-2 py-1'

  return (
    <ul className={cx('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => {
        const chip = cx(
          'hud inline-flex items-center gap-2 border-2 border-[color:var(--line)]',
          'bg-[color:var(--bg-sunken)] text-[color:var(--ink-soft)]',
          pad,
        )

        if (!tag.href) {
          return (
            <li key={tag.label} className={chip}>
              {tag.label}
            </li>
          )
        }

        return (
          <li key={tag.label}>
            <a
              href={tag.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (shouldSuppressClick?.()) e.preventDefault()
              }}
              className={cx(
                chip,
                // §9 — a 44px target even though the chip's own text is small.
                'min-h-[44px] no-underline',
                'hover:bg-[color:var(--brand)] hover:text-[color:var(--on-brand)]',
                'transition-colors duration-100 ease-steps-4',
              )}
            >
              {tag.label}
              <GlyphExternal aria-hidden="true" className="flex-none" />
              {/* The icon is decorative, so the destination is said in words. */}
              <span className="sr-only"> — open the {tag.label} prototype in Figma, in a new tab</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
