import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { WorkItem } from "@/lib/types/content"
import { WorkSpecimen } from "./work-specimens"

/** "Demo Systems / Mastercard" → "Demo systems at Mastercard". Sentence case
 *  instead of a tracked mono label, so the context reads as a phrase. */
function context(category: string) {
  const [type, client] = category.split("/").map((part) => part.trim())
  const sentence = type.charAt(0) + type.slice(1).toLowerCase()
  return client ? `${sentence} at ${client}` : sentence
}

const slugOf = (href: string) => href.replace(/^\/work\//, "")

/**
 * The work index: one row per case study, the story on the left and a picture
 * of the work on the right (above it on phones).
 *
 * The picture is the row's real screenshot when `cover` is set; otherwise it's
 * the drawn specimen of that project's core mechanism. Each row renders once
 * for every breakpoint, so headings and links aren't duplicated in the DOM.
 */
export function WorkIndex({ items }: { items: WorkItem[] }) {
  return (
    <div className="work-index relative" data-work-animate>
      {items.map((item, i) => {
        const slug = slugOf(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "work-row group relative grid gap-7 border-t border-border/60 py-10",
              "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-x-12 md:py-14 lg:gap-x-20",
              i === items.length - 1 && "border-b",
              "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-8 focus-visible:ring-offset-background"
            )}
          >
            <div className="order-2 min-w-0 md:order-1">
              <p className="text-[13.5px] leading-snug text-muted-foreground">
                {context(item.category)}
              </p>

              <h3
                className={clsx(
                  "work-title-hover mt-3 max-w-[22ch] font-bold leading-[1.1] tracking-[-0.015em] text-foreground",
                  i === 0
                    ? "text-[clamp(1.6rem,2.6vw,2.3rem)]"
                    : "text-[clamp(1.4rem,2.1vw,1.85rem)]"
                )}
              >
                {item.title}
              </h3>

              <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-foreground/65 transition-colors duration-700 group-hover:text-foreground/85">
                {item.description}
              </p>

              <span className="mt-7 inline-flex items-center gap-3 text-[14px] font-medium text-foreground/85">
                Read the case study
                <span
                  aria-hidden
                  className={clsx(
                    "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70",
                    "transition-[border-color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "row-on:scale-105 row-on:border-accent/60"
                  )}
                >
                  {/* Fill grows from the centre, no hard background swap */}
                  <span className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] row-on:scale-100" />
                  {/* Arrow swap: one flies out top-right, its twin arrives from bottom-left */}
                  <span className="relative z-10 grid place-items-center text-foreground row-on:text-white dark:row-on:text-neutral-950">
                    <IconArrowUpRight
                      size={16}
                      stroke={2}
                      className="col-start-1 row-start-1 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] row-on:-translate-y-[160%] row-on:translate-x-[160%]"
                    />
                    <IconArrowUpRight
                      size={16}
                      stroke={2}
                      className="col-start-1 row-start-1 -translate-x-[160%] translate-y-[160%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] row-on:translate-x-0 row-on:translate-y-0"
                    />
                  </span>
                </span>
              </span>
            </div>

            <div className="order-1 min-w-0 md:order-2">
              {item.cover ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-card ring-1 ring-foreground/[0.08] dark:ring-white/[0.07]">
                  <Image
                    src={item.cover}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw, 640px"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] row-on:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
              ) : (
                <WorkSpecimen slug={slug} />
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
