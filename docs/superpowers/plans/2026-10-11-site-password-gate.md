# Site Password Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the whole portfolio behind one shared password, with an on-brand unlock page and a signed 30-day cookie.

**Architecture:** A Next.js 16 `proxy.ts` checks every non-allowlisted request for a `site_access` cookie whose value is an HMAC of a fixed string keyed by `SITE_PASSWORD`; requests without it get a 307 to `/unlock?next=...`. The unlock page posts to a server action that verifies the password and sets the cookie. Pure logic lives in `lib/gate.ts` so it can be unit tested.

**Tech Stack:** Next.js 16.1.6 (App Router, `proxy.ts`), React 19, TypeScript, Web Crypto, `@playwright/test` 1.61.1 (already installed, used for both unit and end-to-end tests).

**Spec:** `docs/superpowers/specs/2026-10-11-site-password-gate-design.md`

## Global Constraints

- Proxy file is `proxy.ts` at the repo root and exports a function named `proxy` (Next 16 rejects anything else).
- Cookie name `site_access`; value is lowercase hex HMAC-SHA256 of `site-access-v1` keyed by `SITE_PASSWORD`; `Max-Age=2592000`; `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` when `NODE_ENV === "production"`.
- Public allowlist, nothing else: `/unlock`, `/_next/*`, `/favicon.ico`, `/opengraph-image*`, `/robots.txt`.
- `SITE_PASSWORD` unset: gate off under `next dev`; everywhere else the gate is on and every password is rejected.
- Wrong password waits 400ms before responding.
- `next` is honoured only if it starts with `/` and not `//` or `/\`; otherwise `/`.
- Copy, verbatim: "This portfolio is shared privately. Use the password from my email or resume, or ask me for access." / "That password didn't work." / "Unlock" / "Ask for access".
- British spelling, no em dashes, no text below 11px (`npm run check:type`), no `transition-all`, no new focus-ring styling.
- No new npm dependencies.

## Review Focus

- A social-preview bot (LinkedIn, Slack) requesting `/` is redirected to `/unlock`; it should still find the site's `og:title` and `og:image` there. Test added in Task 3.
- A visitor who is already unlocked opens `/unlock` (old bookmark): they should be sent on to `next` (or `/`), not shown the form. Test added in Task 3.
- A locked visitor opens a URL with a query string (`/articles?topic=ai`): after unlocking they should land on the same URL, query included. Test added in Task 2.
- `/unlock/` and `/robots.txt/` with a trailing slash must be treated as public, not redirect-looped. Unit test added in Task 1.
- The unlock page must not reference anything under `/public` (images, `/resume.pdf`), because those are gated and would 307 to itself. Test added in Task 3 (no failed requests while rendering `/unlock`).

---

### Task 1: Test harness and gate core library

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/constants.ts`
- Create: `e2e/gate.unit.spec.ts`
- Create: `lib/gate.ts`
- Create: `.env.example`
- Modify: `.gitignore` (add `!.env.example`, `/test-results/`, `/playwright-report/`)
- Modify: `package.json` (add script `"test:e2e": "playwright test"`)

**Interfaces:**
- Produces, from `lib/gate.ts`:
  - `export const GATE_COOKIE = "site_access"`
  - `export const GATE_MAX_AGE = 2592000`
  - `export type GateMode = "off" | "on" | "closed"`
  - `export function gateMode(env: { password?: string; nodeEnv?: string }): GateMode`
  - `export async function accessToken(password: string): Promise<string>`
  - `export function safeEqual(a: string, b: string): boolean`
  - `export async function hasAccess(cookie: string | undefined, env: { password?: string; nodeEnv?: string }): Promise<boolean>` (true when mode is `off`, false when `closed`)
  - `export function safeNext(next: string | null | undefined): string`
  - `export function isPublicPath(pathname: string): boolean`
- Produces, from `e2e/constants.ts`: `export const E2E_PASSWORD = "e2e-local-only-password"` and `export const E2E_PORT = 3100`

- [ ] **Step 1: Configure Playwright**

`playwright.config.ts`: `testDir: "e2e"`, `use.baseURL: http://localhost:${E2E_PORT}`, one `chromium` project, and
`webServer: { command: "npm run build && npm run start -- -p 3100", port: 3100, reuseExistingServer: !process.env.CI, timeout: 300_000, env: { SITE_PASSWORD: E2E_PASSWORD } }`.
Unit specs (`*.unit.spec.ts`) need no page; Playwright still starts the server once per run, which is acceptable.

- [ ] **Step 2: Write the failing unit tests in `e2e/gate.unit.spec.ts`**

```ts
test("gateMode", () => {
  expect(gateMode({ password: "x", nodeEnv: "production" })).toBe("on")
  expect(gateMode({ password: "x", nodeEnv: "development" })).toBe("on")
  expect(gateMode({ nodeEnv: "development" })).toBe("off")
  expect(gateMode({ nodeEnv: "production" })).toBe("closed")
  expect(gateMode({ password: "", nodeEnv: "production" })).toBe("closed")
})
test("accessToken is a stable 64-char hex HMAC that changes with the password", async () => {
  const a = await accessToken("alpha")
  expect(a).toMatch(/^[0-9a-f]{64}$/)
  expect(await accessToken("alpha")).toBe(a)
  expect(await accessToken("beta")).not.toBe(a)
})
test("safeEqual", () => {
  expect(safeEqual("abc", "abc")).toBe(true)
  expect(safeEqual("abc", "abd")).toBe(false)
  expect(safeEqual("abc", "abcd")).toBe(false)
  expect(safeEqual("pässwörd", "pässwörd")).toBe(true)
})
test("hasAccess", async () => {
  const env = { password: "alpha", nodeEnv: "production" }
  expect(await hasAccess(await accessToken("alpha"), env)).toBe(true)
  expect(await hasAccess(await accessToken("beta"), env)).toBe(false)
  expect(await hasAccess(undefined, env)).toBe(false)
  expect(await hasAccess("anything", { nodeEnv: "production" })).toBe(false)
  expect(await hasAccess(undefined, { nodeEnv: "development" })).toBe(true)
})
test("safeNext", () => {
  expect(safeNext("/work/agent-commerce")).toBe("/work/agent-commerce")
  expect(safeNext("/articles?topic=ai")).toBe("/articles?topic=ai")
  expect(safeNext("//evil.example")).toBe("/")
  expect(safeNext("/\\evil.example")).toBe("/")
  expect(safeNext("https://evil.example")).toBe("/")
  expect(safeNext("")).toBe("/")
  expect(safeNext(null)).toBe("/")
})
test("isPublicPath", () => {
  for (const p of ["/unlock", "/unlock/", "/_next/static/chunks/a.js", "/favicon.ico", "/opengraph-image", "/opengraph-image-1a2b", "/robots.txt", "/robots.txt/"])
    expect(isPublicPath(p), p).toBe(true)
  for (const p of ["/", "/work/white-label-rfp", "/resume.pdf", "/unlockx", "/assets/images/pic.webp", "/sitemap.xml"])
    expect(isPublicPath(p), p).toBe(false)
})
```

- [ ] **Step 3: Run to verify they fail**

Run: `npx playwright test e2e/gate.unit.spec.ts`
Expected: FAIL, cannot resolve `@/lib/gate`.

- [ ] **Step 4: Implement `lib/gate.ts`**

Use `crypto.subtle` (`importKey` raw HMAC SHA-256, `sign` over `TextEncoder` bytes) so the same file runs in the proxy and in Node. `safeEqual` XORs every char code of the longer length and folds in the length difference, so it never returns early. `isPublicPath` strips one trailing slash before matching. No `node:` imports.

- [ ] **Step 5: Run to verify they pass**

Run: `npx playwright test e2e/gate.unit.spec.ts`
Expected: 6 passed.

- [ ] **Step 6: Add `.env.example`, `.gitignore` entries and the npm script**

`.env.example`:
```
# Shared portfolio password. Local development only; set a different value
# in Vercel (Production and Preview). Leave unset to disable the gate in `next dev`.
SITE_PASSWORD=local-dev-only
```

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts e2e lib/gate.ts .env.example .gitignore package.json
git commit -m "Add gate core library and Playwright harness"
```

---

### Task 2: Proxy and robots

**Files:**
- Create: `proxy.ts`
- Modify: `app/robots.ts`
- Test: `e2e/gate.proxy.spec.ts`

**Interfaces:**
- Consumes: `GATE_COOKIE`, `hasAccess`, `isPublicPath` from `lib/gate.ts`; `E2E_PASSWORD` from `e2e/constants.ts`.
- Produces: `export async function proxy(request: NextRequest): Promise<NextResponse>` and `export const config = { matcher: "/:path*" }`.

- [ ] **Step 1: Write the failing tests in `e2e/gate.proxy.spec.ts`**

Use `request` (API context, `maxRedirects: 0`). Next writes `Location` as an absolute URL, so compare path and query only:
```ts
const target = (res: APIResponse) => { const u = new URL(res.headers()["location"]); return u.pathname + u.search }
for (const path of ["/", "/work/white-label-rfp", "/resume.pdf"]) {
  test(`locked ${path} redirects to unlock`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status()).toBe(307)
    expect(target(res)).toBe(`/unlock?next=${encodeURIComponent(path)}`)
  })
}
test("query string survives in next", async ({ request }) => {
  const res = await request.get("/articles?topic=ai", { maxRedirects: 0 })
  expect(target(res)).toBe(`/unlock?next=${encodeURIComponent("/articles?topic=ai")}`)
})
for (const path of ["/favicon.ico", "/opengraph-image", "/robots.txt"]) {
  test(`public ${path} loads without a cookie`, async ({ request }) => {
    expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(200)
  })
}
test("robots disallows everything and lists no sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text()
  expect(body).toContain("Disallow: /")
  expect(body).not.toContain("Sitemap")
})
test("a valid cookie passes through", async ({ request }) => {
  const token = await accessToken(E2E_PASSWORD)
  const res = await request.get("/", { maxRedirects: 0, headers: { cookie: `site_access=${token}` } })
  expect(res.status()).toBe(200)
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test e2e/gate.proxy.spec.ts`
Expected: FAIL, locked paths return 200.

- [ ] **Step 3: Implement `proxy.ts`**

Pass through when `isPublicPath(pathname)` or `hasAccess(cookie, { password: process.env.SITE_PASSWORD, nodeEnv: process.env.NODE_ENV })`. Otherwise `NextResponse.redirect(new URL("/unlock?next=" + encodeURIComponent(pathname + search), request.url), 307)`.

- [ ] **Step 4: Change `app/robots.ts`**

`rules: { userAgent: "*", disallow: "/" }`, no `sitemap` key. Leave `app/sitemap.ts` in place for when the gate is lifted.

- [ ] **Step 5: Run to verify they pass**

Run: `npx playwright test e2e/gate.proxy.spec.ts`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add proxy.ts app/robots.ts e2e/gate.proxy.spec.ts
git commit -m "Gate every page behind the site_access cookie"
```

---

### Task 3: Unlock page, server action and chrome hiding

**Files:**
- Create: `app/unlock/page.tsx`
- Create: `app/unlock/actions.ts`
- Create: `app/unlock/unlock-form.tsx`
- Create: `components/layout/site-chrome.tsx`
- Modify: `app/layout.tsx` (wrap `FancyCursor`, `SiteBackground`, `Navbar`, `ThemeFab` and the `FooterGate` block in `<SiteChrome>`)
- Test: `e2e/gate.unlock.spec.ts`

**Interfaces:**
- Consumes: `GATE_COOKIE`, `GATE_MAX_AGE`, `accessToken`, `gateMode`, `hasAccess`, `safeEqual`, `safeNext` from `lib/gate.ts`; `EMAIL_HREF` from `lib/contact.ts`.
- Produces:
  - `export type UnlockState = { error: boolean }`
  - `export async function unlock(prev: UnlockState, form: FormData): Promise<UnlockState>` in `app/unlock/actions.ts` (`"use server"`; reads `password` and `next` fields; on success sets the cookie with `cookies()` and calls `redirect(safeNext(next))`)
  - `export function SiteChrome({ children }: { children: ReactNode }): ReactNode` (client; returns `null` when `usePathname() === "/unlock"`)

- [ ] **Step 1: Write the failing tests in `e2e/gate.unlock.spec.ts`**

```ts
test("wrong password shows the error and sets no cookie", async ({ page, context }) => {
  await page.goto("/unlock?next=%2Fwork%2Fwhite-label-rfp")
  await page.getByLabel("Password").fill("not-it")
  await page.getByRole("button", { name: "Unlock" }).click()
  await expect(page.getByText("That password didn't work.")).toBeVisible()
  expect((await context.cookies()).find(c => c.name === "site_access")).toBeUndefined()
})
test("right password lands on next, and a second visit needs nothing", async ({ page }) => {
  await page.goto("/work/white-label-rfp")
  await expect(page).toHaveURL(/\/unlock\?next=/)
  await page.getByLabel("Password").fill(E2E_PASSWORD)
  await page.getByRole("button", { name: "Unlock" }).click()
  await expect(page).toHaveURL("/work/white-label-rfp")
  await page.goto("/")
  await expect(page).toHaveURL("/")
})
test("an open-redirect next falls back to home", async ({ page }) => {
  await page.goto("/unlock?next=%2F%2Fevil.example")
  await page.getByLabel("Password").fill(E2E_PASSWORD)
  await page.getByRole("button", { name: "Unlock" }).click()
  await expect(page).toHaveURL("/")
})
test("an unlocked visitor opening /unlock is sent on", async ({ page }) => {
  await page.context().addCookies([{ name: "site_access", value: await accessToken(E2E_PASSWORD), url: "http://localhost:3100" }])
  await page.goto("/unlock?next=%2Farticles")
  await expect(page).toHaveURL("/articles")
})
test("unlock page carries the site's social preview tags", async ({ request }) => {
  const html = await (await request.get("/unlock")).text()
  expect(html).toContain('property="og:title"')
  expect(html).toContain('property="og:image"')
  expect(html).toContain('name="robots" content="noindex')
})
test("unlock page renders with no failed requests and no site chrome", async ({ page }) => {
  const failed: string[] = []
  page.on("response", r => { if (r.status() >= 300 && r.status() !== 304) failed.push(`${r.status()} ${r.url()}`) })
  await page.goto("/unlock")
  await expect(page.getByText("This portfolio is shared privately.", { exact: false })).toBeVisible()
  await expect(page.getByRole("link", { name: "Ask for access" })).toHaveAttribute("href", /^mailto:/)
  await expect(page.getByRole("navigation")).toHaveCount(0)
  expect(failed).toEqual([])
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test e2e/gate.unlock.spec.ts`
Expected: FAIL, `/unlock` is a 404.

- [ ] **Step 3: Implement the action, form, page and `SiteChrome`**

- `actions.ts`: when `gateMode(...)` is `closed` or the comparison fails, `await` a 400ms delay and return `{ error: true }`. Compare with `safeEqual(submitted, process.env.SITE_PASSWORD ?? "")`. Never trim the submitted value.
- `unlock-form.tsx`: client component using `useActionState(unlock, { error: false })`; hidden `next` input; `<label htmlFor="password">Password</label>`; `type="password"`, `autoComplete="current-password"`, `autoFocus`; error paragraph in an `aria-live="polite"` region. Primary button styled per DESIGN.md (emerald pill, `active:translate-y-px`).
- `page.tsx`: server component; reads `searchParams.next`; if `hasAccess(cookie, env)` then `redirect(safeNext(next))`; `export const metadata = { title: "Private portfolio", robots: { index: false, follow: false } }` (root `openGraph` still applies). Centred column, max width about 26rem, name in the display face, title in muted body text, the fixed copy line, the form, then the "Ask for access" link to `EMAIL_HREF`. No images and no links into `/public`.
- `site-chrome.tsx`: mirror `components/layout/footer/footer-gate.tsx`.

- [ ] **Step 4: Run the full suite**

Run: `npx playwright test`
Expected: all unit, proxy and unlock tests pass.

- [ ] **Step 5: Project checks**

Run: `npm run lint && npx tsc --noEmit && npm run check:type && npm run build`
Expected: no errors; the build lists `ƒ Proxy (Middleware)` and `/unlock`. Revert `tsconfig.json` if the build rewrote it.

- [ ] **Step 6: Visual check**

Screenshot `/unlock` at 1440 and 390, dark and light, and confirm the type and tokens match DESIGN.md.

- [ ] **Step 7: Commit**

```bash
git add app/unlock components/layout/site-chrome.tsx app/layout.tsx e2e/gate.unlock.spec.ts
git commit -m "Add the unlock page and hide site chrome on it"
```

---

## Owner action before merge

Set `SITE_PASSWORD` in Vercel for Production and Preview. Without it the
deployed site rejects every password, by design.
