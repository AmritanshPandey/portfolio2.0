/**
 * How the MacBook Air 15 model's lid turns, in the model's own metres.
 * `axisY` is measured from the base's top, `axisZ` from the lid's front-most
 * point in its open pose, and `shut` is the turn from that pose, in radians.
 *
 * Solved from the display panel: parallel to the base, 0.3mm above it, flush
 * at the front (the back then lands flush too). The axis is inside the base,
 * as the real hinge is; lib/macbook-lid.test.mjs measures the result.
 */
export const MACBOOK_LID = { axisY: -0.00289, axisZ: -0.00221, shut: 1.9198 }
