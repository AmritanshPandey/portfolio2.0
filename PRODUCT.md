# Product

## Register

brand

## Positioning

**I design scalable product systems by making better decisions under constraints.**

The portfolio presents a senior product/UX designer who thinks in systems, not a visual designer showcasing UI screens. It communicates **clarity over decoration, systems over screens, decisions over UI**, and should leave the visitor thinking: *this person knows how to make complex things understandable.*

## Users

**Primary — hiring managers & recruiters** (fintech, product, design) evaluating Amritansh for a senior product role. They arrive on a referral or a link, scan fast (often between other tabs), and need to decide "is this person senior and interesting enough to talk to?" within a minute, then go deeper into specific case studies.

**Product & design peers** who judge craft and taste. The audience most sensitive to AI-slop and template design — they notice the details and decide whether the work is respectable.

**Founders & startup teams** who might hire Amritansh to build or advise. They care about range and proven shipping ability across the full product lifecycle.

The shared job to be done: quickly grasp seniority, range, and impact, then dig into the work that proves it.

## Product Purpose

A personal portfolio for Amritansh Pandey — Senior UX Designer · Front-end Developer at Mastercard, 6+ years building products end to end. It exists to convert qualified visitors into conversations about senior product roles by demonstrating depth (PartnerBank demo systems, the Email Builder, the React demo the CPO used at Money20/20), range (work, explorations, systems, and writing), and a distinctive point of view. Success is a hiring manager or founder reaching out — or a peer remembering the site.

Career facts (dates, titles, years of experience) must match the LinkedIn profile, which recruiters cross-check. "6+ years" counts full-time work from May 2020.

## Brand Personality

**Confident, warm, senior.** Assured without bragging; plain-spoken and story-driven; lets the work and its outcomes carry the weight. A visitor should feel they're meeting a thoughtful, high-level practitioner they'd want on their team — credible but approachable, never cold, salesy, or self-promoting.

## Information architecture

The home page tells one narrative, and each section answers a different question. No section repeats another's message.

| Section | Question it answers |
|---|---|
| Hero | Who am I? |
| Work | Can I deliver outcomes? |
| Systems | Do I think beyond screens? |
| Approach | How do I build? |
| Thinking | How do I make decisions? |
| Insights | Can I articulate ideas? |
| Explorations | Do I experiment? |
| Leadership | Can I influence outcomes? |
| Advisory | Am I trusted? |
| About | Who am I as a person? |

Navigation: Work / Systems / Thinking / Explorations / About, plus Gallery and Lab.

Case studies read as editorial product investigations, ordered **Context → Constraint → Decision → System → Outcome**, using artefacts as evidence.

## Anti-references

What this must NOT look like:

- **Generic AI-template look** — display-serif headings + tiny uppercase tracked eyebrows on every section + identical icon-card grids + gradient text.
- **Trend-checklist portfolios** — generic glassmorphism, generic bento grid, Apple clone, Linear clone, generic brutalism, Web3, neon cyberpunk, excessive 3D, excessive gradients, excessive rounded cards, dashboard-like UI, Dribbble-style screen galleries.
- **Corporate / enterprise stiffness** — safe navy-and-gray, stock photography, vendor-deck soullessness. Reads as a company, not a person.
- **Flashy dev-portfolio** — particle backgrounds, neon, over-animation, cursor gimmicks, scroll-jacking, gimmicks that distract from the work.
- **Minimal to the point of bland** — restraint with no POV; so quiet it becomes invisible and forgettable.

## Design Principles

1. **Clarity over decoration. Systems over screens. Decisions over UI.** The design itself should demonstrate that complex things can be made understandable.
2. **Proof over claims.** Lead with shipped outcomes before adjectives. Every visual communicates something; nothing is there because it looks good.
3. **Senior calm, with a POV.** Confidence reads through editing and restraint, not volume or effects — but restraint must still take a position. Quiet is not the same as bland.
4. **Human in the loop.** Keep a personal, warm voice throughout. The visitor is meeting a person, not a brand deck.
5. **Distinctive by default.** Awwwards-level comes from composition, typography, interaction, and storytelling, not effects. If the page could belong to any product designer, rework it until it couldn't.
6. **Respect the fast scanner.** The first fold must convey seniority and range in seconds, with depth one click away.

## Accessibility & Inclusion

Target **WCAG AA**: body text ≥4.5:1 (enforced for every token pair by `npm run check:contrast`), large text ≥3:1, visible keyboard focus states, and a `prefers-reduced-motion` alternative for every animation (Framer Motion's `reducedMotion="user"` plus CSS fallbacks). The site defaults to the light editorial theme with a dark-mode toggle — contrast and legibility must hold in both, including inside emphasis bands. Glass falls back to solid surfaces under `prefers-reduced-transparency`.
