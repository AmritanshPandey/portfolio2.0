"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ProcessStep } from "@/components/shared/process-step"
import { CoreBeliefCard } from "@/components/shared/core-belief-card"

export default function ProductThinkingSection() {

  const principles = [
    {
      number: "01",
      title: "Incentives Drive Behavior",
      description:
        "User behavior follows incentives. Align mechanics with outcomes.",
    },
    {
      number: "02",
      title: "Designing Under Uncertainty",
      description:
        "Move forward without perfect data using hypothesis-led thinking.",
    },
    {
      number: "03",
      title: "Balancing Growth & Risk",
      description:
        "Balance usability, compliance, and long-term stability.",
    },
  ]

  return (
    <SectionSubgroup
      label="Thinking"
      description="How I make product decisions under constraints."
      variant="spacious"
    >

      <div className="space-y-12 md:space-y-14 pb-4 md:pb-8">

        {/* ✅ CORE BELIEF (shared system) */}
        <CoreBeliefCard>
          <>
            Most product problems aren't solved by{" "}
            <span className="text-muted-foreground">
              interfaces
            </span>.
            <br />
            They're solved by{" "}
            <span className="text-orange-500 font-semibold tracking-tight">
              better decisions
            </span>.
          </>
        </CoreBeliefCard>

        {/* ✅ PRINCIPLES */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid md:grid-cols-3 gap-8 md:gap-10"
        >
          {principles.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProcessStep
                number={item.number}
                title={item.title}
                description={item.description}
                variant="horizontal"
              />
            </motion.div>
          ))}
        </motion.div>

      </div>

    </SectionSubgroup>
  )
}