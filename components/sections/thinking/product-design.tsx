"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { motion } from "framer-motion"

const QUESTIONS = [
  {
    num: "01",
    q: "What's the forcing function?",
    body: "What's actually making this problem urgent right now — and does that forcing function last?",
  },
  {
    num: "02",
    q: "What would have to be true for the opposite approach to be right?",
    body: "The strongest test of any decision is whether you can honestly argue the other side.",
  },
  {
    num: "03",
    q: "Who isn't in the room whose constraints will break this later?",
    body: "Engineering, legal, sales, the user in a low-connectivity environment. Find them before you commit.",
  },
]

export default function ProductDesignApproachSection() {
  return (
    <SectionSubgroup
      label="Approach"
      description="How I think before I decide."
      variant="spacious"
    >
      <div className="flex flex-col gap-0 rounded-2xl border border-border overflow-hidden">
        {QUESTIONS.map((item, i) => (
          <motion.div
            key={item.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`
              group relative px-7 py-7
              bg-card hover:bg-orange-500/[0.02] dark:hover:bg-orange-500/[0.04]
              transition-colors duration-200
              ${i < QUESTIONS.length - 1 ? "border-b border-border" : ""}
            `}
          >
            {/* Number */}
            <span className="
              text-[11px] font-mono font-semibold tracking-[0.14em]
              text-orange-500/70 dark:text-orange-400/60
              block mb-3
            ">
              {item.num}
            </span>

            {/* Question */}
            <p className="
              text-[17px] md:text-[19px] font-semibold tracking-tight leading-snug
              text-foreground mb-3
            ">
              {item.q}
            </p>

            {/* Answer */}
            <p className="text-[14px] md:text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              {item.body}
            </p>

            {/* Hover accent line */}
            <div className="
              absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full
              bg-orange-500/0 group-hover:bg-orange-500/50
              transition-colors duration-300
            " />
          </motion.div>
        ))}
      </div>
    </SectionSubgroup>
  )
}
