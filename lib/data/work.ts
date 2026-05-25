import type { WorkItem } from "@/lib/types/content"

export const workItems: WorkItem[] = [
  {
    tier: "flagship",
    order: 1,
    category: "AI Commerce · Mastercard",
    title: "Agentic Commerce — Defining Trust, UX, and Mastercard's Role in AI-led Payments",
    description:
      "Designed an AI-native commerce system where autonomous agents handle pricing, discovery, and fulfillment in real time — shifting decision-making from static rules to adaptive, signal-driven behavior.",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
    metric: "End-to-end agent loop: discovery → pricing → fulfillment",
  },
  {
    tier: "flagship",
    order: 2,
    category: "Design Systems · Mastercard",
    title: "Building a Scalable PartnerBank Design System for Global Product Demos and RFPs",
    description:
      "Built a configurable white-label design system enabling enterprise sales teams to rapidly tailor product narratives and demos for high-stakes RFPs without engineering dependency.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    metric: "Reduced demo setup from days to hours across sales cycles",
  },
  {
    tier: "supporting",
    order: 1,
    category: "Commerce Infrastructure · Honasa",
    title: "Multi-Brand Design System — Enabling Scalable D2C Growth at Honasa",
    description:
      "Architected a shared commerce foundation for multi-brand D2C operations — eliminating duplicated systems while preserving distinct brand experiences at scale.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    metric: "One platform powering multiple brand storefronts",
  },
  {
    tier: "supporting",
    order: 2,
    category: "0→1 Product · Dror",
    title: "Building a Citizen Safety Platform from Scratch — and Pivoting It Under COVID",
    description:
      "Sole PM, designer, and React frontend dev across two products in eleven months — a consumer safety app, a COVID-forced pivot to B2B workplace safety, and a lesson about PMF you can't own.",
    image: "/assets/images/work/citizen-safety.jpg",
    href: "/work/citizen-safety",
    metric: "2 products shipped · ₹1.98Cr revenue · $494K raised",
  },
]
