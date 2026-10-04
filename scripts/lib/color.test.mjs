import { test } from "node:test"
import assert from "node:assert/strict"
import { parseColor, contrastRatio } from "./color.mjs"

const to255 = (c) => [c.r, c.g, c.b].map((x) => Math.round(x * 255))

test("parses 6- and 3-digit hex", () => {
  assert.deepEqual(to255(parseColor("#F1EDE4")), [241, 237, 228])
  assert.deepEqual(to255(parseColor("#fff")), [255, 255, 255])
  assert.equal(parseColor("#fff").a, 1)
})

test("parses space-separated rgb() with alpha", () => {
  const c = parseColor("rgb(20 20 20 / 0.13)")
  assert.deepEqual(to255(c), [20, 20, 20])
  assert.equal(c.a, 0.13)
})

test("parses legacy rgba()", () => {
  const c = parseColor("rgba(255, 255, 255, 0.5)")
  assert.deepEqual(to255(c), [255, 255, 255])
  assert.equal(c.a, 0.5)
})

test("converts oklch() to sRGB", () => {
  assert.deepEqual(to255(parseColor("oklch(1 0 0)")), [255, 255, 255])
  assert.deepEqual(to255(parseColor("oklch(0 0 0)")), [0, 0, 0])
  // Tailwind's emerald-600 is oklch(59.6% 0.145 163.225) ≈ #059669
  const [r, g, b] = to255(parseColor("oklch(59.6% 0.145 163.225)"))
  assert.ok(Math.abs(r - 5) <= 6 && Math.abs(g - 150) <= 6 && Math.abs(b - 105) <= 6, `${r},${g},${b}`)
})

test("parses oklch() alpha", () => {
  assert.equal(parseColor("oklch(0.93 0.012 85 / 0.12)").a, 0.12)
})

test("returns null for formats it cannot evaluate", () => {
  assert.equal(parseColor("color-mix(in oklab, red 50%, blue)"), null)
  assert.equal(parseColor("var(--x)"), null)
  assert.equal(parseColor("#12"), null)
})

test("black on white is 21:1", () => {
  assert.equal(Math.round(contrastRatio(parseColor("#000"), parseColor("#fff")) * 100) / 100, 21)
})

test("#767676 on white sits just above AA", () => {
  const r = contrastRatio(parseColor("#767676"), parseColor("#fff"))
  assert.ok(r > 4.5 && r < 4.6, String(r))
})

test("composites a translucent foreground over the background", () => {
  const r = contrastRatio(parseColor("rgb(0 0 0 / 0.5)"), parseColor("#fff"))
  assert.ok(r > 3.9 && r < 4.05, String(r))
})

test("rejects malformed colours that browsers treat as invalid", () => {
  for (const v of [
    "#04785g",
    "#12345",
    "oklch(0.7, 0.012, 85)",
    "oklch(0.93 0.012 85deg0)",
    "oklch(abc 0 0)",
    "rgb(20, 20 20)",
    "rgb(20 20 20 0.5)",
  ]) {
    assert.equal(parseColor(v), null, v)
  }
})

test("reads oklch hue units", () => {
  const ref = to255(parseColor("oklch(0.6 0.15 180)"))
  for (const v of ["oklch(0.6 0.15 180deg)", "oklch(0.6 0.15 0.5turn)", "oklch(0.6 0.15 200grad)", "oklch(0.6 0.15 3.14159265rad)"]) {
    assert.deepEqual(to255(parseColor(v)), ref, v)
  }
})

test("clamps alpha to [0, 1] like browsers do", () => {
  assert.equal(parseColor("rgb(20 20 20 / 13)").a, 1)
  assert.equal(parseColor("oklch(0.5 0 0 / -1)").a, 0)
})
