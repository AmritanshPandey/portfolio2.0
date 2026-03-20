"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ProcessStep } from "@/components/shared/process-step"

export default function ProductDesignApproachSection() {

  const steps = [
    {
      number: "01",
      title: "Frame the Problem",
      description: "Align user needs, business goals, and constraints before jumping into solutions.",
    },
    {
      number: "02",
      title: "Structure the Solution",
      description: "Define architecture, flows, and interaction models that scale beyond initial use cases.",
    },
    {
      number: "03",
      title: "Design & Ship",
      description: "Translate concepts into production-ready experiences with engineering.",
    },
    {
      number: "04",
      title: "Learn & Iterate",
      description: "Continuously refine using feedback, product signals, and evolving requirements.",
    },
  ]

  return (
    <SectionSubgroup label="Process" variant="spacious">

      <div className="rounded-3xl bg-neutral-950 text-white px-6 py-8 md:px-10 md:py-10">

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 md:gap-12">

          {/* STEPS */}
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
            className="space-y-6 md:space-y-8"
          >

            {steps.map((step, i) => (
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
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  variant="vertical"
                />
              </motion.div>
            ))}

          </motion.div>

          {/* RIGHT */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full min-h-[260px] rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent" />
              <div className="text-xs text-white/30">Illustration</div>
            </div>
          </div>

        </div>

      </div>

    </SectionSubgroup>
  )
}