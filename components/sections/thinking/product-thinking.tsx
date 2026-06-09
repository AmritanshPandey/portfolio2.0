"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { motion } from "framer-motion"

const PRINCIPLES = [
  {
    number: "01",
    title: "Incentives Drive Behavior",
    description:
      "Behavior follows incentives, not stated intent. The cleanest interface fails when the mechanic beneath it rewards the wrong action — so I map backward from the behavior the product needs.",
  },
  {
    number: "02",
    title: "Designing Under Uncertainty",
    description:
      "Most decisions happen before the data exists, and waiting for certainty is itself a decision — usually the wrong one. I state what must be true, then design the fastest experiment to prove it false.",
  },
  {
    number: "03",
    title: "Balancing Growth & Risk",
    description:
      "In regulated products, compliance isn't a constraint on design — it's a design input. The most durable fintech treats risk as part of the brief, designing usability and stability together instead of trading them off.",
  },
]

export default function ProductThinkingSection() {
  return (
    <SectionSubgroup
      label="Thinking"
      description="How I make product decisions under constraints."
      variant="spacious"
    >
      <div className="grid md:grid-cols-2 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">

        {/* ── BELIEF — top left */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card p-7 md:p-10 flex flex-col justify-center"
        >
          <p className="text-[11px] text-muted-foreground/60 tracking-wide mb-5">
            Core Belief
          </p>
          <p className="text-[24px] md:text-[28px] font-semibold leading-[1.35] tracking-[-0.02em] text-foreground">
            Most product problems aren&apos;t solved by{" "}
            <span className="text-foreground/35">interfaces</span>.
            {" "}They&apos;re solved by{" "}
            <span className="text-orange-600 dark:text-orange-400">better decisions</span>.
          </p>
        </motion.div>

        {/* ── PRINCIPLES — remaining 3 cells */}
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p.number}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i + 1) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="card-surface group bg-card p-6 flex flex-col gap-3"
          >
            <span className="text-[11px] text-muted-foreground/50 tracking-wide">
              {p.number}
            </span>
            <h3 className="text-[16px] font-semibold tracking-tight leading-snug text-foreground">
              {p.title}
            </h3>
            <p className="text-[13px] leading-[1.7] text-foreground/70">
              {p.description}
            </p>
          </motion.div>
        ))}

      </div>
    </SectionSubgroup>
  )
}
