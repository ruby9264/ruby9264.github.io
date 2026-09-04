import { cx } from '@/lib/cx'

type WindowChromeProps = {
  title: string
  className?: string
}

/**
 * The 24px title bar used by `.panel--window` (§2.6).
 * The [ _ ][ o ][ x ] glyphs are decoration, not controls — they carry no
 * behaviour, so they are hidden from assistive tech rather than announced
 * as buttons the visitor cannot press.
 */
export function WindowChrome({ title, className }: WindowChromeProps) {
  return (
    <div className={cx('win-chrome', className)}>
      <span className="win-chrome__title">{title}</span>
      <span className="win-chrome__buttons" aria-hidden="true">
        <span className="win-chrome__glyph">_</span>
        <span className="win-chrome__glyph">□</span>
        <span className="win-chrome__glyph">×</span>
      </span>
    </div>
  )
}
