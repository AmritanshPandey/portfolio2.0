"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { motion } from "framer-motion"

const PRINCIPLES = [
  {
    number: "01",
    title: "Constraint → Decision → Outcome",
    description:
      "I write the constraint first, then the decision it forced, then what changed. It keeps the case for a design choice grounded.",
  },
  {
    number: "02",
    title: "Reuse Before Rebuild",
    description:
      "Before adding a new component or flow, I check whether an existing pattern can stretch. New patterns need a reason beyond preference.",
  },
  {
    number: "03",
    title: "Prototype the Risky Assumption First",
    description:
      "If the risk is trust, build the trust moment. If the risk is sales, build the demo. The prototype should test the decision, not show every screen.",
  },
  {
    number: "04",
    title: "Separate Structure From Expression",
    description:
      "Product logic, tokens, and component behavior should stay stable while brand expression changes above them. That is how systems scale without looking generic.",
  },
  {
    number: "05",
    title: "Design for Handoff, Not Just Approval",
    description:
      "A good review deck is not enough. The decision needs rules, edge cases, ownership, and a shape engineering can build from without re-litigating the intent.",
  },
]

export default function ProductThinkingSection() {
  return (
    <SectionSubgroup
      label="Thinking"
      description="Decision frameworks I reach for when the problem is bigger than a screen."
      variant="spacious"
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/50 md:grid-cols-2 lg:grid-cols-3">

        {/* ── BELIEF, top left */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card p-7 md:p-10 flex flex-col justify-center lg:row-span-2"
        >
          <p className="type-caption mb-5 text-muted-foreground/60">
            Core Belief
          </p>
          <p className="type-card-title-featured text-foreground">
            The interface is usually the record of a decision that happened earlier.
            {" "}Make that decision visible.
          </p>
        </motion.div>

        {/* ── PRINCIPLES, remaining 3 cells */}
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p.number}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i + 1) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="card-surface group bg-card p-6 flex flex-col gap-3"
          >
            <span className="type-caption text-muted-foreground/50">
              {p.number}
            </span>
            <h3 className="type-card-title text-foreground">
              {p.title}
            </h3>
            <p className="type-card-body text-foreground/70">
              {p.description}
            </p>
          </motion.div>
        ))}

      </div>
    </SectionSubgroup>
  )
}
