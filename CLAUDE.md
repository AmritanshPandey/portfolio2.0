# CLAUDE.md — Amritansh Pandey portfolio

Personal portfolio. Goal: convert hiring managers, founders and design peers into conversations about senior product roles. Read `PRODUCT.md` (audience, brand, anti-references) and `DESIGN.md` (tokens, type scale, component rules) before UI work.

## Stack
Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Framer Motion, Lenis, next-themes (dark default), shadcn/radix, Recharts, WebGL shader backgrounds. Static site, no backend/DB. Analytics only when `VERCEL === "1"`.

## Commands
```bash
npm run dev      # http://localhost:3000
npm run build    # production build; the pre-deploy check
npm run lint
npx tsc --noEmit
```
`npm run dev:preview` uses `NEXT_DIST_DIR=.next-preview` so a second dev server can run alongside.

## Architecture
- `app/layout.tsx`: fonts, theme, smooth scroll, cursor, shader background, skip link, `<main id="main-content">`.
- `app/page.tsx`: home = Hero, Work, Explorations, Approach, Insights, Trajectory, Advisory (`components/sections/*`).
- Content is typed data in `lib/data/*.ts` (articles, work, explorations, about, systems).
- Case studies: `/work/[slug]` reads `data/case-studies/<slug>.json` at build time into `components/case-study/case-study-renderer.tsx`, which picks from ~40 `cs-*` block components. Five case studies also have hand-built routes under `app/work/`.
- Shared UI: `components/shared` (motion, shaders, cursor, cards, CTAs), `components/ui` (primitives, flow diagram, charts).

## Conventions
- Career facts (dates, titles, "6+ years") must match the LinkedIn export. Write "DROR Labs (later Lythouse)". Never invent tenure numbers.
- No `transition-all`; list properties explicitly. Honour `prefers-reduced-motion`.
- Do not add or change keyboard focus-ring styling; it hurts the aesthetic. Other a11y fixes (labels, headings, contrast, landmarks) are welcome.
- Avoid the AI-template look: identical icon-card grids, tracked uppercase eyebrows everywhere, gradient text.
- Framer reveals write `opacity:0` into SSR HTML; a `.js` class plus CSS fallback and `SettleGuard` keep content visible. Scan for contrast only after content has scrolled in.

## Gotchas
- No tests. `@playwright/test` is installed but unused.
- `data/casestudy/` (agent-commerce, honasa, white-label-rfp) and `data/case-studies/` (d2c-platform) both exist; the loader only reads `case-studies/`.
- `components/sections/growth/growth-chart.tsx` appears unused.
- `PRODUCT.md` says "7 years"; the canonical claim is "6+ years".
