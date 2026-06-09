import type { ExplorationItem } from "@/lib/types/content"

// Grid is 5 columns. Each row must sum to 5 (e.g. col-span-3 + col-span-2).
export const explorationItems: ExplorationItem[] = [
  {
    title: "PlanR Personal Execution System",
    description:
      "A goal-oriented planning app that connects long-term intent to weekly execution and progress tracking.",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/personal-execution-system",
    tags: ["PlanR", "Execution", "Planning"],
    span: "md:col-span-5",
    status: "Live",
  },
]
