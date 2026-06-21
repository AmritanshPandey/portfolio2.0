"use client"

import Link from "next/link"
import type { MouseEvent, ReactNode } from "react"

/** Track the pointer within a cell so the spotlight glow can follow it. */
function trackPointer(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
  el.style.setProperty("--my", `${e.clientY - rect.top}px`)
}

/**
 * Client wrapper that owns the bento cell's interactivity: the pointer-tracking
 * spotlight glow and the optional link behaviour. Kept separate from BentoCard
 * so BentoCard can stay a server component (and accept an icon component prop).
 */
export function BentoCardShell({
  href,
  cursorLabel,
  className,
  background,
  children,
}: {
  href?: string
  cursorLabel?: string
  className?: string
  /** Decorative layer rendered behind the spotlight + content. */
  background?: ReactNode
  children: ReactNode
}) {
  const inner = (
    <>
      {background}

      {/* Cursor-tracking spotlight glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)",
        }}
      />

      {children}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        onMouseMove={trackPointer}
        data-cursor-card
        data-cursor-label={cursorLabel}
        className={className}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div onMouseMove={trackPointer} className={className}>
      {inner}
    </div>
  )
}
