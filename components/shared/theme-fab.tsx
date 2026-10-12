"use client"

import clsx from "clsx"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

/**
 * Theme toggle: a small ruled square whose mark is half filled with ink. It
 * turns a half-rotation as the sheet flips between paper and night. Lives in
 * the nav (and the phone menu), so nothing floats over the page.
 * Hydration-safe: renders an inert placeholder until mounted.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const isDark = mounted && theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={clsx(
        "group flex size-9 shrink-0 items-center justify-center border border-border text-foreground",
        "transition-[border-color,transform] duration-200 hover:border-foreground active:translate-y-px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden
        className="block size-3.5 border border-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: "linear-gradient(135deg, currentColor 0 50%, transparent 50% 100%)",
          transform: isDark ? "rotate(180deg)" : "rotate(0deg)",
        }}
      />
    </button>
  )
}

/** Kept for compatibility: the floating toggle is retired in favour of the nav. */
export function ThemeFab() {
  return null
}
