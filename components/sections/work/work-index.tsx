import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { WorkItem } from "@/lib/types/content"

export function WorkIndex({ items }: { items: WorkItem[] }) {
  return (
    <div className="work-index relative" data-work-animate>
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          data-cursor-image={item.image}
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
                "work-title-hover leading-[1.08] font-bold tracking-[-0.02em] text-foreground",
                item.featured
                  ? "text-[clamp(1.3rem,2.2vw,1.9rem)]"
                  : "text-[clamp(1.1rem,1.6vw,1.5rem)]"
              )}
            >
              {item.title}
            </h3>
            <p className="mt-2.5 max-w-[52ch] text-[13px] leading-relaxed text-foreground/55 md:hidden">
              {item.description}
            </p>
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="max-w-[46ch] text-[13.5px] leading-relaxed text-foreground/55 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-foreground/80">
              {item.description}
            </p>
          </div>

          <span
            className={clsx(
              "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60",
              "transition-[border-color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:scale-105 group-hover:border-accent/60"
            )}
          >
            {/* Fill grows from the centre — no hard background swap */}
            <span
              aria-hidden
              className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
            />
            {/* Arrow swap: one flies out top-right, its twin arrives from bottom-left */}
            <span className="relative z-10 grid place-items-center text-foreground group-hover:text-white dark:group-hover:text-neutral-950">
              <IconArrowUpRight
                size={17}
                stroke={2}
                className="col-start-1 row-start-1 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[160%] group-hover:-translate-y-[160%]"
              />
              <IconArrowUpRight
                size={17}
                stroke={2}
                aria-hidden
                className="col-start-1 row-start-1 -translate-x-[160%] translate-y-[160%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
              />
            </span>
          </span>
        </Link>
      ))}
    </div>
  )
}
