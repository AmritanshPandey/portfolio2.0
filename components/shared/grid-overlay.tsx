"use client"

import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

/**
 * Development-only overlay of the page grid (12 / 8 / 4 columns) for checking
 * alignment. Add `?grid` to any URL. Mounted from app/layout.tsx only outside
 * production, and renders nothing on the server.
 */

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange)
  return () => window.removeEventListener("popstate", onChange)
}
const getSnapshot = () => new URLSearchParams(window.location.search).has("grid")
const getServerSnapshot = () => false

const columnVisibility = (i: number) =>
  i < 4 ? "" : i < 8 ? "hidden md:block" : "hidden lg:block"

export function GridOverlay() {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (!on) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div className="page-container h-full">
        <div className="grid-page h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={cn("h-full border-x border-accent/25 bg-accent/[0.07]", columnVisibility(i))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
