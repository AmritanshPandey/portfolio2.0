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
  },
  {
    title: "Weather-Aware Skincare System",
    description:
      "Models how environmental signals like UV and AQI can dynamically influence personal routines.",
    image: "/assets/images/work/skincare-planner.jpg",
    href: "/explorations/weather-skincare",
    tags: ["Context", "Personalization", "Data"],
    span: "md:col-span-2",
  },
  {
    title: "AI Decision Engine",
    description:
      "Tests structured decision-making using weighted inputs, trade-offs, and scenario simulation.",
    image: "/assets/images/work/ai-decision-engine.jpg",
    href: "/explorations/ai-decision-engine",
    tags: ["AI", "Decision Systems", "Framework"],
    span: "md:col-span-2",
  },
  {
    title: "Personal Execution System",
    description:
      "Explores how goals can be decomposed into dependency-aware systems for consistent execution.",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/personal-execution-system",
    tags: ["Execution", "Systems", "Planning"],
    span: "md:col-span-3",
  },
]
