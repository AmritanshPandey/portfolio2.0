# Amritansh Pandey — Portfolio

Product-design portfolio built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind v4. Dark-default with full light-mode support; one emerald accent; motion honours `prefers-reduced-motion` throughout.

See [`AUDIT.md`](./AUDIT.md) for the design audit and the phased improvement plan, and [`DESIGN.md`](./DESIGN.md) for the design system (tokens, type scale, component rules).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also the pre-deploy check)
npm run lint
```

## Content structure

| Layer | Route(s) | Where the content lives |
|---|---|---|
| Home | `app/page.tsx` | Composes section components from `components/sections/*` |
| Selected Work | `app/work/<slug>/page.tsx` | One page per case study (self-contained data + layout) |
| Explorations / Systems | `app/explorations/*`, `app/systems/*` | Cards from `lib/data/explorations.ts`, `lib/data/systems.ts` |
| Insights | `app/articles/*` | Cards from `lib/data/articles.ts`; article bodies are per-route |
| Lab | `app/playground`, `app/showcase/*` | Interactive experiments (the "Lab" nav item) |
| Gallery | `app/gallery` | Visual/UI work wall |

Nav links and scroll-spy are defined in `components/layout/navigation/navbar.tsx` (`SECTION_LINKS`, `PAGE_LINKS`, `SECTION_IDS`). Add a new home section id to `SECTION_IDS` so the active-state highlight stays accurate.

## Add a new case study

1. Create `app/work/<slug>/page.tsx`. Copy an existing one (`app/work/agent-commerce/page.tsx` is the most complete) as the template.
2. It composes shared blocks from `components/case-study` — import from the barrel `@/components/case-study`:
   - `CsHeroShell` — hero: `breadcrumb`, `title`, `lede`, `keywords`, `meta` (role/scope/duration/team icon cards = the at-a-glance), `readTime`, `topics`, optional `aside` visual. Renders the top `ReadingProgress` bar automatically.
   - `CsSection` — a titled body section (use these in the §7 order: Opportunity → Challenge → Role → Principles → Key moments → Outcome → Reflection).
   - Content blocks: `CsDecision`, `CsFlow`, `CsTimeline`, `CsMetricBars`, `CsBeforeAfter`, `CsOutcomes`, `CsResults`, `CsInfoBar`, `CsList`, `CsImage`, `CsPhoneShowcase`, etc.
   - `CsNextStudies` — the "next project" CTA at the end.
3. Add a matching card to `lib/data/work.ts` (title, category, description, image, href, order, optional metric) so it appears in the home Work index.
4. Set `metadata` (title/description) in the page for the tab title and SEO.

## Add a Lab experiment

- Standalone interactive piece: add `app/showcase/<name>/page.tsx` and a client component under `components/showcase/`. Follow `components/showcase/chromatic-lens-hero.tsx` for the WebGL pattern (progressive enhancement: a real DOM fallback under the canvas, canvas fades in only once it has painted, `prefers-reduced-motion` skips the loop, DPR capped, paused off-screen).
- Image/component tiles: they surface on the `/playground` wall.

## Replace media

- Put assets in `public/assets/images/...` and reference by absolute path (`/assets/images/work/<name>.jpg`).
- Always use `next/image` with an explicit `sizes` prop (avoids layout shift and over-fetching). Prefer real screenshots over decorative fills; the design system treats product artifacts as the visual hero.
- Keep source images reasonably sized; Next serves responsive variants automatically.

## Maintain performance & robustness

- **No visibility gated on animation.** Entrance reveals must keep content readable if the animation never runs (throttled/backgrounded load). Hero lines slide a small non-clipping distance; `components/shared/settle-guard.tsx` is a failsafe that un-hides any stalled `opacity:0` reveal, and `html:not(.js)` in `app/globals.css` covers the no-JS case.
- **Reduced motion** has an alternative for every animation (`<MotionConfig reducedMotion="user">` for Framer, plus CSS `@media (prefers-reduced-motion: reduce)` collapses and JS early-returns).
- **WebGL/Canvas effects** must ship a static fallback, cap DPR, and pause off-screen (IntersectionObserver). Verify shader falloffs use increasing `smoothstep` edges (reversed edges are undefined in GLSL).
- **Safari/iOS:** use `svh` with a `vh` fallback for full-height, `-webkit-` prefixes on masks/backdrop-filter, and transform-only progress bars.
- Run `npm run build` before pushing; it type-checks and validates the production build. It does not by itself guarantee a route is static — if a page must prerender, check its entry in the build output's route table (`○` static vs `ƒ` dynamic).

## Confidential content — review before publishing

This site references real Mastercard work. Before deploying any change that touches case-study copy or imagery, confirm:

- **No confidential detail** — internal metrics, unreleased roadmap, client names, or non-public artifacts. Use anonymised examples and honest qualitative outcomes ("reduced reliance on external agency production") rather than invented numbers.
- **Individual vs. team contribution** is clearly distinguished; leadership language is not inflated.
- **Proof lines are real** — the checkable claims in the hero and case studies (e.g. Money20/20 demo, PartnerBank RFP demos) must trace to actual work. Do not invent metrics, research findings, or awards.

## Deploy

Deploys on [Vercel](https://vercel.com) from `main`; PR branches get preview URLs automatically.
