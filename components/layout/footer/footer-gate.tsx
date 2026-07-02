"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const HIDDEN_FOOTER_ROUTES = new Set(["/playground"])

export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (HIDDEN_FOOTER_ROUTES.has(pathname)) return null

  return children
}
