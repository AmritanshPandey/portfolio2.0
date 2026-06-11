"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"
import type { ArticleItem } from "@/lib/types/content"

/**
 * Reading list — the quieter sibling of the work index. Same editorial
 * row grammar (hairlines, recede-on-hover), smaller voice.
 */
export function InsightsList({ items }: { items: ArticleItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const tween = gsap.from(root.querySelectorAll(".work-row"), {
      y: 26,
      autoAlpha: 0,
      duration: 0.75,
      stagger: 0.07,
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: root, start: "top 84%", once: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div ref={rootRef} className="work-index">
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          data-cursor-card
          data-cursor-label="Read"
          className={clsx(
            "work-row group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 border-t border-border/60 py-5 md:py-6",
            "md:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)_auto] md:gap-x-10",
            i === items.length - 1 && "border-b",
            "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          )}
        >
          <p className="order-2 col-span-2 mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:order-none md:col-span-1 md:mt-0">
            {item.category}
            {item.readTime ? <span className="text-foreground/30"> · {item.readTime}</span> : null}
          </p>

          <h3
            className={clsx(
              "order-1 md:order-none min-w-0 text-[clamp(1.15rem,2vw,1.5rem)] font-semibold leading-[1.22] tracking-[-0.012em] text-foreground",
              "transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:translate-x-2"
            )}
          >
            {item.title}
          </h3>

          <span className="order-1 md:order-none relative grid shrink-0 place-items-center overflow-hidden">
            <IconArrowUpRight
              size={17}
              stroke={2}
              className="col-start-1 row-start-1 text-foreground/30 transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[160%] group-hover:-translate-y-[160%]"
            />
            <IconArrowUpRight
              size={17}
              stroke={2}
              aria-hidden
              className="col-start-1 row-start-1 -translate-x-[160%] translate-y-[160%] text-accent transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
            />
          </span>
        </Link>
      ))}
    </div>
  )
}
