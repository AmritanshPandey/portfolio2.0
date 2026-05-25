import type { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

export function FadeIn({ children, className }: FadeInProps) {
  return <div className={className}>{children}</div>
}
