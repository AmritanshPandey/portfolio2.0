"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ArticleCard } from "@/components/shared/article-card"
import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"

export default function InsightsSection() {

  const articles = [
    {
      title: "Designing Incentive Systems",
      description:
        "Most products fail due to misaligned incentives, not poor UX.",
      href: "/articles/incentive-systems",
    },
    {
      title: "The Cost of Over-Engineering UX",
      description:
        "Complexity doesn't make products powerful — it makes them harder to use.",
      href: "/articles/overengineering-ux",
    },
    {
      title: "Risk as a Design Constraint",
      description:
        "In fintech, every product decision is also a risk decision.",
      href: "/articles/risk-as-design-constraint",
    },
    {
      title: "Designing Under Uncertainty",
      description:
        "Strong teams move forward without perfect data and learn faster.",
      href: "/articles/designing-under-uncertainty",
    },
  ]

  return (
    <SectionSubgroup
      label="Insights"
      description="Writing on product, systems, and decision-making."
      variant="spacious"
    >
      <section data-cursor-zone="thinking">
        <div className="space-y-12 md:space-y-14">

          {/* ── GRID ───────────────── */}
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
            className="
            grid md:grid-cols-2
            gap-6 md:gap-8
          "
          >
            {articles.map((article, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ArticleCard
                  index={index + 1}
                  title={article.title}
                  description={article.description}
                  href={article.href}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* ── VIEW ALL (upgraded) ───────────────── */}
          <div className="flex justify-start">

            <Link
              href="/articles"
              className="
              group relative inline-flex items-center gap-2

              text-sm font-medium
              text-foreground/70

              transition-all duration-300
              hover:text-foreground
            "
            >

              {/* TEXT */}
              <span className="relative">

                <span className="relative z-10">
                  View all writing
                </span>

                {/* ✨ underline (cleaner + softer) */}
                <span
                  className="
                  absolute left-0 -bottom-[2px]
                  h-[1px] w-full

                  bg-gradient-to-r
                  from-foreground/60
                  to-foreground/10

                  origin-left scale-x-0
                  transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]

                  group-hover:scale-x-100
                "
                />

              </span>

              {/* ICON */}
              <IconArrowUpRight
                size={16}
                className="
                opacity-50

                transition-all duration-300

                group-hover:opacity-100
                group-hover:translate-x-[3px]
                group-hover:-translate-y-[3px]
              "
              />

            </Link>

          </div>

        </div>

        {/* ── DIVIDER (softer) ───────────────── */}
        <div className="
        h-px w-full mt-12 md:mt-14

        bg-gradient-to-r
        from-transparent via-border/70 to-transparent
      " />
      </section>
    </SectionSubgroup>
  )
}