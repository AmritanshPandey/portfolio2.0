import { SectionSubgroup } from "@/components/shared/section-subgroup"

const ITEMS = [
  {
    id: "stakeholders",
    role: "Stakeholder Alignment",
    title: "Framed trust as a product decision",
    desc: "Pushed back on a brand-heavy direction in agentic commerce by showing which payment moments actually needed Mastercard presence. The silent guardian framework became the aligned direction.",
    tags: ["Agent Pay", "Trust UX", "Decision Framing"],
  },
  {
    id: "sales",
    role: "Sales Enablement",
    title: "Made executive demos usable without design support",
    desc: "Built the React and Claude AI demo the CPO used live at Money20/20, Connections, and Innovate at McLaren with Google, ChatGPT, and merchant partners.",
    tags: ["React", "Claude AI", "Money20/20"],
  },
  {
    id: "research",
    role: "Research & Strategy",
    title: "Turned research constraints into V2 direction",
    desc: "Led multilingual UX research across NAM, EU, and South America for agentic commerce trust signals. Six flows, two typologies, and real haptic feedback through Haptic Labs fed the next version.",
    tags: ["UX Research", "Haptic Labs", "Agentic Commerce"],
  },
  {
    id: "engineering",
    role: "Engineering Collaboration",
    title: "Moved demo work into reusable systems",
    desc: "Built PartnerBank V1 with 65 components and 120 screen templates. Proposed the V2 rebuild after promotion, using a Figma multi-mode variable architecture with a team of 3.",
    tags: ["PartnerBank", "Figma", "Design Systems"],
  },
]

export default function LeadershipSection() {
  return (
    <SectionSubgroup
      label="Leadership"
      description="How I influence outcomes through framing, critique, documentation, stakeholder communication, and reusable systems."
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
