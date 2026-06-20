"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { IconChevronDown, IconArrowUpRight } from "@tabler/icons-react"
import type { MegaMenuColumn } from "@/data/portfolio/types"

/* ----------------------------------------------------------------------------
   WorkMegaMenu — mode-aware 3-column "Work" dropdown for the navbar. Labels and
   items come from the active mode's config.

   Accessibility: opens on hover (pointer) and on focus-within (keyboard),
   closes on Escape (returning focus to the trigger) and when focus leaves.
---------------------------------------------------------------------------- */

function MenuLink({ label, href, onNavigate }: { label: string; href: string; onNavigate: () => void }) {
  const isAnchor = href.startsWith("#")
  const className =
    "group/item flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13.5px] text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-foreground focus-visible:bg-black/[0.04] focus-visible:text-foreground focus-visible:outline-none dark:hover:bg-white/[0.06] dark:focus-visible:bg-white/[0.06]"
  const icon = (
    <IconArrowUpRight
      size={14}
      className="shrink-0 text-foreground/25 transition-all duration-200 group-hover/item:translate-x-[1px] group-hover/item:-translate-y-[1px] group-hover/item:text-accent"
    />
  )

  if (isAnchor) {
    return (
      <a href={href} onClick={onNavigate} role="menuitem" className={className}>
        {label}
        {icon}
      </a>
    )
  }
  return (
    <Link href={href} onClick={onNavigate} role="menuitem" className={className}>
      {label}
      {icon}
    </Link>
  )
}

export function WorkMegaMenu({ columns }: { columns: MegaMenuColumn[] }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  // Close when focus leaves the whole menu (keyboard tab-out).
  const onBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "relative flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Work
        <IconChevronDown
          size={14}
          className={clsx("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Work"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={clsx(
              "absolute left-1/2 top-[calc(100%+12px)] z-50 w-[640px] max-w-[90vw] -translate-x-1/2",
              "rounded-2xl border border-black/[0.08] bg-white/95 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-md",
              "dark:border-white/[0.10] dark:bg-neutral-900/95",
            )}
          >
            <div className="grid grid-cols-3 gap-3">
              {columns.map((col) => (
                <div key={col.heading} className="flex flex-col">
                  <p className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {col.heading}
                  </p>
                  <div className="flex flex-col">
                    {col.items.map((item) => (
                      <MenuLink
                        key={item.label}
                        label={item.label}
                        href={item.href}
                        onNavigate={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
