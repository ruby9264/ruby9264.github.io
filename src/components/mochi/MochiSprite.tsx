import { useMemo } from 'react'
import {
  ACCESSORIES,
  ARMS,
  ART_H,
  ART_W,
  BODY,
  EARS,
  EYES,
  LEGS,
  PALETTE,
  layersToRects,
  type Accessory,
  type ArmPose,
  type EarPose,
  type EyePose,
  type LegPose,
} from './pixelMaps'

export type MochiPose = {
  ears?: EarPose
  eyes?: EyePose
  arms?: ArmPose
  legs?: LegPose
  accessory?: Accessory
}

type MochiSpriteProps = MochiPose & {
  /** Rendered width in px. Multiples of 24 stay perfectly square-aligned. */
  size?: number
  className?: string
  /**
   * MOCHI is decoration in every placement — the meaning is always carried by
   * nearby text or by the speech bubble. So the sprite is hidden from assistive
   * tech unless a caller has a genuine reason to name it.
   */
  title?: string
}

export function MochiSprite({
  ears = 'normal',
  eyes = 'open',
  arms = 'rest',
  legs = 'stand',
  accessory = 'none',
  size = 72,
  className,
  title,
}: MochiSpriteProps) {
  const rects = useMemo(
    () =>
      layersToRects([
        EARS[ears],
        BODY,
        LEGS[legs],
        EYES[eyes],
        ARMS[arms],
        ACCESSORIES[accessory],
      ]),
    [ears, eyes, arms, legs, accessory],
  )

  return (
    <svg
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      width={size}
      height={(size / ART_W) * ART_H}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
    >
      {title ? <title>{title}</title> : null}
      {rects.map((r) => (
        <rect
          key={`${r.y}-${r.x}-${r.ch}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={1}
          fill={PALETTE[r.ch]}
        />
      ))}
    </svg>
  )
}
