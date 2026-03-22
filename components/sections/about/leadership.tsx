"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ProcessStep } from "@/components/shared/process-step"

export default function LeadershipSection() {

  const items = [
    {
      number: "01",
      title: "Driving Enterprise Product Narratives",
      desc: "Shaped interactive product demos used in high-stakes RFPs, helping translate complex systems into compelling client narratives.",
    },
    {
      number: "02",
      title: "Enabling Sales Through Product Thinking",
      desc: "Partnered with sales and product teams to build prototypes that accelerated deal cycles and improved product understanding.",
    },
    {
      number: "03",
      title: "Connecting Research to Product Decisions",
      desc: "Synthesized research across banking and payment experiences to identify gaps and inform product direction.",
    },
    {
      number: "04",
      title: "Building Scalable Demo Infrastructure",
      desc: "Developed reusable demo platforms enabling teams to showcase product capabilities consistently across stakeholders.",
    },
  ]

  return (
    <SectionSubgroup
      label="Leadership"
      description="Influencing product direction across product, sales, and stakeholders."
      variant="spacious"
    >

      <div className="
        grid lg:grid-cols-[1fr_380px]
        gap-10 md:gap-12
        items-start
      ">

        {/* LEFT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="space-y-6 md:space-y-8"
        >

          {items.map((item, index) => (
            <motion.div
              key={index}
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
                description={item.desc}
                variant="vertical"
               
              />
            </motion.div>
          ))}

        </motion.div>

        {/* RIGHT — VISUAL */}
        <div className="hidden lg:block">
          <div className="sticky top-24">

            <div className="
              w-full aspect-square
              rounded-2xl

              border border-border
              bg-muted/40

              flex items-center justify-center
              text-xs text-muted-foreground

              dark:bg-white/[0.03]
              dark:border-white/10
              dark:text-white/30
            ">
              Cross-functional influence
            </div>

          </div>
        </div>

      </div>

    </SectionSubgroup>
  )
}