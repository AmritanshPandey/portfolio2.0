# Portfolio redesign: put the work in front

For Claude Code, working in `AmritanshPandey/portfolio2.0`.
Written 2026-10-31 against commit `10f1492` ("Agent Pay on a foldable") from a full render of every
public page (desktop 1440 and phone 390, light and night), a production build, Lighthouse runs,
and a code audit. Line numbers refer to that commit; re-check them before editing.

---

## 0. How to use this file

**The pack** (unzip at the repo root and commit):

| File | Purpose |
|---|---|
| `docs/redesign/REDESIGN.md` | This plan |
| `docs/redesign/DECISIONS.md` | The owner's answers to D1 to D11 |
| `.claude/commands/redesign.md` | `/redesign <n>` runs one phase with the verification loop |
| `scripts/snap.mjs` | Before/after screenshots of every page, both themes, desktop and phone |
| `scripts/check-ledger.mjs` | Design-system drift check: hard failures and soft counts |

**Owner (Amritansh):** answer the open decisions in `docs/redesign/DECISIONS.md` (or tell Claude
in chat and it records them there). Review each phase on its Vercel preview before merging.

**Claude Code:** run one phase per session with `/redesign <n>` (see `.claude/commands/redesign.md`).
Read in this order before touching code:

1. this file (scope, phases, acceptance criteria)
2. `docs/redesign/DECISIONS.md` (owner answers)
3. `DESIGN.md` (Ledger: the visual spec)
4. `PRODUCT.md` (audience, principles, anti-references)
5. `CLAUDE.md` (stack, conventions, gotchas)
6. `README.md` → "Confidential content: review before publishing"

Where documents disagree: this file wins on **scope and order**, `DESIGN.md` wins on **visual rules**,
`DECISIONS.md` wins on **anything the owner has answered**. Several older docs are stale (see F12);
never take visual direction from `AUDIT.md`, `README.md`'s first paragraph or `.impeccable/design.json`.

Work rules:

- One phase per branch: `redesign/p<n>-<slug>`. Small commits, plain messages.
- Baseline snapshots before the first edit, after-snapshots before you report (section 8).
- Stop at every **CHECKPOINT** and wait for the owner. Don't push or open a PR unless asked.
- If a step needs an unanswered decision, ask with the options from section 5, then stop.

---

### Shipped since this plan was written

These landed on `main` after commit `10f1492`. Line numbers and findings below predate them.

- **Agent Pay is already a home work row (#45), second in the list.** Phase 2 still moves it first
  and gates its page. Its outcome line uses D3-approved facts only (#46).
- **Hero statement is annotated (#47):** two footnote marks and two ruled notes under the statement,
  animated in. This covers part of F4 and overlaps Phase 2 step 4's proof strip: decide with the
  owner whether the strip is still needed, and keep the 7.2 rows to D3-approved facts. The notes
  move into `lib/data/proof.ts` when that lands.
- **Work rows (#48):** the tag eyebrow is gone; a byline sits under the title (`WorkItem.byline`).
- **"Show the working" (#54):** a note under each work row. Its Agent Pay copy goes beyond the two
  D3 facts; the owner has yet to confirm it.
- **Lazy islands use `lazyClient`, never `next/dynamic` (#52);** see CLAUDE.md.
- **Device models now live in the repo (#51)**, so F14's build-time download is gone. D9 still
  needs an answer: Apple's model is now committed, not only fetched.

## 1. Verdict and target

**What's already right.** Ledger is a real point of view: paper, ink and one ultramarine accent;
Archivo's width axis carrying the hierarchy; Martian Mono for every reference; the settle; the
dot field and pixel wake; pluckable rules; the ASCII sea. The hero statement is striking at
1440px. The work index reads like a statement of account, and every case study shows its options
and trade-offs. Engineering discipline is high (reduced-motion paths, settle guard, AddLater notes
hidden in production, e2e specs). **Don't rebuild any of this. Extend it.**

**What's wrong.** The frame is louder than the work.

1. The strongest, most current work, Agent Pay (the React and Claude demo Mastercard's CPO used at
   Money20/20), is not on the home page and is set to `noindex`.
2. Most images that claim to show product UI are stock gradient blobs: all seven Gallery covers
   and the key figure in three case studies. Annotations point at nothing.
3. The first fold spends its largest type on a general claim; no proof is visible above the fold.
4. Case studies drifted from Ledger: rose accents, card grids, emoji, 8px text, white-on-paper
   chart labels.
5. Mobile performance on the home page is mediocre for a design engineer's site.

**"Amazing", made checkable.** The redesign is done when all of these hold:

1. At 1440×900, 1536×864 and 1280×800, the first fold shows name and role, the statement, a link
   to the latest work, and at least one proof line, with no scrolling.
2. Agent Pay is the first line item of the work, and `/work/agent-commerce` is the best-looking
   page on the site in both themes.
3. Zero stock gradient placeholders on any public page (`check:ledger --strict-images` passes).
   Every product figure shows real or faithfully recreated, anonymised UI.
4. Every case study passes Ledger: one accent, ruled rows instead of card grids, no text under
   11px at rendered size, no gradients outside mockups, colours from tokens (both themes, and
   inside the ink band).
5. (If D5 = yes) one signature interactive piece lets a reader feel the silent-guardian idea in
   under 20 seconds.
6. Mobile Lighthouse performance ≥ 85 on `/` and every case study, measured on the Vercel preview;
   nothing ends below its baseline.

---

## 2. Non-negotiables (every phase)

### 2.1 Content integrity

- Never invent, round up or "improve" numbers, quotes, research findings, partners, events,
  titles, tenures or awards. A figure may appear on a page only if it already appears in that
  case study's source file, or the owner supplied it in `DECISIONS.md`.
- Unknown or unconfirmed: write `<AddLater note="..." />` (visible in dev and preview, never in
  production; see `components/shared/add-later.tsx`). Resolve existing AddLater notes only with
  owner-supplied facts.
- Career facts: "6+ years", "Senior UX Designer at Mastercard", "DROR Labs (later Lythouse)".
  They must match LinkedIn (CLAUDE.md).
- Self-directed work stays labelled as such (`CsProvenance kind="exploration"`). A concept never
  borrows a shipped outcome.

### 2.2 Confidentiality

- No Mastercard details beyond what the pages already say. Agent Pay visuals come only from the
  white-labelled demo. No Mastercard logos, marks or sonic identity recreated anywhere, including
  the signature piece.
- No card-network names in mock UI (today's Agent Pay hero shows "Visa ···· 4821"; fix in Phase 1).
- Before any Agent Pay text becomes public, follow D1 and D3.

### 2.3 Owner decisions already made: don't reopen

- Keyboard focus-ring styling stays exactly as it is (DESIGN.md §7).
- Light paper is the default; night through the toggle; no system theme.
- Sound is on by default and starts with the visitor's first click, tap or key press; turning it
  off is remembered (changed by the owner, #53; this replaces "opt-in and off by default").
- Native scrolling; no smooth-scroll library.
- Framer Motion stays off the home page.

### 2.4 Ledger rules (DESIGN.md is the spec; this is the checklist)

- Ultramarine is the only accent; it marks one thing at a time and never fills a large area.
- No gradients, glows or drop shadows outside product mockups (`[data-keep-radius]`, `.fintech-system`).
- Lists are ruled line items, not card grids. Cards only for specimens and mockups.
- Mono labels in sentence case with tabular figures (`ledger-label`), never uppercase-tracked.
- No pills. No emoji in copy. No text below 11px at rendered size, including SVG text.
- 4px corners on the sheet; mockups keep their own radii.
- Colours come from tokens (`--foreground`, `--text-muted`, `--border`, `--accent`, `--surface-*`),
  never `rgba(255,255,255,…)` or hex literals that only work on one theme.
- Use the `type-*` classes and the existing components (`CsSection`, `CsDecision`, `CsProvenance`,
  `.work-row`, `.ledger-grid`) before inventing new ones.

### 2.5 Voice

- Plain, first person, specific. Sentences a person would say in an interview.
- No em dashes in visible copy (use a comma, colon or full stop).
- Banned: leveraging, seamless, robust, cutting-edge, delve, elevate, empower, unlock, streamline,
  innovative, synergy, holistic, game-changer, world-class, passionate, revolutionise, harness,
  transformative, best-in-class, state-of-the-art.
- `skills-lock.json` lists a `writing-guidelines` skill; if it's installed, use it on any copy you write.

### 2.6 Engineering

- No `transition-all`; list properties. Transform and opacity for motion.
- Every animation has a `prefers-reduced-motion` path. WebGL and canvas ship a static fallback,
  cap DPR and pause off-screen (README "Maintain performance & robustness").
- Pointer and scroll listeners only while on screen; cache rects; write transforms or leaf
  variables (CLAUDE.md "Gotchas").
- `next/image` with an explicit `sizes` on every image.
- No new dependency without a one-line reason in the PR. Prefer none.
- Keep every route static (`○` in the build's route table) unless the gate needs otherwise.

---

## 3. Baseline (2026-10-31, commit 10f1492)

| Measure | Result |
|---|---|
| Build | 39 routes, all static. `lint`, `tsc --noEmit`, `check:type` clean. |
| Lighthouse, simulated mobile, local production build | `/` perf 62 (LCP 5.0s: the hero portrait; TBT 641ms) · `/work/agent-commerce` 68 (TBT 691ms; SEO 66 because of `noindex`) · `/work/white-label-rfp` 85 |
| Lighthouse, desktop | 99 to 100 on all three. Accessibility 100 on all three (automated subset only). |
| Home height | about 9,000px desktop (8,967 in the production build), 10,396px phone |
| `check-ledger` | 4 hard failures; soft drift totals in Appendix B |

Local numbers are for before/after comparison only. Record the real baseline on the first Vercel
preview with PageSpeed Insights (Phase 0) and compare against that.

---

## 4. Findings, with locations

### P0: a recruiter sees these in the first minute

**F1. Agent Pay is hidden.** Not in `SEQUENCE` (`lib/data/work.ts` L8-13); `robots: noindex`
(`app/work/agent-commerce/layout.tsx`); no work specimen. Waiting on the gate
(`docs/superpowers/specs/2026-10-11-site-password-gate-design.md`, "Ships before (or with) the
latest-work showcase").

**F2. Placeholder art is presented as product.** Every file in `public/assets/images/work/*.jpg`
is an abstract gradient. They appear as:

- PartnerBank "configured demo" with four annotations over a gradient
  (`app/work/white-label-rfp/page.tsx` ~L440, `CsAnnotatedImage`)
- Honasa "product detail page" inside a `BrowserFrame` (`app/work/d2c-platform/page.tsx` ~L766)
- Email Builder "anatomy" with annotations (`app/work/email-builder/page.tsx` ~L598)
- all seven Gallery covers (`components/gallery/ui-design-gallery.tsx` L37-102), so `/gallery`,
  "a visual-first collection of app screens", shows no screens
- article images (`lib/data/articles.ts` ~L93-204), `components/shared/brand/brand-bento.tsx`

The greyscale override in `app/globals.css` (L1664-1669) hides the colour, not the emptiness.
Their alt texts describe UI that isn't in the picture.

**F3. Live typos.** Entities inside JS strings render literally:
`couldn&apos;t` (`app/work/d2c-platform/page.tsx` L469) and `&lsquo;Track your family&rsquo;`
(`app/work/citizen-safety/page.tsx` L336). Both are on the production site today.

**F4. The first fold carries a claim, not proof.** At 1440×900 the biggest element is
"Product design for complex systems people can trust."; the meta line's right side is empty; the
"View selected work" button sits about 180px below the fold; no proof (Agent Pay, Money20/20,
numbers) appears before scrolling. Your name isn't visible either: the nav shows only the square
mark, and "Amritansh Pandey" sits in the photo caption, below the fold. The glass plate's right
column has an empty band between the intro and the buttons
(`components/sections/hero/hero.tsx` L95-110).

**F5. Light-theme chart bugs.** Stage labels, the axis label and the baseline in Agent Pay's
`AnxietyCurve` use white alpha and vanish on paper (`app/work/agent-commerce/page.tsx` L130-151).
Same pattern: `white-label-rfp/page.tsx` L364-366 and L509-512, `d2c-platform/page.tsx` L839-842.

**F6. A credibility risk in self-directed work.** `lib/data/systems.ts` L43 says the system
"reduced compliance sign-off from three weeks to under five days", and L31 says the tier model
"came from working with compliance and legal teams", on a page the home page labels as
self-directed exploration. An interviewer will ask which product and which legal team. Owner
decides (D6). Until then, wrap the claims in `<AddLater>` or leave them untouched; never extend them.

### P1: craft and consistency

**F7. Case studies drifted from Ledger** (run `npm run check:ledger` for the live list):
legacy rose and red accents (PartnerBank 15, Agent Pay 9, Email 8, Honasa 7 lines), card surfaces
(Dror 12, Agent Pay 8, Honasa 7, Email 5), uppercase-tracked labels (Dror 20, Email 10, Agent Pay 9),
emoji (⚡ in Dror L66/181/211, ✦ in Agent Pay L99/190), radial glows (Agent Pay L66, L625),
`text-[8px]` (Agent Pay L99, Honasa L98), SVG text under 11 units (PartnerBank 15, Honasa 6,
Agent Pay 3), heading case mixed ("Modular Systems for Enterprise RFP Velocity." and
"One System. Three Brands. Eight Weeks." in Title Case; the rest in sentence case).

**F8. Agent Pay page specifics.**

- The hero visual is a small chat mock (190px wide) that names a card network; the real UI
  (`/assets/images/agent-pay/fold-screens.jpg`) first appears about two-thirds of the way down.
- "Flagship · Ongoing" prints twice in the hero (`keywords` and `badge`, L200-202).
- On phones the title breaks "AI-led" into "AI-" / "led".
- "Built in 2 weeks. / Used by the / CPO / at Money20/20." leaves "CPO" alone (manual `<br />`, L601).
- The live demo is a bare iframe to `https://agent-pay-demo.vercel.app/` (L638-644). If that
  deployment sleeps or fails, the flagship shows an empty phone.
- Tinted accent fills: Layer 03's box, the "Adopted" metric card, the roadmap badges.
- `text-[8px]` "Secured by trusted payment network ✦" (L99).

**F9. Home page.** The two AI essays exist but aren't featured (`lib/data/articles.ts`:
"Trust as Architecture in Agentic Commerce" L56-65 and "Designing for Cognitive Load in AI
Products" L318-323 have `featured: false`). Approach spends about 1,100px on six general steps.
The Fintech system's hi-fi screens, the best UI craft on the site, are represented by a small
risk-tier list. The Honasa and Email specimens are low-fidelity wireframes for shipped work.

**F10. Chapter rail state.** After jumping from the end of a case study back to the top (Home key,
or `scrollTo(0, 0)`), the rail keeps a later chapter: "Reflection" on PartnerBank, Dror and Email,
"Timeline" on Honasa. Reproduce, then fix (no active chapter above the first one).

**F11. Mobile performance.** LCP element is the hero portrait. A 36KB chunk containing Framer's
`MotionGlobalConfig` is referenced in the home HTML of a production build, despite the "no Framer
on home" rule. It may only be a `<Link>` prefetch for the case studies (harmless) or it may execute
on load (worth removing); check before changing anything. TBT is dominated by script evaluation.

**F12. Docs that will mislead you.** `README.md` L3 ("Dark-default", "one emerald accent");
`CLAUDE.md` L33 ("No tests"; `e2e/` has 10 specs and `test:e2e`/`test:unit` scripts) and L19
(home lists "Trajectory", which isn't on the page); `PRODUCT.md` L19 ("Product Thinker",
"7 years"); `AUDIT.md` (July: dark studio, emerald, GSAP; superseded by Ledger);
`.impeccable/design.json` ("Warm Studio": ember and Montserrat; superseded);
`data/casestudy/agent-commerce.json` is empty (0 bytes) and the loader ignores `data/casestudy/`.

**F13. Guards miss real bugs.** `check:type` only greps 9 to 10.5px, so `text-[8px]` passes;
nothing catches literal entities, white-alpha SVG fills or placeholder images. This pack adds
`scripts/check-ledger.mjs`.

**F14. Small things.** Phone hero caption wraps "Fintech ·" alone on a line; article pages use
pill tags (`components/layout/article-layout.tsx`); `components/sections/growth/growth-chart.tsx`
is unused; the fold viewer downloads Apple's iPhone Duo AR model at build time (`vercel.json`,
`scripts/prepare-iphone-duo.py`), see D9.

---

## 5. Owner decisions (Claude asks; never assumes)

Record answers in `docs/redesign/DECISIONS.md`.

**D1. Password gate scope.**
(A) whole site, as approved on 2026-10-11; (B) public site, gate only the confidential case
studies (Agent Pay at least), and show the gated study on the home page as a private line item;
(C) no gate.
*Recommendation: B.* With A, every recruiter or sourcer who clicks the link on LinkedIn meets a
password screen before seeing anything, link previews only ever show `/unlock`, and nobody can
find the site by search. B gives the sensitive material the same protection while the first
screen still sells. The spec's mechanism works for both; B narrows the proxy's matcher.

**D2. Hero statement.** Each option holds three lines of about 17 characters, so the condensed
phone hero (`wdth` 88) keeps one line per row. The ultramarine full stop stays.

- H-a (keep): "Product design for / complex systems / people can trust."
- H-b: "I design how / people trust AI / with their money."
- H-c: "Design for the / moment an AI / pays for you."

**D3. What about Agent Pay may be public** (home row, link previews, meta descriptions).
Candidates, each traceable to `app/work/agent-commerce/page.tsx` or the resume:

1. "Set design direction for agentic commerce at Mastercard" (resume; already public)
2. "Built a React and Claude demo in two weeks" (decision 03, info bar)
3. "Used by Mastercard's CPO at Money20/20" (lede, decision 03, impact)
4. "The silent guardian became Mastercard's direction for agentic commerce" (decision 02)
5. Partner names (Google, ChatGPT, Haptic Labs, ElevenLabs): keep behind the gate unless approved

**D4. Gallery.** (a) Fill it with captured real UI (Phase 3) plus owner screenshots, and hide it
from the nav until it holds at least six real shots; (b) remove it and fold its best pieces into
the case studies and the Lab.

**D5. Signature piece "Guardian moments"** (Phase 5): build now, later, or not at all.

**D6. Fintech system claims** (`lib/data/systems.ts` L31, L43): (a) the owner names the source and
the claim stays with that source stated; (b) reword as design intent ("designed so legal owns the
copy and the slot can't be skipped"); (c) remove.

**D7. PlanR numbers.** Real usage (users, weekly actives, retention) for the PlanR line item and
page, replacing the "Fast · Release and feedback loop" stat card; or keep it qualitative.

**D8. Approach section.** (a) Compress to three steps and add "Where AI is in my work" (facts
only, section 7.6); (b) keep as is.

**D9. iPhone Duo model.** Keep (owner has checked Apple's terms for reusing its AR model), or draw
a neutral foldable frame in code; the screens are the owner's either way.

**D10. Heading case.** Switch the Title Case case-study headings to sentence case (yes/no).

**D11. Colophon.** Add `/colophon` (stack, type, the Ledger idea, how AI tools helped build the
site): yes/no.

---

## 6. Phases

Phases 0 and 1 come first. If D1 is still open, do Phases 3 and 4 before Phase 2: they don't
depend on the gate.

### Phase 0: Baseline and hygiene

No visual change except bug fixes.

1. Branch `redesign/p0-baseline`.
2. Install the pack's tooling (already in the repo if the owner committed it): `scripts/snap.mjs`
   and `scripts/check-ledger.mjs`. Add to `package.json`:
   `"snap": "node scripts/snap.mjs"`, `"check:ledger": "node scripts/check-ledger.mjs"`, and make
   `"check:type"` run `check:ledger` too (keep the old name working). Add `snapshots/` to
   `.gitignore`. Run `npx playwright install chromium` once if no browser is installed.
3. Baseline: `npm run dev`, then `npm run snap -- --label p0-before --frames 30`.
4. Fix the hard failures: F3 entities (use the real characters ’ ‘ in JS strings), `text-[8px]`
   (Agent Pay L99, Honasa L98; nothing under 11px).
5. Docs (F12): update `CLAUDE.md` (tests exist; current home sections; a line pointing to
   `docs/redesign/REDESIGN.md`; "`.impeccable/design.json` and `AUDIT.md` predate Ledger; never
   use them as a spec"), `PRODUCT.md` ("6+ years", "Senior UX Designer at Mastercard"),
   `README.md` first paragraph (Ledger: paper default, ultramarine, link to DESIGN.md). Move
   `AUDIT.md` to `docs/archive/2026-07-audit.md` with a one-line "superseded by Ledger" note.
6. Remove `data/casestudy/agent-commerce.json` (empty) after grepping for imports; delete
   `growth-chart.tsx` if nothing imports it.
7. Open the first Vercel preview and record PageSpeed Insights (mobile and desktop) for `/`,
   `/work/agent-commerce`, `/work/white-label-rfp` in `docs/redesign/RESULTS.md`.

Acceptance: `check:ledger` reports zero hard failures; lint, tsc, `test:unit`, `test:e2e`, build
pass; the only visual differences in snapshots are the fixed strings; docs agree on years, title
and theme.
**CHECKPOINT.**

### Phase 1: Agent Pay, Ledger edition

Make `/work/agent-commerce` the best page on the site before anything links to it. Needs D3, D9.

1. **Hero.** Replace `PhoneVisual` with the real screens: `fold-screens.jpg` (or the `FoldPhone`
   folded state as a still) in a Ledger frame. Remove every card-network name; mock cards read
   "Personal card ···· 4821" style. Print "Flagship · Ongoing" once. Keep "AI-led" together on
   phones (non-breaking hyphen U+2011 or `whitespace-nowrap`). Add a `CsProvenance` line; suggested
   `kind="internal" label="Used inside Mastercard · demo white-labelled"` (owner can edit).
2. **The short version.** Directly under the info bar, add the problem / my role / outcome summary
   the other studies use, so a recruiter can stop there. Text only from this page.
3. **Order.** Problem → Research → The silent guardian (curve and flow) → Four calls → What I
   built (toolkit, multi-sensory) → Live demo → The flow, unfolded → Impact (with the One
   Credential note folded in as one line) → Reflection. The silent guardian is the idea every
   decision refers to, so it comes before the decisions.
4. **Ledger pass.** Problem layers become ruled line items (mono ref, title, body); Layer 03 gets
   its emphasis from an ink rule and the accent on its ref, not a tinted box. Research insights
   become ruled two-column rows; quotes in graphite with a left hairline. Impact metric cards
   become a four-line statement (mono label, tabular value, one-line note); no accent fills.
   Roadmap: three ruled columns; status as a mono label with the square mark `CsProvenance` uses.
   Reflection: ruled rows.
5. **Charts.** `AnxietyCurve`, the flow nodes and the sensory glyphs take colours from tokens,
   never rose and never white alpha; they must read on paper, on night and inside the ink band.
   Labels render at 11px or more at the narrowest width; if the SVG scales down, move labels to
   HTML.
6. **Live demo.** New component `DemoPoster`: a still of the demo's first screen with a
   "Try the live demo" button; the iframe loads only on click; after 8s without a load event, or on
   error, show "The demo didn't load. Open it in a new tab." with the link. Nothing heavy on first
   paint. Capture the still once with Playwright from the white-labelled demo at 393×852 and save
   it as `public/assets/images/agent-pay/demo-poster.png`.
7. **Type.** Remove the manual `<br />`s in the live-demo heading; `text-balance`, and a
   non-breaking space in "the CPO".
8. Remove the radial glows (L66, L625). Device frames inside `[data-keep-radius]` may keep their
   own shadows.
9. Keep `robots: noindex` and leave the page unlinked until Phase 2 ships the gate decision.

Acceptance: `check:ledger` shows no S1, S2, S3, S4, S6 or S7 hits for this file; snapshots in
both themes at 1440 and 390 reviewed; the phone title has no broken hyphen; with the network to
`agent-pay-demo.vercel.app` blocked, the section still looks finished; mobile Lighthouse for the
page ≥ 85 or better than baseline.
**CHECKPOINT.**

### Phase 2: The flagship goes first, and the gate

Needs D1, D2, D3.

1. **Gate.** Implement the approved spec and plan
   (`docs/superpowers/specs/2026-10-11-site-password-gate-design.md`,
   `docs/superpowers/plans/2026-10-11-site-password-gate.md`) with the scope from D1.
   For B: the proxy matcher covers only the gated routes; `/unlock` copy as the spec says;
   gated routes `noindex` and disallowed in `robots.ts`; public pages stay indexable; the sitemap
   lists only public routes. The owner sets `SITE_PASSWORD` in Vercel (Production and Preview)
   before merge.
2. **Data.** Extend `WorkItem` (`lib/types/content.ts`) with `flagship?: boolean`,
   `access?: "public" | "private"` and `specimenImage?: { src: string; alt: string }`.
   Add Agent Pay first in `SEQUENCE` with the copy in section 7.3 (adjusted to D3).
3. **Flagship row.** In `WorkIndex`, the flagship renders as one full-width line item before the
   rest: a wide specimen (the two demo screens side by side on `surface-1`, 4px corner, hairline)
   above the usual ref, client and role line, a title one step larger, then the Problem and
   Outcome entries. Same hover grammar as the other rows; `ViewTransition` name
   `case-agent-commerce` so the specimen grows into the case-study hero. If gated: a
   `CsProvenance`-style mono line "Private case study · password in my resume and emails".
4. **Hero.**
   - Name above the fold: set "Amritansh Pandey" in the nav beside the square home mark (desktop),
     or at the start of the meta line. One place, not both; the square mark stays.
   - Meta line, right side: "Latest · Agent Pay, used live at Money20/20" with the arrow icon,
     linking to the flagship row. This puts proof above the fold without moving anything.
   - Statement: the D2 option.
   - Intro: the D2 intro line (section 7.1).
   - Proof strip: three ruled mono rows in the glass plate's right column, in the empty band
     between the intro and the buttons (section 7.2). Each row links to the exact section anchor.
   - On viewports 900px tall or less, tighten the space between the statement and the plate so
     the first proof row is visible at 1440×900, 1536×864 and 1280×800.
5. **Reconciliation test.** Proof lines live in a new `lib/data/proof.ts` as
   `{ text, href, source: { file, quotes: string[] } }`. A unit test (`lib/proof.test.mjs`, run by
   `test:unit`, same `node --test` style as the existing tests) reads each `file` and asserts every
   quote appears verbatim. The home page can never claim something its case study doesn't say,
   and editing a case study's wording later fails the test until the strip is updated too.
6. **Work intro.** "Five case studies: agentic commerce, enterprise demo systems, multi-brand
   commerce, a design system, and a 0→1 pivot. Each one names the options considered and what
   actually changed."
7. **Insights.** Feature the two AI essays and list them first.
8. **Meta.** Lead `app/layout.tsx` descriptions and the OG image (`app/opengraph-image.tsx`)
   with agentic commerce, using only D3-approved facts.

Acceptance: the first-fold rule from section 1 holds at all three sizes; Agent Pay is the first
work row; `proof.test` passes; CLS stays 0; the home page gains no more than 10KB of gzipped JS;
snapshots in both themes and both widths reviewed; gate behaviour covered by the spec's
Playwright cases.
**CHECKPOINT.**

### Phase 3: Real visuals everywhere

Needs D4.

1. **Capture pipeline.** Add `data-capture="<name>"` to coded UI that already exists and a script
   `scripts/capture-ui.mjs` (Playwright element screenshots at 2x, saved as PNG into
   `public/assets/images/gallery/`; `next/image` serves WebP or AVIF itself). Sources already in
   the repo:
   - PartnerBank: the banking screen in `CsBrandSkinCompare`, one shot per brand skin
   - Fintech system: treasury command, payment review, mobile wallet
     (`/systems/fintech-ai-interface`)
   - PlanR: the app screen (or the owner's real screenshots)
   - Agent Pay: `fold-screens.jpg` and the `DemoPoster` still
2. **Replace the three case-study placeholders with coded, anonymised recreations**, not images:
   - PartnerBank "configured demo": render the real banking screen with a brand-skin token set;
     re-aim the four annotations at real regions. If `CsAnnotatedImage` only takes an image, add
     `CsAnnotatedFigure` that annotates any React node.
   - Honasa product detail page: a coded PDP in the shared system's structure with neutral
     products and SVG product art; the three brand token sets as in the specimen; no real product
     photos unless the owner supplies screenshots.
   - Email anatomy: a hi-fi coded email built from the four blocks (hero, editorial, call to
     action, legal footer), Outlook-plausible, with believable copy.
3. **Gallery.** Real images only. When no placeholder remains, delete the greyscale override in
   `app/globals.css`. Under six real shots: hide Gallery from `PAGE_LINKS` and the sitemap (D4).
4. **Articles.** Replace or remove the 11 placeholder references in `lib/data/articles.ts`. An
   article image shows the thing its caption names, or there's no image.
5. Make `check:ledger` run with `--strict-images`.

Acceptance: `npm run check:ledger -- --strict-images` passes; every alt text describes what is
visible; no image over 300KB is served at phone width.
**CHECKPOINT.**

### Phase 4: Case-study consistency

PartnerBank, Dror, Honasa and Email Builder, one commit per page.

1. Drive soft drift to zero for `app/work/*`: legacy accents to tokens; card grids to ruled line
   items (`.work-row` grammar, `CsList`), cards kept only for specimens and mockups; emoji to mono
   marks (Dror's ⚡ "Forcing function" becomes a mono label with a square mark); uppercase-tracked
   classes to `ledger-label`; SVG text 11px or more at rendered size; white alpha to tokens.
2. Headings in sentence case if D10 = yes.
3. Chapter rail (F10): clear the active label above the first chapter; add an e2e spec (scroll to
   the end, back to the top, no active chapter).
4. "60-second read": a toggle in `CsHeroShell` that collapses the page to the short version, each
   decision's Decision and Impact lines, and the outcomes. CSS only (`data-mode="brief"`), no
   layout shift, and the state lives in the hash (`#brief`) so a recruiter can share it.
5. Upgrade the Honasa and Email work specimens to hi-fi, reusing the Phase 3 recreations at
   specimen size.

Acceptance: `check:ledger` soft rules S1, S3, S4, S5, S6, S7 report zero for `app/work/*`;
snapshots reviewed in both themes; e2e green.
**CHECKPOINT.**

### Phase 5: Signature piece, "Guardian moments"

Needs D5 = yes.

A small working simulation that makes the silent guardian felt. White-labelled: "trusted payment
network", a fake merchant and basket, no Mastercard marks or sounds.

- **Where:** in the Agent Pay study right after the silent-guardian section, and as a Lab item
  ("Used in Agent Pay").
- **Controls:** Assisted or Autonomous; three basket presets (reuse the demo's $193.00 bike
  basket); "Run the agent".
- **Behaviour:** the seven stages (Intent, Browse, Select, Confirm, Verify, Complete, Receipt) run
  as a ruled horizontal ledger, about 600ms a stage. At Confirm, Verify and Complete the guardian
  appears: an ultramarine square and one line of text, an optional tone, and a haptic pulse where
  `navigator.vibrate` exists, a different pattern per moment. Assisted waits at Confirm for the
  reader's tap; Autonomous runs through and the guardian confirms after.
- **The counter-example:** a "Brand everywhere" switch shows the mark at all seven stages, so the
  reader feels the noise Brand asked for. That contrast is the case study's key decision.
- **Sound:** reuse the synthesis in `lib/ledger-sound.ts`; obey the site's sound toggle; off by
  default; never plays without a click.
- **Accessibility:** keyboard operable; stage changes announced through `aria-live="polite"`;
  reduced motion changes stages without animation.
- **Cost:** one client component, no new dependency, under 8KB gzipped, loaded with a dynamic
  import when it nears the viewport.
- **Caption:** "A white-labelled sketch of the silent guardian, not Mastercard's product."

Acceptance: works by keyboard alone; silent unless sound is on; no Mastercard marks; Lighthouse
for the page within 3 points of Phase 1.
**CHECKPOINT.**

### Phase 6: Home rhythm, explorations, performance

Needs D6, D7, D8, D11.

1. **Approach** (D8 = a): keep three steps ("Identify what cannot move", "Prototype the risk",
   "Make alignment concrete") and add "Where AI is in my work" (section 7.6).
2. **Explorations:** the Fintech system row shows a captured hi-fi screen (Phase 3); PlanR gets
   D7's numbers; apply D6 to `systems.ts`.
3. **Hero caption on phones:** keep "Fintech · Systems Builder" together.
4. **Article tags:** pills become mono labels (`article-layout.tsx`).
5. **Performance (F11):**
   - Check whether Framer executes on the home page (Chrome's Coverage panel on a production build,
     or the request initiators in Lighthouse's network list). If it's only prefetch for linked case
     studies, leave it. If it executes, find the importer (`grep -l MotionGlobalConfig
     .next/static/chunks/*.js`, or `@next/bundle-analyzer` once without committing it) and remove it.
   - Portrait LCP: right-size `sizes` at phone widths, `fetchPriority="high"`, and make sure the
     drift wrapper's `scale-[1.04]` doesn't force a larger download.
   - Don't hydrate the cursor, rule pluck or wake field on touch devices; they do nothing there.
6. **Colophon** if D11 = yes.

Acceptance: the desktop home page is at least 10% shorter than at Phase 0 without losing content;
mobile Lighthouse ≥ 85 on `/` (Vercel preview, PageSpeed Insights).
**CHECKPOINT.**

### Phase 7: Ship gate

1. Run everything: `check:ledger -- --strict-images`, lint, tsc, `test:unit`, `test:e2e`, build.
   Full snapshots compared with `p0-before`.
2. New e2e specs: Agent Pay is the first work row; no public page contains literal `&apos;`,
   `&lsquo;` or `&rsquo;` text; no rendered `/assets/images/work/` placeholder; gated routes redirect
   (if D1 is A or B); chapter rail state; `DemoPoster` fallback with the demo blocked.
3. Accessibility: the AccessLint skills in `skills-lock.json` (`accessibility-scan`, if installed;
   otherwise Lighthouse plus a manual contrast pass) on every public page in both themes, after
   content has settled; contrast in the ink band too.
4. README's confidential checklist for every changed case study; the owner signs off the D3 list.
5. PageSpeed Insights on the preview for `/`, `/work/agent-commerce`, `/work/white-label-rfp`;
   write before and after into `docs/redesign/RESULTS.md`.

---

## 7. Copy deck (drafts: the owner approves; no em dashes)

### 7.1 Hero

- Statement: D2 option.
- Intro: "**Senior UX Designer at Mastercard.** I set design direction for agentic commerce and
  build what I design, including the React and Claude demo Mastercard's CPO used at Money20/20."
  (sources: resume Mastercard bullet; `agent-commerce/page.tsx` lede and decision 03)
- Meta line, right: "Latest · Agent Pay, used live at Money20/20"

### 7.2 Proof strip (each row links to its section)

| Ref | Text | Links to | Source quotes (each must appear verbatim in the file) |
|---|---|---|---|
| 01 | Agent Pay · a React and Claude demo, built in two weeks, used by Mastercard's CPO at Money20/20 | `/work/agent-commerce#live-demo` | `the React demo the CPO used at Money20/20` (L212) and `a Claude backend in two weeks` (L393), both in `app/work/agent-commerce/page.tsx` |
| 02 | PartnerBank · a per-deal demo went from about 10 days to about 3 | `/work/white-label-rfp` | `cut a per-deal demo from about 10 days to about 3` in `app/work/white-label-rfp/page.tsx` (L159) |
| 03 | Dror · a B2B pivot shipped in six weeks, ₹1.98Cr lifetime revenue | `/work/citizen-safety` | `The B2B pivot shipped in six weeks and reached ₹1.98Cr lifetime revenue` in `app/work/citizen-safety/page.tsx` (L736) |

Quotes point at the case-study files, not `lib/data/work.ts`, so the strip reconciles with the
page a reader will open. Dror's own page says the revenue fell short of the $494K raised; if the
owner prefers a line without that tension, swap row 03 for "Email Builder · a no-code builder on
50+ Outlook-safe components, adopted Mastercard-wide" (quote: `A no-code builder on 50+ Outlook-safe
components and 28 templates, adopted Mastercard-wide` in `app/work/email-builder/page.tsx`, L204).

### 7.3 Agent Pay work row

- category: "Agentic Commerce / Mastercard"
- title: "Agent Pay: Trust when an AI pays for you"
- role: "Lead · Creative Studio"
- description (problem): "AI agents were starting to buy things for people, and nobody had
  defined what trust looks like without a checkout screen."
- metric (outcome): "The silent guardian became Mastercard's direction for agentic commerce, and
  the React and Claude demo I built in two weeks was used by the CPO at Money20/20."

### 7.4 Work section intro

"Five case studies: agentic commerce, enterprise demo systems, multi-brand commerce, a design
system, and a 0→1 pivot. Each one names the options considered and what actually changed."

### 7.5 Unlock page (from the spec)

"This portfolio is shared privately. Use the password from my email or resume, or ask me for access."

### 7.6 Where AI is in my work (D8 = a; only D3-approved facts)

1. "I build what I design. The Agent Pay demo is React with a Claude backend, built in two weeks
   and run live by Mastercard's CPO."
2. "I design how agents behave, not only how they look: when an agent acts alone, when it asks,
   and when the payment network should show itself."
3. "I use AI tools to prototype faster, without dropping craft."

---

## 8. Verification loop

After every meaningful change, and always before reporting:

1. `npm run check:ledger && npm run lint && npx tsc --noEmit`
2. `npm run snap -- --label p<n>-after --pages <touched pages>`, then open the before and after
   frames for each touched page and compare them yourself. Look for: what draws the eye first,
   Ledger rule breaks, both themes, the phone width, text under 11px, anything empty or broken.
   Fix what you see before reporting.
3. `npm run test:unit && npm run test:e2e` (add specs for new behaviour).
4. `npm run build`; confirm the route table is still static.
5. Performance-sensitive phases (1, 2, 6): `npm run build && npm start`, then
   `npx lighthouse http://localhost:3000/ --only-categories=performance,accessibility` (mobile
   default and `--preset=desktop`). Final numbers come from the Vercel preview.
6. Report: what changed; frames to look at (paths); checks run and results; anything you couldn't
   verify; open AddLater notes; the decisions used.

If the `impeccable` skill is available, run its critique on the home page after Phases 2 and 6 and
record the score beside July's 30/40 in `RESULTS.md`.

---

## 9. Only the owner can supply

- Answers to D1 to D11.
- `SITE_PASSWORD` in Vercel (Production and Preview) before the gate merges.
- Real screenshots: Honasa storefront pages if any survive; PlanR app screens and usage numbers.
- Confirmation that `agent-pay-demo.vercel.app` stays up, or a still to use instead.
- `public/resume.pdf` says "7+ years"; the site says "6+". Update the PDF (Claude can't edit it).

---

## Appendix A: file map

| Area | Files |
|---|---|
| Tokens, overrides | `app/globals.css` (LEDGER · TOKENS L72; system overrides L1645-1674) |
| Fonts, metadata, providers | `app/layout.tsx` |
| Home | `app/page.tsx`; `components/sections/hero/hero.tsx`; `components/sections/work/{case-study,work-index,work-specimens,exploration,exploration-specimens}.tsx`; `components/sections/articles/*`; `components/sections/about/*` |
| Content | `lib/data/{work,articles,explorations,systems,about}.ts`; `lib/types/content.ts` |
| Case studies | `app/work/{agent-commerce,white-label-rfp,citizen-safety,d2c-platform,email-builder}/page.tsx`; blocks in `components/case-study/*` (barrel `@/components/case-study`) |
| Provenance, notes | `components/case-study/cs-provenance.tsx`; `components/shared/add-later.tsx` |
| Nav | `components/layout/navigation/navbar.tsx` (`SECTION_LINKS`, `PAGE_LINKS`, `SECTION_IDS`) |
| Gallery, Lab | `components/gallery/ui-design-gallery.tsx`; `app/playground/*` |
| Gate spec, plan | `docs/superpowers/specs/2026-10-11-site-password-gate-design.md`; `docs/superpowers/plans/2026-10-11-site-password-gate.md` |
| Tests | `e2e/*.spec.ts`, `playwright.config.ts`; `lib/*.test.mjs` |
| Redesign tooling | `scripts/snap.mjs`; `scripts/check-ledger.mjs`; `.claude/commands/redesign.md` |

## Appendix B: `check-ledger` at baseline (2026-10-31)

Hard failures (4):

- H1 `text-[8px]`: `app/work/agent-commerce/page.tsx:99`, `app/work/d2c-platform/page.tsx:98`
- H2 literal entity: `app/work/citizen-safety/page.tsx:336` (`&lsquo;…&rsquo;`),
  `app/work/d2c-platform/page.tsx:469` (`&apos;`)

Soft totals: S1 legacy accents 66 · S2 gradients 97 · S3 card surfaces 60 · S4 emoji 9 ·
S5 uppercase-tracked 118 · S6 white-alpha SVG 8 · S7 SVG text under 11: 28 ·
S8 placeholder images 31 · S9 em dashes 33 (mostly code; check copy) · S10 open AddLater notes 3.
Many S2 and S5 hits sit in shared components the system overrides already restyle; fix those when
a phase touches the file, and prioritise `app/work/*` and `lib/data/*`.
