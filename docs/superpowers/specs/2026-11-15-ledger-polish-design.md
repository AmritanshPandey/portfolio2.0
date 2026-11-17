# Ledger polish pass (home page)

Approved by the owner in chat on 2026-11-15 ("Yes, all eight").

## Intent

Make the home page read as award-level craft without redesigning it. Ledger
(DESIGN.md) stays the spec; this pass removes the places where the page
breaks its own rules or looks unfinished.

## Goals

1. Footer social icons in ink; PartnerBank card stack calmed.
2. Tighten the empty paper before Work, Explorations and About.
3. Approach numerals small, in the mono, so step titles lead.
4. Advisory set as ruled line items across the full sheet.
5. About photo greyscale, settling to colour on hover.
6. Honasa specimen drawn as a real storefront in three brand tints.
7. Phone hero card: name aligned to the photo's top; lighter menu button.
8. Hero right column: a still phone where the 3D phone does not run.

## Non-goals

Hero statement, glass card, nav structure, work-row grammar, footer sea,
focus rings, copy, case-study pages. No new dependencies, no Framer Motion on
the home page.

## Anti-goals

New accent colours, gradients outside mockups, looping motion, card grids,
uppercase tracked eyebrows, invented facts.

## Approaches

- **Polish inside Ledger (picked).** Eight small edits to existing components
  and CSS. Keeps everything the owner has already decided.
- **Add a signature moment (page intro, scroll-driven set piece).** More
  "award site", but it is the flashy-portfolio anti-reference and adds motion
  cost on the home page.
- **Rework section layouts.** Would fix Advisory and Approach more deeply, but
  the owner said not to redesign.

## Constraints

Transform and opacity only; a reduced-motion path for anything that moves; no
`transition-all`; tokens only; no text under 11px; both themes; 1440 and 390.

## Left to the builder

Exact spacing values, the storefront drawing, the still-phone asset (rendered
from what the repo already has), and how the card stack is calmed.

## Verification

`npm run lint`, `npx tsc --noEmit`, `npm run check:ledger`, and before/after
frames from `npm run snap` for the home page.
