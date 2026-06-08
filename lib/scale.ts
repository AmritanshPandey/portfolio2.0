/**
 * Scale generation shared across the color-system tools.
 *
 * Builds an 11-stop tonal scale from a base color (hue held constant, lightness
 * on a perceptual curve, saturation eased at the extremes, optional hue-shift),
 * plus a full "system" (primary + harmonized neutral + semantic scales).
 */

import { clamp, hexToHsl, hslToHex, normalizeHex } from "@/lib/color"

export const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export type Stop = (typeof STOPS)[number]

const L_TARGET: Record<Stop, number> = {
  50: 96, 100: 92, 200: 84, 300: 72, 400: 57, 500: 40,
  600: 32, 700: 24, 800: 16, 900: 10, 950: 5,
}
const S_FACTOR: Record<Stop, number> = {
  50: 0.72, 100: 0.78, 200: 0.88, 300: 0.96, 400: 1, 500: 1,
  600: 1, 700: 0.98, 800: 0.94, 900: 0.9, 950: 0.85,
}
const HUE_SHIFT: Record<Stop, number> = {
  50: 8, 100: 7, 200: 5, 300: 3, 400: 1, 500: 0,
  600: -1, 700: -2, 800: -3, 900: -4, 950: -5,
}

export interface FeelDef {
  key: string
  label: string
  desc: string
  literal: boolean
  transform: (s: number, l: number) => { s: number; l: number }
}

export const FEELS: FeelDef[] = [
  { key: "balanced", label: "Balanced", desc: "True to your color — full saturation, perceptual lightness ramp.", literal: true,
    transform: (s, l) => ({ s, l }) },
  { key: "pastel", label: "Pastel", desc: "Soft and airy — lifted lightness, gentle saturation.", literal: false,
    transform: (s, l) => ({ s: Math.min(s * 0.72, 75), l: l + (100 - l) * 0.18 }) },
  { key: "vivid", label: "Vivid", desc: "Punchy and digital — boosted saturation, screen-bright.", literal: false,
    transform: (s, l) => ({ s: Math.min(100, s * 1.25 + 6), l }) },
  { key: "matte", label: "Matte", desc: "Muted and flat — desaturated, compressed contrast.", literal: false,
    transform: (s, l) => ({ s: Math.min(s * 0.5, 52), l: l + (52 - l) * 0.16 }) },
]

export interface Swatch { stop: Stop; hex: string; anchor: boolean }

export function buildScale(baseHex: string, hueShift: boolean, feel: FeelDef): Swatch[] {
  const base = hexToHsl(baseHex)
  const anchor = STOPS.reduce((best, stop) =>
    Math.abs(L_TARGET[stop] - base.l) < Math.abs(L_TARGET[best] - base.l) ? stop : best
  , STOPS[0])

  return STOPS.map(stop => {
    const isAnchor = stop === anchor
    if (isAnchor && feel.literal) return { stop, hex: normalizeHex(baseHex)!, anchor: true }
    const { s, l } = feel.transform(clamp(base.s * S_FACTOR[stop]), L_TARGET[stop])
    const hex = hslToHex({ h: base.h + (hueShift ? HUE_SHIFT[stop] : 0), s: clamp(s), l: clamp(l) })
    return { stop, hex, anchor: isAnchor }
  })
}

export const at = (sw: Swatch[], stop: Stop) => sw.find(s => s.stop === stop)?.hex ?? "#000000"

export const PRESETS = [
  { name: "Blue", hex: "#2563eb" }, { name: "Teal", hex: "#0d9488" },
  { name: "Green", hex: "#16a34a" }, { name: "Amber", hex: "#f59e0b" },
  { name: "Orange", hex: "#ea580c" }, { name: "Red", hex: "#dc2626" },
  { name: "Purple", hex: "#7c3aed" }, { name: "Pink", hex: "#db2777" },
]

export const SEMANTIC_BASES = [
  { key: "success", label: "Success", hex: "#16a34a" },
  { key: "warning", label: "Warning", hex: "#f59e0b" },
  { key: "error",   label: "Error",   hex: "#dc2626" },
  { key: "info",    label: "Info",    hex: "#2563eb" },
]

export interface ColorSystem {
  primary: Swatch[]
  neutral: Swatch[]
  semantics: { key: string; label: string; hex: string; swatches: Swatch[] }[]
  semMap: Record<string, Swatch[]>
}

export function buildSystem(hex: string, hueShift: boolean, feel: FeelDef): ColorSystem {
  const baseHsl = hexToHsl(hex)
  const primary = buildScale(hex, hueShift, feel)
  const neutral = buildScale(hslToHex({ h: baseHsl.h, s: 8, l: 50 }), hueShift, feel)
  const semantics = SEMANTIC_BASES.map(b => ({ ...b, swatches: buildScale(b.hex, hueShift, feel) }))
  const semMap = Object.fromEntries(semantics.map(s => [s.key, s.swatches]))
  return { primary, neutral, semantics, semMap }
}
