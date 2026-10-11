# Latest Work Showcase (iPhone Duo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Latest work" section under the hero where a folded iPhone Duo plays the Agent Pay demo and, on activation, unfolds, dollies into its inner screen and opens `/work/agent-commerce`.

**Architecture:** A server section renders the caption and a CSS placeholder; a client stage lazy-loads a framework-free Three.js engine (ported from chuspeeism/iphone-duo) once the section nears the viewport, and owns activation, fallbacks and navigation. Apple's model is fetched at build time into a gitignored folder; only `lib/duo/apple-model.ts` and the prepare script know about it.

**Tech Stack:** Next.js 16.1.6, React 19, TypeScript, `three@0.186.0` (new, exact pin), Python 3.12 + `usd-core==26.8` (build-time only), ffmpeg (local, media prep), `@playwright/test` 1.61.1.

**Spec:** `docs/superpowers/specs/2026-10-11-latest-work-duo-design.md`

## Global Constraints

- Starts after the site password gate is merged: rebase this branch onto `main` first; every end-to-end test runs unlocked through the `unlocked` fixture (Task 1).
- `three` pinned to exactly `0.186.0`, imported only from `lib/duo/*`, reached only through `import()` in `duo-stage.tsx`.
- Apple files live in `public/duo/apple/` and are gitignored. Nothing rendered from Apple's model is committed.
- Timings: arrival 0.9s with `cubic-bezier(0.22, 1, 0.36, 1)` and a 24px rise; unfold 1.4s smoothstep from 0° to 180°; dolly 0.6s; fallback navigation 2.5s after activation.
- Caption copy, verbatim: label "Latest work · Mastercard", title "Agent Pay", line "The CPO and several SVPs now demo Agent Pay from their phones at Money20/20, Mastercard Connections, and Innovate at McLaren HQ, with no designer in the room.", prompt "Open the case study". Button accessible name "Open the Agent Pay case study".
- Device pixel ratio cap 2, or 1.5 on `(pointer: coarse)`. Keep the placeholder when `navigator.connection?.saveData` or `navigator.deviceMemory < 4`.
- No orbit, drag, slider, upload, idle loop or `alert()`.
- British spelling, no em dashes, 11px text floor, no `transition-all`, no new focus-ring styling, DESIGN.md tokens.

## Review Focus

- A visitor switches theme while the stage is on screen: the phone must still sit cleanly on the section background, with no dark or light box behind it. Test added in Task 4.
- A visitor double-clicks the phone: exactly one animation and one navigation. Test added in Task 4.
- A visitor presses Back from the case study: the home page shows the phone folded, visible and clickable again, not faded or stuck open. Test added in Task 4.
- The cover video fails to load (blocked, offline, Save-Data): the poster frame shows; nothing looks broken. Test added in Task 4.
- The window is resized from desktop to phone width with the stage live: the canvas follows its container without stretching. Test added in Task 3.

---

### Task 1: Dependency, Apple asset pipeline and test fixture

**Files:**
- Create: `scripts/prepare-duo-assets.py` (adapted from the repo's `scripts/prepare-assets.py`; keep its MIT notice in the header)
- Create: `requirements-duo.txt` (`usd-core==26.8`)
- Create: `vercel.json`
- Create: `THIRD_PARTY_NOTICES.md`
- Create: `e2e/fixtures.ts`
- Create: `e2e/duo.assets.spec.ts`
- Modify: `.gitignore` (add `/public/duo/apple/`)
- Modify: `package.json` (`"three": "0.186.0"`, `"@types/three"` matching, script `"duo:assets": "uv run --no-project --python 3.12 --with-requirements requirements-duo.txt python scripts/prepare-duo-assets.py"`)

**Interfaces:**
- Produces: model at `/duo/apple/iPhone_Duo_Render.usdc` with textures under `/duo/apple/textures/`; `export const test = base.extend<{}>(...)` in `e2e/fixtures.ts` that adds a valid `site_access` cookie (via `accessToken(E2E_PASSWORD)` from `lib/gate.ts`) before each test, plus re-exported `expect`.

- [ ] **Step 1: Rebase and install**

Run: `git fetch origin && git rebase origin/main && npm install three@0.186.0 @types/three@0.186.0 --save-exact`
Expected: rebase clean; `package.json` shows exact versions.

- [ ] **Step 2: Write the failing asset test in `e2e/duo.assets.spec.ts`**

```ts
import { test, expect } from "./fixtures"
test("Apple model is served to unlocked visitors", async ({ request }) => {
  const res = await request.get("/duo/apple/iPhone_Duo_Render.usdc")
  expect(res.status()).toBe(200)
  expect(Number(res.headers()["content-length"])).toBeGreaterThan(1_000_000)
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx playwright test e2e/duo.assets.spec.ts`
Expected: FAIL, 404.

- [ ] **Step 4: Write `scripts/prepare-duo-assets.py`**

Same steps as the original (download the Star White USDZ, extract textures, select the `Landscape` pose, flatten, rewrite texture paths to `textures/<file>`, export `iPhone_Duo_Render.usdc`), with three changes: output to `public/duo/apple/`; skip the wallpaper and launcher UI downloads; wrap everything in `try/except` that prints one warning and exits 0, so a failed download never fails the build.

- [ ] **Step 5: Add `vercel.json` and notices**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run duo:assets; npm run build"
}
```
`THIRD_PARTY_NOTICES.md`: the iphone-duo engine (MIT, chuspeeism), Three.js (MIT), and a line that Apple's model is downloaded at build time, is not in this repository, and remains Apple's.

- [ ] **Step 6: Prepare assets locally and run the test**

Run: `brew install uv` (once, if missing), then `npm run duo:assets && npx playwright test e2e/duo.assets.spec.ts`
Expected: script prints the ready line; test passes; `git status` shows nothing under `public/duo/apple/`.

- [ ] **Step 7: Commit**

```bash
git add scripts/prepare-duo-assets.py requirements-duo.txt vercel.json THIRD_PARTY_NOTICES.md e2e/fixtures.ts e2e/duo.assets.spec.ts .gitignore package.json package-lock.json
git commit -m "Add three, the Apple asset build step and an unlocked test fixture"
```

---

### Task 2: Screen media (owner approval gate)

**Files:**
- Create: `scripts/capture-agent-pay.mjs`
- Create: `public/duo/media/agent-pay-cover.mp4`, `agent-pay-cover.webm`, `agent-pay-cover-poster.jpg`, `agent-pay-inner.webp`

**Interfaces:**
- Produces: the four media files at `/duo/media/...`. Cover: portrait about 0.69:1, 8–12s, muted-safe (no audio track). Inner: exactly 1600 × 1125.

- [ ] **Step 1: Write `scripts/capture-agent-pay.mjs`**

Playwright Chromium against `https://agent-pay-demo.vercel.app/` at 390 × 566 CSS px (0.69:1), `deviceScaleFactor: 2`, `recordVideo` on. Cover: wait for "Good Afternoon", click "Buy a bicycle", let the flow run, stop at 12s. Inner: in a fresh page, capture the key screen of the "Book a flight" flow and of the "Buy a bicycle" flow, and composite them side by side on a 1600 × 1125 canvas using the site's dark canvas colour `oklch(0.14 0 0)` with even margins (use Playwright to render a small HTML composition page and screenshot it).

- [ ] **Step 2: Encode**

Run:
```bash
ffmpeg -y -i cover-raw.webm -an -c:v libx264 -pix_fmt yuv420p -crf 23 -movflags +faststart public/duo/media/agent-pay-cover.mp4
ffmpeg -y -i cover-raw.webm -an -c:v libvpx-vp9 -crf 34 -b:v 0 public/duo/media/agent-pay-cover.webm
ffmpeg -y -ss 0.5 -i public/duo/media/agent-pay-cover.mp4 -frames:v 1 -q:v 3 public/duo/media/agent-pay-cover-poster.jpg
```
Expected: MP4 under 1.5 MB, WebM under 1.2 MB.

- [ ] **Step 3: Owner approval**

Send the owner the cover video and inner still. Ask them to confirm which demo task is Assisted and which is Autonomous, and approve both files. Do not continue to Task 4 without approval; Task 3 can proceed in parallel.

- [ ] **Step 4: Commit**

```bash
git add scripts/capture-agent-pay.mjs public/duo/media
git commit -m "Add Agent Pay screen media for the showcase"
```

---

### Task 3: Engine port

**Files:**
- Create: `lib/duo/shaders.ts` (the `screenShader` and `foldShader` strings, verbatim from `main.js`)
- Create: `lib/duo/apple-model.ts`
- Create: `lib/duo/duo-engine.ts`
- Create: `app/showcase/duo/page.tsx` (internal harness under the existing noindex `/showcase`)
- Test: `e2e/duo.engine.spec.ts`

**Interfaces:**
- Consumes: model URL from Task 1; media from Task 2 (the harness may use any local image or video until Task 2 lands).
- Produces:
  - `lib/duo/apple-model.ts`: `export async function loadAppleModel(url: string, screens: { inner: THREE.MeshBasicMaterial; outer: THREE.MeshBasicMaterial }, bend: { value: number }): Promise<THREE.Group>`. Owns the USD load, the `* 100` scale, the `-5.8974` y-translate, the mesh-name tables (`upTUAKvMVkPOMKq`, `SiftyleUEEZwLhF`, flexible names, `UXtsBZYlaUvHoEh` inner, `hhgAIoCGsHXeDPY` outer), screen UVs and the `onBeforeCompile` shader injection.
  - `lib/duo/duo-engine.ts`: `export type DuoEngine` and `export function createDuoEngine(canvas: HTMLCanvasElement, opts: { modelUrl: string }): DuoEngine`, exactly as in spec section 6.1. Starts folded (angle 0°).
  - The harness page exposes `window.__duo` (typed `DuoEngine`) for tests only.

- [ ] **Step 1: Write the failing tests in `e2e/duo.engine.spec.ts`**

```ts
import { test, expect } from "./fixtures"
test.use({ launchOptions: { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } })
test("engine loads, renders and unfolds", async ({ page }) => {
  await page.goto("/showcase/duo")
  await page.waitForFunction(() => (window as any).__duo)
  await page.evaluate(() => (window as any).__duo.ready)
  const folded = await page.locator("canvas").screenshot()
  const t0 = Date.now()
  await page.evaluate(() => (window as any).__duo.unfold())
  expect(Date.now() - t0).toBeGreaterThan(1200)
  expect(Date.now() - t0).toBeLessThan(2500)
  expect(Buffer.compare(folded, await page.locator("canvas").screenshot())).not.toBe(0)
})
test("canvas follows its container on resize", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/showcase/duo")
  await page.evaluate(() => (window as any).__duo.ready)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(300)
  const [c, box] = await Promise.all([page.locator("canvas").boundingBox(), page.locator("[data-duo-frame]").boundingBox()])
  expect(Math.round(c!.width)).toBe(Math.round(box!.width))
  expect(Math.round(c!.height)).toBe(Math.round(box!.height))
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test e2e/duo.engine.spec.ts`
Expected: FAIL, `/showcase/duo` is a 404.

- [ ] **Step 3: Port the engine**

Port from `main.js` per spec 6.2: keep renderer, tone mapping (`ACESFilmicToneMapping`, exposure 1.18), `RoomEnvironment` at 0.04, environment intensity 1.35, hemisphere/key/rim lights, camera FOV fit from `resize()`, fold and screen shaders, the smoothstep transition. Clear colour fully transparent. Render loop runs only while a transition is active, while `setCoverMedia`'s video is playing and on screen, or for one frame after a resize. For video, use `THREE.VideoTexture` with `generateMipmaps = true` and `minFilter = LinearMipmapLinearFilter` (the screen shader samples with `textureLod`); if mip generation per frame costs more than 4ms on the harness, switch to drawing frames into a mipmapped `CanvasTexture` every second frame. `dollyIn` moves the camera along its view axis until the inner screen fills the canvas. `dispose()` releases renderer, geometries, materials and textures.

- [ ] **Step 4: Build the harness page**

`app/showcase/duo/page.tsx`: client page, a `data-duo-frame` box (aspect 4:3, max width 900px) holding the canvas, mounts the engine with `/duo/apple/iPhone_Duo_Render.usdc`, sets `window.__duo`.

- [ ] **Step 5: Run to verify they pass**

Run: `npx playwright test e2e/duo.engine.spec.ts`
Expected: 2 passed.

- [ ] **Step 6: Commit**

```bash
git add lib/duo app/showcase/duo e2e/duo.engine.spec.ts
git commit -m "Port the iPhone Duo fold engine as a framework-free module"
```

---

### Task 4: Stage, section and arrival veil

**Files:**
- Create: `components/sections/latest/latest-work.tsx`
- Create: `components/sections/latest/duo-stage.tsx`
- Create: `components/sections/latest/duo-placeholder.tsx`
- Create: `components/case-study/arrival-veil.tsx`
- Modify: `app/page.tsx` (insert `<LatestWork />` between `<Hero />` and the Work section)
- Modify: `app/work/agent-commerce/page.tsx` (render `<ArrivalVeil image="/duo/media/agent-pay-inner.webp" />` first in `Page`)
- Modify: `components/layout/navigation/navbar.tsx` (add `"latest"` after `"hero"` in `SECTION_IDS`)
- Test: `e2e/duo.stage.spec.ts`

**Interfaces:**
- Consumes: `createDuoEngine`, `DuoEngine` (Task 3); media paths (Task 2).
- Produces:
  - `export function DuoStage(props: { href: string; label: string; coverVideo: { mp4: string; webm: string; poster: string }; innerImage: string; modelUrl: string }): JSX.Element`
  - `export function ArrivalVeil(props: { image: string }): JSX.Element | null`: if `sessionStorage["duo-arrival"] === "1"`, shows the image fixed full-viewport and fades it out over 400ms, then clears the key.
  - The stage sets `sessionStorage["duo-arrival"] = "1"` just before navigating after a completed dolly.

- [ ] **Step 1: Write the failing tests in `e2e/duo.stage.spec.ts`**

```ts
import { test, expect } from "./fixtures"
const GL = { launchOptions: { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } }
const stage = (page) => page.getByRole("button", { name: "Open the Agent Pay case study" })

test.describe("with WebGL", () => {
  test.use(GL)
  test("nothing 3D loads before scrolling; the model loads near the section", async ({ page }) => {
    const seen: string[] = []
    page.on("request", r => seen.push(r.url()))
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    expect(seen.some(u => u.includes("/duo/apple/"))).toBe(false)
    await page.locator("#latest").scrollIntoViewIfNeeded()
    await page.waitForRequest(r => r.url().includes("/duo/apple/iPhone_Duo_Render.usdc"))
  })
  test("activation unfolds, then opens the case study", async ({ page }) => {
    await page.goto("/"); await page.locator("#latest").scrollIntoViewIfNeeded()
    await page.waitForSelector("[data-duo-ready]")
    const t0 = Date.now()
    await stage(page).click()
    await expect(page).toHaveURL("/work/agent-commerce", { timeout: 4000 })
    expect(Date.now() - t0).toBeGreaterThan(1500)
  })
  test("double click navigates once", async ({ page }) => {
    await page.goto("/"); await page.locator("#latest").scrollIntoViewIfNeeded()
    await page.waitForSelector("[data-duo-ready]")
    const before = await page.evaluate(() => history.length)
    await stage(page).dblclick()
    await expect(page).toHaveURL("/work/agent-commerce", { timeout: 4000 })
    expect(await page.evaluate(() => history.length)).toBe(before + 1)
  })
  test("Back returns to a folded, clickable stage", async ({ page }) => {
    await page.goto("/"); await page.locator("#latest").scrollIntoViewIfNeeded()
    await page.waitForSelector("[data-duo-ready]")
    await stage(page).click()
    await expect(page).toHaveURL("/work/agent-commerce", { timeout: 4000 })
    await page.goBack()
    await expect(stage(page)).toBeVisible()
    await expect(page.locator("#latest")).toHaveCSS("opacity", "1")
    await expect(page.locator("[data-duo-state]")).toHaveAttribute("data-duo-state", "folded")
  })
  test("light theme: no box behind the phone", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" })
    await page.addInitScript(() => localStorage.setItem("theme", "light"))
    await page.goto("/"); await page.locator("#latest").scrollIntoViewIfNeeded()
    await page.waitForSelector("[data-duo-ready]")
    // A transparent canvas corner must look exactly like plain section background beside the frame.
    const frame = (await page.locator("[data-duo-frame]").boundingBox())!
    const inside = await page.screenshot({ clip: { x: frame.x + 2, y: frame.y + 2, width: 4, height: 4 } })
    const outside = await page.screenshot({ clip: { x: frame.x - 12, y: frame.y + 2, width: 4, height: 4 } })
    expect(Buffer.compare(inside, outside)).toBe(0)
  })
})

test("reduced motion: activation navigates at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/"); await page.locator("#latest").scrollIntoViewIfNeeded()
  const t0 = Date.now()
  await stage(page).click()
  await expect(page).toHaveURL("/work/agent-commerce")
  expect(Date.now() - t0).toBeLessThan(1000)
})

test.describe("without WebGL", () => {
  test.use({ launchOptions: { args: ["--disable-webgl", "--disable-3d-apis"] } })
  test("placeholder stays and Enter still opens the page", async ({ page }) => {
    await page.goto("/"); await page.locator("#latest").scrollIntoViewIfNeeded()
    await expect(page.locator("[data-duo-placeholder]")).toBeVisible()
    await stage(page).focus(); await page.keyboard.press("Enter")
    await expect(page).toHaveURL("/work/agent-commerce")
  })
})

test("cover video failure shows the poster", async ({ page }) => {
  await page.route(/agent-pay-cover\.(mp4|webm)$/, r => r.abort())
  await page.goto("/"); await page.locator("#latest").scrollIntoViewIfNeeded()
  await expect(page.locator("[data-duo-placeholder] img[src*='agent-pay-cover-poster']")).toBeVisible()
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test e2e/duo.stage.spec.ts`
Expected: FAIL, no `#latest`.

- [ ] **Step 3: Implement the section and placeholder**

`latest-work.tsx` (server): `<section id="latest">` using the shared `Section` look (default band, same container as other sections), two columns from `md` (caption left, stage right), stacked below. Caption copy from Global Constraints. `duo-placeholder.tsx`: the poster inside a plain CSS phone outline at the folded phone's on-screen size and aspect, `data-duo-placeholder`.

- [ ] **Step 4: Implement `duo-stage.tsx`**

- A `data-duo-frame` wrapper sized to the folded phone holds the canvas; a `<button>` overlay carries the accessible name; canvas and media are `aria-hidden`. Keep the frame at least 12px clear of other content on its left so the light-theme test can sample plain background.
- `IntersectionObserver` with `rootMargin: "100% 0px"` triggers `router.prefetch(href)` and, unless reduced motion, no WebGL (`canvas.getContext("webgl2")` probe), Save-Data or low memory, `import("@/lib/duo/duo-engine")`. When `ready` resolves, cross-fade placeholder to canvas over 300ms and set `data-duo-ready`.
- Arrival motion on first intersection per Global Constraints (skipped for reduced motion).
- `data-duo-state`: `folded` | `opening` | `leaving`. Activation is ignored unless `folded`.
- Activation: reduced motion or engine not ready, navigate now. Otherwise `unfold()`, then `dollyIn()` while the section fades to 0, set the session key, `router.push(href)`. A 2.5s timer navigates regardless.
- `pageshow` with `persisted` and the effect cleanup both reset to `folded`, opacity 1, angle 0.
- `setActive(false)` when out of view; `dispose()` on unmount.

- [ ] **Step 5: Implement `ArrivalVeil` and wire both pages**

Insert `<LatestWork />` into `app/page.tsx` after `<Hero />`; add `"latest"` to `SECTION_IDS`; render the veil at the top of the Agent Pay page.

- [ ] **Step 6: Run to verify they pass**

Run: `npx playwright test e2e/duo.stage.spec.ts`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add components/sections/latest components/case-study/arrival-veil.tsx app/page.tsx app/work/agent-commerce/page.tsx components/layout/navigation/navbar.tsx e2e/duo.stage.spec.ts
git commit -m "Add the Latest work stage with the fold-into-case-study transition"
```

---

### Task 5: Agent Pay visibility, hero note and final checks

**Files:**
- Modify: `app/work/agent-commerce/layout.tsx` (remove the `robots` key and its comment)
- Modify: `lib/data/work.ts` (add Agent Pay to `ITEMS`; put `"agent-commerce"` first in `SEQUENCE`)
- Modify: `components/sections/hero/hero.tsx` (remove the block `AddLater` about missing AI work)
- Test: `e2e/duo.visibility.spec.ts`

**Interfaces:**
- Consumes: `WorkItem` (`lib/types/content.ts`).

- [ ] **Step 1: Write the failing tests**

```ts
import { test, expect } from "./fixtures"
test("Agent Pay is in the work list", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("#work a[href='/work/agent-commerce']")).toHaveCount(1)
})
test("Agent Pay page has no noindex of its own", async ({ request }) => {
  const html = await (await request.get("/work/agent-commerce")).text()
  expect(html).not.toContain('content="noindex')
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test e2e/duo.visibility.spec.ts`
Expected: FAIL on both.

- [ ] **Step 3: Make the changes**

Work item: `category: "Agentic Commerce / Mastercard"`, `title: "Agent Pay: Mastercard's role in AI-led payments"`, `description` and `metric` taken from the case study's own lede and impact lines (no new claims), `image: "/assets/images/work/agent-commerce.jpg"`, `href: "/work/agent-commerce"`, `tags: ["Agentic Commerce", "Trust UX", "Prototype"]`, `featured: true`. If PR #8 has merged, follow its `WorkItem` shape (it adds `cover`).

- [ ] **Step 4: Full suite and project checks**

Run: `npx playwright test && npm run lint && npx tsc --noEmit && npm run check:type && npm run build`
Expected: all green. Revert `tsconfig.json` if the build rewrote it.

- [ ] **Step 5: Evidence for the owner**

Screenshots of placeholder, folded, mid-unfold, 390px and light mode; and the home page's bytes before first scroll on `main` versus this branch (must match within 2 KB).

- [ ] **Step 6: Commit**

```bash
git add app/work/agent-commerce/layout.tsx lib/data/work.ts components/sections/hero/hero.tsx e2e/duo.visibility.spec.ts
git commit -m "List Agent Pay and drop the hero's missing-AI note"
```
