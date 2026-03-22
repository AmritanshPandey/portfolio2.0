"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        group relative flex items-center justify-center
        w-9 h-9 rounded-full
        border border-border
        bg-background/70 backdrop-blur-md
        text-muted-foreground hover:text-foreground
        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:scale-[1.05] active:scale-[0.96]
        hover:border-border/80
      "
    >

      {/* subtle glow */}
      <span
        className="
          absolute inset-0 rounded-full opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
          bg-gradient-to-br from-transparent via-primary/10 to-transparent
        "
      />

      {/* icon swap */}
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <IconSun size={16} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <IconMoon size={16} />
          </motion.span>
        )}
      </AnimatePresence>

    </button>
  )
}