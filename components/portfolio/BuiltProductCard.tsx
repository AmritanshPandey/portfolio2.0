import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight, IconBolt } from "@tabler/icons-react"
import type { LabProduct } from "@/data/portfolio/types"

/* ----------------------------------------------------------------------------
   BuiltProductCard — medium card for the "Lab" (frontend-built products).
   Renders 3–4 across; image-light, status-forward.
---------------------------------------------------------------------------- */

const STATUS_STYLES: Record<LabProduct["status"], string> = {
  Live: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  Demo: "bg-accent/12 text-accent border-accent/25",
  Concept: "bg-muted/60 text-muted-foreground border-black/[0.06] dark:border-white/[0.08]",
  "In Development":
    "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25",
}

export function BuiltProductCard({ product }: { product: LabProduct }) {
  const ready = Boolean(product.href) && !product.placeholder

  const inner = (
    <article
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-xl",
        "border border-black/[0.07] dark:border-white/[0.08]",
        "bg-white dark:bg-[oklch(0.18_0_0)]",
        "transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        ready && "hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_14px_34px_rgba(0,0,0,0.12)]",
      )}
    >
      {product.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className={clsx(
              "object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              ready && "group-hover:scale-[1.04]",
            )}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <IconBolt size={12} className="text-accent" /> Built
          </span>
          <span
            className={clsx(
              "rounded-full border px-2 py-0.5 text-[10px] font-medium",
              STATUS_STYLES[product.status],
            )}
          >
            {product.status}
          </span>
        </div>

        <h3 className="text-[1rem] font-bold leading-snug tracking-[-0.01em] text-foreground">
          {product.title}
        </h3>

        <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-foreground/55">
          {product.summary}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.stack.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full border border-black/[0.06] bg-muted/30 px-2 py-0.5 text-[10.5px] text-foreground/60 dark:border-white/[0.06]"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[12.5px] font-medium">
          {ready ? (
            <>
              <span className="text-foreground/70 transition-colors group-hover:text-foreground">
                Open product
              </span>
              <IconArrowUpRight
                size={14}
                stroke={2}
                className="text-foreground/50 transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-accent"
              />
            </>
          ) : (
            <span className="text-muted-foreground">In progress</span>
          )}
        </div>
      </div>
    </article>
  )

  if (!ready) return <div className="h-full">{inner}</div>

  return (
    <Link
      href={product.href!}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {inner}
    </Link>
  )
}
