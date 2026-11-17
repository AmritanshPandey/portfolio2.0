import {
  G,
  box,
  clamp01,
  grain,
  noise,
  onCell,
  onCurve,
  outline,
  smooth,
  stroke,
  type FieldState,
  type Motif,
} from "@/components/shared/ascii-field"
import { drorRevenueVsRestrictions } from "@/lib/data/dror"

/**
 * The work rows' ASCII specimens: each draws its study's mechanism as a
 * field of type (see AsciiField). Same subjects as the drawn specimens they
 * replaced, from the same case-study data. Hovering the row (energy) runs
 * the mechanism faster.
 */

/** A clock that runs faster with energy without jumping when it changes. */
function pace(base: number, boost: number) {
  let last = 0
  let phase = 0
  return (t: number, f: FieldState) => {
    // A jump (the still frame's held moment) sets the clock outright.
    if (t < last || t - last > 0.5) phase = t * base
    else phase += (t - last) * (base + boost * f.energy)
    last = t
    return phase
  }
}

/* ── PartnerBank: one component, three bank skins ──────────────────────── */

// Three cards with the same layout; only the skin (the fill) differs. The
// lit card is the deal on the table, and the deal moves along.
const CARD_X = [0.19, 0.5, 0.81]
const skin = (k: number, lx: number, ly: number, t: number) => {
  if (k === 0) return Math.sin((lx * 1.6 + ly) * 30 - t * 1.4) > 0.55 ? G.rise : 0
  if (k === 1) return (Math.round(lx * 40) + Math.round(ly * 22)) % 3 === 0 ? G.dot : 0
  return Math.sin(ly * 34 + t * 1.1) > 0.6 ? G.colon : 0
}
const banks = (): Motif => {
  const clock = pace(0.42, 0.5)
  let lit = 0
  let turn = 0
  return {
    still: 0.8,
    frame: (t, f) => {
      const at = clock(t, f)
      lit = Math.floor(at) % 3
      turn = at - Math.floor(at)
    },
    cell: (x, y, t, out, f) => {
      out.b = grain(x, y, t)
      for (let k = 0; k < 3; k++) {
        const cx = CARD_X[k]
        const cy = 0.5 + (k === lit ? -0.035 * smooth(0, 0.25, turn) * (1 - smooth(0.8, 1, turn)) : 0)
        const hw = 0.135
        const hh = 0.3
        if (box(x, y, cx, cy, hw, hh) > Math.max(f.cx, f.cy)) continue
        const on = k === lit
        const glow = on ? smooth(0, 0.18, turn) * (1 - smooth(0.82, 1, turn)) : 0
        out.a = glow
        const edge = outline(x, y, cx, cy, hw, hh, f)
        if (edge) {
          out.b = 0.75
          out.g = edge
          return
        }
        if (box(x, y, cx, cy, hw, hh) > 0) continue
        const lx = (x - (cx - hw)) / (hw * 2)
        const ly = (y - (cy - hh)) / (hh * 2)
        // The layout every bank shares: chip, masked number, holder.
        if (box(lx, ly, 0.2, 0.27, 0.08, 0.08) < 0) {
          out.b = 0.9
          out.g = G.hash
          return
        }
        if (Math.abs(ly - 0.63) < 0.04 && lx > 0.08 && lx < 0.92) {
          // Four groups of four, masked.
          const slot = Math.floor(((lx - 0.08) / 0.84) * 19)
          out.b = slot % 5 === 4 ? 0 : 0.7
          out.g = G.star
          return
        }
        if (Math.abs(ly - 0.8) < 0.035 && lx > 0.08 && lx < 0.5) {
          out.b = 0.5
          out.g = G.dash
          return
        }
        // The skin: rebuilt as the deal arrives.
        const g = skin(k, lx, ly, t)
        const settled = on ? smooth(0, 0.3, turn) : 1
        if (g && noise(lx * 9, ly * 9) < settled + 0.1) {
          out.b = 0.32
          out.g = g
        } else out.b = 0
        return
      }
    },
  }
}

/* ── Agent Pay: the anxiety curve, with the guardian moments lit ───────── */

// The study's curve (x 40..660 of 700, smaller y is higher), as 0..1.
const ANXIETY = [
  [40, 133], [120, 140], [180, 142], [240, 128], [290, 112], [320, 70], [340, 56], [380, 46],
  [420, 42], [440, 45], [480, 50], [510, 66], [540, 73], [590, 100], [600, 132], [660, 133],
].map(([x, y]) => [x / 700, 0.24 + ((y - 40) / 105) * 0.52] as const)
const curveAt = (x: number) => {
  if (x <= ANXIETY[0][0]) return ANXIETY[0][1]
  for (let i = 1; i < ANXIETY.length; i++) {
    const [x1, y1] = ANXIETY[i]
    if (x <= x1) {
      const [x0, y0] = ANXIETY[i - 1]
      const k = (x - x0) / (x1 - x0)
      return y0 + (y1 - y0) * (k * k * (3 - 2 * k))
    }
  }
  return ANXIETY[ANXIETY.length - 1][1]
}
const slopeAt = (x: number) => (curveAt(x + 0.004) - curveAt(x - 0.004)) / 0.008
const GUARDIAN = [340 / 700, 440 / 700, 540 / 700]
const BRAND = [290 / 700, 590 / 700] as const
const BASE = 0.84
const guardian = (): Motif => {
  const clock = pace(0.13, 0.12)
  let walker = 0
  return {
    still: 6.8,
    frame: (t, f) => {
      walker = 0.04 + (clock(t, f) % 1.2) * 0.92
    },
    cell: (x, y, t, out, f) => {
      out.b = grain(x, y, t)
      if (x < 0.05 || x > 0.95) return
      const cy = curveAt(x)
      const inBrand = x > BRAND[0] && x < BRAND[1]
      // Where the brand is present: a dotted frame, silent everywhere else.
      if (inBrand && onCell(y, 0.13, f.cy)) {
        out.b = 0.45
        out.g = G.dot
        out.a = 0.8
      }
      if ((onCell(x, BRAND[0], f.cx) || onCell(x, BRAND[1], f.cx)) && y > 0.13 && y < BASE) {
        out.b = 0.45
        out.g = G.colon
        out.a = 0.8
      }
      // The base line.
      if (onCell(y, BASE, f.cy)) {
        out.b = 0.35
        out.g = G.floor
        out.a = 0
        return
      }
      // Under the curve, a falling haze.
      if (y > cy + f.cy && y < BASE) {
        const depth = (y - cy) / (BASE - cy)
        if (noise(x * 60, y * 40 + t * 0.2) > 0.25 + depth * 0.7) {
          out.b = 0.2
          out.g = G.dot
          out.a = inBrand ? 0.35 : 0
        }
      }
      // The line; once the reader has passed, it is lit.
      const s = slopeAt(x)
      if (onCurve(y, cy, s, f)) {
        const passed = x < walker
        out.b = passed ? 0.95 : 0.6
        out.g = stroke(1, s, f.aspect)
        out.a = passed && inBrand ? 1 : passed ? 0.25 : 0
      }
      // The guardian moments: marked on the curve, ringing once reached.
      for (let i = 0; i < 3; i++) {
        const gx = GUARDIAN[i]
        const gy = curveAt(gx) - f.cy * 1.6
        const d = Math.hypot((x - gx) * f.aspect, y - gy)
        const since = walker - gx
        if (onCell(x, gx, f.cx) && onCell(y, gy, f.cy)) {
          out.b = 1
          out.g = since > 0 ? G.at : G.ring
          out.a = since > 0 ? 1 : 0.6
        } else if (since > 0 && since < 0.25) {
          const r = 0.02 + since * 0.5
          if (onCell(d, r, f.cy)) {
            out.b = 0.5 * (1 - since / 0.25) + 0.1
            out.g = G.dot
            out.a = 1
          }
        }
      }
      // The reader.
      if (walker < 0.95 && Math.abs(x - walker) < f.cx * 0.6 && Math.abs(y - curveAt(walker)) < f.cy * 0.6) {
        out.b = 1
        out.g = G.at
        out.a = 1
      }
    },
  }
}

/* ── Honasa: one backbone under three storefronts ──────────────────────── */

const STORE_X = [0.21, 0.5, 0.79]
const backbone = (): Motif => {
  const clock = pace(0.28, 0.3)
  let sweep = 0
  return {
    still: 1.5,
    frame: (t, f) => {
      sweep = clock(t, f) % 1.5
    },
    cell: (x, y, t, out, f) => {
      out.b = grain(x, y, t)
      // The shared spine, with the lit sweep running along it.
      if (onCell(y, 0.9, f.cy) && x > 0.1 && x < 0.9) {
        const lit = 1 - smooth(0, 0.06, Math.abs(x - (0.08 + sweep * 0.62)))
        out.b = 0.45 + 0.5 * lit
        out.g = G.equals
        out.a = lit
        return
      }
      for (let k = 0; k < 3; k++) {
        const cx = STORE_X[k]
        const hw = 0.11
        const top = 0.1
        const bottom = 0.8
        const lit = smooth(0, 0.08, sweep - 0.14 - k * 0.3) * (1 - smooth(0.25, 0.4, sweep - 0.14 - k * 0.3))
        // Each store hangs off the spine.
        if (onCell(x, cx, f.cx) && y > bottom && y < 0.9) {
          out.b = 0.4 + 0.5 * lit
          out.g = G.bar
          out.a = lit
          return
        }
        const edge = outline(x, y, cx, (top + bottom) / 2, hw, (bottom - top) / 2, f)
        if (edge) {
          out.b = 0.7
          out.g = edge
          return
        }
        if (Math.abs(x - cx) > hw || y < top || y > bottom) continue
        const lx = (x - (cx - hw)) / (hw * 2)
        const ly = (y - top) / (bottom - top)
        // The skeleton, the same in every store.
        let g = 0
        if (ly > 0.07 && ly < 0.12 && lx > 0.12 && lx < 0.55) g = G.equals
        else if (box(lx, ly, 0.5, 0.34, 0.34, 0.15) < 0) g = noise(lx * 14 + k * 3, ly * 10) > 0.45 ? G.hash : G.plus
        else if (Math.abs(ly - 0.6) < 0.025 && lx > 0.12 && lx < 0.88) g = G.dash
        else if (Math.abs(ly - 0.68) < 0.025 && lx > 0.12 && lx < 0.6) g = G.dash
        else if (box(lx, ly, 0.5, 0.86, 0.36, 0.05) < 0) g = G.equals
        if (g) {
          out.b = 0.4 + 0.5 * lit
          out.g = g
          out.a = lit
        } else {
          // Each store's own texture, in the gaps.
          out.b = (Math.round(lx * 30) + Math.round(ly * 40) * (k + 1)) % (4 + k) === 0 ? 0.14 : 0
          out.g = G.dot
        }
        return
      }
    },
  }
}

/* ── DROR Labs: revenue against restrictions, and the turn ─────────────── */

const DROR = drorRevenueVsRestrictions
const maxRev = Math.max(...DROR.map((d) => d.revenue))
const maxCovid = Math.max(...DROR.map((d) => d.covid))
const peakAt = 0.07 + (DROR.findIndex((d) => d.revenue === maxRev) / (DROR.length - 1)) * 0.86
const series = (key: "revenue" | "covid", max: number) => (x: number) => {
  const p = clamp01((x - 0.07) / 0.86) * (DROR.length - 1)
  const i = Math.min(DROR.length - 2, Math.floor(p))
  const k = p - i
  const v = DROR[i][key] + (DROR[i + 1][key] - DROR[i][key]) * (k * k * (3 - 2 * k))
  return 0.84 - (v / max) * 0.64
}
const revenue = series("revenue", maxRev)
const covid = series("covid", maxCovid)
const slope = (fn: (x: number) => number, x: number) => (fn(x + 0.004) - fn(x - 0.004)) / 0.008
const pivot = (): Motif => {
  const clock = pace(0.11, 0.12)
  let reading = 0
  return {
    still: 6.2,
    frame: (t, f) => {
      reading = 0.07 + ((clock(t, f) % 1.25) - 0.05) * 0.86
    },
    cell: (x, y, t, out, f) => {
      out.b = grain(x, y, t)
      if (x < 0.06 || x > 0.94) return
      const ry = revenue(x)
      const cy = covid(x)
      if (onCell(y, 0.86, f.cy)) {
        out.b = 0.35
        out.g = G.floor
        return
      }
      // Revenue's area: a haze, brighter near the line.
      if (y > ry + f.cy && y < 0.86) {
        const depth = (y - ry) / (0.86 - ry)
        if (noise(x * 60, y * 40) > 0.2 + depth * 0.75) {
          out.b = 0.22
          out.g = G.colon
          out.a = 0.4
        }
      }
      // The reading line.
      const reads = onCell(x, reading, f.cx)
      if (reads && y > 0.14 && y < 0.86) {
        out.b = 0.3
        out.g = G.colon
      }
      // Restrictions: graphite, dashed, falling away.
      const cs = slope(covid, x)
      if (onCurve(y, cy, cs, f) && Math.floor(x / f.cx) % 3 !== 2) {
        out.b = 0.5
        out.g = stroke(1, cs, f.aspect)
        out.a = 0
      }
      // Revenue: the line that turned, lit up to the reading.
      const rs = slope(revenue, x)
      if (onCurve(y, ry, rs, f)) {
        out.b = 0.95
        out.g = stroke(1, rs, f.aspect)
        out.a = x < reading ? 1 : 0.3
      }
      // The peak, where the pivot came.
      const d = Math.hypot((x - peakAt) * f.aspect, y - (revenue(peakAt) - f.cy * 1.6))
      if (onCell(x, peakAt, f.cx) && onCell(y, revenue(peakAt) - f.cy * 1.6, f.cy)) {
        out.b = 1
        out.g = G.at
        out.a = 1
      } else if (Math.abs(d - (0.05 + 0.012 * Math.sin(t * 2.4))) < f.cy * 0.45) {
        out.b = 0.45
        out.g = G.dot
        out.a = 1
      }
      if (reads && onCurve(y, ry, rs, f)) {
        out.g = G.at
        out.a = 1
      }
    },
  }
}

/* ── Email builder: blocks from the library into the email ─────────────── */

// Library entries on the left, the email's slots on the right. One block at
// a time travels across and lands in its slot; then the email clears.
const SLOT = [
  { y: 0.29, h: 0.12 }, // hero
  { y: 0.5, h: 0.06 }, // editorial
  { y: 0.64, h: 0.035 }, // call to action
  { y: 0.76, h: 0.03 }, // legal footer
]
const LIB_Y = [0.3, 0.42, 0.54, 0.66]
const ease = (k: number) => 1 - Math.pow(1 - k, 3)
const slotGlyph = (i: number, x: number, y: number, t: number) => {
  if (i === 0) return noise(x * 26, y * 20 + t * 0.25) > 0.5 ? G.hash : G.plus
  if (i === 1) return Math.round((y - 0.44) * 60) % 2 === 0 && Math.sin(x * 90) > -0.6 ? G.dash : 0
  if (i === 2) return x < 0.6 ? G.equals : 0
  return Math.sin(x * 110) > 0.2 ? G.dot : 0
}
const email = (): Motif => {
  const clock = pace(0.55, 0.6)
  let moving = 0
  let travel = 0
  return {
    still: 4.6 / 0.55,
    frame: (t, f) => {
      const at = clock(t, f) % 5
      moving = Math.floor(at)
      travel = at - moving
    },
    cell: (x, y, t, out, f) => {
      out.b = grain(x, y, t)
      // The library.
      for (let i = 0; i < 4; i++) {
        if (onCell(y, LIB_Y[i], f.cy) && x > 0.08 && x < 0.3) {
          const lit = i === moving ? 1 - smooth(0.5, 1, travel) : 0
          out.b = 0.4 + 0.5 * lit
          out.g = onCell(x, 0.09, f.cx) ? G.ring : G.dash
          out.a = lit
          return
        }
      }
      // The email.
      const edge = outline(x, y, 0.65, 0.5, 0.22, 0.38, f)
      if (edge) {
        out.b = 0.7
        out.g = edge
        return
      }
      if (box(x, y, 0.65, 0.5, 0.22, 0.38) > 0) {
        // The travelling block crosses the gap.
        if (moving < 4 && travel <= 0.7) {
          const k = ease(travel / 0.7)
          const s = SLOT[moving]
          if (box(x, y, 0.19 + 0.46 * k, LIB_Y[moving] + (s.y - LIB_Y[moving]) * k, 0.06 + 0.11 * k, s.h * (0.5 + 0.5 * k)) < 0) {
            out.b = 0.9
            out.g = slotGlyph(moving, x, y, t) || G.star
            out.a = 1
          }
        }
        return
      }
      for (let i = 0; i < 4; i++) {
        const s = SLOT[i]
        if (box(x, y, 0.65, s.y, 0.17, s.h) > 0) continue
        const filled = moving === 4 ? travel < 0.6 : i < moving || (i === moving && travel > 0.7)
        if (filled) {
          const g = slotGlyph(i, x, y, t)
          const flash = i === moving && moving < 4 ? 1 - smooth(0.7, 1, travel) : 0
          out.b = g ? (i === 2 ? 0.9 : 0.6) : 0
          out.g = g
          out.a = Math.max(flash, i === 2 ? 0.8 : 0)
        } else if (outline(x, y, 0.65, s.y, 0.17, s.h, f) && Math.floor(x / f.cx) % 2 === 0) {
          out.b = 0.2
          out.g = G.dot
        }
        return
      }
    },
  }
}

const FIELDS: Record<string, () => Motif> = {
  "white-label-rfp": banks,
  "agent-commerce": guardian,
  "d2c-platform": backbone,
  "citizen-safety": pivot,
  "email-builder": email,
}

/** A fresh motif for the study, or undefined when it has none. */
export const workField = (slug: string): Motif | undefined => FIELDS[slug]?.()
