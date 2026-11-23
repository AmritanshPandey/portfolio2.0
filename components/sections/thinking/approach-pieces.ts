import sphereCube, { meta as sphereCubeMeta } from "ascii-magic-art/pieces/sphere-cube-morph.js"
import flowField, { meta as flowFieldMeta } from "ascii-magic-art/pieces/flow-field.js"
import { KEYS } from "ascii-magic-art/lib/kit.js"
import { PieceSource, quadCover } from "@/lib/ascii-magic"

/**
 * The two ascii-magic-art pieces behind Approach, and how each is read back
 * into numbers (see lib/ascii-magic.ts). Shared by the worker that runs them
 * and by the main thread when there is no worker.
 */

// sphere-cube-morph paints each face in 8 light levels (key = face * 8 +
// level) with shade blocks; key 48 is its dotted backdrop, left out here.
// Face 3 is its blue face: that one is drawn in the accent.
const BLOCKS = "░▒▓█"
const ACCENT_FACE = 3

export const solidSource = () =>
  new PieceSource(
    { meta: sphereCubeMeta, default: sphereCube },
    (ch, key, out) => {
      if (key < 0 || key >= 48 || !BLOCKS.includes(ch)) return
      out.m = 1
      out.l = ((key & 7) + 0.5) / 8
      out.a = key >> 3 === ACCENT_FACE ? 1 : 0
    },
    KEYS,
    2,
  )

// flow-field draws its particle trails in quadrant blocks, keyed hue * 4 +
// brightness (0..3, brightest at the head), over a backdrop of the field's
// own streamlines (keys 48 and 49) drawn as ─ ╲ │ ╱ by direction. The trails
// become coverage; the backdrop's directions become the glyphs the ground is
// drawn in (FLOW_GLYPHS), so it reads as combed streamlines.
export const FLOW_GLYPHS = "─╲│╱"
export const flowSource = () =>
  new PieceSource(
    { meta: flowFieldMeta, default: flowField },
    (ch, key, out) => {
      const dir = FLOW_GLYPHS.indexOf(ch)
      if (dir >= 0) {
        out.g = dir + 1
        return
      }
      if (key < 0 || key >= 48) return
      const level = (key & 3) / 3
      out.m = quadCover(ch) * (0.35 + 0.65 * level)
      out.l = level
    },
    KEYS,
    1,
  )

export const SOLID_SIZE = { cols: sphereCubeMeta.cols, rows: sphereCubeMeta.rows }
export const FLOW_SIZE = { cols: flowFieldMeta.cols, rows: flowFieldMeta.rows }

/** A request to the worker: draw both pieces at these times. */
export interface PiecesAsk {
  solid: number
  flow: number
}

/** The worker's answer: both grids, as m, l, a arrays back to back. */
export interface PiecesFrame {
  solid: Float32Array
  flow: Float32Array
}
