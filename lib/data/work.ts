import type { WorkItem } from "@/lib/types/content"

export const workItems: WorkItem[] = [
  {
    category: "AI Commerce",
    title: "Agent-Driven Commerce Platform",
    description:
      "Conceptualized an agent-driven commerce system to explore adaptive decision-making across pricing, discovery, and fulfillment, driven by real-time signals and user behavior.",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
    featured: true,
  },
  {
    category: "Enterprise Systems",
    title: "Modular White-Label Platform for Enterprise RFPs",
    description:
      "Designed a configurable platform inspired by enterprise RFP workflows, enabling rapid demo customization and scalable configurations in high-stakes sales environments.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    featured: false,
  },
  {
    category: "Commerce Infrastructure",
    title: "Shared Commerce Platform for Multi-Brand D2C",
    description:
      "Modeled a shared commerce system based on multi-brand D2C operations, reducing duplication while preserving brand differentiation at scale.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    featured: false,
  },
]
