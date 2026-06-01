import type { ExplorationItem } from "@/lib/types/content"

// Grid is 5 columns. Each row must sum to 5 (e.g. col-span-3 + col-span-2).
export const explorationItems: ExplorationItem[] = [
  {
    title: "Sneakers Commerce System",
    description:
      "Hypothesis: scarcity mechanics can be systematised without eroding brand trust.",
    image: "/assets/images/work/sneaker-commerce.jpg",
    href: "/explorations/sneakers-commerce",
    tags: ["Commerce", "Behavior", "Systems"],
    span: "md:col-span-3",
    status: "Concept",
  },
  {
    title: "Smart Journal",
    description:
      "Hypothesis: privacy-first architecture as a product differentiator — what happens when data never leaves the device.",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/smart-journal",
    tags: ["Flutter", "On-device AI", "Privacy"],
    span: "md:col-span-2",
    status: "In Development",
  },
  {
    title: "AI Decision Engine",
    description:
      "Hypothesis: structured frameworks reduce cognitive load on complex PM trade-off decisions.",
    image: "/assets/images/work/ai-decision-engine.jpg",
    href: "/explorations/ai-decision-engine",
    tags: ["AI", "Decision Systems", "Framework"],
    span: "md:col-span-2",
    status: "Concept",
  },
  {
    title: "Personal Execution System",
    description:
      "Hypothesis: goals fail at decomposition, not intention. Explores dependency-aware task systems.",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/personal-execution-system",
    tags: ["Execution", "Systems", "Planning"],
    span: "md:col-span-3",
    status: "In Development",
  },
]
