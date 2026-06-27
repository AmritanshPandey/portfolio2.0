import Image from "next/image"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface ImpactStoryCardProps {
  image: string
  alt: string
  label: string
  quote: string
  attribution: string
  metric: string
  metricLabel: string
  className?: string
  priority?: boolean
  children?: ReactNode
}

export function ImpactStoryCard({
  image,
  alt,
  label,
  quote,
  attribution,
  metric,
  metricLabel,
  className,
  priority = false,
  children,
}: ImpactStoryCardProps) {
  const [name, ...roleParts] = attribution.split(",")
  const role = roleParts.join(",")

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-[28px] bg-card p-3 shadow-[0_22px_70px_rgba(15,23,42,0.08)] ring-1 ring-foreground/8 dark:shadow-[0_24px_80px_rgba(0,0,0,0.34)]",
        className
      )}
    >
      <div className="group relative isolate aspect-[1.05] overflow-hidden rounded-[22px] bg-muted sm:aspect-[16/10] lg:aspect-[16/9]">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 1024px"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.035]"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,12,0.08)_0%,rgba(7,10,12,0.04)_42%,rgba(7,10,12,0.5)_100%)]"
        />

        <figcaption className="absolute left-3 top-3 z-20 rounded-full bg-emerald-300 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-950 shadow-[0_10px_32px_rgba(16,185,129,0.34)] sm:left-5 sm:top-5">
          {label}
        </figcaption>

        <div className="absolute inset-x-3 bottom-3 z-20 overflow-hidden rounded-[16px] border border-white/12 bg-neutral-950/42 p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:inset-x-5 sm:bottom-5 sm:grid sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center sm:gap-8 sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:p-7">
          <div className="max-w-md">
            <blockquote className="text-balance text-sm font-semibold leading-6 sm:text-base sm:leading-7">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <p className="mt-4 text-xs font-medium text-white/76">
              <span className="text-white">&mdash; {name}</span>
              {role ? (
                <span className="text-white/55">,{role}</span>
              ) : null}
            </p>
          </div>

          <div className="mt-6 border-t border-white/12 pt-5 sm:mt-0 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
            <strong className="block font-serif text-4xl font-semibold leading-none tracking-normal text-white sm:text-5xl">
              {metric}
            </strong>
            <p className="mt-3 max-w-[18rem] text-xs font-semibold leading-5 text-white/72 sm:text-sm">
              {metricLabel}
            </p>
          </div>
        </div>

        {children}
      </div>
    </figure>
  )
}
