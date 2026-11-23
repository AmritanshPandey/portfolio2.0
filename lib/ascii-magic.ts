/**
 * A bridge from ascii-magic-art pieces to the site's own ASCII field.
 *
 * An ascii-magic piece draws each frame into a small grid of characters plus
 * a colour key per cell. That grid is too coarse, and too colourful, to put on
 * the page as it is, so a `PieceSource` reads each frame back into numbers
 * (how much of a cell is covered, how lit it is, whether it is the accent)
 * and the field samples those smoothly at its own, finer cell size, in
 * Ledger's ink and one ultramarine.
 *
 * Pieces are pure: draw(t) depends only on t, so a source can be scrubbed
 * backwards or held on one moment.
 */

export type Frame = string | { text: string; color: string }

export interface PieceModule {
  meta: { cols: number; rows: number }
  default: () => (t: number) => Frame
}

/** What a decoder writes for one character of a piece. */
export interface Decoded {
  /** How much of the cell is covered, 0..1. */
  m: number
  /** How lit it is, 0..1. */
  l: number
  /** How much of it is the accent, 0..1. */
  a: number
  /** A glyph the piece meant here (the caller's own numbering), or 0. */
  g: number
}

/** Reads one character and its colour key (index into the palette, or -1). */
export type Decoder = (ch: string, key: number, out: Decoded) => void

export interface Sample {
  m: number
  l: number
  a: number
}

/** The channels of a grid, in the order they are packed. */
const CHANNELS = 4

/** A piece's frame read back into numbers: coverage, light and accent per
 *  cell, row by row. It can live apart from the piece (a copy posted back
 *  from a worker), so the field can sample it without running the piece. */
export class PieceGrid {
  readonly cols: number
  readonly rows: number
  m: Float32Array
  l: Float32Array
  a: Float32Array
  /** Glyph per cell (see Decoded.g), unsoftened. */
  g: Float32Array

  constructor(cols: number, rows: number) {
    this.cols = cols
    this.rows = rows
    const n = cols * rows
    this.m = new Float32Array(n)
    this.l = new Float32Array(n)
    this.a = new Float32Array(n)
    this.g = new Float32Array(n)
  }

  /** All four channels in one array, to post from a worker. */
  pack() {
    const n = this.m.length
    const out = new Float32Array(n * CHANNELS)
    out.set(this.m, 0)
    out.set(this.l, n)
    out.set(this.a, n * 2)
    out.set(this.g, n * 3)
    return out
  }

  /** Point the channels at a packed array (from pack()), without copying. */
  unpack(data: Float32Array) {
    const n = this.cols * this.rows
    this.m = data.subarray(0, n)
    this.l = data.subarray(n, n * 2)
    this.a = data.subarray(n * 2, n * 3)
    this.g = data.subarray(n * 3, n * 4)
  }

  /** The glyph of the cell under (u, v), or failing that of its nearest
   *  neighbour across that has one, or 0. */
  glyph(u: number, v: number) {
    const c = Math.floor(u)
    const r = Math.floor(v)
    if (r < 0 || r >= this.rows) return 0
    const o = r * this.cols
    const near = u - c < 0.5 ? -1 : 1
    for (const k of [c, c + near, c - near]) if (k >= 0 && k < this.cols && this.g[o + k]) return this.g[o + k]
    return 0
  }

  /** Bilinear sample at (u, v) in piece cells (0..cols, 0..rows, cell
   *  centres at +0.5). Outside the grid reads as empty. Light and accent are
   *  weighted by coverage, so an edge doesn't darken toward the empty side. */
  sample(u: number, v: number, out: Sample) {
    const { cols, rows, m, l, a } = this
    const x = u - 0.5
    const y = v - 0.5
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    out.m = 0
    out.l = 0
    out.a = 0
    if (x0 < -1 || y0 < -1 || x0 >= cols || y0 >= rows) return
    const fx = x - x0
    const fy = y - y0
    let mm = 0
    let ll = 0
    let aa = 0
    for (let j = 0; j < 2; j++) {
      const yy = y0 + j
      if (yy < 0 || yy >= rows) continue
      const wy = j ? fy : 1 - fy
      for (let k = 0; k < 2; k++) {
        const xx = x0 + k
        if (xx < 0 || xx >= cols) continue
        const i = yy * cols + xx
        const cover = m[i] * wy * (k ? fx : 1 - fx)
        mm += cover
        ll += l[i] * cover
        aa += a[i] * cover
      }
    }
    if (mm < 1e-4) return
    out.m = mm
    out.l = ll / mm
    out.a = aa / mm
  }
}

/** A running piece: draws a frame at a time and reads it into its grid. */
export class PieceSource extends PieceGrid {
  private draw: (t: number) => Frame
  private decode: Decoder
  private keys: Map<string, number>
  private at = Number.NaN
  private soften: number
  private tmp: Float32Array

  /** `soften`: passes of a small blur over coverage, light and accent, so a
   *  coarse piece with a few light levels samples as smooth gradients and
   *  rounded edges. */
  constructor(piece: PieceModule, decode: Decoder, keys: string, soften = 0) {
    super(piece.meta.cols, piece.meta.rows)
    this.draw = piece.default()
    this.decode = decode
    this.keys = new Map([...keys].map((k, i) => [k, i]))
    this.soften = soften
    this.tmp = new Float32Array(this.cols * this.rows)
  }

  /** Draw the piece at t seconds and read it back. Repeat calls at the same
   *  t are free. */
  update(t: number) {
    if (t === this.at) return
    this.at = t
    const frame = this.draw(t)
    const text = typeof frame === "string" ? frame : frame.text
    const color = typeof frame === "string" ? "" : frame.color
    const { cols, rows, m, l, a, g, keys, decode } = this
    const out: Decoded = { m: 0, l: 0, a: 0, g: 0 }
    m.fill(0)
    l.fill(0)
    a.fill(0)
    g.fill(0)
    // Walk both layers by offset: every row is cols characters plus "\n".
    // Pieces draw with single-unit characters, so offsets line up.
    for (let r = 0; r < rows; r++) {
      const row = r * (cols + 1)
      for (let c = 0; c < cols; c++) {
        const ch = text[row + c]
        if (!ch || ch === " ") continue
        const key = color ? (keys.get(color[row + c]) ?? -1) : -1
        out.m = 0
        out.l = 0
        out.a = 0
        out.g = 0
        decode(ch, key, out)
        const i = r * cols + c
        m[i] = out.m
        l[i] = out.l * out.m
        a[i] = out.a * out.m
        g[i] = out.g
      }
    }
    // Light and accent are held premultiplied by coverage while blurring,
    // then divided back out.
    for (let p = 0; p < this.soften; p++) {
      this.blur(m)
      this.blur(l)
      this.blur(a)
    }
    for (let i = 0; i < m.length; i++) {
      if (m[i] > 1e-4) {
        l[i] /= m[i]
        a[i] /= m[i]
      } else {
        l[i] = 0
        a[i] = 0
      }
    }
  }

  /** One pass of a small blur: [1 2 1] across, and a tighter [1 4 1] down,
   *  since a piece's cells are about twice as tall as they are wide. */
  private blur(v: Float32Array) {
    const { cols, rows, tmp } = this
    for (let r = 0; r < rows; r++) {
      const o = r * cols
      for (let c = 0; c < cols; c++) {
        const L = c > 0 ? v[o + c - 1] : 0
        const R = c < cols - 1 ? v[o + c + 1] : 0
        tmp[o + c] = (L + 2 * v[o + c] + R) / 4
      }
    }
    for (let r = 0; r < rows; r++) {
      const o = r * cols
      for (let c = 0; c < cols; c++) {
        const U = r > 0 ? tmp[o - cols + c] : 0
        const D = r < rows - 1 ? tmp[o + cols + c] : 0
        v[o + c] = (U + 4 * tmp[o + c] + D) / 6
      }
    }
  }
}

/** Ink of the quadrant-block characters ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█, 0..1. */
const QUAD = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█"
export function quadCover(ch: string) {
  const bits = QUAD.indexOf(ch)
  if (bits <= 0) return 0
  return ((bits & 1) + ((bits >> 1) & 1) + ((bits >> 2) & 1) + ((bits >> 3) & 1)) / 4
}
