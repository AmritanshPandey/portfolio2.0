---
name: Amritansh Pandey — Portfolio
description: "Ledger": the portfolio as a settlement statement. Paper, ink, one ultramarine accent, a ruled 12-column sheet, and type that carries hierarchy through width.
colors:
  paper: "#F2F0EB"
  ink: "#111111"
  graphite: "#5C5A55"
  rule: "#D6D2C9"
  ultramarine: "#2B35E8"
  sheet: "#F8F7F3"
  night: "#101010"
  night-ink: "#ECEAE4"
  night-graphite: "#9A978F"
  night-rule: "#2B2A27"
  night-ultramarine: "#8C93FF"
typography:
  display:
    fontFamily: "Archivo (wdth 112–116), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 9.1vw, 9.5rem) hero · clamp(2.5rem, 6.4vw, 7rem) page"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  section:
    fontFamily: "Archivo (wdth 114)"
    fontSize: "clamp(2.125rem, 5.4vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Archivo (wdth 100)"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0"
    note: "sentence case, tabular figures, never uppercase-tracked"
rounded:
  default: "2–4px (near-square); product mockups keep their own radii via [data-keep-radius] or .fintech-system"
spacing:
  gutter: "clamp(20px, 4.2vw, 72px)"
  col-gap: "clamp(16px, 1.7vw, 28px)"
  container: "1560px"
  section-y: "clamp(96px, 11vw, 184px)"
motion:
  ease-settle: "cubic-bezier(0.2, 0.8, 0.2, 1)"
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  durations: "120 / 180 / 240 / 420 / 720 / 1000ms"
---

# Design System: Ledger

## 1. Concept

The portfolio is set like a settlement statement: every claim itemised, every
number aligned, every section opened by a rule. Precision is the personality.
It is payments-native without payments clichés (no cards, coins or gradients),
and it reads the way a hiring manager scans: references on the left, the line
item, the outcome.

Light paper is the default sheet; night is the same sheet inverted (toggle in
the nav). Tokens live in `app/globals.css` under "LEDGER · TOKENS".

## 2. Colour

- **Paper, ink, graphite, rule** carry everything. Contrast on paper: ink 16.6:1,
  graphite 6.1:1. Hairline rules (`--border`) are decoration, not text.
- **Ultramarine** is the only accent (6.6:1 on paper; `#8C93FF` on night). It
  marks one thing at a time: an active nav item, a hover answer, the full stop
  in the hero, a status mark. Never a fill for large areas, never a gradient.
- Product mockups (bank cards, the fintech kit, PlanR screens) may use their own
  palettes; they are someone else's interface.
- Stock gradient placeholders are rendered greyscale (system override in
  `globals.css`) until real screenshots replace them.

## 3. Type

- **Archivo** (variable, `wdth` axis) is the whole voice. Width carries the
  hierarchy: display sets expanded (`wdth` 112–116), reading text normal
  (`wdth` 100), and the phone hero condenses (`wdth` 88) so the rotating word
  always fits one line.
- **Martian Mono** sets references, dates, roles, captions and labels, always
  with tabular figures and in sentence case. Uppercase letter-spaced eyebrows
  are retired; a system override converts any legacy instance.
- Use the `type-*` classes (hero, page, section, case, card, prose, meta) rather
  than ad hoc sizes. No text below 11px (`npm run check:type`).

## 4. Layout

- `.ledger` is the sheet (container + gutters); `.ledger-grid` the 12 columns.
- Sections open with an ink rule (`.rule-ink`, drawn on entry), then the title
  hung left with its intro set against it on the right.
- Case-study reading columns start at column 4 (`.ledger-offset`, `CsSection`),
  leaving a left rail open. Lists are ruled line items, not card grids.
- Cards are rare: a raised sheet (`--surface-1`) only for specimens and mockups.

## 5. Motion

One idea, used everywhere it appears: **the settle**. Rules draw left to right,
then content lands a few pixels onto them (`data-settle`, driven by
`SettleObserver`). Transform and opacity only. The hero runs the same settle in
pure CSS on load and stays legible if the animation never runs.

The hero has one ambient layer, **the dot field** (`HeroField`): a fine screen
of tiny ink dots packed 8px apart, one even tone, filling the hero from the
hero rule down and fading out over its last 96px into the next section.
On a desktop pointer it becomes the **pixel wake** (`WakeField`, WebGL): the
cells the cursor passes turn into near-touching 7px square pixels, so the sheet
briefly reads as a pixel mosaic, and they step back down through three ink
levels to dots as the wake fades; a click sends a soft ring of ultramarine
pixels through the same grid. It draws only while something moves. It loads
only when the page is idle on a desktop pointer; phones, touch, iPads (even
with a trackpad), low battery, reduced motion, and any browser that can't hold
~36fps get the same dot screen as a static CSS texture, and never download the
shader.

The portrait sits in that screen (`HalftonePortrait`): on a desktop pointer the
photo is drawn as a halftone on the sheet's own 8px lattice (ink dots grown by
how dark the photo is, light dots on the night sheet), so the person is made of
the same dots as the page. The cursor's wake turns the cells it crosses into
square pixels of the photo's colour, fading back within a second; resting on
it develops the photo (cells flip in a ragged order, then the photo itself
fades in) and leaving returns it to dots. On load the photo dissolves into the
screen once. The real image stays in the page; phones, touch and reduced
motion see only it.

The gallery header has the other ambient layer, **the ASCII field**
(`GalleryAscii`): graphite glyphs in the site's mono drifting at 30fps, the
brightest clusters lighting up in ultramarine, hanging from the header rule
and dissolving below. It follows the dot field's rules (`lib/motion-budget.ts`):
a still frame on phones, iPads, low battery and reduced motion, and on phones
it keeps to the right edge, away from the text.

The footer has the third, **the sea** (`FooterSea`): swell lines of graphite
tildes in the mono running from a faded horizon down to the foot of the page,
closer together and calmer far away. Each line rises and falls with the water
under it and hides the swells behind it, with a face of fading full stops
below; the highest front crests glint ultramarine, a glyph or two at a time.
It is the same ASCII renderer as the gallery's (`AsciiFlowBackground`,
`shape="waves"`; geometry in `lib/ascii-sea.ts`), runs at 30fps only while on
screen in a visible tab, and costs about 1ms a frame at phone width (about
3ms on a wide desktop). Being that light, it is the one ambient layer that
also moves on phones and iPads
(`useAmbientStill("anywhere")`); reduced motion and a low battery get a still
frame, and plugging back in lets it move again.

Elsewhere motion is a response, not a performance: a gliding nav underline,
row hover that dims siblings and runs a specimen's mechanism, a 420ms
cross-dissolve between routes (View Transitions). Apart from these ambient
layers, nothing loops for attention. Ink rules are strings: on a desktop pointer, sweeping
across one catches it, bends it toward the pointer (18px at most), and it
slips free and rings flat in about a second, lit ultramarine by how hard it
was plucked (`RulePluck`, physics in `lib/pluck.ts`). Only pointer movement
plucks; scrolling a rule past the pointer never does.

Sound is opt-in and off by default. The wave-mark square beside the theme
toggle turns on one plucked note per release (synthesised, no audio files),
rising in pitch down the page, for the visit only (sessionStorage). It is only
offered where rules can be plucked. Every animation has a `prefers-reduced-motion`
path (the settle never arms, hero animations are off, the dot field is static,
Framer Motion is globally skipped).

## 6. Controls

- `.btn-ink` (solid ink rectangle, ultramarine on hover) for the one primary
  action; `.btn-line` (ruled outline on glass, inverts on hover) for secondary.
- Text links use `.link-underline` (hairline that thickens and turns ultramarine).
- Filters are mono text buttons with an ultramarine underline when active.
- Glass (`.glass`) only for the layer that floats over content: the nav bars,
  the phone menu button and `.btn-line`. The page's own paper at 76%, blurring
  what passes under it, with a bright 1px top edge (`--glass-edge`; the nav's
  toggles carry the edge alone, `.glass-edge`). No refraction. Solid where the
  browser can't blur or the reader asks for reduced transparency.
- Glass plates (`.glass-plate`, `<GlassPlate>`) are the one place content goes
  glass: the hero's intro, so the dot grid frosts under the text
  instead of running through it. Paper at 55%, a 10px blur, a light rim, a faint
  inner shade, an outer hairline and a specular sheen across the top-left;
  Ledger's 4px corners, no drop shadow. On Chromium with a desktop pointer the
  rim bends what passes under it (an SVG lens as the backdrop-filter: bent and
  nearly sharp at the rim, frosted in the middle); elsewhere the plate is the
  plain CSS glass. The glass is alive on a desktop pointer: a soft highlight
  follows the pointer across it and its rim brightens nearest the pointer
  (`--px`, `--py`, `--glass-hot`); with reduced motion it stays still. On wide
  screens the plate spans the rest of the row and matches the photo's height
  (`.hero-intro`), the intro hanging from the photo's top and the actions level
  with its foot. Cards, sections and the primary action never go glass.
- No pills, no drop shadows (a system override removes arbitrary shadows
  outside mockups).

## 7. Focus

Owner decision (2026-10): do not add or extend keyboard focus-ring styling.
Existing focus styles stay as they are.

## 8. Signature details

Square ultramarine home mark; half-filled square theme toggle; wave-mark
square sound toggle; pluckable ink rules; square cursor with a mono label; ink-thumb scrollbar; ultramarine text selection; ink sheet
favicon with an ultramarine mark; a ruled 404 in the same voice as the site.
