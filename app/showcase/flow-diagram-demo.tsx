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
        { id: "work-agent", title: "Agent Pay", subtitle: "Money20/20", status: "new" },
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
        { id: "sys-components", title: "Components", subtitle: "Showcase", status: "new" },
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

// Cross-links — any node to any node, beyond the tree edges.
const LINKS: FlowEdge[] = [
  ["art-color", "sys-components"],
  ["work-agent", "sys-fintech"],
]

export function FlowDiagramDemo() {
  return (
    <div className="overflow-x-auto pb-4">
      <FlowDiagram className="mx-auto w-max py-4" root={ROOT} links={LINKS} />
    </div>
  )
}
