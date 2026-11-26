/**
 * The footer's ASCII sea: the geometry, kept free of the DOM so it can be
 * tested on its own. Swell lines run from a horizon to the front of the band,
 * closer together and calmer far away. Each line rises and falls with the
 * water under it; the drawing lives in <AsciiFlowBackground shape="waves">.
 */

export const SEA = {
  /** Deepest a trough sinks, as a share of a crest's height (crests reach 1). */
  trough: 0.56,
  /** Swell lines on a wide band, and on a phone. */
  lines: 7,
  phoneLines: 5,
  /** Where the horizon line and the front line rest, as shares of the band's height. */
  horizon: 0.14,
  front: 0.82,
  /** Furthest a front crest rises (px), and as a share of the band's height. */
  maxAmp: 24,
  ampShare: 0.11,
}

export interface SeaLine {
  /** 0 at the horizon, 1 at the front. */
  depth: number
  /** Resting height of the line, px from the top of the band. */
  y: number
  /** How far a crest rises above the resting height (px). */
  amp: number
  /** Crest glyph size (px). */
  size: number
  /** Phase offset, so no two lines rise in step. */
  seed: number
}

const TAU = Math.PI * 2
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// One long swell carries the shape; a slower one running against it and a
// short chop break up its rhythm. Wavelengths are shares of the line's swell
// length, speeds shares of its speed, weights sum to 1.
const SWELLS = [
  { k: 1, v: 1, w: 0.64 },
  { k: 0.57, v: -0.7, w: 0.24 },
  { k: 1.9, v: 1.3, w: 0.12 },
]

/**
 * Height of the water under column `x` (px) on the line at `depth`, at `time`
 * (s): 1 at the highest crest, -SEA.trough at the deepest trough. Each swell is
 * Stokes-shaped (cos θ + 0.3 cos 2θ) so crests peak and troughs flatten, and an
 * envelope rolls through sets of bigger swells.
 */
export function swellHeight(x: number, depth: number, time: number, seed: number): number {
  // Far swells look shorter and slower.
  const length = lerp(90, 230, depth)
  const speed = lerp(9, 24, depth)
  let h = 0
  for (let i = 0; i < SWELLS.length; i++) {
    const { k, v, w } = SWELLS[i]
    const theta = (TAU * k * (x - speed * v * time)) / length + seed * (i + 1.3)
    h += (w * (Math.cos(theta) + 0.3 * Math.cos(2 * theta))) / 1.3
  }
  const set = 0.7 + 0.3 * Math.sin((TAU * (x - speed * 0.4 * time)) / (length * 4.3) + seed)
  return h * set
}

/**
 * The swell lines for a band `width` x `height` px, horizon first. The front
 * line's crests are `frontSize` px; lines shrink, flatten and close up towards
 * the horizon, as a sea does in perspective.
 */
export function seaLines(width: number, height: number, frontSize: number): SeaLine[] {
  const count = width < 768 ? SEA.phoneLines : SEA.lines
  const frontAmp = Math.min(SEA.maxAmp, height * SEA.ampShare)
  const lines: SeaLine[] = []
  for (let i = 0; i < count; i++) {
    const depth = i / (count - 1)
    const spread = depth ** 1.45
    lines.push({
      depth,
      y: lerp(height * SEA.horizon, height * SEA.front, spread),
      amp: lerp(frontAmp * 0.22, frontAmp, spread),
      size: Math.round(lerp(frontSize * 0.65, frontSize, depth)),
      seed: i * 2.39,
    })
  }
  return lines
}
