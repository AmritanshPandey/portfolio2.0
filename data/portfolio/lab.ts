import type { LabProduct } from "./types"

/* ============================================================================
   LAB — frontend-built products & prototypes.

   Frontend fluency as a design/product execution advantage: things actually
   built, not just designed. PlanR is live (lib/data/explorations.ts); the rest
   are scaffolded until real links/copy land.
   ============================================================================ */

export const labProducts: LabProduct[] = [
  {
    id: "agent-pay-demo",
    title: "Agent Pay Demo",
    summary:
      "The interactive React demo of AI-led payments — the build a CPO used on stage at Money20/20.",
    stack: ["React", "Prototype", "Trust UX"],
    status: "Demo",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
  },
  {
    id: "planr",
    title: "PlanR — Personal Execution System",
    summary:
      "A live planning prototype connecting long-term goals to weekly execution, review loops, and visible progress.",
    stack: ["React", "Product", "Planning"],
    status: "Live",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/personal-execution-system",
  },
  {
    id: "ai-goal-system",
    // TODO(amritansh): real content — summary, stack, link.
    title: "AI Goal Execution System",
    summary:
      "TODO(amritansh): what it does — an agentic system that turns goals into executed steps.",
    stack: ["AI", "Agents", "TODO"],
    status: "Concept",
    image: "/assets/images/work/ai-decision-engine.jpg",
    placeholder: true,
  },
  {
    id: "demo-infra",
    // TODO(amritansh): real content — link to the live demo infra / simulated app.
    title: "Demo Infrastructure / Simulated App",
    summary:
      "TODO(amritansh): reusable demo infrastructure / simulated app for consistent product storytelling.",
    stack: ["React", "Infra", "TODO"],
    status: "In Development",
    image: "/assets/images/work/fintech-ai-system.jpg",
    placeholder: true,
  },
]
