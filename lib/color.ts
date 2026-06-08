/**
 * Shared color math for the color-system article tools.
 *
 * Pure functions, no dependencies. Covers HSL ↔ hex, sRGB luminance + WCAG
 * contrast, OKLab/OKLCH ↔ hex (perceptually-uniform ramps), and
 * color-vision-deficiency simulation matrices.
 */

export const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n))

export interface HSL { h: number; s: number; l: number }

export function normalizeHex(input: string): string | null {
  let h = input.trim().replace(/^#/, "")
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split("").map(c => c + c).join("")
  if (/^[0-9a-fA-F]{6}$/.test(h)) return "#" + h.toLowerCase()
  return null
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")
  return "#" + to(r) + to(g) + to(b)
}

export function hexToHsl(hex: string): HSL {
  const [R, G, B] = hexToRgb(hex)
  const r = R / 255, g = G / 255, b = B / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r)      h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else                h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return { h, s: s * 100, l: l * 100 }
}

export function hslToHex({ h, s, l }: HSL): string {
  h = ((h % 360) + 360) % 360
  s = clamp(s) / 100
  l = clamp(l) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60)       [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else              [r, g, b] = [c, 0, x]
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255)
}

// ─── luminance + WCAG contrast ───────────────────────────────────────────────

export const srgbToLinear = (c: number) =>
  c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

export const linearToSrgb = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(v => srgbToLinear(v / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const la = luminance(a), lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

export const readableInk = (hex: string) =>
  contrast(hex, "#ffffff") >= contrast(hex, "#111111") ? "#ffffff" : "#111111"

export function rating(ratio: number): { label: string; kind: "pass" | "warn" | "fail" } {
  if (ratio >= 7)   return { label: "AAA", kind: "pass" }
  if (ratio >= 4.5) return { label: "AA",  kind: "pass" }
  if (ratio >= 3)   return { label: "AA·lg", kind: "warn" }
  return { label: "✕", kind: "fail" }
}

export const BADGE_BG: Record<string, string> = { pass: "#16a34a", warn: "#d97706", fail: "#dc2626" }

// ─── OKLab / OKLCH ───────────────────────────────────────────────────────────

export interface OKLCH { l: number; c: number; h: number } // l 0..1, c, h degrees

export function hexToOklch(hex: string): OKLCH {
  const [lr, lg, lb] = hexToRgb(hex).map(v => srgbToLinear(v / 255))
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  const c = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h }
}

export function oklchToHex({ l: L, c, h }: OKLCH): string {
  const hr = (h * Math.PI) / 180
  const a = c * Math.cos(hr)
  const b = c * Math.sin(hr)
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
  const lr =  4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_
  return rgbToHex(
    linearToSrgb(clamp(lr, 0, 1)) * 255,
    linearToSrgb(clamp(lg, 0, 1)) * 255,
    linearToSrgb(clamp(lb, 0, 1)) * 255,
  )
}

export const oklchString = (hex: string) => {
  const { l, c, h } = hexToOklch(hex)
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`
}

// ─── color-vision-deficiency simulation ───────────────────────────────────────
// Brettel/Viénot-style linear-RGB transforms (common web approximations).

export const CB_MATRIX: Record<string, number[]> = {
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  protanopia:   [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  tritanopia:   [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
}

export function simulateCb(hex: string, type: keyof typeof CB_MATRIX | "normal"): string {
  if (type === "normal") return hex
  const m = CB_MATRIX[type]
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(
    m[0] * r + m[1] * g + m[2] * b,
    m[3] * r + m[4] * g + m[5] * b,
    m[6] * r + m[7] * g + m[8] * b,
  )
}
