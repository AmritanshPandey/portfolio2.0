# Architecture summary
Static Next.js 16 portfolio; all routes prerender. Home composes `components/sections/*`; content lives in `lib/data/*.ts`. Case studies are JSON in `data/case-studies/` rendered by a ~40-block `cs-*` system; five also have hand-built routes. No backend, DB or API routes.
