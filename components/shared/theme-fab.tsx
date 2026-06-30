"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"

/**
 * Floating theme toggle — a fixed circular FAB pinned to the bottom-right,
 * site-wide. Replaces the in-navbar theme button. Hydration-safe (renders
 * nothing until mounted so SSR markup matches).
 */
export function ThemeFab() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        group fixed bottom-5 right-5 z-50 flex size-12 items-center justify-center rounded-full
        border border-black/[0.06] bg-white/90 text-foreground shadow-[0_14px_40px_rgba(0,0,0,0.18)]
        backdrop-blur-xl transition-transform duration-200 hover:scale-105 active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background
        dark:border-white/[0.10] dark:bg-neutral-950/84 dark:shadow-[0_14px_40px_rgba(0,0,0,0.5)]
        md:bottom-6 md:right-6
      "
      style={{
        WebkitBackdropFilter: "saturate(145%) blur(16px)",
        backdropFilter: "saturate(145%) blur(16px)",
      }}
    >
      <AnimatePresence initial={false} mode="wait">
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 45 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <IconSun size={20} stroke={1.75} className="text-amber-400" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, scale: 0.7, rotate: 45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: -45 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <IconMoon size={19} stroke={1.75} className="text-sky-500" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
