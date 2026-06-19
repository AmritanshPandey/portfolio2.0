"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { EASE, DURATION, RISE } from "@/lib/motion"

interface FadeInProps {
  children: ReactNode
  /** Stagger offset in seconds — set this higher on later siblings. */
  delay?: number
  /** Distance the element rises from, in px. */
  y?: number
  /** Animation length in seconds. */
  duration?: number
  /** How early it triggers as it scrolls in (negative = later). */
  margin?: string
  className?: string
}

/**
 * Fade + rise on scroll into view. Replaces the per-page copies that used to
 * live in every case study and article. Honours prefers-reduced-motion through
 * the app-level <MotionConfig reducedMotion="user"> wrapper in layout.tsx.
 */
export function FadeIn({
  children,
  delay = 0,
  y = RISE,
  duration = DURATION.base,
  margin = "-60px",
  className,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: margin as never }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
