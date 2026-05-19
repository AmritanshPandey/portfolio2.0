"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ExplorationCard } from "@/components/shared/exploration-card"
import { explorationItems } from "@/lib/data"

export default function ExplorationsSection() {
  return (
    <SectionSubgroup
      label="Side Projects"
      description="Personal experiments built outside of work to test ideas around systems, behavior, and decision-making."
      variant="spacious"
    >
      <section data-cursor-zone="exploration">

        <div className="space-y-10 md:space-y-12">

          {/* GRID — motion.div is the grid child carrying the span */}
          <div className="
            grid grid-cols-1 md:grid-cols-5
            gap-5 md:gap-6
            md:auto-rows-[280px]
          ">
            {explorationItems.map((item, index) => (
              <motion.div
                key={index}
                className={clsx(item.span, "aspect-square md:aspect-auto")}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.52,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ExplorationCard
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  href={item.href}
                  tags={item.tags}
                />
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </SectionSubgroup>
  )
}
