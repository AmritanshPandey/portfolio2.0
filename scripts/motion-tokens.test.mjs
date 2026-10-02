import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { extractThemes } from "./lib/tokens.mjs"
import { DURATION, EASE, EASE_MOVE, STAGGER, STAGGER_MAX, RISE, PARALLAX_MAX, entrance } from "../lib/motion.ts"

const { light } = extractThemes(readFileSync(new URL("../app/globals.css", import.meta.url), "utf8"))
const ms = (seconds) => `${Math.round(seconds * 1000)}ms`
const bezier = (curve) => `cubic-bezier(${curve.join(", ")})`

test("CSS durations mirror DURATION", () => {
  assert.equal(light["dur-1"], ms(DURATION.feedback))
  assert.equal(light["dur-2"], ms(DURATION.fast))
  assert.equal(light["dur-3"], ms(DURATION.base))
  assert.equal(light["dur-4"], ms(DURATION.slow))
  assert.deepEqual([DURATION.feedback, DURATION.fast, DURATION.base, DURATION.slow], [0.2, 0.4, 0.6, 0.9])
})

test("CSS easings mirror EASE and EASE_MOVE", () => {
  assert.equal(light["ease-out"], bezier(EASE))
  assert.equal(light["ease-move"], bezier(EASE_MOVE))
})

test("motion limits match the spec", () => {
  assert.equal(STAGGER, 0.06)
  assert.equal(STAGGER_MAX, 6)
  assert.ok(RISE <= 12)
  assert.equal(PARALLAX_MAX, 16)
})

test("entrance() caps the stagger at STAGGER_MAX items", () => {
  assert.ok(Math.abs(entrance(2).transition.delay - 0.12) < 1e-9)
  assert.ok(Math.abs(entrance(10).transition.delay - 0.36) < 1e-9)
  assert.equal(entrance(0).transition.duration, DURATION.base)
})
