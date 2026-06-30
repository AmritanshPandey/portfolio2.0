import { cn } from "@/lib/utils"

export interface GradientShineBackgroundProps {
  className?: string
  /** Overall opacity of the field (0–1). */
  opacity?: number
  /** Gradient angle in degrees. */
  angle?: number
  /** Key colours the banded spectrum ramps through (hex). Omit to use the
   *  theme-aware default ramp built from --accent / --background. */
  colors?: string[]
  /** Number of hard bands across the gradient. */
  bands?: number
  /** Drifting film-grain intensity (0 = off). */
  noise?: number
  /** Diagonal shine intensity it settles to (0 = off). */
  shine?: number
  /** Play the one-shot settle slide on mount. */
  settle?: boolean
}

// The original warm spectrum from the older portfolio hero (orange → blue).
// Kept available — pass it via the `colors` prop to get the old look back.
export const WARM_SPECTRUM = [
  "#ff7426",
  "#ffb948",
  "#ffe88a",
  "#ffffca",
  "#e3ffff",
  "#bde9ff",
  "#a3cfff",
]

// Fine grayscale turbulence as a data-URI — no global <filter> id to collide.
const NOISE_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ] as const
}
const lerpHex = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  const to2 = (n: number) => clamp(n).toString(16).padStart(2, "0")
  return `#${to2(ar + (br - ar) * t)}${to2(ag + (bg - ag) * t)}${to2(ab + (bb - ab) * t)}`
}
/** Sample the key-colour ramp at t ∈ [0,1]. */
const rampColor = (colors: string[], t: number) => {
  if (colors.length === 1) return colors[0]
  const seg = t * (colors.length - 1)
  const i = Math.min(colors.length - 2, Math.floor(seg))
  return lerpHex(colors[i], colors[i + 1], seg - i)
}

/** Emit one band's two stops (hard 1px transition between bands). */
function bandStops(color: string, i: number, bands: number) {
  const start = (i / bands) * 100
  const end = ((i + 1) / bands) * 100
  return [i === 0 ? `${color} 0%` : `${color} calc(${start}% + 1px)`, `${color} ${end}%`]
}

/** Build the stepped, hard-edged banded gradient from explicit hex colours. */
function buildBandedGradient(colors: string[], bands: number, angle: number) {
  const stops: string[] = []
  for (let i = 0; i < bands; i++) {
    const c = rampColor(colors, bands === 1 ? 0 : i / (bands - 1))
    stops.push(...bandStops(c, i, bands))
  }
  return `linear-gradient(${angle}deg, ${stops.join(", ")})`
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/**
 * Theme-aware default ramp: each band is a color-mix of the accent into the
 * background, deepening across the sweep, with a soft highlight toward the
 * bright end. Uses CSS vars (--accent / --background) so it tracks the brand
 * accent and adapts to light/dark with no JS.
 */
function buildThemedGradient(bands: number, angle: number) {
  const stops: string[] = []
  const n = Math.max(1, bands)
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1)
    const accentPct = Math.round(16 + easeInOut(t) * 78) // 16% → 94% accent
    const whitePct = t < 0.55 ? 0 : Math.round(((t - 0.55) / 0.45) * 28) // highlight near the bright end
    const core = `color-mix(in srgb, var(--accent) ${accentPct}%, var(--background))`
    const color = whitePct > 0 ? `color-mix(in srgb, #fff ${whitePct}%, ${core})` : core
    stops.push(...bandStops(color, i, n))
  }
  return `linear-gradient(${angle}deg, ${stops.join(", ")})`
}

/**
 * A banded gradient that settles in on mount, with a drifting film-grain layer
 * and a soft diagonal shine that fades in once — ported from the older portfolio
 * hero, recoloured to the brand. By default the bands ramp the accent into the
 * background (theme-aware via CSS vars); pass `colors` for a custom hex spectrum
 * (e.g. WARM_SPECTRUM for the original look). Pure CSS (server-renderable),
 * reduced-motion safe via the global media query in globals.css.
 */
export function GradientShineBackground({
  className,
  opacity = 1,
  angle = 225,
  colors,
  bands = 32,
  noise = 0.12,
  shine = 0.35,
  settle = true,
}: GradientShineBackgroundProps) {
  const gradient = colors
    ? buildBandedGradient(colors, Math.max(1, bands), angle)
    : buildThemedGradient(bands, angle)

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} style={{ opacity }}>
      {/* Base banded spectrum — slides from 10% → 55% once on mount */}
      <div
        className={cn(
          "absolute inset-0",
          settle && "[animation:gradient-settle_1.2s_ease-out_forwards] motion-reduce:animate-none"
        )}
        style={{
          background: gradient,
          backgroundSize: "140% 140%",
          backgroundPosition: "50% 50%",
        }}
      />

      {/* Organic grain — drifts continuously, blended over the spectrum */}
      {noise > 0 && (
        <div
          aria-hidden
          className="absolute -inset-[20%] mix-blend-overlay [animation:noise-drift_6s_steps(4)_infinite] motion-reduce:animate-none"
          style={{
            backgroundImage: `url("${NOISE_URI}")`,
            backgroundSize: "120px 120px",
            opacity: noise,
          }}
        />
      )}

      {/* Specular shine — sweeps diagonally, fades in once and stays */}
      {shine > 0 && (
        <div
          aria-hidden
          className="absolute -inset-[40%] opacity-0 mix-blend-overlay [animation:shine-fade-in_1.6s_ease-out_forwards] motion-reduce:animate-none"
          style={
            {
              background: `linear-gradient(${angle}deg, transparent 42%, rgba(255,255,255,0.28) 50%, transparent 58%)`,
              "--shine-to": shine,
            } as React.CSSProperties
          }
        />
      )}
    </div>
  )
}
