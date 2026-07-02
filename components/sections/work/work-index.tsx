import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { WorkItem } from "@/lib/types/content"

function splitCategory(category: string) {
  const [type, client] = category.split("/").map((part) => part.trim())
  return { type, client: client ?? "Portfolio" }
}

function projectName(title: string) {
  return title.split(":")[0]?.trim() || title
}

export function WorkIndex({ items }: { items: WorkItem[] }) {
  return (
    <div className="work-index relative max-md:space-y-4" data-work-animate>
      {items.map((item, i) => {
        const category = splitCategory(item.category)
        const name = projectName(item.title)
        const role = item.tags?.slice(0, 2).join(", ") ?? "Product strategy, Interface design"

        return (
          <Link
            key={item.href}
            href={item.href}
            data-cursor-image={item.image}
            className={clsx(
              "work-row group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 border-t border-border/60 py-6 md:py-8",
              "md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto] md:gap-x-10",
              "max-md:block max-md:overflow-hidden max-md:rounded-lg max-md:border max-md:border-border/70 max-md:bg-card/88 max-md:p-3 max-md:text-foreground max-md:shadow-[var(--shadow-md)] max-md:backdrop-blur dark:max-md:bg-card/90 dark:max-md:shadow-[0_22px_52px_rgba(0,0,0,0.42)]",
              i === items.length - 1 && "border-b",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm"
            )}
          >
            <article className="md:hidden">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <span className="h-3 w-3 rounded-full border border-border/70 bg-background" />
                <span>No. {String(i + 1).padStart(2, "0")}</span>
              </div>

              <div className="relative overflow-hidden rounded-md border border-border/60 bg-muted/30">
                <div className="relative aspect-[1.28/1]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 767px) calc(100vw - 64px), 1px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(85%_65%_at_50%_0%,rgba(255,255,255,0.28),transparent_62%)] dark:bg-[radial-gradient(85%_65%_at_50%_0%,rgba(255,255,255,0.14),transparent_62%)]" />
                  <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full border border-border/65 bg-background/72 text-foreground shadow-[0_12px_28px_rgba(0,0,0,0.20)] backdrop-blur-md dark:bg-neutral-950/72 dark:shadow-[0_14px_34px_rgba(0,0,0,0.38)]">
                    <IconArrowUpRight size={18} stroke={2} />
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="min-w-0 text-[21px] font-medium leading-tight tracking-[-0.01em] text-foreground">
                    {name}
                  </h3>
                  <span className="shrink-0 rounded border border-border/45 bg-muted/60 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Case Study
                  </span>
                </div>

                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="my-4 border-t border-dashed border-border/70" />

                <dl className="space-y-2.5 text-[12px] leading-snug">
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">Type</dt>
                    <dd className="text-foreground/72">{category.type}</dd>
                  </div>
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">Role</dt>
                    <dd className="text-foreground/72">{role}</dd>
                  </div>
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">Team</dt>
                    <dd className="text-foreground/72">{category.client}</dd>
                  </div>
                  {item.metric && (
                    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">Impact</dt>
                      <dd className="text-foreground/72">{item.metric}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </article>

            <div className="hidden min-w-0 md:block">
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
            </div>

            <div className="hidden min-w-0 md:block">
              <p className="max-w-[46ch] text-[13.5px] leading-relaxed text-foreground/55 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-foreground/80">
                {item.description}
              </p>
            </div>

            <span
              className={clsx(
                "relative hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 md:flex",
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
        )
      })}
    </div>
  )
}
