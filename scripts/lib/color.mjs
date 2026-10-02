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

function splitAlpha(inner) {
  const [channels, alpha] = inner.includes("/") ? inner.split("/") : [inner, undefined]
  return { channels: channels.trim(), alpha }
}

function parseAlpha(s) {
  if (s === undefined) return 1
  const t = s.trim()
  return t.endsWith("%") ? parseFloat(t) / 100 : parseFloat(t)
}

function parseHex(v) {
  let h = v.slice(1)
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("")
  if (h.length !== 6 && h.length !== 8) return null
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255
  const c = { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 }
  return isValid(c) ? c : null
}

function parseRgb(v) {
  const m = v.match(/^rgba?\(([^)]+)\)$/)
  if (!m) return null
  const { channels, alpha } = splitAlpha(m[1])
  const parts = channels.split(/[\s,]+/).filter(Boolean)
  let a = alpha
  if (parts.length === 4 && alpha === undefined) a = parts.pop() // rgba(r, g, b, a)
  if (parts.length !== 3) return null
  const [r, g, b] = parts.map((p) => (p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p) / 255))
  const c = { r, g, b, a: parseAlpha(a) }
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
  const m = v.match(/^oklch\(([^)]+)\)$/)
  if (!m) return null
  const { channels, alpha } = splitAlpha(m[1])
  const parts = channels.split(/\s+/)
  if (parts.length !== 3) return null
  const L = parts[0].endsWith("%") ? parseFloat(parts[0]) / 100 : parseFloat(parts[0])
  const C = parseFloat(parts[1])
  const H = parseFloat(parts[2])
  if (![L, C, H].every(Number.isFinite)) return null
  const c = { ...oklchToSrgb(L, C, H), a: parseAlpha(alpha) }
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
