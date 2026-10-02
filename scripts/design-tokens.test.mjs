import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { extractThemes } from "./lib/tokens.mjs"

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
const { light, dark } = extractThemes(css)

test("colour: paper canvas and the new surface tokens exist in both themes", () => {
  assert.equal(light.background.toLowerCase(), "#f1ede4")
  assert.equal(light.accent.toLowerCase(), "#047857")
  for (const t of ["surface-inverse", "on-inverse", "surface-glass", "glass-border", "rule-strong"]) {
    assert.ok(light[t], `light --${t}`)
    assert.ok(dark[t], `dark --${t}`)
  }
})

test("colour: emphasis bands swap the token scope in CSS", () => {
  assert.match(css, /:root,\s*\.light,\s*\.dark \.band-inverse\s*\{/)
  assert.match(css, /\.dark,\s*:root:not\(\.dark\) \.band-inverse\s*\{/)
  assert.match(css, /@custom-variant dark \(&:where\(\.dark, \.dark \*, :root:not\(\.dark\) \.band-inverse, :root:not\(\.dark\) \.band-inverse \*\):not\(:where\(\.dark \.light, \.dark \.light \*, \.dark \.band-inverse, \.dark \.band-inverse \*\)\)\);/)
  assert.match(css, /\.band-inverse\s*\{\s*background-color: var\(--background\);\s*color: var\(--foreground\);/)
})

test("colour: surfaces are flat at rest", () => {
  assert.equal(light["shadow-sm"], "none")
  assert.equal(dark["shadow-sm"], "none")
})
