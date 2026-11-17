import { G, grain, noise, onCell, outline, segment, smooth, stroke, type Motif } from "@/components/shared/ascii-field"

/**
 * The Approach field's six pictures, one per step, in order. The field
 * decodes from one into the next as the reader moves down the steps.
 */

// 01 Identify what cannot move: fixed anchors the flow bends around.
const ANCHORS = [
  [0.3, 0.28, 0.1],
  [0.7, 0.52, 0.12],
  [0.36, 0.77, 0.085],
] as const
const anchors = (): Motif => ({
  still: 2,
  cell: (x, y, t, out, f) => {
    const ax = x * f.aspect
    // A flow past cylinders: the stream function and its slope.
    let psi = y
    let px = 0
    let py = 1
    for (const [cx, cy, r] of ANCHORS) {
      const dx = ax - cx * f.aspect
      const dy = y - cy
      const d2 = dx * dx + dy * dy
      const d = Math.sqrt(d2)
      // The anchor: a ring, fixed, in the accent; a mark at its centre.
      if (Math.abs(d - r) < f.cy * 0.5) {
        out.b = 0.95
        out.g = G.hash
        out.a = 1
        return
      }
      if (onCell(x, cx, f.cx) && onCell(y, cy, f.cy)) {
        out.b = 1
        out.g = G.plus
        out.a = 1
        return
      }
      if (d < r) {
        out.b = 0
        return
      }
      const k = r * r
      psi -= (k * dy) / d2
      px += (2 * k * dx * dy) / (d2 * d2)
      py -= (k * (dx * dx - dy * dy)) / (d2 * d2)
    }
    // Streamlines every 1/14 of psi, one cell thick, drawn along the flow.
    const n = psi * 14
    const near = Math.abs(n - Math.round(n)) / (14 * Math.hypot(px, py))
    if (near < f.cy * 0.5) {
      const travel = 0.5 + 0.5 * Math.sin(ax * 18 - t * 2.2 + Math.round(n) * 1.7)
      out.b = 0.25 + 0.5 * travel
      out.g = stroke(py, -px)
      out.a = 0
      return
    }
    out.b = grain(x, y, t)
  },
})

// 02 Map the moving parts: components in motion, joined by their handoffs.
const parts = (): Motif => {
  const N = 6
  const nodes = new Float32Array(N * 2)
  const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4], [0, 3]]
  let pulse = 0
  return {
    still: 1.5,
    frame: (t) => {
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + t * 0.14
        const r = 0.3 + 0.05 * Math.sin(t * 0.6 + i * 1.7)
        nodes[i * 2] = 0.5 + Math.cos(a) * r * 0.9
        nodes[i * 2 + 1] = 0.5 + Math.sin(a) * r * 0.72
      }
      pulse = (t * 0.45) % 1
    },
    cell: (x, y, t, out, f) => {
      // The parts: small boxes, each with a live centre.
      for (let i = 0; i < N; i++) {
        const nx = nodes[i * 2]
        const ny = nodes[i * 2 + 1]
        const hw = f.cx * 2
        const hh = f.cy * 1
        const edge = outline(x, y, nx, ny, hw, hh, f)
        if (edge) {
          out.b = 0.85
          out.g = edge
          out.a = 0.6
          return
        }
        if (Math.abs(x - nx) < hw && Math.abs(y - ny) < hh) {
          out.b = onCell(x, nx, f.cx) ? 1 : 0
          out.g = G.at
          out.a = 1
          return
        }
      }
      // The handoffs: dotted lines along each edge, a packet travelling.
      out.b = grain(x, y, t)
      const ax = x * f.aspect
      for (let e = 0; e < EDGES.length; e++) {
        const [i, j] = EDGES[e]
        const x0 = nodes[i * 2] * f.aspect
        const y0 = nodes[i * 2 + 1]
        const x1 = nodes[j * 2] * f.aspect
        const y1 = nodes[j * 2 + 1]
        if (segment(ax, y, x0, y0, x1, y1) > f.cy * 0.5) continue
        const k = (pulse + e * 0.17) % 1
        const hx = x0 + (x1 - x0) * k
        const hy = y0 + (y1 - y0) * k
        if (Math.hypot(ax - hx, y - hy) < f.cy * 1.2) {
          out.b = 1
          out.g = G.star
          out.a = 1
        } else {
          out.b = 0.4
          out.g = stroke(x1 - x0, y1 - y0)
          out.a = 0
        }
        return
      }
    },
  }
}

// 03 Choose the smallest proof: the field narrows to one small square.
const proof = (): Motif => {
  let hw = 0.4
  let hh = 0.4
  let held = 0
  return {
    still: 3.9,
    frame: (t, f) => {
      const k = (t % 7) / 7
      // Narrow, hold the proof, let the field back in.
      const s = smooth(0.06, 0.5, k) * (1 - smooth(0.86, 1, k))
      const size = 0.42 - s * 0.34
      hw = size
      hh = size * Math.min(1.25, f.aspect)
      held = smooth(0.5, 0.58, k) * (1 - smooth(0.82, 0.88, k))
    },
    cell: (x, y, t, out, f) => {
      const edge = outline(x, y, 0.5, 0.5, hw, hh, f)
      if (edge) {
        out.b = 0.9
        out.g = edge
        out.a = 0.3 + 0.7 * held
        return
      }
      const inside = Math.abs(x - 0.5) < hw && Math.abs(y - 0.5) < hh
      // The field of options: everywhere, faint outside the frame.
      const v = noise(x * 8 + t * 0.25, y * 8 - t * 0.18)
      if (inside) {
        if (held > 0.05) {
          out.b = 0.4 + 0.5 * held
          out.g = (Math.floor(x / f.cx) + Math.floor(y / f.cy)) % 2 ? G.hash : G.plus
          out.a = held
        } else {
          out.b = v > 0.62 ? 0.5 : v > 0.45 ? 0.3 : 0
          out.g = v > 0.62 ? G.plus : G.colon
        }
      } else {
        out.b = v > 0.6 ? 0.22 : grain(x, y, t)
        out.g = v > 0.6 ? G.colon : 0
      }
    },
  }
}

// 04 Prototype the risk: turbulence where the cursor is, calm elsewhere.
const risk = (): Motif => {
  let rx = 0.5
  let ry = 0.5
  return {
    still: 2.4,
    frame: (t, f) => {
      // With no pointer, the unknown wanders; with one, it follows it.
      const wx = 0.5 + 0.26 * Math.sin(t * 0.33)
      const wy = 0.5 + 0.28 * Math.sin(t * 0.27 + 1.3)
      rx = wx + (f.px - wx) * f.pull
      ry = wy + (f.py - wy) * f.pull
    },
    cell: (x, y, t, out, f) => {
      const dx = (x - rx) * f.aspect
      const dy = y - ry
      const d = Math.hypot(dx, dy)
      const storm = Math.exp(-(d * d) / 0.02)
      // A calm grid: the known parts, in order.
      const grid = onCell(x, Math.round(x * 8) / 8, f.cx) && onCell(y, Math.round(y * 10) / 10, f.cy)
      if (storm < 0.08) {
        out.b = grid ? 0.4 : grain(x, y, t)
        out.g = grid ? G.plus : 0
        return
      }
      // The storm: glyphs turning with a swirl around the unknown.
      const a = Math.atan2(dy, dx) + 1.4 + noise(d * 8 - t * 1.2, t * 0.4) * 1.5
      const v = noise(Math.cos(a) * 3 + d * 10 - t * 1.4, Math.sin(a) * 3 + t * 0.5)
      out.b = storm * (0.35 + 0.65 * v)
      out.g = v > 0.72 ? G.star : v < 0.3 ? G.dot : stroke(Math.cos(a), Math.sin(a))
      out.a = storm * smooth(0.35, 0.75, v)
    },
  }
}

// 05 Make alignment concrete: scattered marks snap into one rule.
const align = (): Motif => {
  const N = 22
  const home = Array.from({ length: N }, (_, i) => {
    const s = Math.sin(i * 91.7) * 43758.5
    const s2 = Math.sin(i * 47.3 + 3) * 24634.6
    return [0.1 + 0.8 * (s - Math.floor(s)), 0.1 + 0.8 * (s2 - Math.floor(s2))] as const
  })
  const pos = new Float32Array(N * 2)
  let snap = 0
  return {
    still: 3.6,
    frame: (t) => {
      const k = (t % 7) / 7
      snap = smooth(0.12, 0.45, k) * (1 - smooth(0.84, 0.98, k))
      for (let i = 0; i < N; i++) {
        // Each mark a little late or early, so the snap reads as agreement.
        const own = smooth(0, 1, Math.min(1, snap * 1.35 - (i % 5) * 0.07))
        const [hx, hy] = home[i]
        const jx = hx + 0.015 * Math.sin(t * 0.9 + i)
        const jy = hy + 0.015 * Math.cos(t * 0.8 + i * 1.3)
        pos[i * 2] = jx + (0.12 + (0.76 * i) / (N - 1) - jx) * own
        pos[i * 2 + 1] = jy + (0.5 - jy) * own
      }
    },
    cell: (x, y, t, out, f) => {
      for (let i = 0; i < N; i++) {
        if (onCell(x, pos[i * 2], f.cx) && onCell(y, pos[i * 2 + 1], f.cy)) {
          out.b = 1
          out.g = snap > 0.9 ? G.plus : G.at
          out.a = snap
          return
        }
      }
      // The rule they agree on, drawn in as they arrive.
      if (onCell(y, 0.5 + 0.0001, f.cy) && x > 0.1 && x < 0.9) {
        out.b = 0.2 + 0.6 * snap
        out.g = G.floor
        out.a = snap
        return
      }
      out.b = grain(x, y, t)
    },
  }
}

// 06 Systematize what works: one proven tile, repeated.
const tiles = (): Motif => ({
  still: 2.2,
  cell: (x, y, t, out, f) => {
    const n = 3
    const w = 1 / n
    const h = w * f.aspect
    const ix = Math.floor(x / w)
    const iy = Math.floor(y / h)
    const cx = (ix + 0.5) * w
    const cy = (iy + 0.5) * h
    if (cy + h * 0.38 > 1) {
      out.b = grain(x, y, t)
      return
    }
    // The wave of repetition runs out from the first tile.
    const wave = 0.5 + 0.5 * Math.sin((ix + iy) * 1.1 - t * 1.6)
    const origin = ix === 0 && iy === 0
    const lit = origin ? 1 : smooth(0.8, 1, wave) * 0.8
    const b = 0.35 + 0.55 * (origin ? 1 : wave)
    // The tile: a frame, a title bar, a line, a control. Same everywhere.
    const edge = outline(x, y, cx, cy, w * 0.38, h * 0.38, f)
    let g = edge
    if (!g && onCell(y, cy - h * 0.2, f.cy) && Math.abs(x - cx) < w * 0.26) g = G.equals
    else if (!g && onCell(y, cy, f.cy) && Math.abs(x - cx) < w * 0.26) g = G.dash
    else if (!g && onCell(y, cy + h * 0.2, f.cy) && x > cx + w * 0.06 && x < cx + w * 0.26) g = G.hash
    if (g) {
      out.b = b
      out.g = g
      out.a = lit
    } else out.b = grain(x, y, t)
  },
})

export const approachFields = (): Motif[] => [anchors(), parts(), proof(), risk(), align(), tiles()]
