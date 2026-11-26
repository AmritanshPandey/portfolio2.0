// Unit tests for the baked studio light. Run with `npm run test:unit`.
import assert from "node:assert/strict"
import fs from "node:fs"
import { test } from "node:test"
import { gunzipSync } from "node:zlib"

import { decodePlane } from "./studio-light.ts"

test("a plane decodes from its differences, row by row", () => {
  const out = new Uint8Array(4)
  decodePlane(new Uint8Array([9, 10, 1, 255, 2]), 1, 2, out)
  assert.deepEqual([...out], [10, 11, 9, 11])
})

test("the baked file holds six faces of six levels, within range", () => {
  const bytes = gunzipSync(fs.readFileSync("public/devices/studio-light.bin"))
  let at = 0
  let peak = -Infinity
  for (let face = 0; face < 6; face++)
    for (let level = 0; level < 6; level++) {
      const n = 256 >> level
      for (let plane = 0; plane < 4; plane++) {
        const out = new Uint8Array(n * n)
        decodePlane(bytes, at, n, out)
        at += n * n
        if (plane < 3) assert.ok(Math.max(...out.subarray(0, n)) <= 127)
        else for (const e of out) peak = Math.max(peak, e)
      }
    }
  assert.equal(at, bytes.length)
  // The room's lamps are far brighter than 1, and within half float.
  assert.ok(peak > 129 && peak <= 144, `exponent ${peak}`)
})
