# Editorial Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap the portfolio's design tokens in place to the editorial system (warm paper canvas, emphasis-band scope swapping, retuned type, a 12-column grid, restrained radius, motion tokens, layer utilities), retire the site-wide cursor/Lenis/WebGL/grain layers, and document the result, with an automated AA contrast gate.

**Architecture:** All tokens live in `app/globals.css`. Existing token and class names are kept so every token-built component updates without edits; new tokens are added beside them. Theme scoping is CSS-only: `:root`/`.light` hold light tokens, `.dark` holds dark tokens, and `.band-inverse` swaps to the opposite set. Dependency-free Node scripts (`node:test`) verify contrast and that CSS and `lib/motion.ts` stay in sync.

**Tech Stack:** Next.js 16.1 (App Router), React 19.2, Tailwind CSS 4.2 (`@theme`, `@layer utilities`, `@custom-variant`), next-themes 0.4, Framer Motion 12, Node 22.15 (`node --test`, `--experimental-strip-types`).

**Spec:** `docs/superpowers/specs/2026-10-01-editorial-foundations-design.md`

## Global Constraints

- Work on branch `redesign/editorial`. Never merge or push to `main` from this plan.
- No new npm dependencies. Scripts use Node built-ins only.
- Keep every existing token name (`--background`, `--surface-1`, `--text-muted`, …) and every `type-*` class name. Only values change; new names are additions.
- Light values are hex and are the source of truth: paper `#f1ede4`, ink `#141414`, muted `#6a6458`, surface-1 `#faf8f3`, surface-2 `#eae5da`, accent `#047857`.
- Dark values are OKLCH: background `oklch(0.15 0.005 80)`, foreground `oklch(0.93 0.012 85)`, accent `oklch(0.765 0.163 163)`.
- Every text/background token pair must clear WCAG AA 4.5:1 in both themes (`npm run check:contrast`).
- Follow the file's existing patterns: plain classes inside `@layer utilities { … }`, colour mappings in `@theme inline { … }`.
- Do not run `next build` into `.next` while `next dev` is running. Build with `NEXT_DIST_DIR=.next-preview npm run build` (already gitignored).
- Components with hard-coded dark colours will look wrong on paper. That is expected on this branch; do not fix them here (later sub-projects own them).
- `ThemeFab` stays mounted. Do not remove it in this plan.
- End every commit message with: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`

## Review Focus

1. **A checked token that the checker can't parse** (e.g. `color-mix()`, a typo, a missing token) must make `check:contrast` fail, never silently pass. → Task 1 tests.
2. **`dark:` utilities inside an emphasis band** must follow the band's scope in both themes (active inside a band on a light page, inactive inside a band on a dark page). → Task 8 browser probe.
3. **Horizontal overflow at 375px** from `.place-bleed` (`100vw`) must not happen. → Task 8 browser check.
4. **Returning visitors with a stored theme** (`localStorage.theme` = `"dark"`, `"light"`, or the old `"system"`) must still get a working page after `defaultTheme` and `enableSystem` change. → Task 7 browser check.
5. **In-page nav links after Lenis is removed** must still land on the section (80px offset), and jump without smooth scrolling under reduced motion. → Task 7 browser check.

---

### Task 1: Dependency-free contrast checker

**Files:**
- Create: `scripts/lib/color.mjs`
- Create: `scripts/lib/tokens.mjs`
- Create: `scripts/lib/contrast-check.mjs`
- Create: `scripts/check-contrast.mjs`
- Test: `scripts/lib/color.test.mjs`, `scripts/lib/tokens.test.mjs`, `scripts/lib/contrast-check.test.mjs`
- Modify: `package.json` (`scripts`)

**Interfaces:**
- Produces: `parseColor(value: string) → {r,g,b,a} | null` (gamma-encoded sRGB, 0–1), `contrastRatio(fg, bg) → number`, `oklchToSrgb(L, C, H) → {r,g,b}` from `scripts/lib/color.mjs`; `extractThemes(css) → { light: Record<string,string>, dark: Record<string,string> }` and `resolveToken(map, name) → string | undefined` from `scripts/lib/tokens.mjs`; `checkContrast(css) → { results, failures }` and `MIN_RATIO = 4.5` from `scripts/lib/contrast-check.mjs`. Later tasks import `extractThemes` in their tests.

- [ ] **Step 1: Write the failing colour tests**

Create `scripts/lib/color.test.mjs`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: FAIL with `Cannot find module '.../scripts/lib/color.mjs'`

- [ ] **Step 3: Implement `scripts/lib/color.mjs`**

```js
// Dependency-free colour maths for the contrast check. Colours are returned as
// gamma-encoded sRGB channels in [0, 1] plus alpha, because that is the space
// browsers composite translucent colours in.

const clamp01 = (n) => Math.min(1, Math.max(0, n))
const encode = (c) => {
  const x = clamp01(c)
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
}
const decode = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const isValid = (c) => [c.r, c.g, c.b, c.a].every((n) => Number.isFinite(n))

function splitAlpha(inner) {
  const [channels, alpha] = inner.includes("/") ? inner.split("/") : [inner, undefined]
  return { channels: channels.trim(), alpha }
}

function parseAlpha(s) {
  if (s === undefined) return 1
  const t = s.trim()
  return t.endsWith("%") ? parseFloat(t) / 100 : parseFloat(t)
}

function parseHex(v) {
  let h = v.slice(1)
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("")
  if (h.length !== 6 && h.length !== 8) return null
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255
  const c = { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 }
  return isValid(c) ? c : null
}

function parseRgb(v) {
  const m = v.match(/^rgba?\(([^)]+)\)$/)
  if (!m) return null
  const { channels, alpha } = splitAlpha(m[1])
  const parts = channels.split(/[\s,]+/).filter(Boolean)
  let a = alpha
  if (parts.length === 4 && alpha === undefined) a = parts.pop() // rgba(r, g, b, a)
  if (parts.length !== 3) return null
  const [r, g, b] = parts.map((p) => (p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p) / 255))
  const c = { r, g, b, a: parseAlpha(a) }
  return isValid(c) ? c : null
}

export function oklchToSrgb(L, C, H) {
  const hr = (H * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return {
    r: encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  }
}

function parseOklch(v) {
  const m = v.match(/^oklch\(([^)]+)\)$/)
  if (!m) return null
  const { channels, alpha } = splitAlpha(m[1])
  const parts = channels.split(/\s+/)
  if (parts.length !== 3) return null
  const L = parts[0].endsWith("%") ? parseFloat(parts[0]) / 100 : parseFloat(parts[0])
  const C = parseFloat(parts[1])
  const H = parseFloat(parts[2])
  if (![L, C, H].every(Number.isFinite)) return null
  const c = { ...oklchToSrgb(L, C, H), a: parseAlpha(alpha) }
  return isValid(c) ? c : null
}

/** Parses hex, rgb()/rgba(), and oklch(). Anything else returns null. */
export function parseColor(input) {
  const v = String(input).trim().toLowerCase()
  if (v.startsWith("#")) return parseHex(v)
  if (v.startsWith("rgb")) return parseRgb(v)
  if (v.startsWith("oklch(")) return parseOklch(v)
  return null
}

function over(fg, bg) {
  const a = fg.a
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 }
}

const luminance = ({ r, g, b }) => 0.2126 * decode(r) + 0.7152 * decode(g) + 0.0722 * decode(b)

/** WCAG contrast of `fg` composited over an opaque `bg`. */
export function contrastRatio(fg, bg) {
  if (bg.a < 1) throw new Error("background must be opaque")
  const solid = over(fg, bg)
  const [hi, lo] = [luminance(solid), luminance(bg)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
```

- [ ] **Step 4: Run the colour tests to verify they pass**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: PASS, 9 tests in `color.test.mjs`

- [ ] **Step 5: Write the failing token-extraction tests**

Create `scripts/lib/tokens.test.mjs`:

```js
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
```

- [ ] **Step 6: Run it to verify it fails**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: FAIL with `Cannot find module '.../scripts/lib/tokens.mjs'`

- [ ] **Step 7: Implement `scripts/lib/tokens.mjs`**

```js
// Pulls the light and dark custom-property maps out of globals.css.
// Light = every rule whose selector list contains `:root` (including rules
// inside @media blocks); dark = every rule whose selector list contains
// exactly `.dark`. Later declarations win, as in the cascade.

export function extractThemes(css) {
  const light = {}
  const dark = {}
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "")
  for (const [, selectorText, body] of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    // Drop any `;`-terminated statements (e.g. @custom-variant) that precede
    // the selector, or they glue onto its first selector.
    const selector = selectorText.slice(selectorText.lastIndexOf(";") + 1)
    const selectors = selector.split(",").map((s) => s.trim())
    const target = selectors.includes(":root") ? light : selectors.includes(".dark") ? dark : null
    if (!target) continue
    for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      target[name] = value.trim()
    }
  }
  return { light, dark }
}

/** Follows `var(--x)` chains inside one theme map. Undefined when missing. */
export function resolveToken(map, name, depth = 0) {
  const raw = map[name]
  if (raw === undefined || depth > 8) return undefined
  const ref = raw.match(/^var\(--([\w-]+)\)$/)
  return ref ? resolveToken(map, ref[1], depth + 1) : raw
}
```

- [ ] **Step 8: Run the token tests to verify they pass**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: PASS, 14 tests total

- [ ] **Step 9: Write the failing contrast-check tests (Review Focus 1)**

Create `scripts/lib/contrast-check.test.mjs`:

```js
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
  const { "on-inverse": _, ...withoutOnInverse } = DARK
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
```

- [ ] **Step 10: Run it to verify it fails**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: FAIL with `Cannot find module '.../scripts/lib/contrast-check.mjs'`

- [ ] **Step 11: Implement `scripts/lib/contrast-check.mjs`**

```js
import { contrastRatio, parseColor } from "./color.mjs"
import { extractThemes, resolveToken } from "./tokens.mjs"

export const MIN_RATIO = 4.5

// Text tokens on the surfaces they sit on (spec §12). Hairline borders are
// decorative and deliberately not checked.
const PAIRS = [
  ["foreground", "background"],
  ["foreground", "surface-1"],
  ["foreground", "surface-2"],
  ["text-muted", "background"],
  ["text-muted", "surface-1"],
  ["text-muted", "surface-2"],
  ["accent", "background"],
  ["accent", "surface-1"],
  ["on-inverse", "surface-inverse"],
  ["primary-foreground", "primary"],
]

export function checkContrast(css) {
  const themes = extractThemes(css)
  const results = []

  for (const [theme, map] of Object.entries(themes)) {
    const otherName = theme === "light" ? "dark" : "light"
    const checks = [
      ...PAIRS.map(([fg, bg]) => ({ fg, bg, fgMap: map, name: `${theme}: ${fg} on ${bg}` })),
      { fg: "accent", bg: "surface-inverse", fgMap: themes[otherName], name: `${theme}: accent (${otherName}) on surface-inverse` },
    ]

    for (const { fg, bg, fgMap, name } of checks) {
      const fgRaw = resolveToken(fgMap, fg)
      const bgRaw = resolveToken(map, bg)
      const fgColor = fgRaw && parseColor(fgRaw)
      const bgColor = bgRaw && parseColor(bgRaw)

      if (!fgColor || !bgColor) {
        const which = !fgColor ? `--${fg} = ${fgRaw ?? "missing"}` : `--${bg} = ${bgRaw ?? "missing"}`
        results.push({ name, ratio: null, pass: false, reason: `unresolved ${which}` })
        continue
      }
      if (bgColor.a < 1) {
        results.push({ name, ratio: null, pass: false, reason: `--${bg} is translucent` })
        continue
      }
      const ratio = contrastRatio(fgColor, bgColor)
      results.push({ name, ratio, pass: ratio >= MIN_RATIO })
    }
  }

  return { results, failures: results.filter((r) => !r.pass) }
}
```

- [ ] **Step 12: Run the tests to verify they pass**

Run: `node --test "scripts/**/*.test.mjs"`
Expected: PASS, 20 tests total

- [ ] **Step 13: Add the CLI and npm scripts**

Create `scripts/check-contrast.mjs`:

```js
#!/usr/bin/env node
// Fails (exit 1) if any text/background token pair in app/globals.css is
// below WCAG AA in either theme. Run: npm run check:contrast
import { readFileSync } from "node:fs"
import { checkContrast, MIN_RATIO } from "./lib/contrast-check.mjs"

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
const { results, failures } = checkContrast(css)

for (const r of results) {
  const detail = r.ratio === null ? r.reason : `${r.ratio.toFixed(2)}:1`
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name.padEnd(48)} ${detail}`)
}

if (failures.length) {
  console.error(`\n${failures.length} pair(s) below AA (${MIN_RATIO}:1).`)
  process.exit(1)
}
console.log(`\nAll ${results.length} pairs meet AA (${MIN_RATIO}:1).`)
```

In `package.json`, change the `scripts` block to:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "dev:preview": "NEXT_DIST_DIR=.next-preview next dev",
    "check:contrast": "node scripts/check-contrast.mjs",
    "test:scripts": "node --experimental-strip-types --test \"scripts/**/*.test.mjs\""
  },
```

- [ ] **Step 14: Run the checker against today's tokens to confirm it catches real problems**

Run: `npm run check:contrast`
Expected: exit code 1. At minimum `light: accent on background` FAILs (today's emerald-600 on near-white is ≈3.4:1), and every `on-inverse` / `surface-inverse` check FAILs as `unresolved … missing` (those tokens don't exist yet). This proves the gate works before Task 2 makes it pass.

- [ ] **Step 15: Commit**

```bash
git add scripts package.json
git commit -m "Add a dependency-free AA contrast check for the design tokens

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Colour and surface tokens, with CSS-only band scoping

**Files:**
- Modify: `app/globals.css` (custom variant at line 9; `@theme inline` block lines 15–47; LIGHT/DARK blocks lines 49–116; canvas utilities lines 118–132 and 167–203; `.surface` / `.surface-elevated` around line 716)
- Test: `scripts/design-tokens.test.mjs` (create)

**Interfaces:**
- Consumes: `extractThemes` from `scripts/lib/tokens.mjs` (Task 1).
- Produces: CSS tokens `--surface-inverse`, `--on-inverse`, `--surface-glass`, `--glass-border`, `--rule-strong` in both themes; Tailwind colours `bg-surface-inverse`, `text-on-inverse`, `bg-surface-glass`, `border-rule-strong`; utility classes `.band-inverse`, `.bg-canvas-inverse`. Tasks 6 and 8 use these names.

- [ ] **Step 1: Write the failing test**

Create `scripts/design-tokens.test.mjs`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:scripts`
Expected: FAIL. `colour: paper canvas…` fails with `'oklch(0.98 0 0)' !== '#f1ede4'`; the band and shadow tests fail too.

- [ ] **Step 3: Replace the dark variant**

In `app/globals.css`, replace line 9:

```css
@custom-variant dark (&:is(.dark *));
```

with:

```css
/* `dark:` follows the nearest theme scope: the page theme, a forced `.light` /
   `.dark` subtree, or an emphasis band (`.band-inverse` swaps to the opposite
   theme). */
@custom-variant dark (&:where(.dark, .dark *, :root:not(.dark) .band-inverse, :root:not(.dark) .band-inverse *):not(:where(.dark .light, .dark .light *, .dark .band-inverse, .dark .band-inverse *)));
```

- [ ] **Step 4: Map the new colours into Tailwind**

In the `@theme inline { … }` block, after the line `--color-destructive-foreground: var(--destructive-foreground);`, add:

```css
  --color-surface-inverse: var(--surface-inverse);
  --color-on-inverse: var(--on-inverse);
  --color-surface-glass: var(--surface-glass);
  --color-rule-strong: var(--rule-strong);
```

- [ ] **Step 5: Replace the LIGHT and DARK token blocks**

Replace everything from the comment `/* ─────── LIGHT` (line 49) through the closing `}` of the `.dark { … }` block (line 116) with:

```css
/* ─────────────────────────
   LIGHT: the editorial default ("paper")

   Also applied by `.light` (force a subtree light, e.g. <BeforeAfter>'s
   theme split) and by `.band-inverse` on a dark page: emphasis bands swap
   the token scope (spec §4.3).
───────────────────────── */

:root,
.light,
.dark .band-inverse {
  --background: #f1ede4;
  --foreground: #141414;

  --text-muted: #6a6458;

  --surface-1: #faf8f3;
  --surface-2: #eae5da;
  --surface-inverse: oklch(0.15 0.005 80);
  --on-inverse: oklch(0.93 0.012 85);
  --surface-glass: color-mix(in oklab, var(--background) 62%, transparent);
  --glass-border: rgb(20 20 20 / 0.08);

  --border: rgb(20 20 20 / 0.13);
  --rule-strong: rgb(20 20 20 / 0.28);
  --ring: #047857;
  /* Emerald-700: clears AA on paper. Emerald-600 only reaches ~3.1:1 here. */
  --accent: #047857;
  --primary: var(--accent);
  --primary-foreground: #ffffff;
  --secondary: #e4ded1;
  --secondary-foreground: var(--foreground);
  --input: #faf8f3;
  --destructive: oklch(0.58 0.2 27);
  --destructive-foreground: oklch(0.99 0 0);

  /* Flat at rest. Resting shadows are retired; only overlays lift. */
  --shadow-sm: none;
  --shadow-md: 0 12px 30px rgba(0, 0, 0, 0.08);

  /* Standard interactive hover — neutral fill */
  --surface-hover: #e9e4d8;

  --radius: 6px;
}

/* ─────────────────────────
   DARK (toggle). Also applied by `.band-inverse` on a light page.
───────────────────────── */

.dark,
:root:not(.dark) .band-inverse {
  --background: oklch(0.15 0.005 80);
  --foreground: oklch(0.93 0.012 85);

  --text-muted: oklch(0.7 0.012 85);

  --surface-1: oklch(0.19 0.005 80);
  --surface-2: oklch(0.12 0.004 80);
  --surface-inverse: #f1ede4;
  --on-inverse: #141414;
  --surface-glass: color-mix(in oklab, var(--background) 62%, transparent);
  --glass-border: oklch(0.93 0.012 85 / 0.1);

  --border: oklch(0.93 0.012 85 / 0.12);
  --rule-strong: oklch(0.93 0.012 85 / 0.3);
  --ring: oklch(0.765 0.163 163);
  --accent: oklch(0.765 0.163 163);
  --primary: var(--accent);
  --primary-foreground: oklch(0.11 0 0);
  --secondary: oklch(0.24 0.005 80);
  --secondary-foreground: var(--foreground);
  --input: oklch(0.22 0.005 80);
  --destructive: oklch(0.72 0.19 24);
  --destructive-foreground: oklch(0.11 0 0);

  --shadow-sm: none;
  --shadow-md: 0 20px 40px rgba(0, 0, 0, 0.45);

  --surface-hover: oklch(0.215 0.005 80);
}

/* An emphasis band paints itself from the swapped scope: near-black on a
   light page, paper on a dark page. Never use --surface-inverse here; on a
   swapped element it resolves to the opposite colour. */
.band-inverse {
  background-color: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 6: Collapse the canvas utilities**

Replace the four rules `.bg-canvas-default`, `.dark .bg-canvas-default`, `.bg-canvas-muted`, `.dark .bg-canvas-muted` (lines 118–132) with:

```css
.bg-canvas-default {
  background-color: var(--background);
}

.bg-canvas-muted {
  background-color: var(--surface-2);
}

.bg-canvas-inverse {
  background-color: var(--surface-inverse);
  color: var(--on-inverse);
}
```

Then replace every rule from `.bg-canvas-accent {` through the closing `}` of `.bg-canvas-raised-muted { … }` (lines 167–203: the `accent`, `raised`, `gallery`, `subtle`, and `raised-muted` canvases and their `.dark` variants) with:

```css
/* Legacy canvas aliases, mapped onto the three canvases until their last
   consumer migrates (removed in sub-project 7). Themes come from the tokens. */
.bg-canvas-accent,
.bg-canvas-subtle {
  background-color: var(--surface-2);
}

.bg-canvas-raised,
.bg-canvas-raised-muted {
  background-color: var(--surface-1);
}

.bg-canvas-gallery {
  background-color: var(--background);
}
```

Leave `.dark .dark-bg-surface-18`, `.bg-accent-wash`, and everything after them untouched.

- [ ] **Step 7: Make the surface utilities flat**

In the `UTILITIES` layer, replace:

```css
  .surface {
    background: var(--surface-1);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .surface-elevated {
    background: var(--surface-1);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
  }
```

with:

```css
  /* Elevated surface: one tonal step off the canvas plus a hairline. Flat at
     rest; only dialogs and popovers use --shadow-md. */
  .surface,
  .surface-elevated {
    background: var(--surface-1);
    border: 1px solid var(--border);
  }
```

- [ ] **Step 8: Run the tests and the contrast gate**

Run: `npm run test:scripts && npm run check:contrast`
Expected: all tests PASS; `check:contrast` prints 22 PASS lines and `All 22 pairs meet AA (4.5:1).` The tightest pairs are `light: text-muted on surface-2` ≈4.67 and `dark: accent (light) on surface-inverse` ≈4.69.

- [ ] **Step 9: Typecheck, lint, and look at it**

Run: `npx tsc --noEmit -p . && npm run lint`
Expected: no output, exit 0.

With the dev server running (`preview_start` name `dev`), open `http://localhost:3000/showcase`. Expected: the page background is warm paper (`getComputedStyle(document.body).backgroundColor` is `rgb(241, 237, 228)` in light mode). Toggle the theme with the header switch: the background becomes warm near-black. No console errors.

- [ ] **Step 10: Commit**

```bash
git add app/globals.css scripts/design-tokens.test.mjs
git commit -m "Editorial colour tokens: paper canvas, flat surfaces, CSS-only band scoping

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Retuned type scale

**Files:**
- Modify: `app/globals.css` (the `type-*` classes inside the first `@layer utilities` block, from `.type-display-hero {` down to the line before `/* Premium underline`)
- Test: `scripts/design-tokens.test.mjs` (append)

**Interfaces:**
- Produces: the existing `type-*` classes with new values, plus the new `.type-mono` class used by Tasks 6 and 8.

- [ ] **Step 1: Write the failing test**

Append to `scripts/design-tokens.test.mjs`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:scripts`
Expected: FAIL on both `type:` tests (e.g. `.type-display-hero` still has `clamp(2.35rem, 10vw, 3.35rem)`).

- [ ] **Step 3: Replace the type classes**

Replace everything from the comment block directly above `.type-display-hero {` (starting `/* Hero display — the one place…`) through the closing `}` of the last `@media (min-width: 1024px) { .type-page-title … .type-section-title … }` block, i.e. up to but not including `/* Premium underline for inline body links`, with:

```css
  /* Editorial type scale (spec §5). Bricolage carries structural headings at
     600; hierarchy comes from contrast with small, precise metadata, not sheer
     size. Fluid sizes run linearly from the 375px value to the 1024px value. */
  .type-display-hero {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: clamp(2.5rem, 1.344rem + 4.93vw, 4.5rem);
    line-height: 1.02;
    font-weight: 600;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }
  .type-hero-internal {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: clamp(2.25rem, 1.528rem + 3.08vw, 3.5rem);
    line-height: 1.05;
    font-weight: 600;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }
  .type-page-title {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: clamp(2rem, 1.422rem + 2.47vw, 3rem);
    line-height: 1.08;
    font-weight: 600;
    letter-spacing: -0.015em;
    text-wrap: balance;
  }
  .type-section-title {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: clamp(1.875rem, 1.369rem + 2.16vw, 2.75rem);
    line-height: 1.06;
    font-weight: 600;
    letter-spacing: -0.018em;
    text-wrap: balance;
  }
  .type-section-intro {
    max-width: 56ch;
    font-size: 16px;
    line-height: 1.6;
    letter-spacing: 0;
    text-wrap: pretty;
  }
  .type-subtitle {
    font-family: var(--font-sans);
    font-size: 20px;
    line-height: 1.28;
    font-weight: 600;
    letter-spacing: 0;
    text-wrap: balance;
  }
  .type-case-title {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: clamp(1.5rem, 1.283rem + 0.92vw, 1.875rem);
    line-height: 1.2;
    font-weight: 560;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }
  /* The display/body split is by ROLE, not size. Structural headings (h1-h3,
     the type-*-title tiers) carry the display face because they are prose
     hierarchy. Labels sitting on a container — card titles, list titles,
     subgroup labels — stay in the body face, so a grid of cards never turns
     into a wall of display type. */
  .type-card-title {
    font-family: var(--font-sans);
    font-size: 18px;
    line-height: 1.34;
    font-weight: 600;
    letter-spacing: 0;
    text-wrap: balance;
  }
  .type-list-title {
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.42;
    font-weight: 600;
    letter-spacing: 0;
  }
  .type-card-title-featured {
    font-size: 22px;
    line-height: 1.3;
    font-weight: 600;
    letter-spacing: 0;
    text-wrap: balance;
  }
  .type-card-body {
    font-size: 14px;
    line-height: 1.6;
    letter-spacing: 0;
    text-wrap: pretty;
  }
  .type-card-body-featured {
    font-size: 14px;
    line-height: 1.9;
    letter-spacing: 0;
    text-wrap: pretty;
  }
  .type-meta {
    font-size: 12.5px;
    line-height: 1.5;
    font-weight: 500;
    letter-spacing: 0;
    color: var(--text-muted);
  }
  .type-caption {
    font-size: 12px;
    line-height: 1.45;
    font-weight: 500;
    letter-spacing: 0;
  }
  .type-cta {
    font-size: 13px;
    line-height: 1.55;
    font-weight: 500;
    letter-spacing: 0;
  }
  .type-prose {
    max-width: 64ch;
    font-size: 16px;
    line-height: 1.7;
    letter-spacing: 0;
    text-wrap: pretty;
  }
  /* System notation and data labels only (↳ DECISION, SYSTEM 01). On the home
     page notation stays quiet: no section numbering (spec decision log). */
  .type-mono {
    font-family: var(--font-mono);
    font-size: 10.5px;
    line-height: 1.4;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  @media (min-width: 768px) {
    .type-subtitle {
      font-size: 22px;
    }
    .type-card-title-featured {
      font-size: 24px;
    }
    .type-prose {
      font-size: 17px;
    }
    .type-mono {
      font-size: 11px;
    }
  }
```

- [ ] **Step 4: Mark `shimmer-accent` deprecated**

Directly above `@keyframes shimmer-sweep {`, add:

```css
/* DEPRECATED (editorial redesign): gradient text is banned by the brief.
   Kept only while the hero still uses it; removed in sub-project 3 (Hero). */
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm run test:scripts`
Expected: PASS (all tests, including both `type:` tests)

- [ ] **Step 6: Look at it**

Open `http://localhost:3000/`. Expected: the hero headline is visibly lighter (600) and caps at 72px at ≥1024px (`getComputedStyle(document.querySelector('.type-display-hero')).fontSize` is `72px` at 1280px wide). Section titles are 44px at ≥1024px. No console errors.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css scripts/design-tokens.test.mjs
git commit -m "Editorial type scale: 600-weight display tiers, fluid sizes, type-mono

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Grid, spacing, and radius

**Files:**
- Modify: `app/globals.css` (`@theme inline` radius line; new layout-token block after `.band-inverse`; `UTILITIES` layer)
- Test: `scripts/design-tokens.test.mjs` (append)

**Interfaces:**
- Produces: CSS custom properties `--page-max`, `--grid-cols`, `--grid-gutter`, `--page-margin`, `--space-1`…`--space-11`, `--radius-xs|sm|md|lg`; Tailwind `rounded-xs|sm|md|lg` mapped to them; classes `.page-container`, `.grid-page`, `.place-full`, `.place-wide`, `.place-text`, `.place-bleed`, `.section-dense`, `.section-quiet`. Tasks 6, 7, and 8 use these.

- [ ] **Step 1: Write the failing test**

Append to `scripts/design-tokens.test.mjs`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:scripts`
Expected: FAIL on both `layout:` tests (`light["page-max"]` is `undefined`).

- [ ] **Step 3: Move radius to an always-emitted theme block**

In `@theme inline { … }`, delete the line:

```css
  --radius-lg: var(--radius);
```

Directly after the closing `}` of `@theme inline`, add:

```css
/* Radius scale (spec §6.3). `static` makes Tailwind always emit these
   variables, because the layer utilities below reference them with var(). */
@theme static {
  --radius-xs: 2px;
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
}
```

- [ ] **Step 4: Add the layout and spacing tokens**

Directly after the `.band-inverse { … }` rule from Task 2, add:

```css
/* ─────────────────────────
   LAYOUT & SPACING TOKENS (theme-independent; spec §6)
───────────────────────── */

:root {
  --page-max: 1320px;
  --grid-cols: 4;
  --grid-gutter: 16px;
  --page-margin: 20px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
  --space-11: 160px;
}

@media (min-width: 768px) {
  :root {
    --grid-cols: 8;
    --grid-gutter: 20px;
    --page-margin: 32px;
  }
}

@media (min-width: 1024px) {
  :root {
    --grid-cols: 12;
    --page-margin: 40px;
  }
}

@media (min-width: 1280px) {
  :root {
    --grid-gutter: 24px;
    --page-margin: 48px;
  }
}
```

- [ ] **Step 5: Add the grid and section utilities**

Inside the `UTILITIES` `@layer utilities { … }` block, after the `.card-surface:hover` rule, add:

```css
  /* ─────────────────────────
     PAGE GRID (spec §6.1): 4 / 8 / 12 columns.
     Placements keep composition consistent; section headers default to an
     asymmetric title-left / intro-right split built from these.
  ───────────────────────── */
  .page-container {
    width: 100%;
    max-width: calc(var(--page-max) + 2 * var(--page-margin));
    margin-inline: auto;
    padding-inline: var(--page-margin);
  }
  .grid-page {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr));
    column-gap: var(--grid-gutter);
  }
  .place-full,
  .place-wide,
  .place-text {
    grid-column: 1 / -1;
  }
  /* Breaks out of its container to the viewport edges. Relies on the
     overflow-x: clip on <main> so 100vw never adds a horizontal scrollbar. */
  .place-bleed {
    grid-column: 1 / -1;
    width: 100vw;
    margin-inline: calc(50% - 50vw);
  }
  @media (min-width: 768px) {
    .place-text {
      grid-column: 2 / span 6;
    }
  }
  @media (min-width: 1024px) {
    .place-wide {
      grid-column: 2 / -1;
    }
    .place-text {
      grid-column: 4 / span 7;
    }
  }

  /* Section densities: alternate dense and quiet for rhythm (spec §6.2). */
  .section-dense {
    padding-block: var(--space-8);
  }
  .section-quiet {
    padding-block: var(--space-9);
  }
  @media (min-width: 1024px) {
    .section-dense {
      padding-block: var(--space-9);
    }
    .section-quiet {
      padding-block: var(--space-11);
    }
  }
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm run test:scripts && npm run check:contrast`
Expected: all PASS; contrast still 22/22.

- [ ] **Step 7: Confirm the radius variables reach the browser**

In the browser on `http://localhost:3000/showcase`, run:

```js
getComputedStyle(document.documentElement).getPropertyValue("--radius-md").trim()
```

Expected: `"6px"`. If it returns `""`, the `@theme static` block isn't being emitted: check it is a top-level block (not inside `@layer`) and that Tailwind is 4.2.x (`node -p "require('tailwindcss/package.json').version"`).

- [ ] **Step 8: Commit**

```bash
git add app/globals.css scripts/design-tokens.test.mjs
git commit -m "Editorial grid, spacing, and radius tokens with placement utilities

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Motion tokens, mirrored in CSS and `lib/motion.ts`

**Files:**
- Modify: `app/globals.css` (layout-token `:root` block from Task 4)
- Modify: `lib/motion.ts`
- Test: `scripts/motion-tokens.test.mjs` (create)

**Interfaces:**
- Consumes: `extractThemes` (Task 1); the theme-independent `:root` block (Task 4).
- Produces: CSS `--dur-1…4`, `--ease-out`, `--ease-move`; TS exports `EASE` (unchanged value), `EASE_MOVE`, `DURATION = { feedback, fast, base, slow }`, `RISE`, `STAGGER`, `STAGGER_MAX`, `PARALLAX_MAX`, `entrance(index)`. The 17 existing importers keep compiling because every existing export name survives.

- [ ] **Step 1: Write the failing test**

Create `scripts/motion-tokens.test.mjs`:

```js
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { extractThemes } from "./lib/tokens.mjs"
import { DURATION, EASE, EASE_MOVE, STAGGER, STAGGER_MAX, RISE, PARALLAX_MAX, entrance } from "../lib/motion.ts"

const { light } = extractThemes(readFileSync(new URL("../app/globals.css", import.meta.url), "utf8"))
const ms = (seconds) => `${Math.round(seconds * 1000)}ms`
const bezier = (curve) => `cubic-bezier(${curve.join(", ")})`

test("CSS durations mirror DURATION", () => {
  assert.equal(light["dur-1"], ms(DURATION.feedback))
  assert.equal(light["dur-2"], ms(DURATION.fast))
  assert.equal(light["dur-3"], ms(DURATION.base))
  assert.equal(light["dur-4"], ms(DURATION.slow))
  assert.deepEqual([DURATION.feedback, DURATION.fast, DURATION.base, DURATION.slow], [0.2, 0.4, 0.6, 0.9])
})

test("CSS easings mirror EASE and EASE_MOVE", () => {
  assert.equal(light["ease-out"], bezier(EASE))
  assert.equal(light["ease-move"], bezier(EASE_MOVE))
})

test("motion limits match the spec", () => {
  assert.equal(STAGGER, 0.06)
  assert.equal(STAGGER_MAX, 6)
  assert.ok(RISE <= 12)
  assert.equal(PARALLAX_MAX, 16)
})

test("entrance() caps the stagger at STAGGER_MAX items", () => {
  assert.ok(Math.abs(entrance(2).transition.delay - 0.12) < 1e-9)
  assert.ok(Math.abs(entrance(10).transition.delay - 0.36) < 1e-9)
  assert.equal(entrance(0).transition.duration, DURATION.base)
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:scripts`
Expected: FAIL. `EASE_MOVE` import is `undefined` (or a SyntaxError for the missing named export), and `light["dur-1"]` is `undefined`.

- [ ] **Step 3: Add the CSS motion tokens**

In the theme-independent `:root { … }` block from Task 4, after `--space-11: 160px;`, add:

```css

  /* Motion (spec §7). Mirrored in lib/motion.ts; scripts/motion-tokens.test.mjs
     fails if the two drift. Unlayered, so --ease-out also retunes Tailwind's
     `ease-out` utility to the house curve. */
  --dur-1: 200ms;
  --dur-2: 400ms;
  --dur-3: 600ms;
  --dur-4: 900ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-move: cubic-bezier(0.65, 0, 0.35, 1);
```

- [ ] **Step 4: Replace `lib/motion.ts`**

```ts
// ─── Motion tokens ────────────────────────────────────────────────────────────
// One place to tune the site's animation feel. Components import these instead
// of hardcoding the curve and timings, so a change here updates everything.
// Mirrors the --dur-* / --ease-* custom properties in app/globals.css;
// scripts/motion-tokens.test.mjs fails if the two drift.
//
// Editorial motion is slow, quiet, and purposeful: opacity-led with a small
// rise, no springs, no bounce. Reduced motion is honoured globally by
// <MotionConfig reducedMotion="user"> in app/layout.tsx.

/** Entrance curve (mirrors --ease-out). */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Layers changing position (mirrors --ease-move). */
export const EASE_MOVE = [0.65, 0, 0.35, 1] as const

/** Durations in seconds (mirror --dur-1…4). */
export const DURATION = {
  /** Hover, focus, press. */
  feedback: 0.2,
  /** UI transitions: nav opacity, dialogs, tabs. */
  fast: 0.4,
  /** Reveals: text, images, layers. */
  base: 0.6,
  /** Hero entrance only. */
  slow: 0.9,
} as const

/** How far below its resting spot an element starts before fading up (px).
 *  The rule is ≤ 12px; small keeps the transform cheap across browsers. */
export const RISE = 8

/** Per-step delay for a staggered group entrance (seconds). */
export const STAGGER = 0.06

/** Items beyond this share the last step's delay, so long lists never crawl. */
export const STAGGER_MAX = 6

/** Ceiling for parallax on layers inside an artefact (px). Nowhere else. */
export const PARALLAX_MAX = 16

/**
 * Consistent on-load entrance props for framer-motion (initial + animate).
 * Pass the element's position in the group for a clean, even stagger.
 */
export function entrance(index = 0) {
  return {
    initial: { opacity: 0, y: RISE },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: DURATION.base,
      delay: Math.min(index, STAGGER_MAX) * STAGGER,
      ease: EASE,
    },
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm run test:scripts`
Expected: PASS (an `ExperimentalWarning` about type stripping is fine)

- [ ] **Step 6: Typecheck the consumers**

Run: `npx tsc --noEmit -p . && npm run lint`
Expected: exit 0, since all 17 importers still use `EASE`, `DURATION.*`, `RISE`, `STAGGER`, or `entrance`.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css lib/motion.ts scripts/motion-tokens.test.mjs
git commit -m "Motion tokens: 200/400/600/900ms and two curves, mirrored in CSS and TS

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Layer utilities

**Files:**
- Modify: `app/globals.css` (`UTILITIES` layer, after the section-density rules from Task 4)
- Test: `scripts/design-tokens.test.mjs` (append)

**Interfaces:**
- Consumes: `--surface-1`, `--border`, `--rule-strong`, `--surface-glass`, `--glass-border`, `--accent` (Task 2); `--radius-md` (Task 4).
- Produces: classes `.layer-interface`, `.layer-system`, `.layer-glass`, `.marker`, `.marker-line`, used by Task 8 and by sub-project 5's `LayeredArtefact`.

- [ ] **Step 1: Write the failing test**

Append to `scripts/design-tokens.test.mjs`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:scripts`
Expected: FAIL on both `layers:` tests (`.layer-interface` not found).

- [ ] **Step 3: Add the layer utilities**

Inside the `UTILITIES` layer, after the `.section-quiet` media block from Task 4, add:

```css
  /* ─────────────────────────
     LAYER LANGUAGE (spec §8). Fixed stacking order, bottom to top:
     interface < system < annotation < context. Layers overlap by grid
     offsets, at most three visible at once. Glass is the context layer only:
     if a surface holds primary content, it is not glass.
  ───────────────────────── */
  .layer-interface {
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }
  .layer-system {
    background: color-mix(in oklab, var(--surface-1) 18%, transparent);
    border: 1px dashed var(--rule-strong);
    border-radius: var(--radius-md);
  }
  /* Solid-ish fallback first; real glass only where the browser supports it. */
  .layer-glass {
    background: color-mix(in oklab, var(--surface-1) 92%, transparent);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
  }
  /* The accent marks the decision: the ↳ DECISION label and its marker. */
  .marker {
    display: inline-block;
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 9999px;
    background: var(--accent);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 18%, transparent);
  }
  .marker-line {
    height: 0;
    border-top: 1px solid var(--accent);
  }
```

Then, **outside** the `@layer utilities` block (directly after its closing `}`), add:

```css
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .layer-glass {
    background: var(--surface-glass);
    -webkit-backdrop-filter: blur(14px) saturate(1.1);
    backdrop-filter: blur(14px) saturate(1.1);
  }
}

@media (prefers-reduced-transparency: reduce) {
  .layer-glass {
    background: var(--surface-1);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
```

(These sit outside the layer on purpose: unlayered rules win over the layered fallback above.)

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test:scripts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/globals.css scripts/design-tokens.test.mjs
git commit -m "Layer utilities: interface, system, annotation marker, glass context

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Retire the site-wide layers, default to light, add the dev grid overlay

**Files:**
- Modify: `app/layout.tsx`
- Modify: `lib/scroll.ts`
- Delete: `components/shared/smooth-scroll.tsx`
- Create: `components/shared/grid-overlay.tsx`
- Modify: `app/globals.css` (reduced-motion comment)
- Modify: `package.json`, `package-lock.json` (uninstall Lenis)
- Test: `scripts/layout.test.mjs` (create)

**Interfaces:**
- Consumes: `.page-container`, `.grid-page` (Task 4).
- Produces: `GridOverlay` (named export, no props) from `components/shared/grid-overlay.tsx`; `scrollToSection(id: string): void` from `lib/scroll.ts` (signature unchanged).

- [ ] **Step 1: Write the failing test**

Create `scripts/layout.test.mjs`:

```js
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
  assert.doesNotMatch(layout, /\benableSystem\b/)
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:scripts`
Expected: FAIL on all four `layout.test.mjs` tests.

- [ ] **Step 3: Create the grid overlay**

Create `components/shared/grid-overlay.tsx`:

```tsx
"use client"

import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

/**
 * Development-only overlay of the page grid (12 / 8 / 4 columns) for checking
 * alignment. Add `?grid` to any URL. Mounted from app/layout.tsx only outside
 * production, and renders nothing on the server.
 */

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange)
  return () => window.removeEventListener("popstate", onChange)
}
const getSnapshot = () => new URLSearchParams(window.location.search).has("grid")
const getServerSnapshot = () => false

const columnVisibility = (i: number) =>
  i < 4 ? "" : i < 8 ? "hidden md:block" : "hidden lg:block"

export function GridOverlay() {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (!on) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div className="page-container h-full">
        <div className="grid-page h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={cn("h-full border-x border-accent/25 bg-accent/[0.07]", columnVisibility(i))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update `app/layout.tsx`**

Delete these four import lines:

```tsx
import { FancyCursor } from "@/components/shared/cursor"
import { SiteBackground } from "@/components/shared/site-background"
import { Grain } from "@/components/shared/motion"
import { SmoothScroll } from "@/components/shared/smooth-scroll"
```

and add, next to the `ThemeFab` import:

```tsx
import { GridOverlay } from "@/components/shared/grid-overlay"
```

Replace the `ThemeProvider` opening tag:

```tsx
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
```

with:

```tsx
        {/* Editorial paper is the default for every first visit, whatever the
            OS setting: it's a design decision, not a preference to follow.
            A visitor's own toggle choice is still remembered. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
```

Delete these mounts and their comments:

```tsx
            {/* Lenis smooth scroll */}
            <SmoothScroll />
```

```tsx
            <FancyCursor />

            {/* Interactive dot field — a standalone, full-viewport background
                layer (independent of the hero). Sits behind all content; the
                opaque section bands scroll over it. */}
            <SiteBackground />

            {/* Film grain — one quiet texture across every page */}
            <Grain />
```

After `<ThemeFab />`, add:

```tsx

            {/* Grid overlay for alignment checks (?grid), development only */}
            {process.env.NODE_ENV !== "production" && <GridOverlay />}
```

- [ ] **Step 5: Replace `lib/scroll.ts`**

```ts
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  // Clears the fixed navbar.
  const yOffset = -80
  const y = el.getBoundingClientRect().top + window.scrollY + yOffset

  // Native scrolling only: smooth by default, an instant jump under reduced motion.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" })
}
```

- [ ] **Step 6: Delete Lenis**

Run:

```bash
git rm components/shared/smooth-scroll.tsx
npm uninstall @studio-freight/lenis
```

In `app/globals.css`, in the comment above `@media (prefers-reduced-motion: reduce) {`, replace the line:

```
   and Lenis smooth-scroll is skipped, in their respective files.)
```

with:

```
   and lib/scroll.ts jumps instead of smooth-scrolling.)
```

- [ ] **Step 7: Run the tests, typecheck, and lint**

Run: `npm run test:scripts && npx tsc --noEmit -p . && npm run lint`
Expected: all PASS, exit 0. If `tsc` reports a missing `window.__lenis` type anywhere, search with `grep -rn "__lenis" app components lib hooks` and delete that reference (Task 7 removes Lenis completely).

- [ ] **Step 8: Browser check: nav anchors without Lenis (Review Focus 5)**

Restart the dev server (`preview_stop`, then `preview_start` name `dev`) so the uninstall is picked up. On `http://localhost:3000/`, run:

```js
document.querySelector('a[href="/#work"]').click()
await new Promise((r) => setTimeout(r, 1500))
Math.round(document.getElementById("work").getBoundingClientRect().top)
```

Expected: between `60` and `100` (the section sits just under the fixed nav).

Then exercise the reduced-motion path. The browser tools can't emulate the media query, so stub `matchMedia` for this check only:

```js
const real = window.matchMedia.bind(window)
window.matchMedia = (q) =>
  q.includes("prefers-reduced-motion")
    ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} }
    : real(q)
window.scrollTo(0, 0)
document.querySelector('a[href="/#work"]').click()
await new Promise((r) => requestAnimationFrame(r))
Math.round(document.getElementById("work").getBoundingClientRect().top)
```

Expected: between `60` and `100` after a single frame (an instant jump; a smooth scroll would still be far from the target). Run `location.reload()` afterwards to restore the real `matchMedia`. No console errors.

- [ ] **Step 9: Browser check: returning visitors' stored themes (Review Focus 4)**

For each value `"dark"`, `"light"`, `"system"`, run in the console, then reload:

```js
localStorage.setItem("theme", VALUE); location.reload()
```

After the reload:

```js
[document.documentElement.className, getComputedStyle(document.body).backgroundColor]
```

Expected: `"dark"` → class contains `dark`, background is warm near-black; `"light"` → class contains `light`, background `rgb(241, 237, 228)`; `"system"` → no `dark` class, background `rgb(241, 237, 228)` (paper), and clicking the theme toggle switches to dark. Finally run `localStorage.removeItem("theme")` and reload: paper.

- [ ] **Step 10: Browser check: grid overlay**

Open `http://localhost:3000/?grid`. Expected: 12 faint emerald columns at 1280px wide; at 768px wide 8; at 375px 4 (`resize_window` presets `tablet` and `mobile`). Without `?grid`, no overlay. No cursor ring follows the pointer, and there's no dot-field canvas behind the hero.

- [ ] **Step 11: Commit**

```bash
git add -A app/layout.tsx lib/scroll.ts components/shared/grid-overlay.tsx app/globals.css package.json package-lock.json scripts/layout.test.mjs
git commit -m "Retire cursor, Lenis, WebGL background, and grain; default to editorial light

Lenis is removed entirely (component, dependency, and the scroll helper's
branch). The theme no longer follows the OS on first visit. Adds a
development-only ?grid overlay for alignment checks.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Living reference in the showcase Foundations tab

**Files:**
- Create: `components/showcase/foundations-reference.tsx`
- Modify: `app/showcase/page.tsx` (import; `TOKENS` constant lines 199–209; Foundations tab description; the `tokens` `Lab` lines 558–571)

**Interfaces:**
- Consumes: every token and class from Tasks 2–6 (`band-inverse`, `place-bleed`, `page-container`, `grid-page`, `place-text`, `place-full`, `section-dense`, `layer-*`, `marker`, `marker-line`, `type-*`, `rounded-xs`, `border-rule-strong`).
- Produces: `FoundationsReference` (named export, no props).

- [ ] **Step 1: Create the reference component**

Create `components/showcase/foundations-reference.tsx`:

```tsx
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Living reference for the editorial Foundations
 * (docs/superpowers/specs/2026-10-01-editorial-foundations-design.md).
 * Everything reads tokens through CSS variables, so the header's theme toggle
 * shows both sets. Static on purpose: no client code.
 */

const COLOR_TOKENS = [
  { name: "background", note: "editorial canvas" },
  { name: "foreground", note: "ink" },
  { name: "text-muted", note: "metadata" },
  { name: "surface-1", note: "elevated" },
  { name: "surface-2", note: "artefact stage" },
  { name: "surface-inverse", note: "inverse colour" },
  { name: "accent", note: "the one accent" },
  { name: "border", note: "hairline rule" },
  { name: "rule-strong", note: "system layer" },
] as const

const TYPE_SCALE = [
  { cls: "type-display-hero", label: "Display", sample: "Systems over screens." },
  { cls: "type-hero-internal", label: "Hero, internal", sample: "Decisions over UI." },
  { cls: "type-page-title", label: "Page title", sample: "Clarity over decoration." },
  { cls: "type-section-title", label: "Section title", sample: "Systems that shipped." },
  { cls: "type-case-title", label: "Case title", sample: "One theme file, one brand skin." },
  { cls: "type-subtitle", label: "Subtitle", sample: "Brand token layer" },
  {
    cls: "type-prose",
    label: "Prose",
    sample:
      "Colour, type and radius live in a single brand layer, so a new prospect is a configuration pass rather than a redesign.",
  },
  { cls: "type-card-body", label: "Card body", sample: "Every bank inherits the system." },
  { cls: "type-meta", label: "Meta", sample: "Mastercard · 2022–now" },
  { cls: "type-caption", label: "Caption", sample: "Representative visual." },
  { cls: "type-mono", label: "Mono / system", sample: "↳ Decision" },
] as const

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160]

const RADII = [
  { token: "radius-xs", use: "tags" },
  { token: "radius-sm", use: "buttons" },
  { token: "radius-md", use: "artefacts" },
  { token: "radius-lg", use: "dialogs" },
] as const

const MOTION = [
  ["--dur-1", "200ms", "hover, focus, press"],
  ["--dur-2", "400ms", "nav, dialogs, tabs"],
  ["--dur-3", "600ms", "reveals"],
  ["--dur-4", "900ms", "hero entrance only"],
  ["--ease-out", "cubic-bezier(0.22, 1, 0.36, 1)", "entrances"],
  ["--ease-move", "cubic-bezier(0.65, 0, 0.35, 1)", "layers changing position"],
] as const

const columnVisibility = (i: number) =>
  i < 4 ? "" : i < 8 ? "hidden md:block" : "hidden lg:block"

function Heading({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-5">
      <h3 className="type-subtitle text-foreground">{children}</h3>
      {note && <p className="type-meta mt-1 max-w-2xl">{note}</p>}
    </div>
  )
}

/** Reports whether `dark:` utilities are active at this point in the tree. */
function ScopeProbe({ id }: { id: string }) {
  return (
    <span data-scope-probe={id} className="type-mono">
      <span className="hidden dark:inline">dark: active</span>
      <span className="dark:hidden">dark: inactive</span>
    </span>
  )
}

export function FoundationsReference() {
  return (
    <div className="flex flex-col gap-14 py-12">
      <section id="foundations-color">
        <Heading note="Semantic tokens. Toggle the theme to see both sets; every text pair is held to AA by npm run check:contrast.">
          Colour
        </Heading>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {COLOR_TOKENS.map((t) => (
            <div key={t.name} className="flex flex-col gap-2">
              <div className="h-14 rounded-md border border-border" style={{ background: `var(--${t.name})` }} />
              <div>
                <p className="type-mono text-foreground">--{t.name}</p>
                <p className="type-caption text-muted-foreground">{t.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="foundations-surfaces">
        <Heading note="Four surfaces only. If a surface holds primary content, it is not glass.">Surfaces</Heading>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-background p-5">
            <p className="type-mono text-foreground">Editorial</p>
            <p className="type-card-body mt-2 text-muted-foreground">The paper canvas.</p>
          </div>
          <div className="layer-interface p-5">
            <p className="type-mono text-foreground">Elevated</p>
            <p className="type-card-body mt-2 text-muted-foreground">Interface artefacts. Hairline, no resting shadow.</p>
          </div>
          <div className="rounded-md border border-border bg-[repeating-linear-gradient(135deg,var(--surface-2)_0_12px,var(--background)_12px_24px)] p-5">
            <div className="layer-glass p-4">
              <p className="type-mono text-foreground">Glass</p>
              <p className="type-card-body mt-2 text-muted-foreground">Metadata, nav and overlays only.</p>
            </div>
          </div>
          <div className="band-inverse rounded-md p-5">
            <p className="type-mono">Inverse band</p>
            <p className="type-card-body mt-2 text-muted-foreground">
              Swaps the token scope. <ScopeProbe id="inside" />
            </p>
          </div>
        </div>
        <p className="type-meta mt-3">
          Outside a band: <ScopeProbe id="outside" />
        </p>
      </section>

      <section id="foundations-band">
        <Heading note="A full-bleed emphasis band, as used for core beliefs and frameworks.">Emphasis band</Heading>
        <div className="band-inverse place-bleed">
          <div className="page-container grid-page section-dense">
            <p className="type-mono place-full text-muted-foreground">Core belief</p>
            <p className="type-section-title place-text mt-4">
              Clarity over decoration. Systems over screens. Decisions over UI.
            </p>
          </div>
        </div>
      </section>

      <section id="foundations-type">
        <Heading note="Bricolage 600 for structural headings, Onest for everything else, JetBrains Mono for system notation only.">
          Type scale
        </Heading>
        <div className="divide-y divide-border border-y border-border">
          {TYPE_SCALE.map((t) => (
            <div key={t.cls} className="grid gap-2 py-4 md:grid-cols-[12rem_1fr] md:items-baseline">
              <p className="type-mono text-muted-foreground">
                {t.label} · .{t.cls}
              </p>
              <p className={cn(t.cls, "text-foreground")}>{t.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="foundations-grid">
        <Heading note="12 columns from 1024px, 8 on tablet, 4 on mobile. In development, add ?grid to any URL to overlay it.">
          Grid
        </Heading>
        <div className="grid-page">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={cn("h-16 rounded-xs bg-accent/15", columnVisibility(i))} />
          ))}
          <div className="type-meta place-text mt-3 rounded-xs border border-dashed border-rule-strong p-3">
            .place-text: the prose column (≈64ch)
          </div>
        </div>
      </section>

      <section id="foundations-space">
        <Heading note="4px base. Sections use .section-dense (64→96px) or .section-quiet (96→160px).">
          Spacing and radius
        </Heading>
        <div className="flex flex-col gap-2">
          {SPACE.map((px, i) => (
            <div key={px} className="flex items-center gap-4">
              <span className="type-mono w-20 text-muted-foreground">--space-{i + 1}</span>
              <span className="h-2 bg-accent" style={{ width: px }} />
              <span className="type-caption text-muted-foreground">{px}px</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-6">
          {RADII.map((r) => (
            <div key={r.token} className="flex flex-col items-center gap-2">
              <div className="size-16 border border-rule-strong bg-muted" style={{ borderRadius: `var(--${r.token})` }} />
              <p className="type-mono text-foreground">--{r.token}</p>
              <p className="type-caption text-muted-foreground">{r.use}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="foundations-layers">
        <Heading note="Interface < system < annotation < context. Layers overlap by grid offsets; at most three are visible at once. The accent marks the decision.">
          Layers
        </Heading>
        <div className="relative h-[26rem] rounded-md bg-muted md:h-72">
          <div className="layer-interface absolute left-4 top-4 h-48 w-[80%] p-4 md:left-6 md:top-6 md:w-[58%]">
            <p className="type-mono text-muted-foreground">Interface</p>
            <div className="mt-4 h-12 rounded-md bg-foreground/10" />
            <div className="mt-3 h-2 w-3/4 rounded-xs bg-foreground/10" />
            <div className="mt-2 h-2 w-1/2 rounded-xs bg-foreground/10" />
          </div>
          <div className="layer-system absolute left-[20%] top-40 h-36 w-[70%] p-4 md:left-[30%] md:top-20 md:w-[44%]">
            <p className="type-mono text-foreground">↳ System · token layer</p>
            <p className="mt-2 font-mono text-[11px] leading-6 text-foreground">
              color.primary → brand
              <br />
              radius.card → 12px
            </p>
          </div>
          <span className="marker-line absolute left-[58%] top-[6.6rem] hidden w-[12%] md:block" />
          <span className="marker absolute left-[calc(58%-4px)] top-[6.35rem] hidden md:block" />
          <div className="layer-glass absolute bottom-4 right-4 w-[55%] p-4 md:bottom-auto md:right-6 md:top-10 md:w-[30%]">
            <p className="type-mono text-accent">↳ Decision</p>
            <p className="type-card-body mt-1 text-foreground">Tokens, not templates.</p>
          </div>
        </div>
      </section>

      <section id="foundations-motion">
        <Heading note="Slow, quiet, purposeful. With reduced motion, reveals become opacity-only or nothing.">Motion</Heading>
        <div className="divide-y divide-border border-y border-border">
          {MOTION.map(([token, value, use]) => (
            <div key={token} className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-1 py-3 md:grid-cols-[10rem_1fr_14rem]">
              <p className="type-mono text-foreground">{token}</p>
              <p className="font-mono text-[12px] text-muted-foreground">{value}</p>
              <p className="type-caption col-span-2 text-muted-foreground md:col-span-1">{use}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Wire it into the showcase**

In `app/showcase/page.tsx`:

1. Add the import after the `ShowcaseTabs` import block:

```tsx
import { FoundationsReference } from "@/components/showcase/foundations-reference"
```

2. Delete the whole `const TOKENS: { name: string; cls: string; note: string }[] = [ … ]` constant (lines 199–209). It has no other users.

3. In `SHOWCASE_TABS`, change the Foundations entry's description to:

```tsx
    description:
      "Editorial tokens, type, grid, surfaces, layers, and motion, plus buttons, badges, and pills.",
```

4. Replace the `{/* Color tokens */}` comment and its entire `<Lab id="tokens" … > … </Lab>` element (lines 558–571) with:

```tsx
      {/* Editorial foundations: the living reference */}
      <FoundationsReference />
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit -p . && npm run lint`
Expected: exit 0.

- [ ] **Step 4: Browser check: band scoping in both themes (Review Focus 2)**

Open `http://localhost:3000/showcase` (Foundations is the default tab). In light mode, run:

```js
Object.fromEntries([...document.querySelectorAll("[data-scope-probe]")].map((el) => [el.dataset.scopeProbe, el.innerText.trim()]))
```

Expected: `{ inside: "DARK: ACTIVE", outside: "DARK: INACTIVE" }` (`type-mono` uppercases the text). The inverse-band tile and the full-bleed band render near-black with paper text. Toggle to dark mode and run it again. Expected: `{ inside: "DARK: INACTIVE", outside: "DARK: ACTIVE" }`, and both bands render paper with ink text.

- [ ] **Step 5: Browser check: no horizontal overflow (Review Focus 3)**

At each of `resize_window` `mobile` (375), `tablet` (768), and widths 1280 and 1440, on `/showcase` run:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Expected: `true` at every width. The full-bleed band reaches both viewport edges with no horizontal scrollbar. Reset with preset `desktop` afterwards.

- [ ] **Step 6: Screenshot the reference**

Take screenshots of the Foundations tab in light and dark at 1280px wide, and the layers section at 375px. Expected: paper canvas, readable type scale, layers overlapping in order (glass on top, emerald marker on the system edge at ≥768px).

- [ ] **Step 7: Commit**

```bash
git add components/showcase/foundations-reference.tsx app/showcase/page.tsx
git commit -m "Showcase: living Foundations reference with scope probes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Rewrite DESIGN.md, PRODUCT.md, and the README summary

**Files:**
- Modify (full rewrite): `DESIGN.md`
- Modify (full rewrite): `PRODUCT.md`
- Modify: `README.md` line 3

**Interfaces:**
- Consumes: the final token values from Tasks 2–6.

- [ ] **Step 1: Replace `DESIGN.md`**

```markdown
---
name: Amritansh Pandey — Portfolio
description: A warm-paper editorial publication about product systems. Swiss structure, a layered-product visual language, one emerald accent, dark mode by toggle.
colors:
  paper: "#F1EDE4"
  ink: "#141414"
  muted: "#6A6458"
  surface-elevated: "#FAF8F3"
  surface-stage: "#EAE5DA"
  night: "oklch(0.15 0.005 80)"
  emerald: "#047857"
  emerald-on-dark: "oklch(0.765 0.163 163)"
  rule: "rgb(20 20 20 / 0.13)"
  rule-strong: "rgb(20 20 20 / 0.28)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.344rem + 4.93vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.369rem + 2.16vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.28
  body:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  meta:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78125rem"
    fontWeight: 500
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.65625rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  xs: "2px"
  sm: "3px"
  md: "6px"
  lg: "10px"
spacing:
  base: "4px"
  scale: "4 8 12 16 24 32 48 64 96 128 160"
grid:
  desktop: "12 columns, 24px gutter, 48px margin, 1320px max"
  laptop: "12 columns, 20px gutter, 40px margin"
  tablet: "8 columns, 20px gutter, 32px margin"
  mobile: "4 columns, 16px gutter, 20px margin"
motion:
  durations: "200ms feedback · 400ms UI · 600ms reveal · 900ms hero"
  ease-out: "cubic-bezier(0.22, 1, 0.36, 1)"
  ease-move: "cubic-bezier(0.65, 0, 0.35, 1)"
---

# Design System: Amritansh Pandey — Portfolio

Source spec: `docs/superpowers/specs/2026-10-01-editorial-foundations-design.md`. Living reference: the Foundations tab at `/showcase`.

## 1. Overview

**Creative North Star: "A premium editorial publication about product systems."**

**Clarity over decoration. Systems over screens. Decisions over UI.** The site reads like a design publication that happens to be interactive: Swiss structure underneath, a warm paper canvas, near-black ink, and one emerald accent. Depth comes from layers of information (interface, system, decision, outcome), not from shadows or effects. It should feel designed, never desperate to impress: quiet confidence, visual intelligence, strong art direction.

**Key characteristics**
- Warm paper (`#F1EDE4`) by default; dark mode by toggle, with the inversion rule.
- One accent, emerald, on about 10% of any screen.
- Bricolage Grotesque for structural headings at 600, Onest for everything else, JetBrains Mono for system notation only.
- A 12 / 8 / 4-column grid with asymmetric, disciplined compositions.
- The layer language: interface < system < annotation < context.
- Slow, quiet motion; everything still reads with motion off.

## 2. Colour

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `#F1EDE4` | `oklch(0.15 0.005 80)` | Canvas |
| `--foreground` | `#141414` | `oklch(0.93 0.012 85)` | Ink |
| `--text-muted` | `#6A6458` | `oklch(0.70 0.012 85)` | Metadata |
| `--surface-1` | `#FAF8F3` | `oklch(0.19 0.005 80)` | Elevated artefacts |
| `--surface-2` | `#EAE5DA` | `oklch(0.12 0.004 80)` | Artefact stages |
| `--accent` | `#047857` | `oklch(0.765 0.163 163)` | The one accent |
| `--border` | ink at 13% | paper at 12% | Hairline rules |
| `--rule-strong` | ink at 28% | paper at 30% | Dashed system layer |
| `--surface-glass` | paper at 62% | night at 62% | Context layer only |

**The One Voice Rule.** Emerald is the only accent: interactions, active states, the important metric's marker, system markers, the decision. Never a second hue; reach for weight, size, or a neutral step instead.

**The Paper Rule.** The canvas is warm paper, not white and not beige. Warmth lives in the neutrals; the accent stays emerald.

**The Inversion Rule.** Dark emphasis sections (core beliefs, frameworks, high-emphasis transitions) use `.band-inverse`, which swaps the token scope in CSS. On a light page a band is near-black; on a dark page it is paper. Everything inside, accent included, renders from the swapped tokens. Bands never paint themselves with `--surface-inverse`.

Every text/background pair is held to WCAG AA in both themes by `npm run check:contrast`.

## 3. Typography

| Class | Face · weight | Mobile → desktop |
|---|---|---|
| `type-display-hero` | Bricolage 600 | 40 → 72px |
| `type-hero-internal` | Bricolage 600 | 36 → 56px |
| `type-page-title` | Bricolage 600 | 32 → 48px |
| `type-section-title` | Bricolage 600 | 30 → 44px |
| `type-case-title` | Bricolage 560 | 24 → 30px |
| `type-subtitle` | Onest 600 | 20 → 22px |
| `type-prose` | Onest 400, lh 1.7, ≤64ch | 16 → 17px |
| `type-card-body` | Onest 400, lh 1.6 | 14px |
| `type-meta` | Onest 500, muted | 12.5px |
| `type-mono` | JetBrains Mono 500, uppercase, 0.08em | 10.5 → 11px |

**The Role-Split Rule.** The display face is for structural headings only. Labels on containers (card titles, list titles) stay in Onest, so a grid never becomes a wall of display type.
**The Restraint Rule.** Headlines are confident, not oversized. No gradient text, outlined text, or decorative type. `shimmer-accent` is deprecated and leaves with the hero redesign.
**The Caveat-Sparingly Rule.** The handwriting accent appears at most once per surface.

## 4. Layout

- **Grid.** `.page-container` + `.grid-page`: 12 columns from 1024px, 8 from 768px, 4 below. Max content width 1320px.
- **Placements.** `.place-full` (1–12), `.place-wide` (2–12), `.place-text` (4–10, the ≈64ch prose column), `.place-bleed` (viewport edge to edge).
- **Asymmetry by default.** Section headers put the title in columns 1–7 and the intro in 8–12, aligned to the title's baseline. Not every section is symmetrical; tension comes from offset, discipline from the grid.
- **Mobile is composed, not compressed.** Offsets become indent steps (metadata starts at column 2 or 3 of 4) instead of stacking flush.
- **Rhythm.** Sections alternate `.section-dense` (64 → 96px) and `.section-quiet` (96 → 160px).
- **Spacing.** A 4px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 (`--space-1…11`).

## 5. Surfaces and elevation

Four surfaces only:
1. **Editorial**: the paper canvas.
2. **Elevated**: `--surface-1` plus a hairline. Flat at rest; no resting shadows.
3. **Inverse**: emphasis bands (`.band-inverse`).
4. **Glass**: `.layer-glass`, for metadata, nav, overlays, and context layers. Subtle blur (14px), low opacity, a near-invisible border. Falls back to a solid surface without `backdrop-filter` and under `prefers-reduced-transparency`.

**The Glass Rule.** If a surface holds primary content, it is not glass. Glass must read editorial and architectural, never "Web3".
**Rules, not boxes.** Lists and indexes are rows separated by hairlines. Bordered containers are reserved for artefacts.
**Radius.** 2px tags, 3px buttons and inputs, 6px artefacts and media, 10px dialogs. Bands and full-bleed blocks are square. `rounded-full` only for dots, avatars, and slider handles.

## 6. The layer language

Product → System → Constraint → Decision → Outcome, expressed spatially:

| Layer (bottom → top) | Class | Treatment |
|---|---|---|
| Interface | `.layer-interface` | Elevated surface, 6px radius |
| System | `.layer-system` | Dashed strong rule, near-transparent, `↳ SYSTEM` label |
| Annotation | `.marker`, `.marker-line` | Emerald dot and leader line, numbered |
| Context | `.layer-glass` | The only glass |

Layers overlap by grid offsets (for example +2 columns, +48px), never arbitrary positions. At most three are visible at once. On mobile they offset vertically and stay overlapped. The accent marks the decision.

## 7. Notation

**The Quiet Rule.** No section numbering on the home page; hierarchy comes from type. Notation (`↳ CONSTRAINT`, `↳ DECISION`, `↳ OUTCOME`, `SYSTEM 01`) appears only in case studies and Systems, where it labels a real chain of cause and effect, set in `type-mono`.

## 8. Motion

| Token | Value | Use |
|---|---|---|
| `--dur-1` / `DURATION.feedback` | 200ms | Hover, focus, press |
| `--dur-2` / `DURATION.fast` | 400ms | Nav opacity, dialogs, tabs |
| `--dur-3` / `DURATION.base` | 600ms | Reveals |
| `--dur-4` / `DURATION.slow` | 900ms | Hero entrance only |
| `--ease-out` / `EASE` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances |
| `--ease-move` / `EASE_MOVE` | `cubic-bezier(0.65, 0, 0.35, 1)` | Layers changing position |

Staggers are 60ms apart, capped at 6 items. Reveals rise at most 12px (8px by default). Parallax only on layers inside an artefact, at most 16px. Hover reveals information; it never only scales. No springs, no bounce, no scroll-jacking. Reduced motion turns reveals into opacity-only fades or nothing, and every page must read completely that way.

## 9. Components

- **Primary CTA.** An underlined text link with an arrow, not a pill. Buttons that remain use a 3px radius.
- **Cards.** Flat; they respond to the pointer with a neutral fill (`--surface-hover`) and at most a 1–2px translate.
- **Navigation.** A minimal, editorial bar on a translucent layer that becomes more opaque on scroll (built in the Chrome sub-project).
- **Retired.** The custom cursor, the magnetic CTA, Lenis smooth scrolling, the WebGL hero dot field, and the grain overlay. Ambient backgrounds live only in the Lab.

## 10. Do's and don'ts

**Do**
- Improve hierarchy, composition, storytelling, and systems before polish.
- Use product artefacts as evidence: interface fragments, system diagrams, workflows, before/after, metrics, annotations, decision points. Every visual must communicate something.
- Verify both themes, reduced motion, and 375 / 768 / 1280 / 1440px.

**Don't**
- Build a generic glassmorphism, bento-grid, Apple-clone, Linear-clone, or brutalist portfolio.
- Use Web3 or neon aesthetics, excessive 3D, excessive gradients, excessive rounded cards, dashboard-like UI, or a Dribbble-style screen gallery.
- Use display-serif headings, a tiny uppercase eyebrow on every section, identical icon-card grids, or gradient text.
- Add a second accent hue, heavy blur, glowing glass, or resting shadows.
- Animate because it's possible.
```

- [ ] **Step 2: Replace `PRODUCT.md`**

```markdown
# Product

## Register

brand

## Positioning

**I design scalable product systems by making better decisions under constraints.**

The portfolio presents a senior product/UX designer who thinks in systems, not a visual designer showcasing UI screens. It communicates **clarity over decoration, systems over screens, decisions over UI**, and should leave the visitor thinking: *this person knows how to make complex things understandable.*

## Users

**Primary — hiring managers & recruiters** (fintech, product, design) evaluating Amritansh for a senior product role. They arrive on a referral or a link, scan fast (often between other tabs), and need to decide "is this person senior and interesting enough to talk to?" within a minute, then go deeper into specific case studies.

**Product & design peers** who judge craft and taste. The audience most sensitive to AI-slop and template design — they notice the details and decide whether the work is respectable.

**Founders & startup teams** who might hire Amritansh to build or advise. They care about range and proven shipping ability across the full product lifecycle.

The shared job to be done: quickly grasp seniority, range, and impact, then dig into the work that proves it.

## Product Purpose

A personal portfolio for Amritansh Pandey — Senior UX Designer · Front-end Developer at Mastercard, 6+ years building products end to end. It exists to convert qualified visitors into conversations about senior product roles by demonstrating depth (PartnerBank demo systems, the Email Builder, the React demo the CPO used at Money20/20), range (work, explorations, systems, and writing), and a distinctive point of view. Success is a hiring manager or founder reaching out — or a peer remembering the site.

Career facts (dates, titles, years of experience) must match the LinkedIn profile, which recruiters cross-check. "6+ years" counts full-time work from May 2020.

## Brand Personality

**Confident, warm, senior.** Assured without bragging; plain-spoken and story-driven; lets the work and its outcomes carry the weight. A visitor should feel they're meeting a thoughtful, high-level practitioner they'd want on their team — credible but approachable, never cold, salesy, or self-promoting.

## Information architecture

The home page tells one narrative, and each section answers a different question. No section repeats another's message.

| Section | Question it answers |
|---|---|
| Hero | Who am I? |
| Work | Can I deliver outcomes? |
| Systems | Do I think beyond screens? |
| Approach | How do I build? |
| Thinking | How do I make decisions? |
| Insights | Can I articulate ideas? |
| Explorations | Do I experiment? |
| Leadership | Can I influence outcomes? |
| Advisory | Am I trusted? |
| About | Who am I as a person? |

Navigation: Work / Systems / Thinking / Explorations / About, plus Gallery and Lab.

Case studies read as editorial product investigations, ordered **Context → Constraint → Decision → System → Outcome**, using artefacts as evidence.

## Anti-references

What this must NOT look like:

- **Generic AI-template look** — display-serif headings + tiny uppercase tracked eyebrows on every section + identical icon-card grids + gradient text.
- **Trend-checklist portfolios** — generic glassmorphism, generic bento grid, Apple clone, Linear clone, generic brutalism, Web3, neon cyberpunk, excessive 3D, excessive gradients, excessive rounded cards, dashboard-like UI, Dribbble-style screen galleries.
- **Corporate / enterprise stiffness** — safe navy-and-gray, stock photography, vendor-deck soullessness. Reads as a company, not a person.
- **Flashy dev-portfolio** — particle backgrounds, neon, over-animation, cursor gimmicks, scroll-jacking, gimmicks that distract from the work.
- **Minimal to the point of bland** — restraint with no POV; so quiet it becomes invisible and forgettable.

## Design Principles

1. **Clarity over decoration. Systems over screens. Decisions over UI.** The design itself should demonstrate that complex things can be made understandable.
2. **Proof over claims.** Lead with shipped outcomes before adjectives. Every visual communicates something; nothing is there because it looks good.
3. **Senior calm, with a POV.** Confidence reads through editing and restraint, not volume or effects — but restraint must still take a position. Quiet is not the same as bland.
4. **Human in the loop.** Keep a personal, warm voice throughout. The visitor is meeting a person, not a brand deck.
5. **Distinctive by default.** Awwwards-level comes from composition, typography, interaction, and storytelling, not effects. If the page could belong to any product designer, rework it until it couldn't.
6. **Respect the fast scanner.** The first fold must convey seniority and range in seconds, with depth one click away.

## Accessibility & Inclusion

Target **WCAG AA**: body text ≥4.5:1 (enforced for every token pair by `npm run check:contrast`), large text ≥3:1, visible keyboard focus states, and a `prefers-reduced-motion` alternative for every animation (Framer Motion's `reducedMotion="user"` plus CSS fallbacks). The site defaults to the light editorial theme with a dark-mode toggle — contrast and legibility must hold in both, including inside emphasis bands. Glass falls back to solid surfaces under `prefers-reduced-transparency`.
```

- [ ] **Step 3: Update the README summary**

In `README.md`, replace line 3:

```markdown
Product-design portfolio built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind v4. Dark-default with full light-mode support; one emerald accent; motion honours `prefers-reduced-motion` throughout.
```

with:

```markdown
Product-design portfolio built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind v4. A warm-paper editorial design by default with a dark-mode toggle; one emerald accent; motion honours `prefers-reduced-motion` throughout. Token checks: `npm run test:scripts` and `npm run check:contrast`.
```

- [ ] **Step 4: Check the docs agree with the code**

Run:

```bash
grep -n "6A6458\|F1EDE4\|047857" DESIGN.md | head -5
grep -n "#6a6458\|#f1ede4\|#047857" app/globals.css | head -5
grep -n "Agent Pay\|7 years\|Dark-default" PRODUCT.md DESIGN.md README.md
```

Expected: the first two print matching values; the third prints nothing. (Agent Pay is intentionally hidden from the portfolio, so the docs no longer cite it as proof.)

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md PRODUCT.md README.md
git commit -m "Docs: DESIGN.md and PRODUCT.md describe the editorial system

The redesign brief replaces both as the source of truth: paper canvas,
inversion rule, layer language, quiet notation, motion tokens, and the
ten-section IA. Agent Pay is no longer cited (it is hidden from the site).

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Full verification and push

**Files:** none modified (fixes found here go in a new commit against the task that owns the file).

- [ ] **Step 1: Run every automated check**

Run:

```bash
npm run test:scripts && npm run check:contrast && npx tsc --noEmit -p . && npm run lint && NEXT_DIST_DIR=.next-preview npm run build
```

Expected: all tests PASS; `All 22 pairs meet AA (4.5:1).`; tsc and lint silent; the build ends with the route table and no errors.

- [ ] **Step 2: Browser matrix**

With the dev server running, visit `/showcase`, `/`, and `/work/white-label-rfp` at 375, 768, 1280, and 1440px wide (`resize_window` presets plus custom sizes), in light and dark. The browser tools can't emulate `prefers-reduced-motion`: if you can switch on the OS "Reduce motion" setting, repeat the matrix with it on; otherwise say in your report that the CSS reduced-motion path was not browser-verified (the JS scroll path was, in Task 7). On each page and width run:

```js
[document.documentElement.scrollWidth <= window.innerWidth, getComputedStyle(document.body).backgroundColor]
```

Expected: `true` everywhere, and the background is `rgb(241, 237, 228)` in light. Check `read_console_messages` with `onlyErrors: true`: no errors. Hard-coded dark components looking wrong on paper is expected and is not a failure here. Write down which ones you see; they belong to sub-projects 2–6.

- [ ] **Step 3: Capture proof**

Screenshot `/showcase` (Foundations tab) in light and dark at 1280px, `/` in light at 1280px and 375px, and `/work/white-label-rfp` in light at 1280px. Reset the viewport with preset `desktop`.

- [ ] **Step 4: Push the branch**

```bash
git push
git status -sb | head -1
```

Expected: `## redesign/editorial...origin/redesign/editorial` with nothing ahead. Do not open a PR or merge: the branch merges to `main` only after sub-projects 2–4.
