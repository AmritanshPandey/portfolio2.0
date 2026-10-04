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
const rule = (selector) => {
  const m = css.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`))
  return m ? m[1] : ""
}

test("type: display tiers drop to 600 with the new fluid sizes", () => {
  assert.match(rule(".type-display-hero"), /font-size:\s*clamp\(2\.5rem, 1\.344rem \+ 4\.93vw, 4\.5rem\)/)
  assert.match(rule(".type-display-hero"), /font-weight:\s*600/)
  assert.match(rule(".type-hero-internal"), /clamp\(2\.25rem, 1\.528rem \+ 3\.08vw, 3\.5rem\)/)
  assert.match(rule(".type-page-title"), /clamp\(2rem, 1\.422rem \+ 2\.47vw, 3rem\)/)
  assert.match(rule(".type-section-title"), /clamp\(1\.875rem, 1\.369rem \+ 2\.16vw, 2\.75rem\)/)
  assert.match(rule(".type-case-title"), /font-weight:\s*560/)
})

test("type: metadata uses the AA muted token, body measures are capped", () => {
  assert.match(rule(".type-meta"), /color:\s*var\(--text-muted\)/)
  assert.match(rule(".type-prose"), /max-width:\s*64ch/)
  assert.match(rule(".type-card-body"), /font-size:\s*14px/)
  assert.match(rule(".type-mono"), /text-transform:\s*uppercase/)
})
test("layout: grid and spacing tokens, last breakpoint wins", () => {
  assert.equal(light["page-max"], "1320px")
  assert.equal(light["grid-cols"], "12")
  assert.equal(light["page-margin"], "48px")
  assert.equal(light["space-1"], "4px")
  assert.equal(light["space-11"], "160px")
})

test("layout: radius tokens are always emitted and placements exist", () => {
  assert.match(css, /@theme static \{[^}]*--radius-xs: 2px;[^}]*--radius-sm: 3px;[^}]*--radius-md: 6px;[^}]*--radius-lg: 10px;/)
  assert.doesNotMatch(css, /--radius-lg: var\(--radius\)/)
  for (const c of [".page-container", ".grid-page", ".place-full", ".place-wide", ".place-text", ".place-bleed", ".section-dense", ".section-quiet"]) {
    assert.match(css, new RegExp(`\\${c}[\\s,{]`), c)
  }
})
test("layers: the four layer utilities exist", () => {
  for (const c of [".layer-interface", ".layer-system", ".layer-glass", ".marker", ".marker-line"]) {
    assert.match(css, new RegExp(`\\${c}\\s*\\{`), c)
  }
  assert.match(rule(".layer-system"), /border:\s*1px dashed var\(--rule-strong\)/)
})

test("layers: glass degrades without backdrop-filter and under reduced transparency", () => {
  assert.match(rule(".layer-glass"), /background:\s*color-mix\(in oklab, var\(--surface-1\) 92%, transparent\)/)
  assert.match(css, /@supports \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\)\s*\{\s*\.layer-glass/)
  assert.match(css, /@media \(prefers-reduced-transparency: reduce\)\s*\{\s*\.layer-glass/)
})

test("layers: layer classes sit in @layer components so Tailwind utilities (hidden, p-*, rounded-*) override them", () => {
  const block = css.match(/@layer components \{([\s\S]*?)\n\}/)
  assert.ok(block, "an @layer components block")
  for (const c of [".layer-interface", ".layer-system", ".layer-glass", ".marker", ".marker-line"]) {
    assert.match(block[1], new RegExp(`\\${c}\\s*\\{`), c)
  }
})

test("colour: legacy canvas aliases map onto canvases, never the elevated surface", () => {
  const canvases = new Set(["var(--background)", "var(--surface-2)", "var(--surface-inverse)"])
  for (const name of ["accent", "raised", "gallery", "subtle", "raised-muted"]) {
    const m = css.match(new RegExp(`(?:^|\\n)([^{}]*\\.bg-canvas-${name}(?![\\w-])[^{}]*)\\{([^}]*)\\}`))
    assert.ok(m, name)
    const bg = m[2].match(/background-color:\s*([^;]+);/)[1].trim()
    assert.ok(canvases.has(bg), `.bg-canvas-${name} → ${bg}`)
  }
})
