import { PieceGrid, type PieceSource, type Sample } from "@/lib/ascii-magic"
import { G, smooth, type CellOut, type FieldState, type Motif } from "@/components/shared/ascii-field"
import { FLOW_SIZE, SOLID_SIZE, flowSource, solidSource, type PiecesAsk, type PiecesFrame } from "./approach-pieces"

/**
 * The Approach stage: one ASCII field behind the whole section, drawn from
 * two ascii-magic-art pieces (approach-pieces.ts).
 *
 * - In front, "sphere-cube-morph": a turning solid that swells from a soft
 *   ball into a hard-edged cube and back. Ambiguity resolving into structure;
 *   its blue face is drawn in the accent. Hovering or focusing a step eases
 *   the solid to that step's stage of the morph: step 01 is the ball, step 06
 *   the cube.
 * - Behind, "flow-field": particles tracing streamlines, the moving parts.
 *   It runs strongest under the glass list and goes quiet behind the heading
 *   so the heading reads on paper.
 *
 * Both are re-inked for Ledger: on paper the shading is ink (lit faces
 * sparse, shadowed faces dense, like pencil); on the dark theme the glyphs
 * are light, so lit faces are the dense ones.
 *
 * The pieces run in a worker (approach.worker.ts); the field samples the last
 * frame it sent back, and a still is redrawn when its frame arrives. Browsers
 * without module workers run them here.
 */

export interface Rect {
  x0: number
  y0: number
  x1: number
  y1: number
}

export interface SceneLayout {
  /** The solid's centre, 0..1 across and down the field. */
  x: number
  y: number
  /** The solid's size, as a fraction of the field's height. */
  size: number
  /** Areas (0..1 of the field) where the ground stays quiet. */
  quiet: Rect[]
  /** Areas where it runs busiest: under the glass. */
  busy: Rect[]
}

/* ── The morph, step by step ─────────────────────────────────────────────── */

// sphere-cube-morph runs a 6 s cycle. Its morph amount at phase p (0..1) is
// smooth(clamp(|2p - 1| * 1.6 - 0.3)): a ball at p = 0.5, a cube toward 0 and
// 1. The rising half (0.5..1) goes ball to cube; each step's phase is there.
const CYCLE = 6
const STEPS = 6
const invSmooth = (y: number) => 0.5 - Math.sin(Math.asin(1 - 2 * y) / 3)
const PHASES = Array.from({ length: STEPS }, (_, i) => {
  const morph = Math.min(0.999, Math.max(0.001, i / (STEPS - 1)))
  return 0.5 + (invSmooth(morph) + 0.3) / 1.6 / 2
})

// flow-field's directions (FLOW_GLYPHS in approach-pieces, 1-based) as the field's own glyphs.
const DIRECTION = [0, G.dash, G.fall, G.bar, G.rise]

/** The moment held for the still frame: mid-morph, the blue face toward us. */
const STILL = 7.25

/* ── Running the pieces ──────────────────────────────────────────────────── */

/** The two pieces' latest frames, from the worker or drawn here. */
class Pieces {
  solid: PieceGrid = new PieceGrid(SOLID_SIZE.cols, SOLID_SIZE.rows)
  flow: PieceGrid = new PieceGrid(FLOW_SIZE.cols, FLOW_SIZE.rows)
  private worker: Worker | null | undefined
  private waiting = false
  private next: PiecesAsk | null = null
  private asked: PiecesAsk | null = null
  /** Called when a frame arrives from the worker. */
  onFrame: (() => void) | null = null
  private local: { solid: PieceSource; flow: PieceSource } | null = null

  /** Ask for both pieces at these times. They land a frame or so later, from
   *  the worker. Asking again for the same moment is free. */
  ask(at: PiecesAsk) {
    if (this.asked && this.asked.solid === at.solid && this.asked.flow === at.flow) return
    this.asked = at
    this.send(at)
  }

  private send(at: PiecesAsk) {
    if (!this.start()) return this.draw(at)
    if (this.waiting) {
      this.next = at
      return
    }
    this.waiting = true
    this.worker!.postMessage(at)
  }

  private draw(at: PiecesAsk) {
    this.local ??= { solid: solidSource(), flow: flowSource() }
    this.local.solid.update(at.solid)
    this.local.flow.update(at.flow)
    this.solid = this.local.solid
    this.flow = this.local.flow
  }

  private start() {
    if (this.worker !== undefined) return this.worker !== null
    try {
      const worker = new Worker(new URL("./approach.worker.ts", import.meta.url), { type: "module" })
      worker.onmessage = (e: MessageEvent<PiecesFrame>) => {
        if (this.worker !== worker) return
        if (this.solid === this.local?.solid) {
          // Was drawing here (a still): go back to grids of our own.
          this.solid = new PieceGrid(SOLID_SIZE.cols, SOLID_SIZE.rows)
          this.flow = new PieceGrid(FLOW_SIZE.cols, FLOW_SIZE.rows)
        }
        this.solid.unpack(e.data.solid)
        this.flow.unpack(e.data.flow)
        this.waiting = false
        const next = this.next
        this.next = null
        if (next) this.send(next)
        this.onFrame?.()
      }
      worker.onerror = () => {
        // No worker after all: draw here from now on.
        worker.terminate()
        this.worker = null
        this.waiting = false
        this.next = null
        if (this.asked) this.draw(this.asked)
        this.onFrame?.()
      }
      this.worker = worker
    } catch {
      this.worker = null
    }
    return this.worker !== null
  }

  dispose() {
    this.worker?.terminate()
    this.worker = undefined
    this.waiting = false
    this.next = null
    this.asked = null
  }
}

/* ── The scene ───────────────────────────────────────────────────────────── */

/** 1 inside the rect, falling to 0 over `soft` outside it (in field-height
 *  units, so the falloff is round). */
function inside(r: Rect, x: number, y: number, aspect: number, soft: number) {
  const dx = Math.max(r.x0 - x, 0, x - r.x1) * aspect
  const dy = Math.max(r.y0 - y, 0, y - r.y1)
  return 1 - smooth(0, soft, Math.hypot(dx, dy))
}

export function approachScene() {
  const pieces = new Pieces()
  let layout: SceneLayout = { x: 0.32, y: 0.6, size: 0.6, quiet: [], busy: [] }

  // Piece clocks. The solid's runs at 1x until a step is in focus, then eases
  // to that step's stage of the morph and all but holds there.
  let focus = -1
  let tSolid = STILL
  let tFlow = 0
  let last = Number.NaN

  // Per-frame placement, in field-height units.
  let sx0 = 0
  let sy0 = 0
  let sScale = 1
  let fx0 = 0
  let fy0 = 0
  let fScale = 1
  let paper = true

  // How strongly the ground shows in each cell. Fixed until the layout or the
  // grid changes, so it is worked out once.
  let zones = new Float32Array(0)
  let zCols = 0
  let zRows = 0
  let zLayout: SceneLayout | null = null
  let zAspect = 0
  const weigh = (f: FieldState) => {
    zCols = Math.max(1, Math.round(1 / f.cx))
    zRows = Math.max(1, Math.round(1 / f.cy))
    zLayout = layout
    zAspect = f.aspect
    zones = new Float32Array(zCols * zRows)
    const half = layout.size / 2
    for (let row = 0; row < zRows; row++)
      for (let col = 0; col < zCols; col++) {
        const x = (col + 0.5) * f.cx
        const y = (row + 0.5) * f.cy
        let zone = 0.34
        for (const r of layout.busy) zone = Math.max(zone, inside(r, x, y, f.aspect, 0.08))
        for (const r of layout.quiet) zone *= 1 - inside(r, x, y, f.aspect, 0.06)
        // A ring of clear paper around the solid, so its lit side reads
        // against nothing rather than against the hatching.
        const cd = Math.hypot(x * f.aspect - (sx0 + half * 1.05), y - (sy0 + half * 1.05)) / half
        zones[row * zCols + col] = zone * smooth(0.95, 1.45, cd)
      }
  }

  const s: Sample = { m: 0, l: 0, a: 0 }
  const g: Sample = { m: 0, l: 0, a: 0 }

  /** The piece time nearest `from` whose phase is the focused step's. */
  const target = (from: number) => {
    let at = Math.floor(from / CYCLE) * CYCLE + PHASES[focus] * CYCLE
    if (at < from - CYCLE / 2) at += CYCLE
    if (at > from + CYCLE / 2) at -= CYCLE
    return at
  }

  const motif: Motif = {
    still: STILL,
    ready(redraw) {
      pieces.onFrame = redraw
      return () => {
        if (pieces.onFrame === redraw) pieces.onFrame = null
      }
    },
    frame(t: number, f: FieldState) {
      const dt = t - last
      if (!f.live || !(dt >= 0 && dt < 0.25)) {
        // A still, the first frame, or after a gap: jump straight there.
        tSolid = focus < 0 ? t : target(t)
        tFlow = t * 0.7
      } else {
        tFlow += dt * 0.7
        if (focus < 0) tSolid += dt
        else tSolid += (target(tSolid) - tSolid) * (1 - Math.exp(-dt * 2.6)) + dt * 0.2
      }
      last = t
      pieces.ask({ solid: tSolid, flow: tFlow })
      paper = f.paper

      // The solid's piece is square on screen (its cells are twice as tall
      // as wide); its box is a little larger than the solid.
      const side = layout.size * 1.05
      sScale = SOLID_SIZE.cols / side
      sx0 = layout.x * f.aspect - side / 2
      sy0 = layout.y - side / 2
      if (zLayout !== layout || zAspect !== f.aspect || zCols !== Math.round(1 / f.cx) || zRows !== Math.round(1 / f.cy)) weigh(f)
      // The flow field covers the whole stage.
      const cellW = Math.max(f.aspect / FLOW_SIZE.cols, 1 / (FLOW_SIZE.rows * 2))
      fScale = 1 / cellW
      fx0 = (f.aspect - FLOW_SIZE.cols * cellW) / 2
      fy0 = (1 - FLOW_SIZE.rows * 2 * cellW) / 2
    },
    cell(x: number, y: number, t: number, out: CellOut, f: FieldState) {
      const X = x * f.aspect

      // Ground: the flow field, weighted by zone.
      const col = Math.min(zCols - 1, (x / f.cx) | 0)
      const row = Math.min(zRows - 1, (y / f.cy) | 0)
      const zone = zones[row * zCols + col]
      let b = 0
      let glyph = 0
      if (zone > 0.001) {
        const u = (X - fx0) * fScale
        const v = ((y - fy0) * fScale) / 2
        pieces.flow.sample(u, v, g)
        // Combed streamlines everywhere, faint; the trails pass along them
        // darker. Every other cell, so the strokes read as hatching.
        const trail = Math.min(1, g.m * 1.4)
        const comb = (col + row) & 1 ? 0.11 : 0
        b = zone * Math.max(comb, trail * (paper ? 0.7 : 0.62))
        if (b > 0) glyph = DIRECTION[pieces.flow.glyph(u, v)] ?? 0
      }

      // The solid, over it.
      pieces.solid.sample((X - sx0) * sScale, ((y - sy0) * sScale) / 2, s)
      const alpha = smooth(0.28, 0.72, s.m)
      if (alpha > 0) {
        // The piece lights in 8 steps, softened to a narrow middle band;
        // stretch it back out so the form reads.
        const lit = smooth(0.12, 0.88, s.l)
        let shade = paper ? 0.36 + 0.64 * Math.pow(1 - lit, 1.1) : 0.1 + 0.9 * Math.pow(lit, 1.1)
        // The accent face holds a floor of density, so it reads as a plane of
        // ultramarine however it is lit.
        shade += (Math.max(shade, 0.62) - shade) * s.a
        // A faint rim where the silhouette turns, so the edge holds even
        // where a face is lit to nothing.
        const rim = 1 - Math.abs(2 * alpha - 1)
        b = b * (1 - alpha) * 0.35 + Math.max(shade, rim * 0.42) * alpha
        out.a = s.a * alpha
        if (alpha > 0.5) glyph = 0
      } else {
        // A soft shadow on the ground under it, so it sits in the scene.
        const dx = (X - (sx0 + layout.size * 0.525)) / (layout.size * 0.3)
        const dy = (y - (sy0 + layout.size * 0.96)) / (layout.size * 0.04)
        const d = dx * dx + dy * dy
        if (d < 1 && (1 - d) * 0.3 > b) {
          b = (1 - d) * 0.3
          glyph = 0
        }
      }
      out.b = b
      out.g = glyph
    },
  }

  return {
    motif,
    place(next: SceneLayout) {
      layout = next
    },
    /** Which step is hovered or focused, or -1 for none. */
    focus(i: number) {
      focus = i
    },
    dispose() {
      pieces.dispose()
    },
  }
}
