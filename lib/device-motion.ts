/**
 * One timeline for every device on a case study, so they move alike and the
 * screen is always the first thing to be ready.
 *
 * A device sits in a block a little taller than the screen and stays pinned
 * while the block scrolls past. `v` is how far past its pin the block is, in
 * screens: negative while it scrolls in, 0 as it pins, HOLD as it lets go.
 */

/** How long a device stays pinned, in screens. Most of it, it holds still. */
export const HOLD = 0.6
/** The block's height, in screens. */
export const BLOCK = 1 + HOLD

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const ease = (t: number) => t * t * (3 - 2 * t)

/** iPhone and MacBook: settled, screen to the reader, by the time it pins. */
export const arrive = (v: number) => ease(clamp01((v + 0.6) / 0.55))

/** iPhone Duo: the cover's screen until it pins, then open to the large one
 *  in the first third of a screen's scroll. */
export const unfold = (v: number) => ease(clamp01(v / 0.3))
