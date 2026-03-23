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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={clsx(
        "relative rounded-3xl px-6 py-8 md:px-10 md:py-10",
        "border border-border",
        "bg-gradient-to-br from-background to-muted/20",
        "dark:from-neutral-950 dark:to-white/[0.03]",
        "overflow-hidden",
        className
      )}
    >

      {/* existing visuals untouched */}
      <div className="
        pointer-events-none absolute inset-y-0 left-0 w-24
        bg-gradient-to-r
        from-orange-500/[0.12]
        via-orange-500/[0.05]
        to-transparent
        blur-xl
        opacity-60
      " />

      <div className="
        pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px]
        bg-[radial-gradient(circle,rgba(249,115,22,0.10),transparent_70%)]
        dark:bg-[radial-gradient(circle,rgba(251,146,60,0.14),transparent_70%)]
        blur-3xl
      " />

      <div className="
        pointer-events-none absolute inset-0
        bg-[linear-gradient(110deg,transparent,rgba(249,115,22,0.06),transparent)]
        dark:bg-[linear-gradient(110deg,transparent,rgba(251,146,60,0.10),transparent)]
        bg-[length:220%_220%]
        animate-[sheen_14s_ease-in-out_infinite]
        opacity-60
      " />

      <div className="
        pointer-events-none absolute inset-0 rounded-3xl
        bg-gradient-to-b from-white/[0.04] to-transparent
        dark:from-white/[0.03]
      " />

      <div className="
        absolute inset-x-0 top-0 h-px
        bg-gradient-to-r from-transparent via-foreground/10 to-transparent
        dark:via-white/20
      " />

      {/* CONTENT */}
      <div className="relative max-w-3xl">

        {/* ✅ FIX 1: eyebrow contrast */}
        {eyebrow && (
          <p className="
            text-[12px] uppercase tracking-[0.18em]
            text-foreground/60 
            mb-4 font-medium
          ">
            {eyebrow}
          </p>
        )}

        {/* ✅ FIX 2: main text readability */}
        <div className="
          text-xl md:text-2xl lg:text-[28px]
          font-medium leading-[1.4]
          text-foreground

          /* improves readability over gradients */
        
          dark:[text-shadow:none]
        ">
          {children}
        </div>

      </div>

    </motion.div>
  )
}