import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Container } from './Container'

type SectionProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  id: string
  /** Rendered as the section heading and wired to aria-labelledby (§9). */
  title?: ReactNode
  /** Heading level — the page must never skip a level. */
  headingLevel?: 2 | 3
  /** Visually hide the heading but keep it for the accessibility tree. */
  hideTitle?: boolean
  /** Full-bleed bands opt out of the container cap. */
  bleed?: boolean
  /** Extra breathing room between narrative beats (§2.4). */
  beat?: boolean
  /**
   * Tighter rhythm for reference pages like /styleguide. The §2.4 rhythm
   * paces a narrative; a lookup table just needs to be scannable.
   */
  dense?: boolean
  children: ReactNode
}

/**
 * §2.4 section rhythm: --sp-24 mobile -> --sp-40 desktop.
 * §9 landmarks: every section is labelled by its own heading.
 */
export function Section({
  id,
  title,
  headingLevel = 2,
  hideTitle = false,
  bleed = false,
  beat = false,
  dense = false,
  className,
  children,
  ...rest
}: SectionProps) {
  const headingId = `${id}-title`
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cx(
        dense ? 'py-12 lg:py-16' : 'py-24 lg:py-40',
        !dense && beat && 'lg:pt-40',
        className,
      )}
      {...rest}
    >
      <Container bleed={bleed}>
        {title ? (
          <Heading
            id={headingId}
            className={cx(
              hideTitle && 'sr-only',
              headingLevel === 2
                ? 'font-display text-h2 mb-8'
                : 'font-ui font-bold text-h3 mb-6',
            )}
          >
            {title}
          </Heading>
        ) : null}
        {children}
      </Container>
    </section>
  )
}
