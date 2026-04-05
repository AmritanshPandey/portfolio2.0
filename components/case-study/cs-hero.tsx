"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import type { CaseStudyMeta } from "@/lib/types/case-study"

interface Props {
  title: string
  subtitle: string
  meta: CaseStudyMeta
}

const META_LABELS: Record<string, string> = {
  role: "Role",
  duration: "Duration",
  platform: "Platform",
  team: "Team",
}

export function CsHero({ title, subtitle, meta }: Props) {
  const metaEntries = Object.entries(meta).filter(([, v]) => Boolean(v))

  return (
    <div className="relative overflow-hidden bg-[oklch(0.985_0_0)] dark:bg-[oklch(0.14_0_0)]">

      {/* Ambient light — matches Section component pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="
          absolute inset-0
          bg-[radial-gradient(900px_400px_at_20%_0%,rgba(249,115,22,0.05),transparent_60%)]
          opacity-70 dark:hidden
        " />
        <div className="
          hidden dark:block absolute inset-0
          bg-[radial-gradient(900px_400px_at_20%_0%,rgba(249,115,22,0.08),transparent_60%)]
        " />
      </div>

      <div className="relative max-w-[1000px] mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-20">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/#work"
            className="
              inline-flex items-center gap-2 mb-12
              text-sm text-muted-foreground hover:text-foreground
              transition-colors duration-200
            "
          >
            <IconArrowLeft size={15} strokeWidth={2} />
            Back to Work
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="
            text-4xl md:text-5xl lg:text-[3.25rem]
            font-semibold tracking-tight leading-[1.06]
            text-neutral-900 dark:text-white
            max-w-3xl mb-6
          "
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="
            text-base md:text-lg leading-relaxed
            text-muted-foreground max-w-2xl mb-14 md:mb-16
          "
        >
          {subtitle}
        </motion.p>

        {/* Meta */}
        {metaEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="
              flex flex-wrap gap-x-10 gap-y-6
              pt-8 border-t border-border/60
            "
          >
            {metaEntries.map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <p className="
                  text-[10px] font-semibold uppercase tracking-[0.18em]
                  text-muted-foreground
                ">
                  {META_LABELS[key] ?? key}
                </p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </motion.div>
        )}

      </div>

      {/* Bottom separator */}
      <div className="
        absolute bottom-0 left-0 w-full h-px
        bg-gradient-to-r from-transparent via-foreground/10 to-transparent
        dark:via-white/10
      " />
    </div>
  )
}
