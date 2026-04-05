"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) return (
    // Skeleton — same size, prevents layout shift
    <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
  )

  const isDark = theme === "dark"

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        group relative flex items-center justify-center
        w-9 h-9 rounded-full
        border border-white/10
        bg-white/[0.04] backdrop-blur-md
        text-white/50 hover:text-white/90
        transition-colors duration-300 outline-none
        focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black
      "
    >

      {/* Hover glow — colour shifts with mode */}
      <span
        className={`
          pointer-events-none absolute inset-0 rounded-full opacity-0
          group-hover:opacity-100 transition-opacity duration-300
          ${isDark
            ? "bg-[radial-gradient(circle,rgba(251,191,36,0.12)_0%,transparent_70%)]"
            : "bg-[radial-gradient(circle,rgba(99,179,237,0.10)_0%,transparent_70%)]"
          }
        `}
      />

      {/* Border glow on hover */}
      <span
        className={`
          pointer-events-none absolute inset-0 rounded-full opacity-0
          group-hover:opacity-100 transition-opacity duration-300
          ${isDark ? "shadow-[0_0_0_1px_rgba(251,191,36,0.25)]" : "shadow-[0_0_0_1px_rgba(99,179,237,0.20)]"}
        `}
      />

      {/* Icon swap — instant scale + fade, no rotation noise */}
      <AnimatePresence initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, scale: 0.75, y: 4  }}
            animate={{ opacity: 1, scale: 1,    y: 0,
              transition: { duration: 0.12, ease: "easeOut" } }}
            exit={{    opacity: 0, scale: 0.75, y: -4,
              transition: { duration: 0.08, ease: "easeIn" } }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <IconSun size={15} stroke={1.75}
              className="text-amber-300/80 group-hover:text-amber-300 transition-colors duration-150" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, scale: 0.75, y: 4  }}
            animate={{ opacity: 1, scale: 1,    y: 0,
              transition: { duration: 0.12, ease: "easeOut" } }}
            exit={{    opacity: 0, scale: 0.75, y: -4,
              transition: { duration: 0.08, ease: "easeIn" } }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <IconMoon size={15} stroke={1.75}
              className="text-sky-500 group-hover:text-sky-300 transition-colors duration-150" />
          </motion.span>
        )}
      </AnimatePresence>

    </motion.button>
  )
}