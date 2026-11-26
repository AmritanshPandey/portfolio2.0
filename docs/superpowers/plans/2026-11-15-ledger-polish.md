# Ledger Polish Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eight small visual refinements to the home page that stay inside Ledger.

**Architecture:** Edits to existing section components and one data-free CSS-drawn fallback. No new dependencies, no new routes, no copy changes.

**Tech Stack:** Next.js 16, React 19, Tailwind v4.

**Spec:** `docs/superpowers/specs/2026-11-15-ledger-polish-design.md`

## Global Constraints

- Tokens only; ultramarine is the only accent; no gradients outside mockups.
- No `transition-all`; every transition has a `motion-reduce` path.
- No text under 11px; mono labels in sentence case (`ledger-label`).
- Do not touch focus-ring styling. No Framer Motion on the home page.
- Both themes, 1440 and 390.
- Work in the current checkout without switching branch or committing: another
  change is in progress here (`fold-phone.tsx`, `cs-feature.tsx`,
  `app/work/d2c-platform/page.tsx`); do not touch those files.

## Review Focus

- Touch devices never hover: the About photo must stay in colour there.
- Night theme: every new fill must come from tokens, not literals.
- Approach shuffle: the "out of place" accent on a numeral must survive the restyle.
- Desktop with reduced motion: the still phone must not fetch three.js.
- 390px: Advisory rows must not overflow or truncate names.

These are visual; each is checked in Task 9's screenshots, not by a unit test.

---

### Task 1: Footer icons in ink, calmer card stack
**Files:** `components/layout/footer/footer.tsx`, `components/sections/work/work-specimens.tsx` (`TokensSpecimen`)
- [ ] Remove the `brand` field and the inline `style={{ color: brand }}`; icons inherit the link colour.
- [ ] Card stack: resting scale `1.42` to `1.28`, add `saturate-[0.82]` to each card.

### Task 2: Section rhythm
**Files:** `app/page.tsx`, `components/sections/about/about.tsx`
- [ ] `space="tight"` on Work and Explorations; About's top padding from `* 1.3` to `var(--section-y)`.

### Task 3: Approach numerals
**Files:** `components/sections/thinking/approach-shuffle.tsx`
- [ ] Numeral span becomes `ledger-label` (mono, tabular), top-aligned to the title's cap height; keeps `text-accent` when `away`. Grid columns `2.5rem` / `md:3.5rem`.

### Task 4: Advisory as ruled rows
**Files:** `components/sections/about/mentorship.tsx`
- [ ] Replace `max-w-3xl` stack with `ledger-grid`: proof sentence and the ask in columns 1 to 4; mentees and engagements as two ruled lists in columns 6 to 12, each row a link: name, then company or role in graphite, then arrow. Split engagement titles on the first comma.

### Task 5: About photo
**Files:** `components/shared/photo-carousel.tsx`
- [ ] Images get `[@media(hover:hover)]:grayscale` and colour on the plate's hover, `transition-[opacity,filter]`, `motion-reduce:transition-none`.

### Task 6: Honasa specimen
**Files:** `components/sections/work/work-specimens.tsx` (`BackboneSpecimen`)
- [ ] Each storefront: name bar with a bag mark, a flat brand-tint banner with a bottle shape, two product tiles, bones for title and price, a brand-colour action. No gradients. Bones still light on `row-on` with the existing stagger.

### Task 7: Phone hero card and menu button
**Files:** `components/sections/hero/hero.tsx`, `components/layout/navigation/navbar.tsx`
- [ ] `figure`: `items-start` below `sm` (keeps `sm:items-stretch`).
- [ ] Menu button border `border-foreground` to `border-border`; bars 1.5px (`.menu-morph span` in `app/globals.css`).

### Task 8: Still phone
**Files:** `components/sections/hero/hero-phone.tsx`
- [ ] When `mode === "still"` or WebGL2 is missing, render a CSS-drawn phone (token colours, ruled rows on its screen) inside the same stage. No three.js import on that path.

### Task 9: Verify
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run check:ledger`, `npm run test:unit`.
- [ ] `node scripts/snap.mjs --label polish-after --pages home --frames 12`; compare with `snapshots/review-1115`.
- [ ] `npx playwright test e2e/hero-portrait.spec.ts e2e/glass.spec.ts e2e/motion.spec.ts`.
