"use client"

import { useEffect, useState } from "react"
import clsx from "clsx"

export type CsNavItem = { id: string; label: string }

/**
 * Sticky "On this page" rail, mirroring the fintech design-system catalog nav.
 * Sits in the left margin of the centered (max-w-[1000px]) case-study column,
 * so it only appears once there is room for it and never overlaps content.
 */
export function CsOnThisPage({ items }: { items: CsNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden min-[1480px]:block">
      <div className="relative mx-auto h-full max-w-[1000px]">
        <nav
          aria-label="On this page"
          className="pointer-events-auto absolute left-0 top-1/2 w-[188px] -translate-x-[calc(100%+2.5rem)] -translate-y-1/2 rounded-2xl border border-border/50 bg-background/75 px-3 py-4 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md"
        >
          <p className="mb-3 pl-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            On this page
          </p>
          <div className="space-y-0.5 border-l border-border/60 pl-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={clsx(
                  "block rounded-md px-2.5 py-1.5 text-[12.5px] font-medium leading-snug transition-colors duration-200",
                  active === item.id
                    ? "bg-muted/60 text-foreground"
                    : "text-muted-foreground/70 hover:bg-muted/40 hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
