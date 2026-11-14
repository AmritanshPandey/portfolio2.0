# Study template: immersive, consistent case studies and explorations

Date: 2026-11-14 · Status: awaiting owner review · Reference: metalab.com/work/uber

## Goal

Every case study and exploration reads as one publication: the same hero, the same chapter order,
big media between short text, a project switcher, a place tracker and a next-study ending. Today
the five case studies are hand-built pages (580 to 920 lines) with different chrome; Agent Pay has
no chapter rail or short version; three explorations are 23-line `ContentPage` stubs.

Owner decisions (2026-11-14): approach A, one shared shell plus a few blocks; scope is the five
case studies and five explorations; the fintech system keeps its own layout but gets the switcher
and ending; empty media slots are "honest slots", never gradients.

Ledger rules (DESIGN.md) and the redesign non-negotiables (REDESIGN.md §2) still apply.

## 1. Navigation layer (every study page, no per-page work)

**Index switcher (`StudyIndex`)**
- Desktop: a fixed mono strip at the bottom of the screen: `01 PartnerBank · 02 Agent Pay · … · All work`.
  The current study is in ink with an ultramarine square; the rest are graphite. Hovering one shows its
  public problem line (`WorkItem.description`) above the strip.
- Explorations follow after a hairline, labelled "Self-directed".
- It appears after the hero scrolls out and steps aside when the ending is in view.
- Phones: one line, `02 / 05 · Agent Pay`, which opens a ruled sheet listing everything. It respects
  safe areas and never covers the ending or the footer.
- Order comes from `SEQUENCE` in `lib/data/work.ts` (and the explorations data), so it matches the home page.
- Once the Phase 2 gate exists, private studies show a lock mark and link to `/unlock`.

**Place tracker (`StudyTracker`, replaces `CsChapterNav`)**
- Built from the page's `StudyChapter`s at runtime (`[data-chapter]`), with no hand-kept list.
- Desktop: the left tick rail, naming only the chapter in view (`03 · The silent guardian`).
- Phones: a hairline progress rule under the floating nav with the current chapter's name; tapping
  it opens the chapter list.
- No chapter is active above the first (fixes REDESIGN F10).

**Ending (`StudyNext`, replaces `CsNextStudies`)**
- The next study's title at hero size, its work-row specimen and byline. The whole block is one link,
  and the last study wraps to the first.
- It reuses the `case-${slug}` ViewTransition, so the specimen grows into the next hero.
- Under it: "All work" and the email address.

Plain links throughout, so everything works before hydration and by keyboard. One
`IntersectionObserver` for chapters; no new scroll listeners. No sound on navigation.

## 2. Page template

**`StudyLayout`** wraps a page and renders `StudyIndex`, `StudyTracker` and `StudyNext`. A page
supplies its hero data and its chapters.

**Hero (`StudyHero`, grows out of `CsHeroShell`)**
- The keyword line and drawn rule, then the title at hero size.
- A one-row facts strip: Role · Scope · Year · Status, where Status is `CsProvenance`.
- The lead media full-bleed beneath it, replacing the half-width side column.

**Introduction**
- The lede as one large statement sentence with an "Introduction" label, then `CsSummary`.

**Chapters (`StudyChapter`, replaces `CsSection`)**
- A mono reference and label, a title, then the body. Each registers with the tracker. One chapter per
  study may use the ink band.
- Fixed order; a study may drop a chapter but not reorder them:
  - Case studies: Problem → Context and research → The idea → Key decisions → What I built → Impact → Reflection.
  - Explorations: The question → What I tried → What I built → What I learned.

**Media (`StudyMedia`)**
- Widths: `bleed` (edge to edge), `wide` (the sheet), `inset` (a column beside text). A mono caption sits under it.
- Content: an image (`next/image` with `sizes`), a coded piece passed as children (Agent Pay's curve,
  the fold phone, PartnerBank's brand skins, coded recreations), or an honest slot.
- **Honest slot:** a flat `--surface-1` block with a hairline and a mono label ("Media to come ·
  Configured demo, PartnerBank"). It is visible where `NEXT_PUBLIC_DEPLOY_ENV !== "production"`, the
  same rule as `<AddLater>` (`components/shared/add-later.tsx`), and renders nothing in production.
  Spacing lives on the parent, so a removed slot leaves no gap. Never a gradient or stock image.

**Blocks that stay:** `CsDecision`, `CsSummary`, `CsProvenance`, `CsOptions`, ruled lists. Card-grid
blocks flagged by `check:ledger` (S3) are retired as pages migrate.

## 3. Motion

- Chapters: the rule draws, then the title rises from its slot (`data-settle="title"`).
- Media: a clip opening from the bottom on first entry; bleed media also settles from 1.03 to 1 scale.
- No scroll-linked parallax. Transform, opacity and clip only. Framer is allowed on these pages.
- Reduced motion: everything at rest.
- Paper stays the default theme; immersion comes from scale and rhythm, not a forced dark mode.

## 4. Rollout (one PR each)

1. The navigation layer and `StudyLayout` on existing pages, so every page gains the switcher, tracker
   and ending at once.
2. Agent Pay migrated onto the full template (after PR #58, its Ledger rebuild, is merged).
3. PartnerBank, Dror, Honasa and Email Builder, one per PR. This absorbs REDESIGN Phase 4.
4. The explorations: PlanR, then the four smaller ones, with honest slots where imagery is missing.
5. The fintech system: switcher and ending only.

Out of scope: the legacy `/work/[slug]` JSON renderer (the hand-built routes take precedence over it).

## 5. Testing

- New e2e: the switcher lists studies in `SEQUENCE` order and marks the current one; the ending links
  to the next study and wraps; the tracker names the chapter in view, with none above the first; a
  production build contains no honest slots.
- Per migrated page: zero `check:ledger` S1 to S7 hits; snapshots in light and dark at 1440 and 390;
  mobile Lighthouse ≥ 85 and no lower than before; CLS 0.
- The existing case-study and motion specs keep passing against the baseline failure list.
