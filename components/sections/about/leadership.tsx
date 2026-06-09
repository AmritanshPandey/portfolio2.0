import { SectionSubgroup } from "@/components/shared/section-subgroup"

const ITEMS = [
  {
    id: "stakeholders",
    role: "Stakeholder Influence",
    title: "Driving Enterprise Product Narratives",
    desc: "Pushed back on a VP-level brand decision in agentic commerce and got full alignment. The silent guardian framework keeps Mastercard invisible by default, then brings it forward at payment confirmation, verification, and completion.",
    tags: ["Agent Pay", "Silent Guardian", "Brand Strategy"],
  },
  {
    id: "sales",
    role: "Sales Enablement",
    title: "Designing for Deal Velocity",
    desc: "Built the React + Claude AI demo the CPO used live at Money20/20, Connections, and Innovate at McLaren with Google, ChatGPT, and merchant partners. No designer in the room required.",
    tags: ["React", "Claude AI", "Money20/20"],
  },
  {
    id: "research",
    role: "Research & Strategy",
    title: "Turning Insights Into Direction",
    desc: "Led multilingual UX research across NAM, EU, and South America for agentic commerce trust signals. Six flows, two typologies, and real haptic feedback via Haptic Labs. Findings are confidential. Outcomes fed V2 direction.",
    tags: ["UX Research", "Haptic Labs", "Agentic Commerce"],
  },
  {
    id: "engineering",
    role: "Engineering Collaboration",
    title: "Building Reusable Demo Systems",
    desc: "Built PartnerBank V1 solo with 65 components and 120 screen templates. Proposed and led the V2 rebuild after promotion, using a new Figma multi-mode variable architecture with a team of 3.",
    tags: ["PartnerBank", "Figma", "Design Systems"],
  },
]

export default function LeadershipSection() {
  return (
    <SectionSubgroup
      label="Leadership"
      description="Cross-functional influence across product, engineering, sales, and research, from early demos to enterprise decisions."
      variant="spacious"
    >
      <div className="grid sm:grid-cols-2 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className="card-surface group bg-card p-6 flex flex-col gap-3"
          >
            <p className="type-caption text-muted-foreground/70">
              {item.role}
            </p>

            <h3 className="type-card-title text-foreground">
              {item.title}
            </h3>

            <p className="type-card-body flex-1 text-foreground/55">
              {item.desc}
            </p>

            <p className="type-caption mt-1 text-foreground/30">
              {item.tags.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </SectionSubgroup>
  )
}
