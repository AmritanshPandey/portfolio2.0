# Gotchas
- Framer reveals ship `opacity:0` in SSR HTML; `.js` class + CSS fallback + `SettleGuard` guard against stuck content. Contrast scanners flag mid-fade text; scan after scroll.
- Two case-study data folders (`casestudy/` vs `case-studies/`); loader reads only the latter.
- `growth-chart.tsx` unused. `PRODUCT.md` "7 years" is stale vs canonical "6+ years".
- Port 3000 may be held by another session's dev server (stale CSS seen); verify with `npm run build`.
- No test suite yet.
