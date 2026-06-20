import Image from "next/image"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { AdvisoryCard as AdvisoryCardData } from "@/data/portfolio/types"

/* ----------------------------------------------------------------------------
   AdvisoryCard — compact engagement card. Role label is shown prominently and
   honestly (e.g. "Fractional Product & Design Advisor") so nothing overclaims.
---------------------------------------------------------------------------- */

export function AdvisoryCard({ item }: { item: AdvisoryCardData }) {
  const Wrapper = item.link ? "a" : "div"
  const linkProps = item.link
    ? { href: item.link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {}

  return (
    <Wrapper
      {...linkProps}
      className={clsx(
        "group relative flex flex-col gap-3 rounded-xl p-4",
        "border border-black/[0.07] dark:border-white/[0.08]",
        "bg-white dark:bg-[oklch(0.18_0_0)]",
        "transition-[transform,border-color] duration-300 ease-out",
        item.link && "hover:-translate-y-0.5 hover:border-accent/40",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/[0.06] bg-muted/40 dark:border-white/[0.06]">
          {item.logo ? (
            <Image
              src={item.logo}
              alt={item.title}
              width={40}
              height={40}
              sizes="40px"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">
              {item.title.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[14px] font-semibold text-foreground">{item.title}</p>
            {item.link && (
              <IconArrowUpRight
                size={14}
                className="shrink-0 text-foreground/30 transition-colors group-hover:text-accent"
              />
            )}
          </div>
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.06em] text-accent/90">
            {item.role}
          </p>
        </div>
      </div>

      <p className="text-[12.5px] leading-relaxed text-foreground/55">{item.summary}</p>
    </Wrapper>
  )
}
