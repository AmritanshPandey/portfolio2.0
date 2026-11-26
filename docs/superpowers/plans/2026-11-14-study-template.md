# Study Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every case study and exploration one navigation layer (index switcher, place tracker, next-study ending) through a shared `StudyLayout`, then move pages onto the full study template.

**Architecture:** Pure data in `lib/study-index.ts` (which studies exist, in what order, which comes next). Three client components in `components/study/` read it. `StudyLayout` mounts them from route-group layouts (`app/work/layout.tsx`, `app/explorations/layout.tsx`), so pages gain them without per-page code. The tracker reads chapters from the DOM (`[data-chapter]`), which `CsSection` emits from its existing `id` and `label` props.

**Tech Stack:** Next.js 16 App Router, React 19 (`ViewTransition`), TypeScript, Tailwind v4, Playwright, `node --test` with `--experimental-strip-types`.

**Spec:** `docs/superpowers/specs/2026-11-14-study-template-design.md`

## Global Constraints

- Ledger: ultramarine marks one thing at a time; no gradients, glows, pills, uppercase-tracked labels or emoji; mono labels use `ledger-label`; colours from tokens only (DESIGN.md, REDESIGN.md §2.4).
- No text under 11px at rendered size. No em dashes in visible copy.
- Do not add or change focus-ring styling (CLAUDE.md).
- No `next/dynamic` or Suspense under the root layout; use `lazyClient` if anything must load lazily (CLAUDE.md).
- Pointer and scroll work: no new scroll listeners; `IntersectionObserver` only (CLAUDE.md "Gotchas").
- No `transition-all`; every animation has a `prefers-reduced-motion` path.
- Plain `<Link>`s for every destination, so navigation works before hydration and by keyboard.
- No new dependency.
- Hover copy in the switcher is `WorkItem.description` only (public, D3-safe).
- Routes stay static (`○` in the build table).
- Baseline: 23 e2e tests already fail on `main` (stale hero, glass and footer specs). "Passing" below means no failure outside that list.

## Review Focus

1. **A page not in the index** (the three exploration stubs, `/work/[slug]`): the layout still renders the switcher with nothing current, and no ending; nothing throws. Test in Task 4.
2. **Navigating between studies while the phone sheet is open:** the layout persists across routes in the App Router, so the sheet must close and the tracker reset on pathname change. Test in Task 3.
3. **A section with no `label`, or no `id`:** it is not a chapter and the tracker ignores it. Test in Task 2.
4. **Escape and focus in the phone sheet:** Escape closes it and focus returns to the trigger. Test in Task 3.
5. **Reduced motion:** the strip shows without sliding and the tracker still updates. Test in Task 3.

---

## Step 1 of the rollout: the navigation layer (detailed)

### Task 1: The study index

**Files:**
- Create: `lib/study-index.ts`
- Test: `lib/study-index.test.mjs`

**Interfaces:**
- Consumes: `workItems` (`lib/data/work.ts`), `explorationItems` (`lib/data/explorations.ts`).
- Produces:
  - `type StudyKind = "work" | "exploration"`
  - `interface StudyEntry { href: string; slug: string; title: string; short: string; problem: string; kind: StudyKind; ref: string }`. `short` is the name before the colon in `title` ("PartnerBank: A demo system…" → "PartnerBank"). `problem` is `description`. `ref` is the two-digit position within its kind ("01"…).
  - `const studies: StudyEntry[]`: all work items in `SEQUENCE` order, then explorations.
  - `function studyAt(href: string): StudyEntry | undefined`
  - `function nextStudy(href: string): StudyEntry | undefined`: the next entry of the same kind, wrapping to the first; `undefined` for an href not in the index.

- [ ] **Step 1: Write the failing tests** in `lib/study-index.test.mjs`, importing `./study-index.ts`:
  - `studies lists the work in home order, then explorations`: the first five hrefs equal `workItems.map((w) => w.href)`, and every later entry has `kind === "exploration"`.
  - `short is the name before the colon`: the entry for `/work/white-label-rfp` has `short === "PartnerBank"`.
  - `refs count within their kind`: the first work entry's `ref === "01"`, and the first exploration's `ref === "01"`.
  - `nextStudy moves on and wraps`: the next after the first work href is the second; the next after the last work href is the first work href.
  - `nextStudy stays within its kind`: the next after the last exploration is an exploration.
  - `an unknown href has no entry and no next`: `studyAt("/work/nope")` and `nextStudy("/work/nope")` are both `undefined`.
- [ ] **Step 2: Run** `npm run test:unit`. Expected: the new tests FAIL (module not found).
- [ ] **Step 3: Implement** `lib/study-index.ts`. Data files import only types through `@/`, so `--experimental-strip-types` can load them; if a value import through `@/` blocks the test, import with a relative path instead.
- [ ] **Step 4: Run** `npm run test:unit`. Expected: all pass (14 existing + 6 new).
- [ ] **Step 5: Commit** `lib/study-index.ts lib/study-index.test.mjs`: "Study index: the studies in home order, and which comes next".

### Task 2: Chapters and the place tracker

**Files:**
- Modify: `components/case-study/cs-section.tsx` (emit chapter attributes)
- Create: `components/study/study-tracker.tsx`
- Test: `e2e/study-nav.spec.ts` (created here; Tasks 3 to 5 add to it)

**Interfaces:**
- Produces: `CsSection` renders `data-chapter` and `data-chapter-label={label}` on its `<section>` when both `id` and `label` are set. `<StudyTracker />` (no props) finds `main [data-chapter]` after mount.

- [ ] **Step 1: Write the failing e2e tests** in `e2e/study-nav.spec.ts`, on `/work/white-label-rfp` at 1440×900:
  - `the tracker names the chapter in view`: scroll `#problem` into view; the locator `[data-study-tracker] [aria-current="location"]` has the text of that section's label.
  - `no chapter is active above the first`: scroll to the bottom, then `window.scrollTo(0, 0)`; `[aria-current="location"]` has count 0 (REDESIGN F10).
  - `a section without a label is not a chapter`: the number of tracker links equals the number of `main section[data-chapter]`, and is less than the number of `main section` elements on that page.
  - At 390×844: `the phone tracker shows the current chapter`: after scrolling `#problem` into view, `[data-study-tracker-phone]` contains its label.
- [ ] **Step 2: Run** `E2E_PORT=3200 npx playwright test e2e/study-nav.spec.ts`. Expected: FAIL (no tracker).
- [ ] **Step 3: Implement.**
  - **`CsSection`:** add `data-chapter=""` and `data-chapter-label` when `id && label`.
  - **`StudyTracker`:** one `IntersectionObserver` with `rootMargin: "-30% 0px -60% 0px"` (as `CsChapterNav` uses). Active is the last chapter whose top has passed that line; it is `null` when the first chapter's top is still below it.
    - Desktop (`xl` and up): a fixed left rail of ticks, one link per chapter (`href="#id"`). Only the active one shows its label, as `NN · Label`, with `aria-current="location"`. Marked with `data-study-tracker`.
    - Below `xl`: a hairline under the floating nav (`top: var(--nav-h)`) whose fill is the active chapter's position over the chapter count (a `scaleX` transform). The active label sits in mono beside it, marked `data-study-tracker-phone`. Tapping it opens the same chapter list as a ruled sheet.
    - Re-scan chapters and reset the active chapter when `usePathname()` changes.
- [ ] **Step 4: Run** the spec again. Expected: PASS in Chromium and WebKit.
- [ ] **Step 5: Commit**: "Study tracker: the chapter you're in, on every width".

### Task 3: The index switcher

**Files:**
- Create: `components/study/study-index.tsx`
- Test: `e2e/study-nav.spec.ts` (add)

**Interfaces:**
- Consumes: `studies`, `studyAt` (Task 1).
- Produces: `<StudyIndex />` (no props; reads `usePathname()`). Root marked `data-study-index`; it listens for the hero `[data-cs-hero-inner]` and the ending `[data-study-next]` (Task 4) with one `IntersectionObserver`.

- [ ] **Step 1: Write the failing e2e tests** (add):
  - `the index lists studies in home order and marks this one`: on `/work/agent-commerce` after scrolling past the hero, `[data-study-index] a` hrefs start with the five work hrefs in `SEQUENCE` order; the Agent Pay link has `aria-current="page"`; an "All work" link points to `/#work`.
  - `explorations are labelled self-directed`: the index contains the text "Self-directed" before the PlanR link.
  - `it waits for the hero and steps aside for the ending`: at the top, `[data-study-index]` has `data-shown="false"`; after the hero scrolls out, `"true"`; with `[data-study-next]` in view, `"false"`.
  - Phone (390×844): `the phone index opens a sheet and closes on Escape`: the trigger reads `02 / 05 · Agent Pay`; clicking opens a dialog listing all studies; Escape closes it, and focus is back on the trigger.
  - Phone: `moving to another study closes the sheet`: open the sheet, click the PartnerBank link, wait for `/work/white-label-rfp`; the dialog is gone and the trigger reads `01 / 05 · PartnerBank`.
  - `with reduced motion the index still shows`: with `page.emulateMedia({ reducedMotion: "reduce" })`, after scrolling past the hero, `data-shown="true"` and the strip's computed `transition-duration` is `0s`.
- [ ] **Step 2: Run** the spec. Expected: the new tests FAIL.
- [ ] **Step 3: Implement** `StudyIndex`.
  - Desktop: fixed to the bottom, `ledger-label` links separated by `·`. The current one is ink with a 7px `bg-accent` square; the rest graphite. A hairline, then "Self-directed" and the explorations. Hover or focus shows that entry's `problem` above the strip.
  - Shown and hidden by `transform` and `opacity` only.
  - Phone: one trigger line (`NN / total · short`) opening a native `<dialog>` with ruled rows.
  - Close the dialog when `usePathname()` changes.
- [ ] **Step 4: Run** the spec. Expected: PASS.
- [ ] **Step 5: Commit**: "Study index: move between studies without going home".

### Task 4: The ending

**Files:**
- Create: `components/study/study-next.tsx`
- Test: `e2e/study-nav.spec.ts` (add)

**Interfaces:**
- Consumes: `nextStudy` (Task 1); `WorkSpecimen` (`components/sections/work/work-specimens.tsx`, by slug); the work item's `byline` (`lib/data/work.ts`).
- Produces: `<StudyNext />`, root marked `data-study-next`, rendering nothing when `nextStudy(pathname)` is `undefined`.

- [ ] **Step 1: Write the failing e2e tests** (add):
  - `the ending leads to the next study`: on `/work/white-label-rfp`, `[data-study-next] a` points to the second work href and contains its `short` name.
  - `the last study wraps to the first`: on the last work href, the ending points to `/work/white-label-rfp`.
  - `a page outside the index has no ending, and nothing breaks`: on `/explorations/smart-journal`, `[data-study-next]` has count 0, `[data-study-index]` exists with no `aria-current`, and there are no page errors (collect `pageerror`).
- [ ] **Step 2: Run** the spec. Expected: FAIL.
- [ ] **Step 3: Implement** `StudyNext`.
  - A full-width block with a hairline above, then "Next" as a `ledger-label` and the next study's `short` title in `type-hero-internal`.
  - Its `WorkSpecimen` inside `<ViewTransition name={`case-${slug}`} share="case-morph">`, and its byline. All of this is one `<Link>`.
  - Under it: "All work" (`/#work`) and the email (`EMAIL_HREF` from `lib/contact`).
- [ ] **Step 4: Run** the spec. Expected: PASS.
- [ ] **Step 5: Commit**: "Study ending: the next study, at hero size".

### Task 5: StudyLayout on every study page

**Files:**
- Create: `components/study/study-layout.tsx`, `app/work/layout.tsx`, `app/explorations/layout.tsx`
- Modify: the five `app/work/*/page.tsx` (remove `CsChapterNav`, its `CHAPTERS` constant and `CsNextStudies`)
- Delete: `components/case-study/cs-chapter-nav.tsx`, `components/case-study/cs-next-studies.tsx`, and their exports in `components/case-study/index.ts`

**Interfaces:**
- Consumes: `StudyTracker`, `StudyIndex`, `StudyNext`.
- Produces: `StudyLayout({ children })` renders `children`, `<StudyNext />`, `<StudyTracker />`, `<StudyIndex />`.

- [ ] **Step 1: Write the failing e2e test** (add): `every study page has the layer`: for each of the five work hrefs and `/explorations/personal-execution-system`, the page has exactly one `[data-study-index]`, one `[data-study-tracker]` (at 1440), one `[data-study-next]`, and no element with the old rail's markup or the text "More case studies".
- [ ] **Step 2: Run** it. Expected: FAIL.
- [ ] **Step 3: Implement**
  - `StudyLayout`, and the two route-group layouts returning `<StudyLayout>{children}</StudyLayout>`.
  - Remove the old components from the pages and delete them. Check `components/case-study/index.ts` and that nothing else imports them (`grep -rn "CsChapterNav\|CsNextStudies" app components`).
- [ ] **Step 4: Verify the whole step**
  - `npm run lint && npx tsc --noEmit && npm run check:ledger && npm run test:unit`: all pass, 0 hard failures.
  - `npm run build`: the five `/work/*` and the `/explorations/*` routes still `○`.
  - `E2E_PORT=3200 npx playwright test`: no failures outside the baseline list.
  - `npm run snap -- --label study-nav --pages agent,partnerbank,dror,honasa,email,planr --themes light,dark --widths 1440,390`: review the strip, rail and ending in each.
  - Mobile Lighthouse on `/work/agent-commerce` and `/work/white-label-rfp` (local production build, 3 runs): ≥ 85 and no lower than before; CLS 0.
- [ ] **Step 5: Commit**: "StudyLayout: the switcher, tracker and ending on every study". Open a PR for step 1.

---

## Steps 2 to 5 of the rollout (outlined; each gets its own detailed plan once step 1 ships)

**Step 2: the template blocks, proven on Agent Pay.** Needs PR #58 merged first.
- `StudyHero`: the facts strip and a full-bleed lead media.
- The introduction statement.
- `StudyChapter`: replaces `CsSection`, with the fixed chapter order and a `data-settle="title"` rise.
- `StudyMedia`: `bleed`, `wide` and `inset`; image, children or honest slot.
- The honest slot is visible where `NEXT_PUBLIC_DEPLOY_ENV !== "production"`, as `<AddLater>` is.
- The fold phone becomes Agent Pay's bleed media.
- New e2e: a production build contains no honest slot.

**Step 3: PartnerBank, Dror, Honasa and Email Builder,** one PR each. Card grids become ruled lists; each page gets zero `check:ledger` S1 to S7 hits. This absorbs REDESIGN Phase 4.

**Step 4: the explorations.** PlanR, then the four `ContentPage` stubs on the exploration chapter set, with honest slots. List them in `explorationItems` so the index includes them.

**Step 5: the fintech system:** `StudyIndex` and `StudyNext` only, from `app/systems/layout.tsx`.
