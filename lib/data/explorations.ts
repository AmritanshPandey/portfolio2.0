import type { ExplorationItem } from "@/lib/types/content"

// Grid is 5 columns. Each row must sum to 5 (e.g. col-span-3 + col-span-2).
export const explorationItems: ExplorationItem[] = [
  {
    title: "Sneakers Commerce System",
    description:
      "Explores scarcity, drop mechanics, and behavioral triggers in hype-driven commerce systems.",
    image: "/assets/images/work/sneaker-commerce.jpg",
    href: "/explorations/sneakers-commerce",
    tags: ["Commerce", "Behavior", "Systems"],
    span: "md:col-span-3",
    status: "Concept",
  },
  {
    title: "Smart Journal",
    description:
      "A private reflection system where AI runs entirely on-device using Gemma. Every journaling app sends your thoughts to a server. This one doesn't — and the entire product architecture follows from that single decision.",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/smart-journal",
    tags: ["Flutter", "On-device AI", "Privacy"],
    span: "md:col-span-2",
    status: "In Development",
  },
  {
    title: "AI Decision Engine",
    description:
      "Tests structured decision-making using weighted inputs, trade-offs, and scenario simulation.",
    image: "/assets/images/work/ai-decision-engine.jpg",
    href: "/explorations/ai-decision-engine",
    tags: ["AI", "Decision Systems", "Framework"],
    span: "md:col-span-2",
    status: "Concept",
  },
  {
    title: "Personal Execution System",
    description:
      "Explores how goals can be decomposed into dependency-aware systems for consistent execution.",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/personal-execution-system",
    tags: ["Execution", "Systems", "Planning"],
    span: "md:col-span-3",
    status: "In Development",
  },
]
