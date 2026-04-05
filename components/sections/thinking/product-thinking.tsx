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

      <div className="space-y-14 md:space-y-16 pb-6 md:pb-10">

        {/* ───────── CORE BELIEF ───────── */}
        <CoreBeliefCard>
          <>
            Most product problems aren&apos;t solved by{" "}
            <span className="text-foreground/50">
              interfaces
            </span>.
            <br />
            They&apos;re solved by{" "}
            <span className="
              font-semibold tracking-tight
              text-orange-600 dark:text-orange-400
            ">
              better decisions
            </span>.
          </>
        </CoreBeliefCard>

        {/* ───────── PRINCIPLES ───────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid md:grid-cols-3 gap-10 md:gap-12"
        >
          {principles.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.45,
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