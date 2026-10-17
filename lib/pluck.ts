/**
 * Pluckable rules: the physics and geometry, kept free of the DOM so they can
 * be tested on their own. A rule behaves like a string pinned at both ends:
 * the pointer catches it, draws it out to `pull` pixels, and when it slips
 * free it rings as a damped spring and settles flat again.
 */

export const PLUCK = {
  /** Furthest a caught rule follows the pointer before it slips free (px). */
  pull: 18,
  /** A rule is not caught this close to its ends (px). */
  edge: 24,
  /** Visual ring frequency (Hz) and damping ratio of the release. */
  frequency: 4.2,
  damping: 0.12,
  /** Envelope (px) under which the rule counts as flat again. */
  rest: 0.25,
}

export type PluckTuning = typeof PLUCK

export interface StringState {
  /** Displacement at the grab point (px, positive is down). */
  d: number
  /** Velocity of that displacement (px/s). */
  v: number
}

export interface Point {
  x: number
  y: number
}

/**
 * Where a pointer moving from `prev` to `cur` crossed the horizontal line at
 * `y`, or null if it stayed on one side. Starting exactly on the line is not a
 * crossing: the direction is unknown until the next move.
 */
export function crossingX(prev: Point, cur: Point, y: number): number | null {
  const a = prev.y - y
  const b = cur.y - y
  if (a === 0 || (a < 0 && b < 0) || (a > 0 && b > 0)) return null
  const t = a / (a - b)
  return prev.x + (cur.x - prev.x) * t
}

/**
 * Advances a released rule by `dt` seconds. Uses the exact solution of the
 * underdamped spring, so the ring looks the same at any frame rate and a long
 * frame can never blow it up.
 */
export function stepString(s: StringState, dt: number, p: PluckTuning = PLUCK): StringState {
  const w = 2 * Math.PI * p.frequency
  const zw = p.damping * w
  const wd = w * Math.sqrt(1 - p.damping * p.damping)
  const A = s.d
  const B = (s.v + zw * s.d) / wd
  const e = Math.exp(-zw * dt)
  const cos = Math.cos(wd * dt)
  const sin = Math.sin(wd * dt)
  const d = e * (A * cos + B * sin)
  const v = e * (-zw * (A * cos + B * sin) + wd * (B * cos - A * sin))
  return { d, v }
}

/** The ring's envelope: how far the rule will swing, rather than where it is now. */
export function amplitude(s: StringState, p: PluckTuning = PLUCK): number {
  const w = 2 * Math.PI * p.frequency
  const zw = p.damping * w
  const wd = w * Math.sqrt(1 - p.damping * p.damping)
  return Math.hypot(s.d, (s.v + zw * s.d) / wd)
}

export function isAtRest(s: StringState, p: PluckTuning = PLUCK): boolean {
  return amplitude(s, p) < p.rest
}

const r2 = (n: number) => Math.round(n * 100) / 100

/**
 * SVG path of a rule `width` px long, drawn out by `d` px at `x0`. Each side
 * is one quadratic curve: it leaves its pinned end at an angle and arrives at
 * the grab point level, so the bend reads as a soft string, not a kink.
 */
export function rulePath(width: number, x0: number, d: number): string {
  const x = Math.min(Math.max(x0, 0), width)
  return `M0 0Q${r2(x / 2)} ${r2(d)} ${r2(x)} ${r2(d)}Q${r2((x + width) / 2)} ${r2(d)} ${r2(width)} 0`
}
