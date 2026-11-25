// Unit tests for the ascii-magic-art bridge. Run with `npm run test:unit`.
import assert from "node:assert/strict"
import { test } from "node:test"

import sphereCube, { meta as sphereMeta } from "ascii-magic-art/pieces/sphere-cube-morph.js"
import { KEYS } from "ascii-magic-art/lib/kit.js"
import { PieceGrid, PieceSource, quadCover } from "./ascii-magic.ts"

const piece = (frames) => ({
  meta: { cols: 3, rows: 2 },
  default: () => (t) => frames[t],
})

test("decodes a frame's text and colour layers cell by cell", () => {
  const src = new PieceSource(
    piece({ 0: { text: "a b\n ba", color: "0 1\n 10" } }),
    (ch, key, out) => {
      out.m = 1
      out.l = key / 2
      out.a = ch === "b" ? 1 : 0
    },
    KEYS,
  )
  src.update(0)
  assert.deepEqual([...src.m], [1, 0, 1, 0, 1, 1])
  assert.deepEqual([...src.l], [0, 0, 0.5, 0, 0.5, 0])
  assert.deepEqual([...src.a], [0, 0, 1, 0, 1, 0])
})

test("samples bilinearly, weighting light by coverage", () => {
  const g = new PieceGrid(2, 1)
  g.m.set([1, 0])
  g.l.set([0.8, 0])
  const out = { m: 0, l: 0, a: 0 }
  g.sample(0.5, 0.5, out)
  assert.equal(out.m, 1)
  assert.ok(Math.abs(out.l - 0.8) < 1e-6)
  // Halfway to an empty cell: half the coverage, the same light.
  g.sample(1, 0.5, out)
  assert.ok(Math.abs(out.m - 0.5) < 1e-6)
  assert.ok(Math.abs(out.l - 0.8) < 1e-6)
  // Far outside reads as empty.
  g.sample(-5, 0.5, out)
  assert.equal(out.m, 0)
})

test("pack and unpack round-trip every channel", () => {
  const a = new PieceGrid(2, 2)
  a.m.set([1, 0.5, 0, 0.25])
  a.l.set([0.1, 0.2, 0.3, 0.4])
  a.a.set([0, 1, 0, 1])
  a.g.set([1, 2, 3, 4])
  const b = new PieceGrid(2, 2)
  b.unpack(a.pack())
  for (const k of ["m", "l", "a", "g"]) assert.deepEqual([...b[k]], [...a[k]])
})

test("quadrant blocks cover a quarter per filled quadrant", () => {
  assert.equal(quadCover(" "), 0)
  assert.equal(quadCover("▘"), 0.25)
  assert.equal(quadCover("▀"), 0.5)
  assert.equal(quadCover("▙"), 0.75)
  assert.equal(quadCover("█"), 1)
  assert.equal(quadCover("x"), 0)
})

test("reads sphere-cube-morph into a solid with light and an accent face", () => {
  const src = new PieceSource(
    { meta: sphereMeta, default: sphereCube },
    (ch, key, out) => {
      if (key < 0 || key >= 48 || !"░▒▓█".includes(ch)) return
      out.m = 1
      out.l = ((key & 7) + 0.5) / 8
      out.a = key >> 3 === 3 ? 1 : 0
    },
    KEYS,
    2,
  )
  src.update(7.25)
  const covered = src.m.filter((v) => v > 0.5).length
  assert.ok(covered > 200, `solid covers ${covered} cells`)
  assert.ok(src.a.some((v) => v > 0.5), "accent face visible at the still moment")
  for (const v of src.l) assert.ok(v >= 0 && v <= 1)
})
