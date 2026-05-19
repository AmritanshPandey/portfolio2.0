"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ProcessStep } from "@/components/shared/process-step"
import { leadershipItems } from "@/lib/data"

export default function LeadershipSection() {
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
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="space-y-8"
        >
          {leadershipItems.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.35,
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
              bg-background/80
              aspect-square
              [transform:translateZ(0)]
              [backface-visibility:hidden]
            ">

              {/* GRID */}
              <div className="
                absolute inset-0 opacity-[0.18]
                [background-size:24px_24px]
                [background-image:radial-gradient(currentColor_1px,transparent_1px)]
                text-foreground/40
                pointer-events-none
              " />

              {/* RADIAL */}
              <div className="
                absolute inset-0 opacity-60
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
