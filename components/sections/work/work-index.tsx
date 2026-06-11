"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"
import type { WorkItem } from "@/lib/types/content"

/**
 * Editorial project index — full-width rows with large titles, hairline
 * separators, and (on fine pointers) a floating image preview that trails
 * the cursor. Touch devices get the same rows with static meta; nothing
 * is gated behind hover.
 */
export function WorkIndex({ items }: { items: WorkItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const moveX = useRef<((v: number) => void) | null>(null)
  const moveY = useRef<((v: number) => void) | null>(null)
  const followEnabled = useRef(false)

  // Rows rise in as a stagger when the index scrolls into view.
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const tween = gsap.from(root.querySelectorAll(".work-row"), {
      y: 34,
      autoAlpha: 0,
      duration: 0.85,
      stagger: 0.08,
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: root, start: "top 82%", once: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const preview = previewRef.current
    if (!root || !preview) return

    // The trailing preview is a fine-pointer, large-viewport, full-motion
    // garnish only — everywhere else the rows carry all the information.
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.matchMedia("(min-width: 1024px)").matches &&
      !prefersReducedMotion()
    followEnabled.current = ok
    if (!ok) return

    gsap.set(preview, { xPercent: -50, yPercent: -118, autoAlpha: 0, scale: 0.92 })
    moveX.current = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3.out" })
    moveY.current = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3.out" })

    const onMove = (e: PointerEvent) => {
      moveX.current?.(e.clientX)
      moveY.current?.(e.clientY)
    }
    root.addEventListener("pointermove", onMove, { passive: true })
    return () => root.removeEventListener("pointermove", onMove)
  }, [])

  useEffect(() => {
    const preview = previewRef.current
    if (!preview || !followEnabled.current) return
    gsap.to(preview, {
      autoAlpha: active === null ? 0 : 1,
      scale: active === null ? 0.92 : 1,
      rotate: active === null ? -4 : 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    })
  }, [active])

  return (
    <div ref={rootRef} className="work-index relative">
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          data-cursor-card
          data-cursor-label="View"
          onPointerEnter={() => setActive(i)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
          className={clsx(
            "work-row group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 border-t border-border/60 py-6 md:py-8",
            "md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto] md:gap-x-10",
            i === items.length - 1 && "border-b",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm"
          )}
        >
          <div className="min-w-0">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {item.category}
            </p>
            <h3
              className={clsx(
                "leading-[1.08] font-bold tracking-[-0.02em] text-foreground",
                "transition-[transform,color] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:translate-x-2",
                item.featured
                  ? "text-[clamp(1.6rem,3.4vw,2.6rem)]"
                  : "text-[clamp(1.35rem,2.6vw,2rem)]"
              )}
            >
              {item.title}
            </h3>
            <p className="mt-2.5 max-w-[52ch] text-[13px] leading-relaxed text-foreground/55 md:hidden">
              {item.description}
            </p>
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="max-w-[46ch] text-[13.5px] leading-relaxed text-foreground/60">
              {item.description}
            </p>
          </div>

          <span
            className={clsx(
              "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60",
              "transition-[border-color,transform] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:scale-105 group-hover:border-accent/60"
            )}
          >
            {/* Fill grows from the centre — no hard background swap */}
            <span
              aria-hidden
              className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
            />
            {/* Arrow swap: one flies out top-right, its twin arrives from bottom-left */}
            <span className="relative z-10 grid place-items-center text-foreground group-hover:text-white dark:group-hover:text-neutral-950">
              <IconArrowUpRight
                size={17}
                stroke={2}
                className="col-start-1 row-start-1 transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[160%] group-hover:-translate-y-[160%]"
              />
              <IconArrowUpRight
                size={17}
                stroke={2}
                aria-hidden
                className="col-start-1 row-start-1 -translate-x-[160%] translate-y-[160%] transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
              />
            </span>
          </span>
        </Link>
      ))}

      {/* Floating preview — decorative, pointer-events-none, fixed so it
          rides above the rows without affecting layout. */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[340px] overflow-hidden rounded-2xl border border-border/60 shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:block"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <div className="relative aspect-[4/3] bg-[oklch(0.18_0_0)]">
          {items.map((item, i) =>
            item.image ? (
              <Image
                key={item.href}
                src={item.image}
                alt=""
                fill
                sizes="340px"
                className={clsx(
                  "object-cover transition-opacity duration-300",
                  active === i ? "opacity-100" : "opacity-0"
                )}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
