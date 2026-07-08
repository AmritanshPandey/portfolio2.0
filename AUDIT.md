# Portfolio Audit — Phase 1

Date: 2026-07-04 · Branch: `redesign/product-portfolio` · Companion: `.impeccable/critique/2026-07-04T14-36-26Z__app-page-tsx.md` (scored 25/40, 3×P1, 2×P2)

## Verdict in one line

The foundation is strong and distinctive — dark-studio identity, emerald one-voice accent, editorial indexes, modular case-study system — but the site currently **makes a claim where it should show proof**, carries **IA ambiguity** (Exploration/Gallery/Playground), and has **one reachable failure mode** where a stalled animation ticker leaves content invisible.

## What exists (structure)

| Layer (target brief) | Current implementation | State |
|---|---|---|
| Home | `app/page.tsx` — hero, work index, explorations, approach, insights, advisory, about | Strong bones; hero copy is claim-shaped; no closing CTA; no trajectory narrative |
| Work / case studies | `app/work/*` + `components/case-study/*` (renderer + 20 modular blocks) | Rich modular system already ≈ brief §7; content depth varies per study |
| Lab / experiments | `/showcase` ("Playground") + `/showcase/*` sub-pages (chromatic lens, WebGL shader) + `/gallery` | Content exists; labelled as internal ("kitchen sink"), leaks lab framing into brand nav |
| Insights | `/articles` + 12 articles, 2 interactive (typography, color-system) | Editorial quality high; matches brief §10 already |
| About | Home section only (`components/sections/about`) | Warm + human; lacks career-trajectory narrative and leadership signal (brief §11/§13) |
| Resume / contact | Resume PDF in nav + footer email | No contact CTA at decision points; no closing CTA |

## Strengths to preserve (do not rebuild)

1. **Editorial work index** — outcome-led rows ("Cut demo prep from days to same-day"). Exactly the recruiter-scannable pattern brief §12 asks for.
2. **Insights reading list + interactive articles** — already evidence of "thinking in systems," no template smell.
3. **Case-study component system** — `CaseStudyRenderer` + cs-* blocks map ~1:1 onto brief §7 (hero/meta, principles, decisions, outcomes, next-study CTA). Extending beats rebuilding.
4. **Human layer** — polaroid + Caveat notes, "Off the clock," warm first-person voice (brief §11 "human" requirement).
5. **Design tokens + dual-theme discipline** — OKLCH neutrals, single emerald accent, AA-verified pairs.

## Weaknesses (ordered, from critique + code inspection)

1. **[P1] Reveal robustness.** Scroll-entrance tweens (`gsap.from` + ScrollTrigger) hide content from tween-creation until play; a stalled ticker (reproduced in automated Chrome; reachable via background-tab load/extension faults) leaves sections invisible with no fallback. Hero is already CSS-animated (safe); the GSAP layer needs a watchdog.
2. **[P1] First fold shows claims, not proof.** Money20/20 / Agent Pay / CPO-demo evidence no longer in the hero; positioning line is generic-adjacent; no availability signal; secondary CTA duplicates nav (Resume).
3. **[P1] IA ambiguity + status bug.** Exploration vs Gallery vs Playground unexplained; nav active-state shows "About" on load (scroll-spy measures before layout settles).
4. **[P2] Explorations band** — abstract non-brand gradient washes, numbered eyebrows, 2 cards + carousel arrows + empty third (detector-confirmed clipped child).
5. **[P2] Case-study micro-type** — recurring 11px body + 40–53-char all-caps runs (detector-confirmed).
6. **Drift** — 98 color literals outside tokens; body-level `transition: width`; footer second-accent glows (scoped, acceptable).

## Keep / rebuild decisions

- **Keep**: routes, case-study system, insights, gallery/showcase content, token system, footer.
- **Recast (this phase)**: hero copy + proof strip + CTAs; nav labels (Playground→Lab); closing CTA + trajectory band on home; GSAP watchdog; scroll-spy fix.
- **Rebuild (next phases)**: explorations band with real product artifacts; case-study content restructured to §7 narrative (Opportunity → Challenge → Role → Principles → Moments → Outcome → Reflection) using existing blocks; About page upgrade with timeline + "what I'm learning next"; per-study reading time + executive-summary mode.

## Technical audit notes

- Next 16 / React 19 / Tailwind 4; builds clean (36 routes, all static).
- `prefers-reduced-motion` honoured globally (CSS collapse + JS early-returns) — keep as the pattern for the watchdog.
- Safari: svh fallbacks, -webkit mask/text prefixes present; WebGL surfaces all have static fallbacks + DPR caps + off-screen pause.
- No invented metrics found in copy; proof lines (Money20/20, ₹1.98Cr, 50+ components) trace to existing data files — reuse only these.
