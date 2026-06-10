"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { motion } from "framer-motion"

const STEPS = [
  {
    num: "01",
    q: "Frame the constraint",
    body: "Name what is fixed: time, risk, legacy systems, brand rules, compliance, stakeholders, or engineering capacity.",
  },
  {
    num: "02",
    q: "Map the system",
    body: "Find the shared flows, repeated decisions, handoff points, and edge cases before designing the visible surface.",
  },
  {
    num: "03",
    q: "Choose the smallest useful solution",
    body: "Cut the first version down to the decision that needs proof, then protect the path for what repeats later.",
  },
  {
    num: "04",
    q: "Prototype the decision",
    body: "Use Figma, code, content models, or a working demo depending on what risk needs to be tested.",
  },
  {
    num: "05",
    q: "Align teams",
    body: "Turn the decision into a shared artifact: a flow, rule, token model, prototype, or implementation note.",
  },
  {
    num: "06",
    q: "Scale what repeats",
    body: "Promote repeated choices into components, templates, documentation, and governance only after the pattern proves useful.",
  },
]

export default function ProductDesignApproachSection() {
  return (
    <SectionSubgroup
      label="Approach"
      description="A practical sequence for turning ambiguity into a decision that can survive handoff."
      variant="spacious"
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((item, i) => (
          <motion.div
            key={item.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`
              card-surface group bg-card px-6 py-7 md:px-7
            `}
          >
            <span className="
              type-caption font-mono font-semibold
              text-orange-500/70 dark:text-orange-400/60
              block mb-3
            ">
              {item.num}
            </span>

            <p className="type-card-title mb-3 text-foreground">
              {item.q}
            </p>

            <p className="type-card-body max-w-xl text-muted-foreground">
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionSubgroup>
  )
}
