import type { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  /** Kept for call-site compatibility; the Ledger system no longer fades every block. */
  delay?: number
  y?: number
  duration?: number
  margin?: string
  className?: string
}

/**
 * Formerly a fade-and-rise on every block. The Ledger system keeps motion to a
 * few designed moments (see the settle in globals.css), so this now renders
 * its children as they are. Props stay so the 200+ call sites keep compiling.
 */
export function FadeIn({ children, className }: FadeInProps) {
  return <div className={className}>{children}</div>
}
