import { test } from "node:test"
import assert from "node:assert/strict"
import { extractThemes, resolveToken } from "./tokens.mjs"

const CSS = `
@custom-variant dark (&:where(.dark, .dark *));
:root, .light, .dark .band-inverse { --background: #ffffff; --accent: #047857; --primary: var(--accent); }
@media (min-width: 768px) { :root { --grid-cols: 8; } }
.dark, :root:not(.dark) .band-inverse { --background: #000000; }
.dark .something-else { --background: #ff0000; }
/* :root { --background: #123456; } */
`

test("light merges every rule whose selector list includes :root, media blocks too", () => {
  const { light } = extractThemes(CSS)
  assert.equal(light.background, "#ffffff")
  assert.equal(light["grid-cols"], "8")
})

test("dark only takes rules whose selector list includes exactly .dark", () => {
  assert.equal(extractThemes(CSS).dark.background, "#000000")
})

test("a statement ending in ; right before a rule does not hide it", () => {
  const { light } = extractThemes(`@custom-variant dark (&:where(.dark, .dark *));\n:root { --background: #abcdef; }`)
  assert.equal(light.background, "#abcdef")
})

test("ignores commented-out rules", () => {
  assert.notEqual(extractThemes(CSS).light.background, "#123456")
})

test("resolveToken follows var() references and reports missing tokens", () => {
  const { light } = extractThemes(CSS)
  assert.equal(resolveToken(light, "primary"), "#047857")
  assert.equal(resolveToken(light, "nope"), undefined)
})
