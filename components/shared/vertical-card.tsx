"use client"

import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { CTA } from "@/components/shared/section-cta"

type Variant = "default" | "compact"

type Props = {
  href: string
  image?: string
  title: string
  description?: string
  category?: string
  ctaLabel?: string
  variant?: Variant
  showImage?: boolean
}

export function VerticalCard({
  href,
  image,
  title,
  description,
  category,
  ctaLabel = "View Case Study",
  variant = "default",
  showImage = true,
}: Props) {

  const isCompact = variant === "compact"

  return (
    <Link
      href={href}
      className="group/card block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
    >
      <div
        className={clsx(
          "h-full flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
          isCompact && "p-5"
        )}
      >

        {/* IMAGE */}
        {showImage && image && !isCompact && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-300" />
          </div>
        )}

        {/* CONTENT */}
        <div
          className={clsx(
            "flex flex-col flex-1",
            isCompact ? "gap-4" : "p-6"
          )}
        >

          {/* TOP CONTENT */}
          <div className="flex flex-col gap-3">

            {category && (
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600">
                {category}
              </p>
            )}

            <h3
              className={clsx(
                "font-medium tracking-tight text-neutral-900",
                "leading-[1.35]",
                "transition-colors duration-200 group-hover/card:text-red-600",
                isCompact ? "text-base" : "text-lg md:text-xl"
              )}
            >
              {title}
            </h3>

            {description && !isCompact && (
              <p className="text-neutral-500 text-sm leading-[1.6] pb-6 mt-auto">
                {description}
              </p>
            )}

          </div>

          {/* CTA */}
          <div className="
            mt-auto pt-6
            border-t border-neutral-100
            group/cta
          ">
            <CTA
              variant="tertiary"
              label={ctaLabel}
              href={href}
            />
          </div>

        </div>

      </div>
    </Link>
  )
}