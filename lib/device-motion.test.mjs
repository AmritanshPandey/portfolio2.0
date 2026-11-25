// Unit tests for the devices' shared timeline. Run with `npm run test:unit`.
import assert from "node:assert/strict"
import { test } from "node:test"

import { HOLD, arrive, unfold } from "./device-motion.ts"

test("the iPhone and MacBook are settled before they pin", () => {
  assert.equal(arrive(-1), 0)
  assert.equal(arrive(-0.6), 0)
  assert.ok(arrive(-0.3) > 0.4)
  assert.equal(arrive(-0.05 + 1e-9), 1)
  assert.equal(arrive(0), 1)
})

test("the Duo shows its cover, then is open for at least half of the hold", () => {
  assert.equal(unfold(-0.5), 0)
  assert.equal(unfold(0), 0)
  assert.ok(unfold(0.15) >= 0.5)
  assert.equal(unfold(HOLD / 2), 1)
})

test("motion only ever goes forward as the page scrolls on", () => {
  for (const f of [arrive, unfold]) for (let v = -1; v < 1; v += 0.01) assert.ok(f(v + 0.01) >= f(v))
})
