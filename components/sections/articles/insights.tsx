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
        "Most products fail because incentives are misaligned, not because UX is broken.",
      href: "/articles/incentive-systems",
    },
    {
      title: "The Cost of Over-Engineering UX",
      description:
        "Complexity doesn't make products powerful, it makes them harder to use.",
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
        "Strong teams move forward without perfect data and learn faster because of it.",
      href: "/articles/designing-under-uncertainty",
    },
  ]

  return (
    <SectionSubgroup
      label="Notes & Insights"
      description="Writing on product, systems, and decision-making"
      variant="spacious"
    >

      <div className="space-y-10 md:space-y-12">

        {/* GRID */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid md:grid-cols-2 gap-6 md:gap-8"
        >

          {articles.map((article, index) => (

            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 16 },
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

        {/* VIEW ALL */}
        <div>
          <Link
            href="/articles"
            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-red-600 transition-colors duration-200"
          >
            <span className="relative">
              View all writing
              <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </span>

            <IconArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
            />
          </Link>
        </div>

      </div>
      <div className="h-px w-full pb-8" />
    </SectionSubgroup>
  )
}