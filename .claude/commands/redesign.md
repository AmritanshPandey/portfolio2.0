---
description: Run one phase of the portfolio redesign (docs/redesign/REDESIGN.md) with its verification loop
argument-hint: <phase number, 0-7>
---

You are running **Phase $ARGUMENTS** of the portfolio redesign.

1. **Read first**, in this order: `docs/redesign/REDESIGN.md`, `docs/redesign/DECISIONS.md`,
   `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`, and the "Confidential content" section of `README.md`.
   REDESIGN.md wins on scope and order, DESIGN.md on visual rules, DECISIONS.md on anything the
   owner has answered. Never take visual direction from `AUDIT.md` or `.impeccable/design.json`.

2. **Restate the phase**: find "Phase $ARGUMENTS" in REDESIGN.md section 6 and summarise its goal,
   steps and acceptance criteria in under ten lines. List the decisions it needs (D-numbers).
   If any of them is still open in DECISIONS.md, ask me now with the options from section 5,
   record my answer in DECISIONS.md with today's date, and only then continue.

3. **Branch**: `git switch -c redesign/p$ARGUMENTS-<short-slug>` from an up-to-date `main`.

4. **Baseline**: make sure the dev server is running (`npm run dev`), then
   `npm run snap -- --label p$ARGUMENTS-before --pages <pages this phase touches>`
   and `npm run check:ledger` (keep the output for the report).

5. **Do the phase.** Stay inside its steps. Small commits with plain messages. Reuse existing
   components and tokens before creating new ones.

6. **Verify** (REDESIGN.md section 8): `npm run check:ledger`, `npm run lint`, `npx tsc --noEmit`,
   `npm run test:unit`, `npm run test:e2e` for the touched areas, `npm run build`. Then
   `npm run snap -- --label p$ARGUMENTS-after --pages <same pages>`, open each before/after pair
   yourself and compare: what draws the eye first, Ledger rule breaks, both themes, phone width,
   anything empty, clipped or under 11px. Fix what you see before you report.

7. **Report** in this shape:
   - What changed (short bullets)
   - Frames to look at (paths, before and after)
   - Checks run and their results, including check:ledger counts before and after
   - What you couldn't verify
   - Open `<AddLater>` notes and decisions used
   - The next phase

Hard rules for every phase:

- Never invent or round up numbers, quotes, partners, events or outcomes. Unknown means `<AddLater>`.
- No Mastercard details beyond what the pages already say; no card-network names in mock UI.
- Don't touch keyboard focus-ring styling.
- No em dashes in visible copy; no words from the banned list in REDESIGN.md 2.5.
- Don't push or open a pull request until I ask.
