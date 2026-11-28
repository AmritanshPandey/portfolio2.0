# Study structure: short, visual, repeatable

Date: 2026-11-27 · Status: proposed, piloted on PartnerBank (`/work/white-label-rfp`)
Builds on: `2026-11-14-study-template-design.md` (the navigation layer shipped in #67).

## Why

The five hand-built studies run 9 to 12 sections each and say most things three times: "What I
Led", "Key Decisions", "Inside the System" and "The Shift" repeat the same story. The blocks they
use (`CsDecision`, `CsOptions`, `CsArchStack`, `CsPrinciples`, `CsBeforeAfter`, `CsFeature`) are
rounded cards with uppercase-tracked labels, glows and rose accents, so the case studies are where
most `check:ledger` drift lives. A hiring manager wants the call, the screen and the outcome.

## The structure

A hero, the short version, then six chapters in a fixed order. A study may drop a chapter; it
never reorders them. Every chapter is one title, at most two sentences, and one visual.

| # | Chapter | What it answers | The visual |
|---|---------|-----------------|------------|
| · | Hero | What, for whom, my role | Title, one-sentence lede, a facts table (role, organisation, timeline, team, scope: the old info bar and meta merged), provenance marks, and the home work-row specimen (the page-transition target) |
| · | The short version | The 30-second read | `CsSummary`: problem, my role, outcome |
| 01 | Problem | What was broken | One drawing of the problem, beside the words (`aside`) |
| 02 | The call (ink band) | The decision the study turned on | `StudyOptions` (considered vs chosen) and the idea drawn: layers, a curve, a pivot |
| 03 | The work | What I made | The UI, as large as the sheet: device scenes, coded recreations, the brand-skin slider. Captions only |
| 04 | Decisions | The other calls | `StudyCalls`: one ruled row each, the call, what it cost, what it changed (three at most) |
| 05 | Impact | What changed | `StudyFigures` (two or three big numbers) and one before/after `StudyBars` |
| 06 | Reflection | What I learned | The lesson as the title, then what I'd do differently and what's still open |

Then the existing `StudyNext` ending.

**Budgets:** at most ~60 words of prose per chapter outside the visuals; one ink band per study;
three calls at most; no section exists only to restate another.

## The blocks (`components/study/`)

- `StudyChapter`: rail reference and label, title and lede in the reading column, the visual on
  the whole sheet below or (`aside`) beside the words. Registers with the place tracker.
- `StudyFigure`: a visual and its mono caption, `wide` or `column`.
- `StudyOptions`, `StudyLayers`, `StudyCalls`, `StudyFigures`, `StudyBars`, `StudyReflection`,
  `StudyFanout` (one source feeding several outputs, `before` dashed or `after` in brand colours).

All are server components on the settle (`data-settle`), so reduced motion just shows them at
rest; no Framer, no new listeners. Ruled rows, 3px corners, one accent mark at a time.

## Per study (what each chapter shows)

| Study | 01 Problem | 02 The call | 03 The work | 05 Impact |
|-------|------------|-------------|-------------|-----------|
| PartnerBank | Template fanning out to banks by hand | Rigid vs modular; four-layer stack; config fan-out | Brand-skin slider | ~10 → ~3 days; 8 → 31 components |
| Agent Pay | The three problem layers | Silent guardian: anxiety curve and the seven stages | Live demo phone; iPhone Duo unfold; the three senses | The statement |
| Honasa | Marketplaces holding the data | Three storefronts vs one backbone; the layers | iPhone PDP, Duo cart, MacBook checkout; three brand cards | 8 → 3 weeks onboarding |
| Dror | Two forcing functions, three acts | The pivot: consumer vs B2B, and the validation | The SOS app, the manager dashboard | Revenue chart and lifetime figures |
| Email Builder | Client compatibility grid, Outlook table | Agency vs templates vs components; the four levels | HTML before, builder after | 50+, 28, zero HTML |

Facts and figures are copied, never rewritten: every number on a page already appears in that
study today. Stock gradient placeholders (`white-label-platform.jpg`, `skincare-planner.jpg`,
`execution-system.jpg`) are dropped rather than captioned.

## Out of scope

The JSON `/work/[slug]` renderer (every slug it serves has a hand-built route); the explorations;
real Honasa screens (the device scenes keep their placeholder screens until the owner supplies
some).
