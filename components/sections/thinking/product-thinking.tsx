"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { IconArrowUpRight } from "@tabler/icons-react"
import { motion } from "framer-motion"
import Link from "next/link"

const FRAMEWORKS = [
  {
    number: "01",
    title: "Constraint → Decision → Outcome",
    context:
      "AI-led payments had no checkout screen, so the work had to define where trust appears.",
    proofLabel: "Seen in Agent Pay",
    href: "/work/agent-commerce",
    constraint: "Users needed confidence before approving AI-led payments.",
    decision: "Make Mastercard visible only at confirmation, verification, and completion.",
    outcome: "The silent guardian became the adopted direction and powered the CPO demo.",
  },
  {
    number: "02",
    title: "Prototype the Risky Assumption First",
    context:
      "The risk was not screen polish. It was whether leaders and partners could understand Agent Pay live.",
    proofLabel: "Seen in Money20/20 demo",
    href: "/work/agent-commerce",
    constraint: "A Figma prototype would not survive a CPO-led partner conversation.",
    decision: "Build a working React + Claude demo that runs on a phone.",
    outcome: "Used live at Money20/20 and in partner conversations.",
  },
  {
    number: "03",
    title: "Reuse Before Rebuild",
    context:
      "Enterprise demo work needed speed without losing market-specific detail.",
    proofLabel: "Seen in PartnerBank",
    href: "/work/white-label-rfp",
    constraint: "RFP demos were too bespoke to configure quickly.",
    decision: "Turn repeated banking flows into configurable scenarios.",
    outcome: "Custom demo prep moved from days to same-day configuration.",
  },
  {
    number: "04",
    title: "Design for Handoff, Not Just Approval",
    context:
      "The work had to keep shipping after design review, without every edge case returning to design.",
    proofLabel: "Seen in Email Builder",
    href: "/work/email-builder",
    constraint: "Teams needed on-brand emails without hand-writing HTML.",
    decision: "Define components, templates, rules, and ownership around the handoff.",
    outcome: "50+ components and 28 templates supported repeatable production.",
  },
]

const BELIEF_ROWS = [
  "Start with the constraint, not the interface.",
  "Prototype the thing that could break the strategy.",
  "Leave behind rules a team can reuse without you.",
]

export default function ProductThinkingSection() {
  return (
    <SectionSubgroup
      label="Thinking"
      description="Decision frameworks I reach for when the problem is bigger than a screen."
      variant="spacious"
    >
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="border-y border-border/60 py-8 md:py-10 lg:sticky lg:top-28"
        >
          <p className="type-caption mb-5 text-muted-foreground/60">
            Core Belief
          </p>
          <p className="max-w-[14ch] text-[28px] font-semibold leading-[1.12] text-foreground md:text-[34px]">
            The interface is usually the record of a decision that happened earlier.
          </p>
          <p className="mt-5 max-w-[32ch] type-card-body-featured text-foreground/58">
            Make the decision visible: the constraint, the call, and what changed because of it.
          </p>
          <div className="mt-8 grid gap-3 border-t border-border/50 pt-5">
            {BELIEF_ROWS.map((row) => (
              <p key={row} className="type-caption text-foreground/55">
                {row}
              </p>
            ))}
          </div>
        </motion.aside>

        <div className="grid gap-3 md:gap-4">
          {FRAMEWORKS.map((item, i) => (
            <motion.article
              key={item.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="card-surface group rounded-lg border border-border/55 bg-card/70 p-5 md:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className="type-caption text-muted-foreground/45">
                  {item.number}
                </span>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-accent/70 transition-colors hover:text-accent"
                >
                  {item.proofLabel}
                  <IconArrowUpRight size={13} stroke={1.8} />
                </Link>
              </div>

              <h3 className="type-card-title text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 type-card-body text-foreground/62">
                {item.context}
              </p>

              <dl className="mt-5 grid gap-px overflow-hidden rounded-lg border border-border/45 bg-border/45">
                {[
                  ["Constraint", item.constraint],
                  ["Decision", item.decision],
                  ["Outcome", item.outcome],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 bg-background/80 px-4 py-3 md:grid-cols-[96px_1fr] md:gap-4">
                    <dt className="type-caption text-muted-foreground/55">
                      {label}
                    </dt>
                    <dd className="type-card-body text-foreground/72">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionSubgroup>
  )
}
