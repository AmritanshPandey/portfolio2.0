"use client"

import {
  IconLayoutGrid,
  IconHome2,
  IconBriefcase,
  IconArticle,
  IconStack2,
  IconUser,
} from "@tabler/icons-react"

import { FlowDiagram, type FlowEdge, type FlowNode } from "@/components/ui/flow-diagram"

// One nested tree — each node fans down to its `children`.
const ROOT: FlowNode = {
  id: "root",
  title: "Portfolio",
  subtitle: "amritansh.dev",
  icon: IconLayoutGrid,
  children: [
    {
      id: "home",
      title: "Home",
      subtitle: "Landing",
      icon: IconHome2,
      status: "ok",
      href: "/",
      children: [
        { id: "home-hero", title: "Hero", subtitle: "Intro", status: "ok" },
        { id: "home-work", title: "Work index", subtitle: "Featured" },
        { id: "home-insights", title: "Insights", subtitle: "Writing" },
      ],
    },
    {
      id: "work",
      title: "Work",
      subtitle: "Case studies",
      icon: IconBriefcase,
      status: "ok",
      children: [
        {
          id: "work-agent",
          title: "Agent Pay",
          subtitle: "Money20/20",
          status: "new",
          edgeLabel: "featured",
          children: [
            { id: "work-agent-flow", title: "Checkout flow", subtitle: "Primary" },
            { id: "work-agent-metrics", title: "Outcomes", subtitle: "Impact", status: "ok" },
          ],
        },
        { id: "work-bank", title: "PartnerBank", subtitle: "Platform" },
        { id: "work-safety", title: "Citizen Safety", subtitle: "Civic" },
      ],
    },
    {
      id: "articles",
      title: "Articles",
      subtitle: "Writing",
      icon: IconArticle,
      status: "ok",
      children: [
        { id: "art-color", title: "Color system", subtitle: "Interactive", status: "new" },
        { id: "art-type", title: "Typography", subtitle: "System" },
        { id: "art-tradeoff", title: "Tradeoffs", subtitle: "Framework", status: "warn" },
      ],
    },
    {
      id: "systems",
      title: "Systems",
      subtitle: "Live demos",
      icon: IconStack2,
      status: "ok",
      children: [
        { id: "sys-fintech", title: "Fintech AI", subtitle: "Interface" },
        { id: "sys-components", title: "Components", subtitle: "Showcase", status: "new", href: "/showcase" },
      ],
    },
    {
      id: "about",
      title: "About",
      subtitle: "Profile",
      icon: IconUser,
      status: "ok",
      children: [
        { id: "about-lead", title: "Leadership", subtitle: "Story" },
        { id: "about-mentor", title: "Mentorship", subtitle: "Giving back" },
      ],
    },
  ],
}

// Cross-links — any node to any node, beyond the tree edges (labels optional).
const LINKS: FlowEdge[] = [
  { from: "art-color", to: "sys-components", label: "tokens" },
  ["work-agent", "sys-fintech"],
]

export function FlowDiagramDemo() {
  return (
    // Break out of the page's centered max-w-5xl column to the full viewport
    // width, so the diagram has room to breathe on desktop.
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      {/* Static dot-grid background (pure CSS, no animation) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-foreground/[0.08] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
      />
      <div className="relative overflow-x-auto px-6 py-6 md:px-10 md:py-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FlowDiagram
          className="mx-auto w-max"
          root={ROOT}
          links={LINKS}
          columnGap={56}
          rowGap={44}
          indentStep={20}
          draggable
          showHelp
        />
      </div>
    </div>
  )
}
