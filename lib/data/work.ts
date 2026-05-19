import type { WorkItem } from "@/lib/types/content"

export const workItems: WorkItem[] = [
  {
    category: "AI Commerce",
    title: "Agent-Driven Commerce Platform",
    description:
      "Designed an AI-native commerce system where autonomous agents handle pricing, discovery, and fulfillment in real time — shifting decision-making from static rules to adaptive, signal-driven behavior.",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
    metric: "End-to-end agent loop: discovery → pricing → fulfillment",
    featured: true,
  },
  {
    category: "Enterprise Systems",
    title: "Modular White-Label Platform for Enterprise RFPs",
    description:
      "Built a configurable demo and delivery platform for high-stakes enterprise RFPs, enabling sales teams to rapidly tailor product narratives without engineering dependency.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    metric: "Reduced demo setup from days to hours across sales cycles",
    featured: false,
  },
  {
    category: "Commerce Infrastructure",
    title: "Shared Commerce Platform for Multi-Brand D2C",
    description:
      "Architected a shared commerce foundation for multi-brand D2C operations — eliminating duplicated systems while preserving distinct brand experiences at scale.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    metric: "One platform powering multiple brand storefronts",
    featured: false,
  },
]
