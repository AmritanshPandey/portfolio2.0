import type { ComponentType } from "react"

import {
  DottedGlowBackground,
  DottedGravityBackground,
  ConstellationNetwork,
  FlowFieldParticles,
  AuroraGradientMesh,
  MagneticLineField,
  ShaderGrid,
} from "./backgrounds"

/**
 * Name → component map for selecting a background by string (e.g. a CMS field
 * or section config). For variant-specific props, use the component directly;
 * the <Background> picker forwards the common `className` / `opacity`.
 */
export const BACKGROUNDS = {
  "dotted-glow": DottedGlowBackground,
  "dotted-gravity": DottedGravityBackground,
  constellation: ConstellationNetwork,
  "flow-field": FlowFieldParticles,
  aurora: AuroraGradientMesh,
  magnetic: MagneticLineField,
  "shader-grid": ShaderGrid,
} as const

export type BackgroundName = keyof typeof BACKGROUNDS

export const BACKGROUND_NAMES = Object.keys(BACKGROUNDS) as BackgroundName[]

export interface BackgroundProps {
  name: BackgroundName
  className?: string
  /** Forwarded where supported (ShaderGrid ignores it). */
  opacity?: number
}

/**
 * Render a registered background by name. Pick-by-string convenience; reach for
 * the concrete component when you need its full prop surface.
 */
export function Background({ name, className, opacity }: BackgroundProps) {
  const Comp = BACKGROUNDS[name] as ComponentType<{ className?: string; opacity?: number }>
  return <Comp className={className} opacity={opacity} />
}
