// Dependency-free colour maths for the contrast check. Colours are returned as
// gamma-encoded sRGB channels in [0, 1] plus alpha, because that is the space
// browsers composite translucent colours in.

const clamp01 = (n) => Math.min(1, Math.max(0, n))
const encode = (c) => {
  const x = clamp01(c)
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
}
const decode = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const isValid = (c) => [c.r, c.g, c.b, c.a].every((n) => Number.isFinite(n))

// Strict CSS number grammar: parseFloat alone accepts "85deg0" or "13px" as
// numbers, which would let typos the browser rejects pass the gate.
const NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i
const number = (s) => (NUMBER.test(s) ? parseFloat(s) : NaN)
const HUE_UNITS = { "": 1, deg: 1, grad: 0.9, rad: 180 / Math.PI, turn: 360 }

/** A number, or a percentage where 100% equals `scale`. */
const channel = (s, scale) => (s.endsWith("%") ? (number(s.slice(0, -1)) / 100) * scale : number(s))

function hue(s) {
  const [, value, unit = ""] = s.match(/^(.*?)(deg|grad|rad|turn)?$/i)
  return number(value) * HUE_UNITS[unit.toLowerCase()]
}

function splitAlpha(inner) {
  const pieces = inner.split("/")
  if (pieces.length > 2) return null
  return { channels: pieces[0].trim(), alpha: pieces[1] }
}

/** Browsers clamp alpha into [0, 1]. */
function parseAlpha(s) {
  if (s === undefined) return 1
  const a = channel(s.trim(), 1)
  return Number.isNaN(a) ? NaN : clamp01(a)
}

function parseHex(v) {
  if (!/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(v)) return null
  let h = v.slice(1)
  if (h.length <= 4) h = [...h].map((c) => c + c).join("")
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 }
}

function parseRgb(v) {
  const m = v.match(/^rgba?\(([^)]*)\)$/)
  if (!m) return null
  const inner = m[1].trim()
  let parts
  let alpha
  if (inner.includes(",")) {
    // Legacy syntax: commas throughout, optional fourth alpha, no slash.
    if (inner.includes("/")) return null
    parts = inner.split(",").map((p) => p.trim())
    if (parts.length === 4) alpha = parts.pop()
  } else {
    const split = splitAlpha(inner)
    if (!split) return null
    parts = split.channels.split(/\s+/).filter(Boolean)
    alpha = split.alpha
  }
  if (parts.length !== 3) return null
  const [r, g, b] = parts.map((p) => channel(p, 255) / 255)
  const c = { r, g, b, a: parseAlpha(alpha) }
  return isValid(c) ? c : null
}

export function oklchToSrgb(L, C, H) {
  const hr = (H * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return {
    r: encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  }
}

function parseOklch(v) {
  const m = v.match(/^oklch\(([^)]*)\)$/)
  if (!m || m[1].includes(",")) return null
  const split = splitAlpha(m[1].trim())
  if (!split) return null
  const parts = split.channels.split(/\s+/)
  if (parts.length !== 3) return null
  const L = channel(parts[0], 1)
  const C = channel(parts[1], 0.4)
  const H = hue(parts[2])
  if (![L, C, H].every(Number.isFinite)) return null
  const c = { ...oklchToSrgb(L, C, H), a: parseAlpha(split.alpha) }
  return isValid(c) ? c : null
}

/** Parses hex, rgb()/rgba(), and oklch(). Anything else returns null. */
export function parseColor(input) {
  const v = String(input).trim().toLowerCase()
  if (v.startsWith("#")) return parseHex(v)
  if (v.startsWith("rgb")) return parseRgb(v)
  if (v.startsWith("oklch(")) return parseOklch(v)
  return null
}

function over(fg, bg) {
  const a = fg.a
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 }
}

const luminance = ({ r, g, b }) => 0.2126 * decode(r) + 0.7152 * decode(g) + 0.0722 * decode(b)

/** WCAG contrast of `fg` composited over an opaque `bg`. */
export function contrastRatio(fg, bg) {
  if (bg.a < 1) throw new Error("background must be opaque")
  const solid = over(fg, bg)
  const [hi, lo] = [luminance(solid), luminance(bg)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
