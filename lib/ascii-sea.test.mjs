// Unit tests for the footer sea's geometry. Run with `npm run test:unit`.
import assert from "node:assert/strict"
import { test } from "node:test"

import { SEA, seaLines, swellHeight } from "./ascii-sea.ts"

const sample = (fn) => {
  const out = []
  for (let x = 0; x < 1600; x += 7) for (const t of [0, 3.3, 41]) out.push(fn(x, t))
  return out
}

test("a swell stays within its range, at every depth", () => {
  for (const depth of [0, 0.4, 1]) {
    const hs = sample((x, t) => swellHeight(x, depth, t, 1.7))
    assert.ok(Math.max(...hs) <= 1, `max ${Math.max(...hs)}`)
    assert.ok(Math.min(...hs) >= -SEA.trough, `min ${Math.min(...hs)}`)
  }
})

test("crests peak higher than troughs sink, the way water does", () => {
  const hs = sample((x, t) => swellHeight(x, 1, t, 0))
  assert.ok(Math.max(...hs) > 1.4 * -Math.min(...hs))
})

test("the sea moves, and the same moment always draws the same frame", () => {
  assert.notEqual(swellHeight(300, 1, 0, 0), swellHeight(300, 1, 0.5, 0))
  assert.equal(swellHeight(300, 1, 2, 0.4), swellHeight(300, 1, 2, 0.4))
})

test("lines with different seeds don't rise in step", () => {
  const a = sample((x, t) => swellHeight(x, 1, t, 0))
  const b = sample((x, t) => swellHeight(x, 1, t, 2.39))
  assert.ok(a.some((h, i) => Math.abs(h - b[i]) > 0.3))
})

test("lines run from the horizon to the front, closer together far away", () => {
  const lines = seaLines(1440, 220, 13)
  assert.equal(lines.length, 7)
  assert.equal(lines[0].depth, 0)
  assert.equal(lines.at(-1).depth, 1)
  for (let i = 1; i < lines.length; i++) {
    assert.ok(lines[i].y > lines[i - 1].y)
    assert.ok(lines[i].amp > lines[i - 1].amp)
    assert.ok(lines[i].size >= lines[i - 1].size)
    if (i > 1) assert.ok(lines[i].y - lines[i - 1].y > lines[i - 1].y - lines[i - 2].y)
  }
  assert.equal(lines.at(-1).size, 13)
})

test("a phone gets fewer, smaller swells", () => {
  const phone = seaLines(375, 140, 12)
  const desk = seaLines(1440, 220, 13)
  assert.ok(phone.length < desk.length)
  assert.ok(phone.at(-1).amp < desk.at(-1).amp)
})

test("every crest stays inside the band", () => {
  for (const [w, h] of [[375, 140], [1440, 220], [2560, 260]]) {
    for (const line of seaLines(w, h, 13)) {
      assert.ok(line.y - line.amp - line.size / 2 >= 0, `crest above the band at ${w}x${h}`)
      assert.ok(line.y + line.amp * SEA.trough <= h, `trough below the band at ${w}x${h}`)
    }
  }
})
