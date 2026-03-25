"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ProcessStep } from "@/components/shared/process-step"

export default function LeadershipSection() {
  const items = [
    {
      number: "01",
      title: "Driving Enterprise Product Narratives",
      desc: "Shaped interactive demos for high-stakes RFPs, translating complex systems into clear, decision-driving narratives.",
    },
    {
      number: "02",
      title: "Enabling Sales Through Product Thinking",
      desc: "Built prototypes that aligned product capabilities with client needs, accelerating deal cycles and clarity.",
    },
    {
      number: "03",
      title: "Connecting Research to Product Direction",
      desc: "Synthesized insights across banking flows to identify gaps and influence roadmap decisions.",
    },
    {
      number: "04",
      title: "Building Scalable Demo Infrastructure",
      desc: "Created reusable demo systems enabling consistent storytelling across teams and stakeholders.",
    },
  ]

  return (
    <SectionSubgroup
      label="Leadership"
      description="Influencing product direction across product, sales, and stakeholders."
      variant="spacious"
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

        {/* LEFT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } }, // reduced
          }}
          className="space-y-8"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 12 }, // reduced motion
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.35, // faster = less jank
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

        {/* RIGHT */}
        <div className="hidden lg:block">
          <div className="sticky top-24">

            <div className="
              relative rounded-2xl overflow-hidden
              border border-border

              /* 🔥 replace heavy blur */
              bg-background/80

              aspect-square

              /* GPU safety */
              [transform:translateZ(0)]
              [backface-visibility:hidden]
            ">

              {/* GRID (lighter) */}
              <div className="
                absolute inset-0 opacity-[0.18]
                [background-size:24px_24px]
                [background-image:radial-gradient(currentColor_1px,transparent_1px)]
                text-foreground/40
                pointer-events-none
              " />

              {/* RADIAL (lighter + cheaper) */}
              <div className="
                absolute inset-0
                opacity-60
                bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03))]
                dark:bg-[radial-gradient(circle_at_center,transparent_45%,rgba(255,255,255,0.05))]
              " />

              {/* LABEL */}
              <div className="absolute top-4 left-4 z-10">
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                  System View
                </p>
              </div>

              {/* PLACEHOLDER */}
              <div className="
                absolute inset-0 flex items-center justify-center
                text-xs text-foreground/50
              ">
                Illustration / System diagram
              </div>

              {/* EDGE */}
              <div className="
                absolute inset-0 rounded-2xl
                ring-1 ring-inset ring-border/40
              " />

            </div>

          </div>
        </div>

      </div>
    </SectionSubgroup>
  )
}