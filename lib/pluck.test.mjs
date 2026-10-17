// Unit tests for the pluckable-rule physics. Run with `npm run test:unit`.
import assert from "node:assert/strict"
import { test } from "node:test"

import { PLUCK, amplitude, crossingX, isAtRest, rulePath, stepString } from "./pluck.ts"

test("a pointer that passes over the line crosses it at the interpolated x", () => {
  assert.equal(crossingX({ x: 100, y: 90 }, { x: 140, y: 110 }, 100), 120)
  assert.equal(crossingX({ x: 100, y: 110 }, { x: 100, y: 90 }, 100), 100)
})

test("a pointer that stays on one side, or starts on the line, does not cross", () => {
  assert.equal(crossingX({ x: 0, y: 80 }, { x: 50, y: 95 }, 100), null)
  assert.equal(crossingX({ x: 0, y: 120 }, { x: 50, y: 105 }, 100), null)
  assert.equal(crossingX({ x: 0, y: 100 }, { x: 50, y: 120 }, 100), null)
})

test("the bent rule is anchored at both ends and peaks at the grab point", () => {
  const d = rulePath(1000, 400, 12)
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number)
  // M0 0 Q200 12 400 12 Q700 12 1000 0
  assert.deepEqual(nums, [0, 0, 200, 12, 400, 12, 700, 12, 1000, 0])
})

test("a flat rule draws as a straight line", () => {
  assert.match(rulePath(800, 300, 0), /^M0 0Q150 0 300 0Q550 0 800 0$/)
})

test("a released rule rings through rest to the other side", () => {
  let s = { d: PLUCK.pull, v: 0 }
  let min = s.d
  for (let i = 0; i < 30; i++) {
    s = stepString(s, 1 / 60)
    min = Math.min(min, s.d)
  }
  assert.ok(min < -PLUCK.pull * 0.3, `swung to ${min.toFixed(2)}`)
})

test("a released rule settles within two seconds, whatever the frame rate", () => {
  for (const fps of [30, 60, 120, 144]) {
    let s = { d: PLUCK.pull, v: 0 }
    let t = 0
    while (!isAtRest(s) && t < 5) {
      s = stepString(s, 1 / fps)
      t += 1 / fps
    }
    assert.ok(t < 2, `${fps}fps settled after ${t.toFixed(2)}s`)
    assert.ok(t > 0.6, `${fps}fps settled too quickly (${t.toFixed(2)}s) to read as a ring`)
  }
})

test("the amplitude envelope only decays, so colour and sound never flicker", () => {
  let s = { d: PLUCK.pull, v: 0 }
  let prev = amplitude(s)
  // Released from rest, the envelope starts at the pull (within 1/√(1−ζ²)).
  assert.ok(Math.abs(prev - PLUCK.pull) / PLUCK.pull < 0.01)
  for (let i = 0; i < 120; i++) {
    s = stepString(s, 1 / 60)
    const a = amplitude(s)
    assert.ok(a <= prev + 1e-9)
    prev = a
  }
})
