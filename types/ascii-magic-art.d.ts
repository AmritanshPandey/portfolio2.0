/* Types for the parts of ascii-magic-art (MIT, plain ES modules, no types of
 * its own) that the site imports. */

declare module "ascii-magic-art/pieces/*.js" {
  /** A frame: plain text, or text plus a colour-key layer of the same shape. */
  export type Frame = string | { text: string; color: string }
  export const meta: {
    slug: string
    name: string
    cols: number
    rows: number
    fps?: number
    palette?: Record<string, string>
  }
  /** Builds the piece; the returned function draws the frame at t seconds. */
  export default function create(): (t: number) => Frame
}

declare module "ascii-magic-art/lib/kit.js" {
  /** The colour keys a palette is indexed by, in order. */
  export const KEYS: string
}
