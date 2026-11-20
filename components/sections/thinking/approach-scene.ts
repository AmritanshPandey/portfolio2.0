import { G, noise, smooth, stroke, type CellOut, type FieldState, type Motif } from "@/components/shared/ascii-field"

/**
 * The Approach stage: one ASCII field behind the whole section.
 *
 * In front, an illustration of the method at work, drawn in type: two phone
 * screens, a hand placing a tile into a card, a second hand drawing a star
 * along a pen-tool curve, and loose shapes floating beside them. Behind it, a
 * busy ground of moving contour lines and drifting glyphs, so the glass card
 * laid over the field has something alive under it. The ground goes quiet
 * behind the heading so the heading reads on paper.
 *
 * Geometry is in illustration units (u right, v down, the phones about two
 * units tall), placed by `layout`, which the section measures from its own
 * DOM and updates on resize.
 */

export interface Rect {
  x0: number
  y0: number
  x1: number
  y1: number
}

export interface SceneLayout {
  /** Where the illustration's origin sits, 0..1 across and down the field. */
  x: number
  y: number
  /** One illustration unit, as a fraction of the field's height. */
  unit: number
  /** Areas (0..1 of the field) where the ground stays quiet. */
  quiet: Rect[]
  /** Areas where it runs busiest: under the glass. */
  busy: Rect[]
}

/* ── 2D shapes ───────────────────────────────────────────────────────────── */

const len = Math.hypot
function rbox(x: number, y: number, hx: number, hy: number, r: number) {
  const qx = Math.abs(x) - hx + r
  const qy = Math.abs(y) - hy + r
  return len(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
function seg(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax
  const dy = by - ay
  const k = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)))
  return len(x - ax - dx * k, y - ay - dy * k)
}
const fract = (v: number) => v - Math.floor(v)
const hash = (a: number, b: number) => fract(Math.sin(a * 127.1 + b * 311.7) * 43758.5453)

type Sd = (u: number, v: number) => number

/* ── Drawing state, shared by the helpers below for one frame ────────────── */

// One glyph cell, in illustration units (wide and tall).
let CW = 0.03
let CH = 0.05
// The last gradient taken (unit length, pointing out of the shape).
let GX = 0
let GY = 0

function grad(sd: Sd, u: number, v: number) {
  const e = Math.min(CW, CH) * 0.5
  const dx = sd(u + e, v) - sd(u - e, v)
  const dy = sd(u, v + e) - sd(u, v - e)
  const l = len(dx, dy) || 1
  GX = dx / l
  GY = dy / l
}
/** Half a glyph across the edge, at whatever slope it runs. */
const halfCell = () => 0.5 * (Math.abs(GX) * CW + Math.abs(GY) * CH)
const near = (d: number) => Math.abs(d) < Math.max(CW, CH)

function set(out: CellOut, b: number, a: number, g = 0) {
  out.b = b
  out.a = a
  out.g = g
}

/** An outline one glyph thick, drawn with the glyph that follows it. */
function line(sd: Sd, u: number, v: number, out: CellOut, b: number, a: number) {
  const d = sd(u, v)
  if (!near(d)) return false
  grad(sd, u, v)
  if (Math.abs(d) > halfCell()) return false
  set(out, b, a, stroke(-GY, GX))
  return true
}

// The key light, from the upper left and in front: x, y (down), z (out).
const LX = -0.48
const LY = -0.58
const LZ = 0.66

/** How a rounded form of the given radius is lit at depth s inside its
 *  edge, facing outward along (GX, GY): a pillow, so tubes read as tubes. */
function pillow(s: number, r: number) {
  const k = Math.min(s, r)
  const h = Math.sqrt(Math.max(1e-6, r * r - (r - k) * (r - k)))
  const slope = (r - k) / h
  const nx = GX * slope
  const ny = GY * slope
  const nl = 1 / Math.sqrt(nx * nx + ny * ny + 1)
  const diff = Math.max(0, (nx * LX + ny * LY + LZ) * nl)
  // A tight highlight where the surface turns toward the light.
  const spec = Math.pow(Math.max(0, (nx * -0.3 + ny * -0.42 + 0.86) * nl), 18)
  return { diff, spec }
}

/** A filled, lit form: an inked outline and a rounded body. */
function solid(sd: Sd, u: number, v: number, out: CellOut, a: number, base = 0.12, r = 0.06) {
  const d = sd(u, v)
  if (d > Math.max(CW, CH)) return false
  grad(sd, u, v)
  const h = halfCell()
  if (Math.abs(d) <= h) {
    set(out, 1, a, stroke(-GY, GX))
    return true
  }
  if (d > 0) return false
  const { diff, spec } = pillow(-d, r)
  // A little ordered grain, so a broad face never fills with one glyph.
  const grain = (hash(Math.floor(u / CW), Math.floor(v / CH)) - 0.5) * 0.09
  // Light falls off toward the lower right of the form as a whole.
  const fall = 0.08 * Math.max(-1, Math.min(1, (u * 0.6 + v * 0.8) * 1.5))
  set(out, Math.max(0.06, Math.min(1, base + 0.62 * diff + 0.3 * spec + grain - fall)), a)
  return true
}

/* ── Fixed geometry ──────────────────────────────────────────────────────── */

const FRONT: Sd = (u, v) => rbox(u + 0.04, v - 0.04, 0.42, 0.8, 0.09)
const BACK: Sd = (u, v) => rbox(u - 0.24, v + 0.16, 0.4, 0.76, 0.09)
const CARD1: Sd = (u, v) => rbox(u + 0.04, v + 0.24, 0.34, 0.25, 0.07)
const CARD2: Sd = (u, v) => rbox(u + 0.04, v - 0.31, 0.34, 0.24, 0.07)
const TAB: Sd = (u, v) => rbox(u + 0.04, v - 0.71, 0.33, 0.055, 0.055)
const DASH: Sd = (u, v) => rbox(u - 0.15, v + 0.15, 0.1, 0.1, 0.025)
const CHIP: Sd = (u, v) => rbox(u - 0.15, v + 0.38, 0.11, 0.04, 0.04)
const BACKBTN: Sd = (u, v) => rbox(u + 0.33, v + 0.66, 0.05, 0.05, 0.015)
const MENU: Sd = (u, v) => rbox(u - 0.25, v + 0.66, 0.05, 0.05, 0.015)
const BACK_MENU: Sd = (u, v) => rbox(u - 0.53, v + 0.82, 0.05, 0.05, 0.015)
const BACK_CARD: Sd = (u, v) => rbox(u - 0.24, v + 0.38, 0.34, 0.25, 0.07)

// The star being drawn: eight points, uneven, as one closed path.
const STAR_C = [-0.1, 0.31] as const
const STAR: number[] = []
{
  const outer = [0.2, 0.16, 0.22, 0.15, 0.2, 0.17, 0.21, 0.14]
  for (let i = 0; i <= 16; i++) {
    const k = i % 16
    const r = k % 2 ? 0.075 : outer[k / 2]
    const a = (k / 16) * Math.PI * 2 - Math.PI / 2
    STAR.push(STAR_C[0] + Math.cos(a) * r, STAR_C[1] + Math.sin(a) * r)
  }
}
const STAR_LEN: number[] = [0]
for (let i = 1; i <= 16; i++)
  STAR_LEN.push(STAR_LEN[i - 1] + len(STAR[i * 2] - STAR[i * 2 - 2], STAR[i * 2 + 1] - STAR[i * 2 - 1]))
const STAR_TOTAL = STAR_LEN[16]

// The pen-tool curve through the star, with an anchor at each end.
const CURVE: number[] = []
const C0 = [-0.62, 0.1] as const
const C1 = [0.02, 0.1] as const
const C2 = [0.05, 0.57] as const
for (let i = 0; i <= 24; i++) {
  const k = i / 24
  const m = 1 - k
  CURVE.push(m * m * C0[0] + 2 * m * k * C1[0] + k * k * C2[0], m * m * C0[1] + 2 * m * k * C1[1] + k * k * C2[1])
}

function inStar(u: number, v: number) {
  let inside = false
  for (let i = 0, j = 15; i < 16; j = i++) {
    const xi = STAR[i * 2]
    const yi = STAR[i * 2 + 1]
    const xj = STAR[j * 2]
    const yj = STAR[j * 2 + 1]
    if (yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/* ── The scene ───────────────────────────────────────────────────────────── */

const CYCLE = 10

/** The scene, and a way to move it: `place` takes a fresh layout whenever
 *  the section's DOM changes size. */
export function approachScene(): { motif: Motif; place: (next: SceneLayout) => void } {
  const layout: SceneLayout = { x: 0.4, y: 0.55, unit: 0.25, quiet: [], busy: [] }
  // Animated state, set once a frame.
  let tx = 0 // the tile
  let ty = 0
  let tRot = 0
  let tScale = 1
  let hx = 0 // the pointing hand's fingertip
  let hy = 0
  let drawn = 0 // the star's outline, 0..1 of its length
  let fill = 0 // the star's fill, 0..1
  let px = 0 // the pencil's point
  let py = 0
  let type1 = 1 // the header's title lines, typing in
  let type2 = 1
  let bob = 0
  let time = 0
  // Bounds of the drawing hand and pencil, refreshed each frame.
  let pu0 = 0
  let pu1 = 0
  let pv0 = 0
  let pv1 = 0
  // The ground's field, sampled on a grid two cells apart and blended
  // between, so each cell costs a lookup rather than six noise calls.
  let gw = 0
  let gh = 0
  let gStep = 0.01
  let gStepY = 0.01
  let gField = new Float32Array(0)
  let gDx = new Float32Array(0)
  let gDy = new Float32Array(0)
  // Where the ground is quiet (the heading, around the illustration) and
  // busy (under the glass), on the same grid; rebuilt when the layout moves.
  let gQuiet = new Float32Array(0)
  let gBusy = new Float32Array(0)
  let maskFor = ""

  // The pencil runs down and right from its point.
  const DX = 0.8
  const DY = 0.6
  const NX = -DY // across the pencil, toward its underside
  const NY = DX

  const tile: Sd = (u, v) => {
    const c = Math.cos(tRot)
    const s = Math.sin(tRot)
    const lu = ((u - tx) * c + (v - ty) * s) / tScale
    const lv = (-(u - tx) * s + (v - ty) * c) / tScale
    return rbox(lu, lv, 0.11, 0.11, 0.035) * tScale
  }

  // The pointing hand, by part, so the fingers can be drawn over the palm.
  const index: Sd = (u, v) => seg(u, v, hx - 0.42, hy + 0.01, hx - 0.05, hy) - 0.058
  const fingers: Sd = (u, v) => {
    let d = seg(u, v, hx - 0.6, hy + 0.075, hx - 0.38, hy + 0.09) - 0.05
    for (let k = 0; k < 3; k++) {
      const fy = hy + 0.17 + k * 0.095
      d = Math.min(d, seg(u, v, hx - 0.62, fy, hx - 0.43 + k * 0.015, fy) - 0.05)
    }
    return d
  }
  const palm: Sd = (u, v) =>
    Math.min(
      rbox(u - (hx - 0.7), v - (hy + 0.21), 0.14, 0.19, 0.08),
      seg(u, v, hx - 0.74, hy + 0.22, hx - 1.7, hy + 0.55) - 0.15,
    )
  const hand: Sd = (u, v) => Math.min(index(u, v), fingers(u, v), palm(u, v))
  const seams: Sd = (u, v) => Math.min(Math.abs(index(u, v)), Math.abs(fingers(u, v)))

  // The drawing hand: its grip a little way up the pencil.
  const gx = () => px + DX * 0.3
  const gy = () => py + DY * 0.3
  const penFinger: Sd = (u, v) => seg(u, v, gx() + DX * 0.26 - NX * 0.03, gy() + DY * 0.26 - NY * 0.03, gx() - DX * 0.03 - NX * 0.045, gy() - DY * 0.03 - NY * 0.045) - 0.052
  const penHand: Sd = (u, v) => {
    const cx = gx() + DX * 0.24 + NX * 0.14
    const cy = gy() + DY * 0.24 + NY * 0.14
    return Math.min(
      len(u - cx, v - cy) - 0.17,
      seg(u, v, cx, cy, cx + DX * 0.95 + NX * 0.15, cy + DY * 0.95 + NY * 0.15) - 0.16,
      seg(u, v, cx - NX * 0.02, cy - NY * 0.02, gx() + NX * 0.07 - DX * 0.01, gy() + NY * 0.07 - DY * 0.01) - 0.05,
      seg(u, v, cx + DX * 0.02 + NX * 0.1, cy + DY * 0.02 + NY * 0.1, gx() + DX * 0.04 + NX * 0.12, gy() + DY * 0.04 + NY * 0.12) - 0.05,
    )
  }
  const penSeams: Sd = (u, v) => {
    const cx = gx() + DX * 0.24 + NX * 0.14
    const cy = gy() + DY * 0.24 + NY * 0.14
    return Math.abs(seg(u, v, cx - NX * 0.02, cy - NY * 0.02, gx() + NX * 0.07 - DX * 0.01, gy() + NY * 0.07 - DY * 0.01) - 0.05)
  }
  // Along and across the pencil, from its point.
  const along = (u: number, v: number) => (u - px) * DX + (v - py) * DY
  const across = (u: number, v: number) => (u - px) * NX + (v - py) * NY
  const pencil: Sd = (u, v) => {
    const k = along(u, v)
    const r = Math.abs(across(u, v))
    if (k < 0) return len(u - px, v - py)
    const w = k < 0.08 ? 0.006 + (0.03 * k) / 0.08 : 0.036
    return Math.max(r - w, k - 0.78)
  }

  const arch: Sd = (u, v) => {
    const ax = u - 0.94
    const ay = v + 0.12 - bob * 0.04
    if (ay < 0) return Math.abs(len(ax, ay) - 0.22) - 0.065
    return Math.min(len(ax - 0.22, ay), len(ax + 0.22, ay)) - 0.065
  }
  const pill: Sd = (u, v) => seg(u, v, -0.95, 0.5 + bob * 0.03, -0.55, 0.5 + bob * 0.03) - 0.085

  /** Hatching: ruled stripes across a filled form. */
  const hatch = (out: CellOut, s: number, g: number) => {
    if (fract(s) < 0.34) set(out, 0.85, 0, g)
    else set(out, 0.16, 0, G.dot)
  }

  /** The front phone's screen; true when the cell is the screen's. */
  function frontScreen(u: number, v: number, out: CellOut): boolean {
    // Header: back button, the title typing in, the menu, a rule.
    if (line(BACKBTN, u, v, out, 0.95, 0)) return true
    if (Math.abs(u + 0.33) < CW * 0.5 && Math.abs(v + 0.66) < CH * 0.5) return set(out, 1, 0, G.lt), true
    if (MENU(u, v) < 0) {
      const row = Math.abs(v + 0.66) < CH * 0.5
      return set(out, 1, 1, row ? G.equals : G.hash), true
    }
    if (Math.abs(v + 0.695) < CH * 0.5 && u > -0.17 && u < -0.17 + 0.27 * type1) return set(out, 0.95, 0, G.dash), true
    if (Math.abs(v + 0.635) < CH * 0.5 && u > -0.12 && u < -0.12 + 0.16 * type2) return set(out, 0.7, 0, G.dash), true
    if (Math.abs(v + 0.56) < CH * 0.5 && Math.abs(u + 0.04) < 0.42) return set(out, 0.9, 0, G.dash), true

    // Card one: the slot the tile drops into, a label chip, a dashed add box.
    if (line(CARD1, u, v, out, 0.9, 0)) return true
    if (line(CHIP, u, v, out, 0.9, 0)) return true
    if (CHIP(u, v) < 0) {
      const wave = Math.abs(v + 0.38) < CH * 0.5 && Math.abs(u - 0.15) < 0.075
      return set(out, wave ? 1 : 0, 0, wave ? G.tilde : 0), true
    }
    {
      const d = DASH(u, v)
      if (near(d)) {
        grad(DASH, u, v)
        if (Math.abs(d) <= halfCell()) {
          const s = Math.abs(GX) > Math.abs(GY) ? v : u
          const on = fract(s * 14 - time * 0.6) < 0.55
          return set(out, on ? 0.85 : 0, 0, on ? stroke(-GY, GX) : 0), true
        }
      }
    }
    {
      const cu = u - 0.15
      const cv = v + 0.15
      const hBar = Math.abs(cv) < CH * 0.5 && Math.abs(cu) < 0.05
      const vBar = Math.abs(cu) < CW * 0.5 && Math.abs(cv) < 0.05
      if (hBar || vBar) return set(out, 1, 1, hBar && vBar ? G.plus : hBar ? G.dash : G.bar), true
    }
    // A faint outline where the tile will land, until it does.
    if (tx > -0.25 ? false : line((a, b) => rbox(a + 0.2, b + 0.25, 0.11, 0.11, 0.035), u, v, out, 0.3, 0)) {
      if (fract((u + v) * 9) < 0.5) return true
      set(out, 0, 0)
      return true
    }

    // Card two: the star going down along the pen tool's curve.
    if (line(CARD2, u, v, out, 0.9, 0)) return true
    if (Math.abs(u - STAR_C[0]) < 0.25 && Math.abs(v - STAR_C[1]) < 0.25) {
      if (fill > 0.02 && inStar(u, v)) {
        const lit = smooth(0.25, -0.05, len(u - STAR_C[0] + 0.05, v - STAR_C[1] + 0.06))
        return set(out, (0.45 + 0.5 * lit) * fill, 0), true
      }
      const reach = drawn * STAR_TOTAL
      for (let i = 0; i < 16; i++) {
        if (STAR_LEN[i] > reach) break
        const ax = STAR[i * 2]
        const ay = STAR[i * 2 + 1]
        let bx = STAR[i * 2 + 2]
        let by = STAR[i * 2 + 3]
        const room = reach - STAR_LEN[i]
        const full = STAR_LEN[i + 1] - STAR_LEN[i]
        if (room < full) {
          bx = ax + ((bx - ax) * room) / full
          by = ay + ((by - ay) * room) / full
        }
        const ex = bx - ax
        const ey = by - ay
        const l = len(ex, ey) || 1
        const tol = 0.5 * (Math.abs(ey / l) * CW + Math.abs(ex / l) * CH)
        if (seg(u, v, ax, ay, bx, by) < tol) return set(out, 1, 0, stroke(ex, ey)), true
      }
    }
    for (let i = 0; u > -0.66 && u < 0.1 && v > 0.06 && v < 0.6 && i < 24; i++) {
      const ax = CURVE[i * 2]
      const ay = CURVE[i * 2 + 1]
      const bx = CURVE[i * 2 + 2]
      const by = CURVE[i * 2 + 3]
      const ex = bx - ax
      const ey = by - ay
      const l = len(ex, ey) || 1
      const tol = 0.5 * (Math.abs(ey / l) * CW + Math.abs(ex / l) * CH)
      if (seg(u, v, ax, ay, bx, by) < tol) return set(out, 0.55, 0, stroke(ex, ey)), true
    }

    // The tab bar: a soft pill holding four icons.
    if (line(TAB, u, v, out, 0.85, 0)) return true
    if (TAB(u, v) < 0) {
      const icons = [G.caret, G.ring, G.hash, G.star]
      for (let i = 0; i < 4; i++) {
        if (Math.abs(u - (-0.26 + i * 0.15)) < CW * 0.5 && Math.abs(v - 0.71) < CH * 0.5)
          return set(out, 1, i === 0 ? 1 : 0, icons[i]), true
      }
      return set(out, 0.12, 0, G.dot), true
    }
    return false
  }

  /** The back phone's visible edge of screen. */
  function backScreen(u: number, v: number, out: CellOut): boolean {
    if (BACK_MENU(u, v) < 0) return set(out, 0.75, 0.5, Math.abs(v + 0.82) < CH * 0.5 ? G.equals : G.hash), true
    if (Math.abs(v + 0.835) < CH * 0.5 && u > 0.12 && u < 0.36) return set(out, 0.7, 0, G.dash), true
    if (Math.abs(v + 0.7) < CH * 0.5 && Math.abs(u - 0.24) < 0.4) return set(out, 0.7, 0, G.dash), true
    if (line(BACK_CARD, u, v, out, 0.6, 0)) return true
    return false
  }

  /** Everything drawn in front of the ground; false where the ground shows. */
  function scene(u: number, v: number, out: CellOut): boolean {
    // The drawing hand and its pencil, frontmost.
    if (u > pu0 && u < pu1 && v > pv0 && v < pv1) {
      if (solid(penFinger, u, v, out, 1, 0.14, 0.055)) return true
      const pd = pencil(u, v)
      if (pd < Math.max(CW, CH)) {
        const k = along(u, v)
        if (k < 0.025 && pd < CH * 0.6) return set(out, 1, 0, G.at), true
        if (line(pencil, u, v, out, 0.95, 0)) return true
        if (pd < 0) {
          if (k < 0.08) return set(out, 0.22, 0, G.dot), true
          if (k > 0.68) return set(out, 0.85, 1, G.hash), true
          // A hexagonal barrel: lit on the upper face, a crease down the middle.
          const c = across(u, v) / 0.036
          if (Math.abs(c) < (CH * 0.35) / 0.036) return set(out, 0.85, 0, G.dash), true
          return set(out, c < 0 ? 0.62 - 0.2 * c : 0.3 - 0.1 * c, 0), true
        }
      }
      if (solid(penHand, u, v, out, 1, 0.12, 0.17)) {
        if (out.g === 0 && penSeams(u, v) < CH * 0.5) {
          grad(penSeams, u, v)
          set(out, 1, 1, stroke(-GY, GX))
        }
        return true
      }
    }

    // The tile, and the hand placing it.
    if (tScale > 0.02 && Math.abs(u - tx) < 0.2 && Math.abs(v - ty) < 0.2 && solid(tile, u, v, out, 1, 0.2, 0.09)) {
      // Its picture: a sun and a hill, cut out of the fill.
      if (out.g === 0) {
        const lu = (u - tx) / tScale
        const lv = (v - ty) / tScale
        const sun = len(lu + 0.04, lv + 0.04) < 0.026
        const hill = Math.abs(lv - (0.045 - 0.03 * Math.sin(lu * 26))) < CH * 0.5 && Math.abs(lu) < 0.085
        if (sun) set(out, 1, 1, G.ring)
        else if (hill) set(out, 1, 1, G.tilde)
      }
      return true
    }
    if (u < hx + 0.03 && u > hx - 1.9 && v > hy - 0.1 && v < hy + 0.76) {
      if (solid(hand, u, v, out, 0, 0.08, 0.16)) {
        if (out.g === 0 && seams(u, v) < CH * 0.5) {
          grad(seams, u, v)
          set(out, 0.95, 0, stroke(-GY, GX))
        }
        return true
      }
    }

    // The phones. Inside a screen is paper, so the ground stops there.
    if (u < -0.52 || u > 0.74 || v < -0.97 || v > 0.95) return loose(u, v, out)
    if (line(FRONT, u, v, out, 1, 0)) return true
    if (FRONT(u, v) < 0) {
      if (!frontScreen(u, v, out)) set(out, 0, 0)
      return true
    }
    if (line(BACK, u, v, out, 0.75, 0)) return true
    if (BACK(u, v) < 0) {
      if (!backScreen(u, v, out)) set(out, 0, 0)
      return true
    }

    // A soft shadow under each phone, down and to the right.
    {
      const sh = Math.min(FRONT(u - 0.05, v - 0.06), BACK(u - 0.05, v - 0.06))
      if (sh < 0.03) {
        const k = smooth(0.03, -0.05, sh)
        if (fract((u * 31 + v * 17) * 3) < 0.55) return set(out, 0.1 + 0.12 * k, 0), true
      }
    }

    return loose(u, v, out)
  }

  /** Loose shapes beside the phones, hatched. */
  function loose(u: number, v: number, out: CellOut): boolean {
    if (u > 0.62 && u < 1.26 && v > -0.48 && v < 0.12) {
      const d = arch(u, v)
      if (near(d) || d < 0) {
        if (line(arch, u, v, out, 1, 0)) return true
        if (d < 0) {
          const a = Math.atan2(v + 0.12 - bob * 0.04, u - 0.94)
          hatch(out, a * 3.2, stroke(Math.cos(a), Math.sin(a)))
          return true
        }
      }
    }
    if (u > -1.08 && u < -0.42 && v > 0.36 && v < 0.65) {
      const d = pill(u, v)
      if (near(d) || d < 0) {
        if (line(pill, u, v, out, 1, 0)) return true
        if (d < 0) {
          hatch(out, (u - v) * 7, G.rise)
          return true
        }
      }
    }
    return false
  }

  /** The ground: moving contour lines over drifting glyphs, with the odd
   *  spark in the accent. Busy on purpose; it is meant to be read through
   *  glass, not looked at. */
  function ground(x: number, y: number, t: number, out: CellOut, f: FieldState) {
    const sx = Math.min(gw - 1.001, x / gStep)
    const sy = Math.min(gh - 1.001, y / gStepY)
    const i0 = Math.floor(sx)
    const j0 = Math.floor(sy)
    const ax = sx - i0
    const ay = sy - j0
    const k = j0 * gw + i0
    const w00 = (1 - ax) * (1 - ay)
    const w10 = ax * (1 - ay)
    const w01 = (1 - ax) * ay
    const w11 = ax * ay
    const quiet = gQuiet[k] * w00 + gQuiet[k + 1] * w10 + gQuiet[k + gw] * w01 + gQuiet[k + gw + 1] * w11
    if (quiet > 0.98) return set(out, 0, 0)
    const busy = gBusy[k] * w00 + gBusy[k + 1] * w10 + gBusy[k + gw] * w01 + gBusy[k + gw + 1] * w11
    const field = gField[k] * w00 + gField[k + 1] * w10 + gField[k + gw] * w01 + gField[k + gw + 1] * w11
    const fx = gDx[k] * w00 + gDx[k + 1] * w10 + gDx[k + gw] * w01 + gDx[k + gw + 1] * w11
    const fy = gDy[k] * w00 + gDy[k + 1] * w10 + gDy[k + gw] * w01 + gDy[k + gw + 1] * w11
    // Contours of the field: thin moving lines, drawn along themselves.
    const lv = field * 9
    const slope = len(fx, fy) || 1
    const gap = Math.abs(fract(lv) - 0.5) / (9 * 0.7 * slope)
    let b = 0
    let g = 0
    let a = 0
    if (gap < f.cy * 0.55) {
      b = 0.3 + 0.35 * busy
      g = stroke(-fy, fx)
    } else {
      // Between contours: glyphs flickering through the ramp, densest on the
      // rises of the field.
      const ci = Math.floor(x / f.cx)
      const ri = Math.floor(y / f.cy)
      const flick = hash(ci, ri + Math.floor(t * (3 + 5 * busy) + hash(ci, ri) * 9))
      const level = smooth(0.3, 0.8, field)
      b = flick < 0.22 + level * 0.36 + busy * 0.45 ? 0.07 + (0.2 + 0.5 * busy) * Math.max(level, busy * 0.85) * flick + 0.12 * busy : 0
      if (flick > 0.993 - busy * 0.012) {
        b = 0.7
        a = 1
        g = G.star
      }
    }
    set(out, b * (1 - quiet), a * (1 - quiet), g)
  }

  const motif: Motif = {
    still: 4.4,
    frame: (t, f) => {
      time = t
      CW = (f.cx * f.aspect) / layout.unit
      CH = f.cy / layout.unit
      const k = (t % CYCLE) / CYCLE
      bob = Math.sin(t * 0.9)

      // The tile: held at the screen's edge, carried in, set down, then
      // lifted away for the next go.
      const carry = smooth(0.1, 0.36, k)
      tx = -0.66 + 0.46 * carry
      ty = -0.2 - 0.05 * carry
      tRot = -0.22 * (1 - carry)
      tScale = smooth(0, 0.07, k) * (1 - smooth(0.88, 0.97, k))
      const back = smooth(0.5, 0.7, k) * (1 - smooth(0.9, 1, k))
      hx = tx - 0.12 - 0.3 * back
      hy = ty + 0.01 + 0.04 * back

      // The star: traced along its outline, filled, then cleared.
      drawn = smooth(0.04, 0.58, k)
      fill = smooth(0.6, 0.7, k) * (1 - smooth(0.9, 0.98, k))
      const reach = drawn * STAR_TOTAL
      let i = 0
      while (i < 15 && STAR_LEN[i + 1] < reach) i++
      const w = (reach - STAR_LEN[i]) / (STAR_LEN[i + 1] - STAR_LEN[i] || 1)
      const ox = STAR[i * 2] + (STAR[i * 2 + 2] - STAR[i * 2]) * w
      const oy = STAR[i * 2 + 1] + (STAR[i * 2 + 3] - STAR[i * 2 + 1]) * w
      // Off the page while the star is filled; back on to begin again.
      const lift = smooth(0.58, 0.66, k) * (1 - smooth(0.96, 1, k))
      px = ox + DX * 0.12 * lift + 0.01 * Math.sin(t * 7)
      py = oy + DY * 0.12 * lift + 0.01 * Math.cos(t * 6)

      // The drawing hand's bounds: pencil, palm and the arm off to the right.
      const cx = px + DX * 0.54 + NX * 0.14
      const cy = py + DY * 0.54 + NY * 0.14
      const ex = cx + DX * 0.95 + NX * 0.15
      const ey = cy + DY * 0.95 + NY * 0.15
      pu0 = Math.min(px, cx) - 0.22
      pu1 = Math.max(px + DX * 0.78, ex) + 0.2
      pv0 = Math.min(py, cy) - 0.22
      pv1 = Math.max(py + DY * 0.78, ey) + 0.2

      // The ground's grid.
      gStep = f.cx * 2
      gStepY = f.cy * 2
      const nw = Math.ceil(1 / gStep) + 2
      const nh = Math.ceil(1 / gStepY) + 2
      if (nw !== gw || nh !== gh) {
        gw = nw
        gh = nh
        gField = new Float32Array(nw * nh)
        gDx = new Float32Array(nw * nh)
        gDy = new Float32Array(nw * nh)
        gQuiet = new Float32Array(nw * nh)
        gBusy = new Float32Array(nw * nh)
        maskFor = ""
      }
      const key = `${layout.x},${layout.y},${layout.unit},${f.aspect},${JSON.stringify(layout.quiet)},${JSON.stringify(layout.busy)}`
      if (key !== maskFor) {
        maskFor = key
        for (let j = 0; j < gh; j++) {
          const y = j * gStepY
          for (let i = 0; i < gw; i++) {
            const x = i * gStep
            let quiet = 0
            for (const r of layout.quiet) {
              const dx = Math.max(r.x0 - x, 0, x - r.x1) * f.aspect
              const dy = Math.max(r.y0 - y, 0, y - r.y1)
              quiet = Math.max(quiet, 1 - smooth(0, 0.05, len(dx, dy)))
            }
            // Calmer around the illustration, so it reads first.
            const iu = ((x - layout.x) * f.aspect) / layout.unit + 0.1
            const iv = (y - layout.y) / layout.unit
            quiet = Math.max(quiet, 0.6 * Math.exp(-(iu * iu * 0.9 + iv * iv * 0.7)))
            let busy = 0
            for (const r of layout.busy) {
              const dx = Math.max(r.x0 - x, 0, x - r.x1) * f.aspect
              const dy = Math.max(r.y0 - y, 0, y - r.y1)
              busy = Math.max(busy, 1 - smooth(0, 0.08, len(dx, dy)))
            }
            gQuiet[j * gw + i] = quiet
            gBusy[j * gw + i] = busy
          }
        }
      }
      const e = 0.004
      for (let j = 0; j < gh; j++) {
        const y = j * gStepY
        for (let i = 0; i < gw; i++) {
          const X = i * gStep * f.aspect
          const n = j * gw + i
          gField[n] = noise(X * 3.2 + t * 0.09, y * 3.2 - t * 0.07) * 0.7 + noise(X * 7 - t * 0.2, y * 7 + t * 0.15) * 0.3
          gDx[n] = (noise((X + e) * 3.2 + t * 0.09, y * 3.2 - t * 0.07) - noise((X - e) * 3.2 + t * 0.09, y * 3.2 - t * 0.07)) / (2 * e)
          gDy[n] = (noise(X * 3.2 + t * 0.09, (y + e) * 3.2 - t * 0.07) - noise(X * 3.2 + t * 0.09, (y - e) * 3.2 - t * 0.07)) / (2 * e)
        }
      }

      type1 = 0.25 + 0.75 * smooth(0.05, 0.3, fract(t / 6))
      type2 = smooth(0.2, 0.42, fract(t / 6))
    },
    cell: (x, y, t, out, f) => {
      const u = ((x - layout.x) * f.aspect) / layout.unit
      const v = (y - layout.y) / layout.unit
      if (u > -2.8 && u < 2 && v > -1.2 && v < 2 && scene(u, v, out)) return
      ground(x, y, t, out, f)
    },
  }
  return { motif, place: (next) => Object.assign(layout, next) }
}
