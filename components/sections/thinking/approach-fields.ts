import { smooth, type FieldState, type Motif } from "@/components/shared/ascii-field"

/**
 * The Approach field's six pictures, one per step, in order. Each is a small
 * lit 3D scene, raymarched per glyph cell: the light ramp ( .:-=+*#%@) does
 * the shading, a dotted floor and a contact shadow ground it, and accent
 * marks the one thing the step is about. The pointer turns the camera.
 * The field decodes from one scene into the next as the reader moves down.
 */

type Sdf = (x: number, y: number, z: number) => number

// The material of the surface the last sdf call found nearest: 0 graphite,
// 1 accent. Set inside each scene's sdf, read once at the hit point.
let mat = 0

const DIST = 4.8
const FOCAL = 2.7
const STEPS = 64

/* ── Shapes ──────────────────────────────────────────────────────────────── */

const len3 = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z)
const sphere = (x: number, y: number, z: number, r: number) => len3(x, y, z) - r
function box(x: number, y: number, z: number, bx: number, by: number, bz: number, r = 0) {
  const qx = Math.abs(x) - bx + r
  const qy = Math.abs(y) - by + r
  const qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
/** A cube's twelve edges as bars of half-thickness e. */
function frameBox(x: number, y: number, z: number, b: number, e: number) {
  const px = Math.abs(x) - b
  const py = Math.abs(y) - b
  const pz = Math.abs(z) - b
  const qx = Math.abs(px + e) - e
  const qy = Math.abs(py + e) - e
  const qz = Math.abs(pz + e) - e
  const part = (ax: number, ay: number, az: number) =>
    len3(Math.max(ax, 0), Math.max(ay, 0), Math.max(az, 0)) + Math.min(Math.max(ax, ay, az), 0)
  return Math.min(part(px, qy, qz), part(qx, py, qz), part(qx, qy, pz))
}
function capsule(x: number, y: number, z: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, r: number) {
  const px = x - ax
  const py = y - ay
  const pz = z - az
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const h = Math.min(1, Math.max(0, (px * dx + py * dy + pz * dz) / (dx * dx + dy * dy + dz * dz || 1)))
  return len3(px - dx * h, py - dy * h, pz - dz * h) - r
}

/* ── The renderer ────────────────────────────────────────────────────────── */

interface Cam {
  yaw: number
  pitch: number
}

interface Scene {
  still: number
  /** The floor's height, in scene units (the frame is about ±1.9 tall). */
  floor: number
  /** Radius of a sphere at the origin holding everything: rays that miss it
   *  skip the march. */
  bound: number
  view: (t: number, f: FieldState, cam: Cam) => void
  frame?: (t: number, f: FieldState) => void
  sdf: Sdf
}

function scene(s: Scene): Motif {
  const cam: Cam = { yaw: 0, pitch: 0 }
  // Camera basis and light, in scene space, refreshed each frame.
  let cy = 1
  let sy = 0
  let cp = 1
  let sp = 0
  let ox = 0
  let oy = 0
  let oz = -DIST
  let lx = 0
  let ly = 1
  let lz = 0

  // View space to scene space: pitch about x, then yaw about y.
  let rx = 0
  let ry = 0
  let rz = 0
  const rot = (x: number, y: number, z: number) => {
    const y1 = y * cp - z * sp
    const z1 = y * sp + z * cp
    rx = x * cy + z1 * sy
    ry = y1
    rz = -x * sy + z1 * cy
  }

  return {
    still: s.still,
    frame: (t, f) => {
      s.view(t, f, cam)
      // The pointer turns the camera a little: the scene leans toward it.
      const yaw = cam.yaw + (f.px - 0.5) * f.pull * 0.9
      const pitch = cam.pitch + (f.py - 0.5) * f.pull * 0.45
      cy = Math.cos(yaw)
      sy = Math.sin(yaw)
      cp = Math.cos(pitch)
      sp = Math.sin(pitch)
      rot(0, 0, -DIST)
      ox = rx
      oy = ry
      oz = rz
      // Key light from the upper left, a little in front.
      rot(-0.52, 0.72, -0.46)
      const il = 1 / len3(rx, ry, rz)
      lx = rx * il
      ly = ry * il
      lz = rz * il
      s.frame?.(t, f)
    },
    cell: (x, y, _t, out, f) => {
      out.g = 0
      rot((x - 0.5) * 2 * f.aspect, (0.5 - y) * 2, FOCAL)
      const il = 1 / len3(rx, ry, rz)
      const dx = rx * il
      const dy = ry * il
      const dz = rz * il

      // Does the ray pass the bounding sphere at all?
      const bq = ox * dx + oy * dy + oz * dz
      const disc = bq * bq - (ox * ox + oy * oy + oz * oz - s.bound * s.bound)
      if (disc > 0) {
        let d = Math.max(0, -bq - Math.sqrt(disc))
        const end = -bq + Math.sqrt(disc)
        for (let i = 0; i < STEPS && d < end; i++) {
          const px = ox + dx * d
          const py = oy + dy * d
          const pz = oz + dz * d
          const h = s.sdf(px, py, pz)
          if (h < 0.003) {
            // Normal from four taps.
            const e = 0.004
            const a = s.sdf(px + e, py - e, pz - e)
            const b = s.sdf(px - e, py - e, pz + e)
            const c = s.sdf(px - e, py + e, pz - e)
            const g = s.sdf(px + e, py + e, pz + e)
            let nx = a - b - c + g
            let ny = -a - b + c + g
            let nz = -a + b - c + g
            const nl = 1 / (len3(nx, ny, nz) || 1)
            nx *= nl
            ny *= nl
            nz *= nl
            s.sdf(px, py, pz)
            const accent = mat
            const diff = Math.max(0, nx * lx + ny * ly + nz * lz)
            // Blinn highlight and a rim, so round forms read as round.
            let hx = lx - dx
            let hy = ly - dy
            let hz = lz - dz
            const hl = 1 / (len3(hx, hy, hz) || 1)
            hx *= hl
            hy *= hl
            hz *= hl
            const spec = Math.pow(Math.max(0, nx * hx + ny * hy + nz * hz), 28)
            const rim = Math.pow(1 - Math.max(0, -(nx * dx + ny * dy + nz * dz)), 3)
            out.b = Math.min(1, 0.13 + 0.72 * diff + 0.35 * spec + 0.18 * rim)
            out.a = accent ? 0.75 + 0.25 * diff : spec * 0.8
            return
          }
          d += h
        }
      }

      // The floor: only the scene's soft contact shadow, so the form sits
      // on something without a horizon cutting the frame.
      out.b = 0
      if (dy >= -0.001) return
      const tf = (s.floor - oy) / dy
      if (tf <= 0) return
      const fx = ox + dx * tf
      const fz = oz + dz * tf
      const fade = smooth(9, 4, tf)
      if (fade <= 0) return
      if (fx * fx + fz * fz > (s.bound + 0.8) * (s.bound + 0.8)) return
      const shade = 1 - smooth(0.0, 0.35, s.sdf(fx, s.floor, fz))
      out.b = 0.2 * shade * shade * fade
      out.a = 0
    },
  }
}

/* ── 01 Identify what cannot move ─────────────────────────────────────────
   A fixed block, in the accent, while a ring of parts circles it. */
const anchor = (): Motif => {
  const N = 9
  const orb = new Float32Array(N * 3)
  return scene({
    still: 2.6,
    floor: -0.85,
    bound: 1.75,
    view: (_t, _f, cam) => {
      cam.yaw = 0.62
      cam.pitch = 0.42
    },
    frame: (t) => {
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + t * 0.55
        orb[i * 3] = Math.cos(a) * 1.38
        orb[i * 3 + 1] = -0.05 + 0.32 * Math.sin(a * 2 + t * 0.4)
        orb[i * 3 + 2] = Math.sin(a) * 1.38
      }
    },
    sdf: (x, y, z) => {
      const block = box(x, y + 0.2, z, 0.5, 0.65, 0.5, 0.05)
      let d = block
      mat = 1
      for (let i = 0; i < N; i++) {
        const o = sphere(x - orb[i * 3], y - orb[i * 3 + 1], z - orb[i * 3 + 2], i % 3 ? 0.13 : 0.17)
        if (o < d) {
          d = o
          mat = 0
        }
      }
      return d
    },
  })
}

/* ── 02 Map the moving parts ──────────────────────────────────────────────
   The parts and their handoffs as a turning graph; one packet travels it. */
const VERTS = [
  [1, 0, 0],
  [0, 0, 1],
  [-1, 0, 0],
  [0, 0, -1],
  [0, 1, 0],
  [0, -1, 0],
] as const
const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [0, 4], [1, 4], [2, 4], [3, 4],
  [0, 5], [1, 5], [2, 5], [3, 5],
] as const
// The packet's route: around the waist, up, over and down.
const ROUTE = [0, 1, 4, 3, 2, 5, 0] as const
const parts = (): Motif => {
  const S = 1.12
  let kx = 0
  let ky = 0
  let kz = 0
  return scene({
    still: 1.9,
    floor: -1.55,
    bound: 1.45,
    view: (t, _f, cam) => {
      cam.yaw = 0.4 + t * 0.32
      cam.pitch = 0.36
    },
    frame: (t) => {
      const legs = ROUTE.length - 1
      const p = (t * 0.55) % legs
      const leg = Math.floor(p)
      const k = smooth(0, 1, p - leg)
      const a = VERTS[ROUTE[leg]]
      const b = VERTS[ROUTE[leg + 1]]
      kx = (a[0] + (b[0] - a[0]) * k) * S
      ky = (a[1] + (b[1] - a[1]) * k) * S
      kz = (a[2] + (b[2] - a[2]) * k) * S
    },
    sdf: (x, y, z) => {
      let d = sphere(x - kx, y - ky, z - kz, 0.17)
      mat = 1
      let g = Infinity
      for (const v of VERTS) g = Math.min(g, sphere(x - v[0] * S, y - v[1] * S, z - v[2] * S, 0.22))
      for (const [i, j] of EDGES) {
        const a = VERTS[i]
        const b = VERTS[j]
        g = Math.min(g, capsule(x, y, z, a[0] * S, a[1] * S, a[2] * S, b[0] * S, b[1] * S, b[2] * S, 0.075))
      }
      if (g < d) {
        d = g
        mat = 0
      }
      return d
    },
  })
}

/* ── 03 Choose the smallest proof ─────────────────────────────────────────
   A wide open frame closes down onto one small, solid cube. */
const proof = (): Motif => {
  let size = 1
  let core = 0
  return scene({
    still: 4.6,
    floor: -1.35,
    bound: 1.85,
    view: (t, _f, cam) => {
      cam.yaw = 0.7 + t * 0.28
      cam.pitch = 0.5
    },
    frame: (t) => {
      const k = (t % 8) / 8
      const close = smooth(0.08, 0.48, k) * (1 - smooth(0.86, 1, k))
      size = 1.05 - 0.7 * close
      core = smooth(0.4, 0.56, k) * (1 - smooth(0.82, 0.9, k))
    },
    sdf: (x, y, z) => {
      let d = frameBox(x, y, z, size, 0.055)
      mat = 0
      if (core > 0.01) {
        const c = box(x, y, z, 0.27 * core, 0.27 * core, 0.27 * core, 0.03)
        if (c < d) {
          d = c
          mat = 1
        }
      }
      return d
    },
  })
}

/* ── 04 Prototype the risk ────────────────────────────────────────────────
   An unknown that will not hold its shape; its worst bulges in the accent.
   The pointer stirs it. */
const risk = (): Motif => {
  let amp = 0.2
  let tt = 0
  return scene({
    still: 2.2,
    floor: -1.45,
    bound: 1.45,
    view: (t, _f, cam) => {
      cam.yaw = t * 0.22
      cam.pitch = 0.3
    },
    frame: (t, f) => {
      tt = t
      amp = 0.17 + 0.12 * f.pull + 0.04 * Math.sin(t * 0.7)
    },
    sdf: (x, y, z) => {
      const w =
        Math.sin(x * 2.6 + tt * 1.1) * Math.sin(y * 2.9 + tt * 0.8) * Math.sin(z * 2.4 + tt * 0.95) +
        0.45 * Math.sin(x * 5.1 - tt * 1.4 + y * 2) * Math.sin(z * 4.7 + tt * 1.2)
      mat = w > 0.42 ? 1 : 0
      // Displacement bends distances; step short so the march holds.
      return (sphere(x, y, z, 0.98) - amp * w) * 0.62
    },
  })
}

/* ── 05 Make alignment concrete ───────────────────────────────────────────
   Scattered marks come into one line, and the rule they agree on appears. */
const align = (): Motif => {
  const N = 5
  const home = Array.from({ length: N }, (_, i) => {
    const r = (k: number) => {
      const s = Math.sin(i * 91.7 + k * 13.1) * 43758.5
      return s - Math.floor(s)
    }
    return [(r(0) - 0.5) * 2.5, (r(1) - 0.5) * 2.2, (r(2) - 0.5) * 1.6] as const
  })
  const pos = new Float32Array(N * 3)
  let rod = 0
  return scene({
    still: 4.2,
    floor: -1.25,
    bound: 1.85,
    view: (t, _f, cam) => {
      cam.yaw = 0.12 + 0.12 * Math.sin(t * 0.25)
      cam.pitch = 0.26
    },
    frame: (t) => {
      const k = (t % 8) / 8
      const snap = smooth(0.1, 0.45, k) * (1 - smooth(0.85, 0.98, k))
      rod = smooth(0.38, 0.55, k) * (1 - smooth(0.8, 0.88, k))
      for (let i = 0; i < N; i++) {
        // Each a little early or late, so it reads as agreement, not a cut.
        const own = smooth(0, 1, Math.min(1, snap * 1.4 - (i % 4) * 0.08))
        const [hx, hy, hz] = home[i]
        const jx = hx + 0.06 * Math.sin(t * 0.8 + i)
        const jy = hy + 0.06 * Math.cos(t * 0.7 + i * 1.3)
        const tx = -1.16 + (2.32 * i) / (N - 1)
        pos[i * 3] = jx + (tx - jx) * own
        pos[i * 3 + 1] = jy + (0 - jy) * own
        pos[i * 3 + 2] = hz + (0 - hz) * own
      }
    },
    sdf: (x, y, z) => {
      let d = Infinity
      mat = 0
      for (let i = 0; i < N; i++) d = Math.min(d, sphere(x - pos[i * 3], y - pos[i * 3 + 1], z - pos[i * 3 + 2], 0.24))
      if (rod > 0.01) {
        const r = capsule(x, y, z, -1.4 * rod, 0, 0, 1.45 * rod, 0, 0, 0.085)
        if (r < d) {
          d = r
          mat = 1
        }
      }
      return d
    },
  })
}

/* ── 06 Systematize what works ────────────────────────────────────────────
   One proven unit, in the accent, and the same unit repeated into a whole:
   eight blocks that open out and settle back together. */
const tiles = (): Motif => {
  let gap = 0.42
  return scene({
    still: 1.2,
    floor: -1.3,
    bound: 1.8,
    view: (t, _f, cam) => {
      cam.yaw = 0.6 + t * 0.3
      cam.pitch = 0.48
    },
    frame: (t) => {
      const k = (t % 7) / 7
      const open = smooth(0.08, 0.32, k) * (1 - smooth(0.62, 0.86, k))
      gap = 0.4 + 0.22 * open
    },
    sdf: (x, y, z) => {
      // Fold into one octant: all eight blocks are the same block.
      const ax = Math.abs(x)
      const ay = Math.abs(y)
      const az = Math.abs(z)
      const d = box(ax - gap, ay - gap, az - gap, 0.34, 0.34, 0.34, 0.05)
      // The original: the block nearest the light.
      mat = x < 0 && y > 0 && z < 0 ? 1 : 0
      return d
    },
  })
}

export const approachFields = (): Motif[] => [anchor(), parts(), proof(), risk(), align(), tiles()]
