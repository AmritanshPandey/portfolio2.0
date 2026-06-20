import type { AdvisoryCard } from "./types"

/* ============================================================================
   ADVISORY — compact, honestly-labelled engagements.

   Roles are stated explicitly so nothing reads as a full-time position it
   wasn't. Covera and Yosn are ported from lib/data/about.ts; GetWork is a
   placeholder until real copy lands.
   ============================================================================ */

export const advisoryCards: AdvisoryCard[] = [
  {
    id: "getwork",
    title: "GetWork",
    role: "Fractional Product & Design Advisor",
    // TODO(amritansh): real summary — what you advised on and the outcome.
    summary:
      "TODO(amritansh): fractional advisory engagement — product direction and design guidance.",
    placeholder: true,
  },
  {
    id: "covera",
    title: "Covera",
    role: "Product & UX Advisor",
    summary:
      "Advised the founding team on product direction, customer experience, and the order of early roadmap bets.",
    logo: "/assets/images/logos/covera.jpeg",
    link: "https://lovecovera.com/",
  },
  {
    id: "yosn",
    title: "Yon Innovations",
    role: "Design & Tech Advisor",
    summary:
      "Guided product direction, technical choices, and brand positioning while the team shaped its first market-facing offer.",
    logo: "/assets/images/logos/yosn.png",
    link: "https://www.yosn.events/",
  },
]
