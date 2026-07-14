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
              "max-md:isolate max-md:block max-md:overflow-hidden max-md:rounded-lg max-md:border max-md:border-border/70 max-md:bg-card/92 max-md:p-3.5 max-md:text-foreground max-md:shadow-[0_18px_54px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.56)] max-md:backdrop-blur dark:max-md:border-white/[0.11] dark:max-md:bg-card/88 dark:max-md:shadow-[0_22px_58px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.06)]",
              i === items.length - 1 && "border-b",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm"
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent max-md:block"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(100%_58%_at_50%_0%,color-mix(in_srgb,var(--foreground)_5%,transparent),transparent_68%)] max-md:block dark:bg-[radial-gradient(100%_58%_at_50%_0%,rgba(255,255,255,0.055),transparent_68%)]"
            />
            <article className="md:hidden">
              <div className="relative mb-3 flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-border/70 bg-background shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:bg-white/[0.035]">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
                </span>
                <span>No. {String(i + 1).padStart(2, "0")}</span>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-border/55 bg-muted/30 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.24)]">
                <div className="relative aspect-[1.22/1]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 767px) calc(100vw - 64px), 1px"
                    className="object-cover saturate-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(85%_65%_at_50%_0%,rgba(255,255,255,0.28),transparent_62%)] dark:bg-[radial-gradient(85%_65%_at_50%_0%,rgba(255,255,255,0.14),transparent_62%)]" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/28 dark:ring-white/[0.08]" />
                  <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/78 text-foreground shadow-[0_12px_28px_rgba(0,0,0,0.20)] backdrop-blur-md transition-transform duration-500 group-active:scale-95 dark:bg-neutral-950/76 dark:shadow-[0_14px_34px_rgba(0,0,0,0.38)]">
                    <IconArrowUpRight size={18} stroke={2} />
                  </span>
                </div>
              </div>

              <div className="relative pt-3.5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="min-w-0 text-[21px] font-medium leading-tight tracking-[-0.01em] text-foreground">
                    {name}
                  </h3>
                  <span className="shrink-0 rounded-md border border-border/50 bg-muted/50 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] dark:bg-white/[0.035]">
                    Case Study
                  </span>
                </div>

                <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="my-4 border-t border-dashed border-border/65" />

                <dl className="grid gap-2.5 text-[12px] leading-snug">
                  {[
                    { label: "Type", value: category.type },
                    { label: "Role", value: role },
                    { label: "Team", value: category.client },
                    ...(item.metric ? [{ label: "Impact", value: item.metric }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">{label}</dt>
                      <dd className="text-foreground/72">{value}</dd>
                    </div>
                  ))}
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
