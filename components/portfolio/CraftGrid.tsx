import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { CraftItem } from "@/data/portfolio/types"

/* ----------------------------------------------------------------------------
   CraftGrid — visual explorations as thumbnails only (max 6 rendered).
   Label appears on hover; the image carries the weight.
---------------------------------------------------------------------------- */

export function CraftGrid({ items }: { items: CraftItem[] }) {
  const shown = items.slice(0, 6)

  const cardClass = clsx(
    "group relative block aspect-[4/3] overflow-hidden rounded-xl",
    "border border-black/[0.07] dark:border-white/[0.08]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  )

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {shown.map((item) => {
        const body = (
          <>
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
            {/* Hover scrim + label */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
              <div className="translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/70">
                  {item.category}
                </p>
                <p className="text-[13px] font-semibold leading-tight text-white">{item.title}</p>
              </div>
              {item.href && (
                <IconArrowUpRight
                  size={16}
                  className="shrink-0 translate-y-1 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                />
              )}
            </div>
          </>
        )

        return item.href ? (
          <Link key={item.id} href={item.href} className={cardClass}>
            {body}
          </Link>
        ) : (
          <div key={item.id} className={cardClass}>
            {body}
          </div>
        )
      })}
    </div>
  )
}
