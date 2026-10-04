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
  emerald: "#037452"
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
| `--accent` | `#037452` | `oklch(0.765 0.163 163)` | The one accent (one notch deeper than emerald-700 so it clears AA on every light surface) |
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

The layer classes live in `@layer components`, so Tailwind utilities on the same element (`hidden`, `p-*`, `rounded-*`) always win.

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
