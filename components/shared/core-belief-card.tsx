"use client"

import { motion } from "framer-motion"
import clsx from "clsx"

type Props = {
  eyebrow?: string
  children: React.ReactNode
  className?: string
}

export function CoreBeliefCard({
  eyebrow = "Core Belief",
  children,
  className,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} // reduced motion
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={clsx(
        "relative rounded-3xl px-6 py-8 md:px-10 md:py-10",
        "border border-border",
        "bg-gradient-to-br from-background to-muted/20",
        "dark:from-neutral-950 dark:to-white/[0.03]",
        "overflow-hidden",

        // 🔥 GPU isolation
        "[transform:translateZ(0)]",
        "[backface-visibility:hidden]",

        className
      )}
    >

      {/* LEFT AMBIENT (lighter blur) */}
      <div className="
        pointer-events-none absolute inset-y-0 left-0 w-20
        bg-gradient-to-r
        from-orange-500/[0.10]
        via-orange-500/[0.04]
        to-transparent
        blur-lg
        opacity-60
      " />

      {/* RADIAL GLOW (lighter + smaller) */}
      <div className="
        pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px]
        bg-[radial-gradient(circle,rgba(249,115,22,0.08),transparent_70%)]
        dark:bg-[radial-gradient(circle,rgba(251,146,60,0.10),transparent_70%)]
        blur-2xl
      " />

      {/* ✨ REMOVE heavy animated sheen (Safari killer) */}
      {/* replaced with subtle static gradient */}
      <div className="
        pointer-events-none absolute inset-0
        opacity-40
        bg-[linear-gradient(110deg,transparent,rgba(249,115,22,0.05),transparent)]
        dark:bg-[linear-gradient(110deg,transparent,rgba(251,146,60,0.08),transparent)]
      " />

      {/* TOP SOFT LIGHT */}
      <div className="
        pointer-events-none absolute inset-0 rounded-3xl
        bg-gradient-to-b from-white/[0.03] to-transparent
        dark:from-white/[0.02]
      " />

      {/* EDGE */}
      <div className="
        absolute inset-x-0 top-0 h-px
        bg-gradient-to-r from-transparent via-foreground/10 to-transparent
        dark:via-white/20
      " />

      {/* CONTENT */}
      <div className="relative max-w-3xl">

        {/* EYEBROW */}
        {eyebrow && (
          <p className="
            text-[12px] uppercase tracking-[0.18em]
            text-foreground/60
            mb-4 font-medium
          ">
            {eyebrow}
          </p>
        )}

        {/* TEXT */}
        <div className="
          text-xl md:text-2xl lg:text-[28px]
          font-medium leading-[1.4]
          text-foreground
        ">
          {children}
        </div>

      </div>

    </motion.div>
  )
}