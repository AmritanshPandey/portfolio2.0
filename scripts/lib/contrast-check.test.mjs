import { test } from "node:test"
import assert from "node:assert/strict"
import { checkContrast } from "./contrast-check.mjs"

const LIGHT = {
  background: "#ffffff", foreground: "#000000", "surface-1": "#ffffff", "surface-2": "#ffffff",
  "text-muted": "#595959", accent: "#047857", primary: "var(--accent)", "primary-foreground": "#ffffff",
  "surface-inverse": "#000000", "on-inverse": "#ffffff",
}
const DARK = {
  background: "#000000", foreground: "#ffffff", "surface-1": "#000000", "surface-2": "#000000",
  "text-muted": "#a6a6a6", accent: "#34d399", primary: "var(--accent)", "primary-foreground": "#000000",
  "surface-inverse": "#ffffff", "on-inverse": "#000000",
}
const block = (sel, map) => `${sel} { ${Object.entries(map).map(([k, v]) => `--${k}: ${v};`).join(" ")} }`
const css = (light = LIGHT, dark = DARK) => block(":root", light) + "\n" + block(".dark", dark)
const names = (r) => r.failures.map((f) => f.name)

test("a compliant palette passes every pair in both themes", () => {
  const r = checkContrast(css())
  assert.deepEqual(names(r), [])
  assert.equal(r.results.length, 22)
})

test("low contrast fails and names the pair", () => {
  const r = checkContrast(css({ ...LIGHT, "text-muted": "#999999" }))
  assert.ok(names(r).includes("light: text-muted on background"), names(r).join("; "))
})

test("a checked token it cannot evaluate fails instead of passing", () => {
  const r = checkContrast(css({ ...LIGHT, "text-muted": "color-mix(in oklab, #000 60%, white)" }))
  const f = r.failures.find((x) => x.name === "light: text-muted on background")
  assert.ok(f, names(r).join("; "))
  assert.match(f.reason, /unresolved/)
})

test("a missing token fails", () => {
  const withoutOnInverse = { ...DARK }
  delete withoutOnInverse["on-inverse"]
  assert.ok(names(checkContrast(css(LIGHT, withoutOnInverse))).includes("dark: on-inverse on surface-inverse"))
})

test("a translucent background fails rather than guessing what is behind it", () => {
  const r = checkContrast(css({ ...LIGHT, "surface-2": "rgb(255 255 255 / 0.5)" }))
  assert.ok(names(r).includes("light: foreground on surface-2"), names(r).join("; "))
})

test("checks the other theme's accent on this theme's surface-inverse", () => {
  const r = checkContrast(css({ ...LIGHT, "surface-inverse": "#34d399" }))
  assert.ok(names(r).includes("light: accent (dark) on surface-inverse"), names(r).join("; "))
})
