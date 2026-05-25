import { SectionSubgroup } from "@/components/shared/section-subgroup"
import {
  IconPresentation,
  IconTarget,
  IconBulb,
  IconComponents,
} from "@tabler/icons-react"
import type { ComponentType } from "react"

type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>

const ITEMS: {
  id: string
  index: string
  role: string
  title: string
  desc: string
  tags: string[]
  Icon: IconType
}[] = [
  {
    id: "stakeholders",
    index: "01",
    role: "Stakeholder Influence",
    title: "Driving Enterprise Product Narratives",
    desc: "Shaped high-stakes RFP demos that turned complex fintech systems into clear, decision-ready stories — directly influencing C-suite buy-in.",
    tags: ["Enterprise Sales", "RFPs", "Executive Demos"],
    Icon: IconPresentation,
  },
  {
    id: "sales",
    index: "02",
    role: "Sales Enablement",
    title: "Designing for Deal Velocity",
    desc: "Built sales-ready prototypes that mapped product capabilities to client needs, reducing time-to-close and giving sales teams a sharper edge.",
    tags: ["Prototyping", "Client Pitches", "Go-to-Market"],
    Icon: IconTarget,
  },
  {
    id: "research",
    index: "03",
    role: "Research & Strategy",
    title: "Turning Insights Into Direction",
    desc: "Synthesized research across global banking flows to surface gaps and translate findings into concrete roadmap decisions.",
    tags: ["UX Research", "Roadmap", "Banking Flows"],
    Icon: IconBulb,
  },
  {
    id: "engineering",
    index: "04",
    role: "Engineering Collaboration",
    title: "Building Reusable Demo Systems",
    desc: "Architected a reusable demo infrastructure that standardised product storytelling across teams and cut repetitive build time.",
    tags: ["Systems Thinking", "Design–Dev", "Scalability"],
    Icon: IconComponents,
  },
]

export default function LeadershipSection() {
  return (
    <SectionSubgroup
      label="Leadership"
      description="Cross-functional influence across product, engineering, sales, and research — from early demos to enterprise decisions."
      variant="spacious"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {ITEMS.map(item => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6
              transition-[transform,box-shadow,border-color] duration-300 ease-out
              hover:-translate-y-[3px]
              hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.45)]
              hover:border-orange-500/20 dark:hover:border-orange-500/15"
          >
            {/* Top edge glass highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px
              bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/15" />

            {/* Hover glow from below */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              bg-[radial-gradient(320px_200px_at_50%_110%,rgba(255,120,40,0.06),transparent)]
              dark:bg-[radial-gradient(320px_200px_at_50%_110%,rgba(255,120,40,0.09),transparent)]" />

            {/* Decorative index number */}
            <span
              className="pointer-events-none absolute right-5 top-3 select-none leading-none font-bold
                text-[72px] text-foreground/[0.03] dark:text-foreground/[0.035]
                transition-colors duration-300 group-hover:text-orange-500/[0.07]"
            >
              {item.index}
            </span>

            {/* Icon container */}
            <div className="mb-5 w-10 h-10 rounded-xl flex items-center justify-center
              bg-orange-500/[0.08] border border-orange-500/[0.12]
              dark:bg-orange-500/[0.12] dark:border-orange-500/[0.20]
              transition-colors duration-300
              group-hover:bg-orange-500/[0.13] dark:group-hover:bg-orange-500/[0.18]">
              <item.Icon
                size={18}
                strokeWidth={1.75}
                className="text-orange-600/80 dark:text-orange-400/75
                  transition-colors duration-300
                  group-hover:text-orange-600 dark:group-hover:text-orange-400"
              />
            </div>

            {/* Role label */}
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.20em]
              text-orange-600/65 dark:text-orange-400/55">
              {item.role}
            </p>

            {/* Title */}
            <h3 className="text-[15px] font-semibold tracking-tight leading-snug text-foreground mb-3">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-[13px] leading-relaxed text-foreground/55">
              {item.desc}
            </p>

            {/* Tags as chips */}
            <div className="mt-5 pt-4 border-t border-border/50 flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-[3px] rounded-full border border-border/70
                    bg-muted/50 text-[10.5px] text-foreground/45 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 inset-x-6 h-[1px] rounded-full
              bg-orange-500/0 group-hover:bg-orange-500/35
              transition-colors duration-500" />
          </div>
        ))}
      </div>
    </SectionSubgroup>
  )
}
