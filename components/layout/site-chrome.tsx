"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

// The unlock screen stands alone: no nav, cursor, background field or footer.
const BARE_ROUTES = new Set(["/unlock"])

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (BARE_ROUTES.has(pathname)) return null

  return children
}
