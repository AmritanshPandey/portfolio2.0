"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ProcessStep } from "@/components/shared/process-step"

export default function ProductThinkingSection() {

  const principles = [
    {
      number: "01",
      title: "Incentives Drive Behavior",
      description: "Product mechanics shape user actions. Well-designed incentives align behavior with business outcomes.",
    },
    {
      number: "02",
      title: "Designing Under Uncertainty",
      description: "Product decisions rarely have complete data. Hypothesis-led thinking enables faster learning.",
    },
    {
      number: "03",
      title: "Balancing Growth & Risk",
      description: "Design must balance usability, compliance, and long-term system stability.",
    },
  ]

  return (
    <SectionSubgroup
      label="Decision Thinking"
      description="Principles that guide how I evaluate and make product decisions"
      variant="spacious"
    >

      <div className="space-y-12 md:space-y-16">

        {/* CORE BELIEF */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-center bg-neutral-950 text-white rounded-3xl px-6 py-8 md:px-10 md:py-10 relative">

            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />

            <div className="relative max-w-[640px]">

              <p className="text-[12px] uppercase tracking-[0.18em] text-white/40 mb-4">
                Core Belief
              </p>

              <p className="text-xl md:text-2xl lg:text-[28px] font-medium leading-[1.45]">

                Most product problems aren't solved by{" "}
                <span className="text-white/70">UI</span>.<br />

                They're solved by{" "}
                <span className="text-orange-400 font-semibold">
                  better decisions
                </span>.

              </p>

            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-full h-[140px] rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-xs text-white/30">
                Illustration
              </div>
            </div>

          </div>
        </motion.div>

        {/* PRINCIPLES */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid md:grid-cols-3 gap-8 md:gap-10"
        >

          {principles.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
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
                theme="light"
              />
            </motion.div>
          ))}

        </motion.div>

      </div>
      <div className="h-px w-full pb-8" />

    </SectionSubgroup>
  )
}