---
name: Amritansh Pandey — Portfolio
description: A dark-default, warm-editorial portfolio with a single emerald accent and confident, tactile interaction.
colors:
  emerald: "#059669"
  emerald-deep: "#047857"
  emerald-soft: "#34d399"
  bg: "oklch(0.14 0 0)"
  surface: "oklch(0.18 0 0)"
  ink: "oklch(0.96 0 0)"
  muted: "oklch(0.60 0 0)"
  border: "oklch(1 0 0 / 0.10)"
  focus-ring: "oklch(0.765 0.163 163)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.16em"
  accent-script:
    fontFamily: "Caveat, cursive"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  sm: "3px"
  md: "12px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  section: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.emerald}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.emerald-deep}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.75rem"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
---

# Design System: Amritansh Pandey — Portfolio

## 1. Overview

**Creative North Star: "The Warm Studio"**

This is a senior practitioner's workspace after hours: the room is dark, the focus is total, and one steady light pools on the work. The system defaults to a near-black canvas (`oklch(0.14 0 0)`) so the content, case studies, writing, and demos, reads as the lit subject, never the decoration. A single emerald accent carries every moment of intent; everything else is a disciplined neutral ramp. The voice is confident and human at once: assured enough to stay quiet, warm enough to feel like a person and not a vendor.

Warmth here is carried by the generous type and the tactile interaction, not by a beige body background. The neutrals are true grays (chroma 0); the one emerald signal and the way things respond to you do the rest. Motion is restrained and intentional: a slide-in navbar, fade-up reveals on a single confident easing curve, a magnetic pull on the primary CTA, and a bespoke cursor that replaces the system one on fine-pointer devices. Nothing bounces, nothing loops for attention.

The system explicitly rejects the four things the brand must never be: the generic AI-template look (display-serif headings, a tiny uppercase eyebrow on every section, identical icon-card grids, gradient text), corporate-enterprise stiffness (safe navy-and-gray, stock photography, vendor-deck soullessness), the flashy dev-portfolio (particle fields, neon, gratuitous animation), and minimal-to-the-point-of-bland (restraint with no point of view).

**Key Characteristics:**
- Dark-default canvas with a fully supported light mode; both built from the same OKLCH neutral ramp.
- One accent only: emerald. Used on ≤10% of any screen.
- Two families on a contrast axis. Bricolage Grotesque (variable, `opsz` on) carries every heading above ~22px; Onest carries body and UI below it. JetBrains Mono is reserved for small data labels, Caveat for the occasional handwritten aside.
- Confident, tactile interaction: magnetic CTA, custom cursor, soft lift on hover.
- Motion is intentional and accessible; every animation has a reduced-motion fallback.

## 2. Colors

A monochrome neutral ramp lit by a single emerald accent. Values are dark-mode canonical (the default theme); the light-mode equivalents are noted where they differ.

### Primary
- **Emerald** (`#059669` light / `#34d399` dark): The one raised voice. Primary CTAs, active navigation, links, focus accents, hero gradient anchors. The color the visitor learns to read as "act here." Light mode uses emerald-600 so white labels hold ≥4.5:1; dark mode uses emerald-400 so the accent holds ≥4.5:1 on the near-black canvas.
- **Emerald Deep** (`#047857`): Hover and pressed states of any emerald surface; the darker anchor in gradients (paired down to `#064e3b`).
- **Emerald Soft** (`#34d399`): The highlight mid-point in the shimmer accent and accent gradient sweeps. A grace note, never a second accent.

### Neutral
- **Ink** (`oklch(0.96 0 0)`, dark / `oklch(0.18 0 0)`, light): Primary text and high-contrast foreground.
- **Muted** (`oklch(0.60 0 0)`, dark / `oklch(0.55 0 0)`, light): Secondary text, metadata, captions. Must still clear 4.5:1.
- **Surface** (`oklch(0.18 0 0)`, dark / `oklch(1 0 0)`, light): Cards, panels, raised containers, one step off the canvas.
- **Background** (`oklch(0.14 0 0)`, dark / `oklch(0.98 0 0)`, light): The page canvas. The lit room.
- **Border** (`oklch(1 0 0 / 0.10)`, dark / `oklch(0.90 0 0)`, light): Hairline structure. Borders do the dividing; shadows are kept quiet.
- **Focus Ring** (`oklch(0.765 0.163 163)`, dark / `oklch(0.609 0.152 161)`, light): A ring at the emerald hue, sibling to the accent. 2px, 3px offset.

### Named Rules
**The One Voice Rule.** Emerald is the only accent in the system. It appears on roughly 10% of any screen, the CTA, the active state, the one link that matters. Its rarity is the point. A second accent hue is forbidden; reach for weight, size, or a neutral step instead.

**The True-Gray Rule.** Neutrals stay at chroma 0. Warmth comes from type and interaction, never from a warm-tinted "cream" background; the accent stays emerald. If a surface starts to read as beige, it has drifted off-system.

## 3. Typography

**Display Font:** Bricolage Grotesque (variable, `opsz` axis on; with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Onest (with ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, "SF Mono", "Menlo")
**Accent Font:** Caveat (handwriting, for sparing personal marks)

**Character:** Two families on a contrast axis. Bricolage Grotesque carries the headings: a variable grotesque with slightly irregular terminals, engineered but warm, and an optical-size axis so letterforms open up small and tighten at display sizes. Onest carries body and UI, and is deliberately quiet so it never competes. Monospace appears only at small sizes for technical labels and metadata, which gives those moments a precise, engineered edge against the warm body.

### Hierarchy
- **Display** (700, `clamp(2rem, 5vw, 3.5rem)`, line-height 1.1, `-0.02em`): Hero and page titles. `text-wrap: balance` so headings never orphan a word.
- **Headline** (700, `clamp(1.75rem, 4vw, 2.1rem)`, 1.12, `-0.015em`): Section titles within long articles and case studies.
- **Title** (600, 1.25rem, 1.2): Card titles, sub-section heads.
- **Body** (400, 1rem, 1.7): Reading text. Capped at 65–75ch; `text-wrap: pretty` for an even rag.
- **Label** (600, 0.6875rem, `0.16em`, UPPERCASE, monospace): Eyebrows, metadata, tags, control labels. Short only (≤4 words).

### Named Rules
**The Role-Split Rule.** The display face is reserved for *structural headings* — prose hierarchy, h1 through h3, the `type-*-title` tiers. Labels that sit on a container (card titles, list titles, subgroup labels) stay in the body face, so a grid of cards never becomes a wall of display type. The split is by role, not by pixel size. (Per-article showcase faces, e.g. the typography essay, are page-scoped specimens and are not part of the system.)

**The Caveat-Sparingly Rule.** The handwriting accent is a personal grace note for at most one moment per surface. It is never a heading, never body, never a label.

## 4. Elevation

Flat by default, lifted only on intent. Depth comes first from the one-step tonal jump between background and surface, and from hairline borders; shadows are soft and reserved for genuinely raised or hovered elements. The system never uses a hard 2014-style drop shadow.

### Shadow Vocabulary
- **Soft Low** (`box-shadow: 0 4px 10px rgba(0,0,0,0.06)` light / `0 6px 14px rgba(0,0,0,0.35)` dark): Resting cards and surfaces (`.surface`).
- **Soft High** (`box-shadow: 0 12px 30px rgba(0,0,0,0.08)` light / `0 20px 40px rgba(0,0,0,0.45)` dark): Elevated panels, popovers (`.surface-elevated`).

### Named Rules
**The Lift-On-State Rule.** Content cards are flat at rest. They respond to the pointer with a neutral surface-fill (`--surface-hover`) and at most a 1–2px translate, not a heavier shadow. Movement signals interactivity; shadow weight is not the affordance.

## 5. Components

### Buttons
- **Shape:** Full pill (`rounded-4xl`, effectively `9999px`).
- **Primary:** Emerald fill (`#059669` light / `#34d399` dark), white label, magnetic hover (the CTA pulls slightly toward the cursor), `active:translate-y-px`. Used for the single most important action on a surface.
- **Hover / Focus:** Hover deepens toward Emerald Deep (`#047857`) / `bg-primary/80`; focus shows the emerald 2px ring at 3px offset.
- **Ghost / Outline:** Transparent or hairline-bordered, ink label, neutral fill on hover. For secondary and tertiary actions.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (16px) for content cards; `rounded-xl` (12px) for tighter UI blocks.
- **Background:** Surface (`oklch(0.18 0 0)`) one step off the canvas.
- **Shadow Strategy:** Flat at rest (see Elevation); neutral surface-fill on hover.
- **Border:** Hairline `oklch(1 0 0 / 0.10)`, often softened further to `/40` opacity.
- **Internal Padding:** 1.5–1.75rem.

### Inputs / Fields
- **Style:** Background drops to the canvas color inside a surface, hairline border, `rounded-md` (12px).
- **Focus:** Border shifts to emerald; the global emerald focus ring applies.
- **Label / Hint:** Label 12–13px medium; hint 11px muted.

### Navigation
- **Style:** A floating pill nav that slides in on mount (`navbar-enter`, `cubic-bezier(0.22,1,0.36,1)`). Monospace/short labels.
- **States:** Current item earns full ink + weight; the rest recede to muted. Hierarchy by state, not size.

### Signature: Custom Cursor
On fine-pointer devices the native cursor is hidden and replaced by a bespoke cursor (`FancyCursor`) that reacts to interactive targets (e.g. a "Read" label on article cards). It is a core part of the "confident & tactile" feel; touch and stylus keep their native cursors.

## 6. Do's and Don'ts

### Do:
- **Do** keep emerald to ~10% of any screen, one CTA, one active state, one link that matters (The One Voice Rule).
- **Do** build hierarchy from Bricolage Grotesque on structural headings and Onest on body, UI, and card labels; never apply the display face as a general texture.
- **Do** keep neutrals at chroma 0; let warmth come from type and interaction, and keep the accent emerald.
- **Do** hold WCAG AA: body ≥4.5:1, large text ≥3:1, the emerald 2px focus ring on every interactive element, and a `prefers-reduced-motion` fallback for every animation.
- **Do** keep surfaces flat at rest and lift on state with a neutral fill and a small translate.
- **Do** verify both themes: every choice must read in dark (default) and light.

### Don't:
- **Don't** ship the generic AI-template look: display-serif headings, a tiny uppercase tracked eyebrow above every section, identical icon-card grids, or gradient text. (The existing `shimmer-accent` is a deliberate, single-word exception, not a license to expand gradient text.)
- **Don't** drift into corporate-enterprise stiffness: safe navy-and-gray, stock photography, vendor-deck layouts.
- **Don't** build a flashy dev-portfolio: particle backgrounds, neon, looping motion that competes with the work.
- **Don't** be minimal to the point of bland: restraint must still carry a point of view.
- **Don't** introduce a second accent hue. Use weight, size, or a neutral step instead.
- **Don't** warm-tint the background toward cream/beige; the canvas stays true gray.
- **Don't** use heavy drop shadows as the affordance for interactivity; movement and fill signal it.
