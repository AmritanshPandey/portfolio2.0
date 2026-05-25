"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) return <div className="w-9 h-9 rounded-full" />

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        group relative flex items-center justify-center
        w-9 h-9 rounded-full
        border border-white/10
        bg-white/[0.04]
        text-white/50 hover:text-white/90
        transition-colors duration-150 outline-none
        focus-visible:ring-2 focus-visible:ring-white/20
      "
    >
      <AnimatePresence initial={false} mode="wait">
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.1 } }}
            exit={{    opacity: 0, scale: 0.8, transition: { duration: 0.08 } }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <IconSun size={15} stroke={1.75} className="text-amber-300/80 group-hover:text-amber-300 transition-colors duration-100" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.1 } }}
            exit={{    opacity: 0, scale: 0.8, transition: { duration: 0.08 } }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <IconMoon size={15} stroke={1.75} className="text-sky-400 group-hover:text-sky-300 transition-colors duration-100" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
