import type { ExplorationItem } from "@/lib/types/content"

// Grid is 5 columns. Each row must sum to 5 (e.g. col-span-3 + col-span-2).
export const explorationItems: ExplorationItem[] = [
  {
    title: "PlanR Personal Execution System",
    description:
      "A planning system for connecting long-term goals to weekly execution, review loops, and visible progress.",
    question: "How can a planning tool keep goals connected to the next concrete action without becoming another task dump?",
    tested: "A model that links intent, weekly commitments, progress review, and lightweight prioritization.",
    built: "A live product prototype with planning flows, execution states, and progress tracking.",
    learned: "Planning tools work better when they reduce the next decision, not when they add more places to organize work.",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/personal-execution-system",
    tags: ["PlanR", "Execution", "Planning"],
    span: "md:col-span-5",
    status: "Live",
  },
]
