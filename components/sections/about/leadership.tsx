"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ProcessStep } from "@/components/shared/process-step"

export default function LeadershipSection() {

  const items = [
    {
      number: "01",
      title: "Enterprise Product Demonstrations",
      desc: "Led design of interactive demos used in RFPs and client engagements to drive enterprise adoption.",
    },
    {
      number: "02",
      title: "Sales & Product Enablement",
      desc: "Partnered with product and sales teams to create prototypes and demo environments supporting deal cycles.",
    },
    {
      number: "03",
      title: "UX Research & Market Insights",
      desc: "Identified usability gaps across banking apps and agent payment flows through cross-team research.",
    },
    {
      number: "04",
      title: "Product Prototyping & Platforms",
      desc: "Built scalable demo platforms to showcase product capabilities across teams and stakeholders.",
    },
  ]

  return (
    <SectionSubgroup
      label="Leadership"
      description="Driving product outcomes across product, sales, and marketing."
      variant="spacious"
    >

      <div className="
        grid lg:grid-cols-[1fr_380px]
        gap-10 md:gap-12
        items-start
      ">

        {/* LEFT — STEPS */}
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
                theme="light"
              />

            </motion.div>

          ))}

        </motion.div>

        {/* RIGHT — OPTIONAL VISUAL */}
        <div className="hidden lg:block">

          <div className="sticky top-24">

            <div className="
              w-full aspect-square
              rounded-2xl border border-neutral-200
              bg-white
              flex items-center justify-center
              text-xs text-neutral-400
            ">
              Illustration
            </div>

          </div>

        </div>

      </div>

    </SectionSubgroup>
  )
}