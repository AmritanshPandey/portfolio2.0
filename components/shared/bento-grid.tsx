import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { AppIcon, type IconComponent } from "@/components/ui/icon"
import { BentoCardShell } from "./bento-card-shell"

/**
 * General-purpose bento grid for arbitrary content (not just images — for an
 * image-only bento see ImageLayout's "bento" variant).
 *
 * Cells declare a colSpan (1–3) and rowSpan (1–2); the grid is 1 column on
 * mobile, 2 on sm, 3 on lg, with grid-flow-dense so cells backfill gaps.
 * Span classes are written out in full so Tailwind's JIT keeps them.
 *
 * BentoCard is a server component; its hover spotlight + link behaviour live in
 * the client BentoCardShell so an `icon` component prop can be passed safely.
 */

export function BentoGrid({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "grid grid-flow-dense gap-4",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {children}
    </div>
  )
}

const COL_SPAN: Record<1 | 2 | 3, string> = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
}

const ROW_SPAN: Record<1 | 2, string> = {
  1: "",
  2: "row-span-2",
}

export interface BentoCardProps {
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
  eyebrow?: ReactNode
  title?: ReactNode
  description?: ReactNode
  icon?: IconComponent
  /** Makes the whole cell a link, with the custom-cursor "card" affordance. */
  href?: string
  /** Label shown in the custom cursor pill when href is set. */
  cursorLabel?: string
  /** Decorative layer rendered behind the content (e.g. an image or gradient). */
  background?: ReactNode
  /** Free content rendered below the description. */
  children?: ReactNode
  className?: string
}

export function BentoCard({
  colSpan = 1,
  rowSpan = 1,
  eyebrow,
  title,
  description,
  icon,
  href,
  cursorLabel = "View",
  background,
  children,
  className,
}: BentoCardProps) {
  const cls = cn(
    "group/bento relative isolate overflow-hidden rounded-2xl bg-card p-5 ring-1 ring-foreground/10",
    "transition duration-300 ease-out",
    "hover:-translate-y-1 hover:ring-foreground/20 hover:shadow-[var(--shadow-md)]",
    COL_SPAN[colSpan],
    ROW_SPAN[rowSpan],
    className
  )

  return (
    <BentoCardShell
      href={href}
      cursorLabel={cursorLabel}
      className={cls}
      background={
        background && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">{background}</div>
        )
      }
    >
      <div className="relative flex h-full flex-col">
        {icon && (
          <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-foreground/10">
            <AppIcon icon={icon} size="lg" />
          </div>
        )}

        {eyebrow && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        )}

        {title && <h3 className="text-base font-medium text-foreground">{title}</h3>}

        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}

        {children && <div className="mt-auto pt-4">{children}</div>}
      </div>
    </BentoCardShell>
  )
}
