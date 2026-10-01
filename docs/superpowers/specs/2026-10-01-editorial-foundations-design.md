# Editorial redesign — Sub-project 1: Foundations

**Date:** 2026-10-01
**Branch:** `redesign/editorial` (long-lived; merges to `main` only after sub-projects 1–4)
**Status:** Draft for review

---

## 1. Context

The owner's "Portfolio Redesign Direction" brief asks for a redesign that reads as *a premium editorial publication about product systems*: Swiss editorial structure, a layered-product visual language (Product → System → Constraint → Decision → Outcome), and translucency used only for supporting information. Its core message is **clarity over decoration, systems over screens, decisions over UI**.

That brief **replaces PRODUCT.md and DESIGN.md as the source of truth**. Where it conflicts with the current system (dark-default canvas, the true-gray rule, custom cursor, magnetic CTA, WebGL hero), the brief wins, except where the owner explicitly chose otherwise (decision log below).

The redesign is too large for one spec, so it is split into seven sub-projects, each with its own spec → plan → implementation cycle:

| # | Sub-project | Depends on |
|---|---|---|
| **1** | **Foundations** — tokens, type, grid, surfaces, motion, layer language, docs *(this spec)* | — |
| 2 | Chrome — navigation (Work / Systems / Thinking / Explorations / About, plus Gallery and Lab), footer, section scaffolding, theme toggle in nav | 1 |
| 3 | Hero — built around the positioning line; years claim made computed (see decision log) | 1, 2 |
| 4 | Home IA — the ten-section narrative order; Trajectory removed, its career facts folded into About | 1, 2 |
| 5 | Case-study template — Context → Constraint → Decision → System → Outcome, `LayeredArtefact` | 1 |
| 6 | Secondary pages — articles, explorations, systems, Gallery, Lab | 1, 2 |
| 7 | Responsive, motion, and accessibility pass, plus dead-code removal | all |

Sub-projects 1–4 merge to `main` together, so the live site never shows a half-migrated state. Sub-projects 5–7 follow as separate PRs from the same branch base.

## 2. Decision log

| Decision | Choice | Note |
|---|---|---|
| Source of truth | The brief replaces PRODUCT.md / DESIGN.md | Both are rewritten in this sub-project |
| Default theme | **Light editorial** (warm paper) | Was dark-default |
| Dark mode | **Kept as a toggle, with the inversion rule** | In dark mode, emphasis bands become paper-toned |
| Typeface | **Bricolage Grotesque + Onest** (unchanged) + JetBrains Mono for system labels | Schibsted Grotesk and Host Grotesk were considered and rejected |
| Paper tone | **#F1EDE4** | #F5F4F1 (too close to white) and #ECEAE5 (too dim) were rejected |
| Notation density | **Quiet**: no section numbering on the home page; `↳ CONSTRAINT / DECISION / OUTCOME` and `SYSTEM 01`-style marks only in case studies and Systems | **Deliberate departure from brief §8**, which shows `01 / WORK`-style home labels. Chosen to avoid the "eyebrow on every section" pattern the previous redesign removed. |
| Rollout | Swap tokens in place on a long-lived branch | A parallel v2 system and a tokens-first ship to `main` were rejected |
| Signature interactions | Custom cursor, magnetic CTA, Lenis smooth scroll, WebGL hero retired | Brief bans cursor gimmicks, scroll-jacking, unnecessary WebGL |
| Buttons | Pill shape retired; the primary CTA becomes an underlined text link with an arrow | |
| Accent | Emerald stays the single accent | |
| Years of experience | **"6+ years"**, counting full-time post-degree work from **April 2020**. Computed at build time from a `CAREER_START = "2020-04"` constant in `lib/site.ts`, so it becomes "7+" in April 2027 without an edit | Part-time and freelance work before 2020 is shown as a separate fact (e.g. "plus startup and freelance work during my degree, from 2016"), never folded into the headline number |
| Career dates | All dates across the site must agree with an April 2020 full-time start. Today they conflict: Trajectory says DROR 2016–2019, Honasa 2019–2021, Mastercard 2021–now; the Dror case study says 2020–2021; metadata and the hero say "7 years" | Owner supplies the correct dates; applied in sub-projects 3–5 |
| Nav | Brief's five items **plus Gallery and Lab** | Sub-project 2 |
| Trajectory section | **Removed as a section.** Its career arc is carried by the Work case studies, "where I'm heading" moves to Hero/About, and its process list duplicates Approach. A compact, rule-separated career list (org · dates · role) moves into About | Sub-project 4; the nav's `trajectory` section id is removed there too |
| Placeholder imagery | **Kept** until real screenshots exist. Every artefact showing a placeholder carries a "Representative visual" caption; replacing one is an image-path change in page data, never a component change | Sub-projects 5–6 |

## 3. Goals and non-goals

**Goals (this sub-project)**
- One coherent token system covering colour, surfaces, type, grid, spacing, radius, borders, motion, and layers, in both themes.
- The site renders on paper by default, with every token-built component inheriting the new system without per-component edits.
- Layout-level retirements removed: cursor, Lenis, ambient site background, grain.
- DESIGN.md and PRODUCT.md rewritten to describe the new system.
- A living reference in `/showcase` (Foundations tab), plus a dev-only grid overlay.
- An automated contrast check that holds both themes to WCAG AA.

**Non-goals (owned by later sub-projects)**
- Fixing the ~34 files with hard-coded colours (≈300 hex literals, ≈314 `dark:` variants, ≈185 literal `bg-black/white/neutral-*`). Each is fixed by the sub-project that owns the file.
- Navigation, footer, hero, section order, case-study template.
- Removing `data-cursor-*` attributes (16 files; inert once the cursor is gone; cleaned up in sub-project 7).
- Removing `shimmer-accent` (still used by the hero; removed in sub-project 3, marked deprecated here).
- Removing the magnetic CTA (`section-cta.tsx`) and `ThemeFab` (replaced in sub-project 2).

## 4. Colour and surfaces

All tokens live in `app/globals.css`. Existing names are kept so components update in place; new names are marked *new*. **Light values are the source of truth as hex**; dark values are OKLCH.

### 4.1 Light (`:root`, `.light`)

| Token | Value | Role |
|---|---|---|
| `--background` | `#F1EDE4` | Editorial canvas ("paper") |
| `--foreground` | `#141414` | Ink |
| `--text-muted` | `#6E685C` | Metadata, captions (must clear 4.5:1 on paper) |
| `--surface-1` | `#FAF8F3` | **Elevated**: interface artefacts, the few cards that remain |
| `--surface-2` | `#EAE5DA` | Deeper paper behind artefact stages |
| `--surface-inverse` *(new)* | `oklch(0.15 0.005 80)` (= dark `--background`) | The inverse colour, for small unscoped uses (an inverse chip or tooltip). Emphasis bands use scope swapping instead, see 4.3 |
| `--on-inverse` *(new)* | `oklch(0.93 0.012 85)` (= dark `--foreground`) | Text on `--surface-inverse` |
| `--surface-glass` *(new)* | `color-mix(in oklab, var(--background) 62%, transparent)` | **Translucent** metadata, nav, overlays |
| `--glass-border` *(new)* | `rgb(20 20 20 / 0.08)` | Glass edge |
| `--border` | `rgb(20 20 20 / 0.13)` | Hairline rules |
| `--rule-strong` *(new)* | `rgb(20 20 20 / 0.28)` | Dashed system-layer outline |
| `--accent` / `--ring` | `#047857` (emerald-700) | The one accent; was emerald-600, which fails AA on paper |
| `--primary` | `var(--accent)` | |
| `--primary-foreground` | `#FFFFFF` | |
| `--secondary` | `#E4DED1` | |
| `--input` | `#FAF8F3` | |
| `--surface-hover` | `#E9E4D8` | Neutral hover fill |
| `--destructive` | unchanged | |

### 4.2 Dark (`.dark`)

| Token | Value |
|---|---|
| `--background` | `oklch(0.15 0.005 80)` |
| `--foreground` | `oklch(0.93 0.012 85)` |
| `--text-muted` | `oklch(0.70 0.012 85)` |
| `--surface-1` | `oklch(0.19 0.005 80)` |
| `--surface-2` | `oklch(0.12 0.004 80)` |
| `--surface-inverse` | `#F1EDE4` (= light `--background`) |
| `--on-inverse` | `#141414` (= light `--foreground`) |
| `--surface-glass` | `color-mix(in oklab, var(--background) 62%, transparent)` |
| `--glass-border` | `oklch(0.93 0.012 85 / 0.10)` |
| `--border` | `oklch(0.93 0.012 85 / 0.12)` |
| `--rule-strong` | `oklch(0.93 0.012 85 / 0.30)` |
| `--accent` / `--ring` | `oklch(0.765 0.163 163)` (emerald-400) |
| `--primary-foreground` | `oklch(0.11 0 0)` |
| `--surface-hover` | `oklch(0.215 0.005 80)` |

### 4.3 Emphasis bands use theme-scope swapping

An emphasis band does not restyle its children. It **swaps the token scope**: in light mode the band carries `.dark`; in dark mode it carries `.light`. Everything inside then renders with the opposite theme's tokens, accent included.

So that `dark:` utilities respect the nearest scope, the custom variant changes from `&:is(.dark *)` to:

```css
@custom-variant dark (&:where(.dark, .dark *):not(:where(.dark .light, .dark .light *)));
```

The band paints itself with **`bg-background text-foreground`**, which resolve inside the swapped scope, so a light-mode band is near-black and a dark-mode band is paper. It must **not** use `--surface-inverse`: on an element that also carries the scope class, that token resolves to the *opposite* of the intended colour. The `Section` variant that renders bands (sub-project 2) owns choosing `.dark` or `.light` from the current theme. Foundations provides the scope mechanism and a `.band` utility (`background: var(--background); color: var(--foreground)`) for the showcase reference.

### 4.4 Surface rules
- Four surface kinds only: **editorial** (`--background`), **elevated** (`--surface-1` + hairline, no resting shadow), **inverse** (emphasis), **glass** (`--surface-glass`).
- **If a surface holds primary content, it is not glass.** Glass is for metadata, nav, overlays, and context layers.
- `--shadow-sm` is removed. `--shadow-md` remains only for dialogs and popovers.
- The seven `.bg-canvas-*` utilities collapse to three: `.bg-canvas-default` (paper), `.bg-canvas-muted` (`--surface-2`), `.bg-canvas-inverse` (new). The others (`accent`, `raised`, `gallery`, `subtle`, `raised-muted`) are kept as aliases of the nearest of those three until their last consumer is migrated, then removed in sub-project 7.

## 5. Typography

Same `type-*` class names; values retuned. Bricolage weight drops from 700 to 600. Mobile value applies below 768px; desktop at ≥1024px; tablet interpolates via `clamp()`.

| Class | Face · weight | Size (mobile → desktop) | Line height | Tracking | Change |
|---|---|---|---|---|---|
| `type-display-hero` | Bricolage 600 | 40 → 72px | 1.02 | −0.025em | was up to 84px / 700 |
| `type-hero-internal` | Bricolage 600 | 36 → 56px | 1.05 | −0.02em | was 64 / 700 |
| `type-page-title` | Bricolage 600 | 32 → 48px | 1.08 | −0.015em | was 52 |
| `type-section-title` | Bricolage 600 | 30 → 44px | 1.06 | −0.018em | was 68 / 700 |
| `type-case-title` | Bricolage 560 | 24 → 30px | 1.2 | −0.01em | weight only |
| `type-subtitle` | Onest 600 | 20 → 22px | 1.28 | 0 | unchanged |
| `type-prose` | Onest 400 | 16 → 17px | 1.7 | 0 | max-width 64ch; was lh 1.8 |
| `type-section-intro` | Onest 400 | 16px | 1.6 | 0 | max-width 56ch |
| `type-card-title` / `type-list-title` | Onest 600 | 18 / 16px | 1.34 / 1.42 | 0 | unchanged |
| `type-card-body` | Onest 400 | 14px | 1.6 | 0 | was 13 / 1.85 |
| `type-meta` | Onest 500 | 12.5px | 1.5 | 0 | colour becomes `var(--text-muted)` (was ink at 42%, ≈3.2:1, fails AA) |
| `type-caption` | Onest 500 | 12px | 1.45 | 0 | was 11 |
| `type-mono` *(new)* | JetBrains Mono 500, uppercase | 10.5 → 11px | 1.4 | 0.08em | notation and data labels only |

**Rules carried over:** display face for structural headings only; Onest for card and list labels (the role-split rule); Caveat at most once per surface.
**Deprecated:** `shimmer-accent` (gradient text is banned by the brief). Kept until the hero stops using it in sub-project 3.

## 6. Grid, spacing, radius, borders

### 6.1 Grid

| Breakpoint | `--grid-cols` | `--grid-gutter` | `--page-margin` |
|---|---|---|---|
| < 768px | 4 | 16px | 20px |
| 768–1023px | 8 | 20px | 32px |
| 1024–1279px | 12 | 20px | 40px |
| ≥ 1280px | 12 | 24px | 48px |

`--page-max: 1320px` (content width, excluding margins).

Utilities:
- `.page-container` — `width: 100%; max-width: calc(var(--page-max) + 2 * var(--page-margin)); margin-inline: auto; padding-inline: var(--page-margin)`.
- `.grid-page` — `display: grid; grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr)); column-gap: var(--grid-gutter)`.
- Placements:

| Class | < 768 | 768–1023 | ≥ 1024 |
|---|---|---|---|
| `.place-full` | 1 / -1 | 1 / -1 | 1 / -1 |
| `.place-wide` | 1 / -1 | 1 / -1 | 2 / -1 |
| `.place-text` | 1 / -1 | 2 / span 6 | 4 / span 7 |
| `.place-bleed` | breaks out of the container to the viewport edges: `width: 100vw; margin-inline: calc(50% - 50vw)` (relies on the existing `overflow-x: clip` on `<main>`) | | |

**Composition defaults:** section headers are asymmetric (title cols 1–7, intro cols 8–12, aligned to the title's baseline). On mobile, offsets become indent steps (metadata starts at col 2 or 3 of 4) rather than full stacking.

### 6.2 Spacing
`--space-1` … `--space-11` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160px.
Section densities (vertical padding, mobile → ≥1024px):
- `.section-dense` — 64 → 96px
- `.section-quiet` — 96 → 160px

### 6.3 Radius

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 2px | Tags, chips |
| `--radius-sm` | 3px | Buttons, inputs, inset bands |
| `--radius-md` | 6px | Artefacts, media, remaining cards |
| `--radius-lg` | 10px | Dialogs only |

Full-bleed blocks and emphasis bands are square. `rounded-full` is reserved for dots, avatars, and slider handles. `--radius` (used by shadcn `rounded-lg`) maps to `--radius-md`.

### 6.4 Borders
Rules, not boxes: lists and indexes are rows separated by `--border` hairlines. Bordered containers are reserved for artefacts. Dashed `--rule-strong` is reserved for the system layer.

## 7. Motion

Tokens in `globals.css`, mirrored in a new `lib/motion.ts` for Framer Motion:

| CSS | `lib/motion.ts` | Value | Use |
|---|---|---|---|
| `--dur-1` | `DUR.feedback` | 200ms | Hover, focus, press |
| `--dur-2` | `DUR.ui` | 400ms | Nav opacity, dialogs, tabs |
| `--dur-3` | `DUR.reveal` | 600ms | Text, image, and layer reveals |
| `--dur-4` | `DUR.hero` | 900ms | Hero entrance only |
| `--ease-out` | `EASE.out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances |
| `--ease-move` | `EASE.move` | `cubic-bezier(0.65, 0, 0.35, 1)` | Layers changing position |
| — | `STAGGER` | 0.06s, max 6 items | Staggered reveals |
| — | `REVEAL_Y` | 12px | Max reveal travel (was 16) |

**Rules**
- No springs, no bounce, no scroll-jacking.
- Parallax only on layers inside an artefact, ≤16px.
- Hover reveals information (an annotation, a metric); it never only scales.
- Reduced motion: reveals become opacity-only or none; parallax and staggers off. Every page must read completely with motion disabled. `MotionConfig reducedMotion="user"` stays.
- `lib/scroll.ts` uses `behavior: "auto"` when `prefers-reduced-motion: reduce`.

## 8. Layer language

Foundations ships the vocabulary as CSS utilities. The composed `LayeredArtefact` component is built in sub-project 5.

| Layer (bottom → top) | Utility | Treatment | Brief mapping |
|---|---|---|---|
| Interface | `.layer-interface` | `--surface-1`, `--radius-md`, 1px `--border` | Product |
| System | `.layer-system` | 1px dashed `--rule-strong`, `background: color-mix(in oklab, var(--surface-1) 18%, transparent)`, `--radius-md`; carries a `type-mono` "↳ SYSTEM" label | System |
| Annotation | `.marker`, `.marker-line` | 9px `--accent` dot with a 4px 18%-accent halo; 1px `--accent` leader line; numbered | Constraint / Decision callouts |
| Context | `.layer-glass` | `--surface-glass`, `backdrop-filter: blur(14px) saturate(1.1)`, 1px `--glass-border`, `--radius-md`. Fallback without `backdrop-filter` support: `--surface-1` at 92% | Metadata, Outcome |

**Rules**
- Fixed stacking order (interface < system < annotation < context).
- Layers overlap by grid offsets (e.g. +2 columns, +48px), never arbitrary positions.
- At most three layers visible at once.
- On mobile, layers offset vertically and stay overlapped.
- **The accent marks the decision**: the `↳ DECISION` label and its marker. Metrics stay in ink and gain emphasis through size.

## 9. Retirements in this sub-project

| Item | Action |
|---|---|
| `FancyCursor` | Unmount from `app/layout.tsx`. Component file kept until sub-project 7. |
| `SmoothScroll` (Lenis) | Unmount; delete `components/shared/smooth-scroll.tsx`; remove the `window.__lenis` branch and global type from `lib/scroll.ts`; uninstall `@studio-freight/lenis`. |
| `SiteBackground` | Unmount from layout. `HeroShaderGrid` / `ShaderGrid` stay in the repo (Lab and showcase use them). |
| `Grain` | Unmount from layout. |
| `ThemeFab` | **Kept** until sub-project 2 places the toggle in the nav, so the site always has a theme switch. |
| `defaultTheme="dark"` | Becomes `"light"`, and `enableSystem` (currently on) is **turned off**: first-time visitors see paper whatever their OS setting, because the editorial default is a decision, not an OS preference. A visitor's explicit toggle choice is still remembered. |

## 10. Documentation

- **DESIGN.md** is fully rewritten to this spec: the creative north star becomes "a premium editorial publication about product systems"; the One Voice rule stays; the True-Gray rule is replaced by the paper rule; it adds the surface, layer, notation (quiet), motion, and radius rules; signature interactions are retired.
- **PRODUCT.md** keeps Users, Purpose, Personality, and Accessibility; adds the positioning line ("I design scalable product systems by making better decisions under constraints"), the brief's core principle, and the brief's avoid-list merged into Anti-references; the IA section records the ten-section narrative order and the question each section answers.

## 11. Living reference

The `/showcase` "Foundations" tab is rebuilt to show tokens in both themes, the type scale, the spacing and radius scales, the four surfaces, the four layers composed together, and an emphasis band with scope swapping.

A dev-only `GridOverlay` (12/8/4 columns with gutters, semi-transparent accent) renders when the URL contains `?grid`. It is mounted in `app/layout.tsx` only when `process.env.NODE_ENV !== "production"`.

## 12. Verification

There is no test runner in the repo. Verification is:

1. **`npm run check:contrast`** *(new script, `scripts/check-contrast.mjs`, no dependencies)*. It parses the `:root` and `.dark` blocks of `app/globals.css` (hex, `rgb()`, and `oklch()`, compositing alpha over the relevant background; `color-mix()` and `var()` values are resolved only where they reference a single token, otherwise skipped) and fails if any pair below is under its threshold, in either theme:
   - `foreground` on `background`, `surface-1`, `surface-2` — 4.5
   - `text-muted` on `background`, `surface-1`, `surface-2` — 4.5
   - `accent` on `background`, `surface-1` — 4.5
   - `on-inverse` on `surface-inverse` — 4.5
   - the opposite theme's `accent` on this theme's `surface-inverse` (the accent inside an emphasis band) — 4.5
   - `primary-foreground` on `primary` — 4.5
   - `border` on `background` — reported only (hairlines are decorative)
2. `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass.
3. Browser check on `/showcase` (Foundations tab), `/`, and `/work/white-label-rfp`, at 375, 768, 1280, and 1440px, in light, dark, and reduced motion: no console errors, no horizontal scroll, and emphasis bands invert correctly. Screenshots attached to the PR.

Expected and accepted on this branch: components with hard-coded dark colours will look wrong on paper until their sub-project migrates them.

## 13. Open items

| Item | Owner |
|---|---|
| Correct career dates (DROR, Honasa, Mastercard, and what was part-time / during the degree) | Owner, before sub-project 3 |
