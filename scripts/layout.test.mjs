import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8")
const layout = read("app/layout.tsx")

test("retired site-wide layers are no longer mounted", () => {
  for (const name of ["FancyCursor", "SmoothScroll", "SiteBackground", "Grain"]) {
    assert.doesNotMatch(layout, new RegExp(`\\b${name}\\b`), name)
  }
  assert.match(layout, /<ThemeFab \/>/, "ThemeFab stays until the nav toggle exists")
})

test("editorial light is the default and the OS setting is not followed", () => {
  assert.match(layout, /defaultTheme="light"/)
  // next-themes defaults enableSystem to true, so omitting the prop is not enough.
  assert.match(layout, /enableSystem=\{false\}/)
})

test("the grid overlay is development-only", () => {
  assert.match(layout, /process\.env\.NODE_ENV !== "production" && <GridOverlay \/>/)
})

test("Lenis is fully removed", () => {
  assert.equal(existsSync(new URL("../components/shared/smooth-scroll.tsx", import.meta.url)), false)
  const pkg = JSON.parse(read("package.json"))
  assert.equal(pkg.dependencies["@studio-freight/lenis"], undefined)
  assert.doesNotMatch(read("lib/scroll.ts"), /lenis/i)
})
