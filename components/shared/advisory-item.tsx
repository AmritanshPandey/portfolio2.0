"use client"

import { IconLink } from "@tabler/icons-react"
import clsx from "clsx"

type Props = {
  title: string
  desc: string
  logo: string
  link: string
}

export function AdvisoryItem({ title, desc, logo, link }: Props) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "group relative flex items-start gap-4 py-4",

        // 🔥 smoother + Safari-safe
        "transition-transform duration-300 ease-out",
        "[transform:translateZ(0)]",

        "hover:[transform:translate3d(0,-1px,0)]"
      )}
    >

      {/* LOGO */}
      <div className={clsx(
        "w-12 h-12 rounded-lg overflow-hidden",
        "flex items-center justify-center",

        "bg-muted/30 border border-black/[0.05] dark:border-white/[0.06]",

        // 🔥 smoother scaling
        "transition-transform duration-300",
        "group-hover:scale-[1.03]",

        "[transform:translateZ(0)]"
      )}>
        <img
          src={logo}
          alt={title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-1.5">

        {/* TITLE + ICON */}
        <div className="flex items-center gap-2">

          <p className={clsx(
            "text-[15px] md:text-[16px]",
            "font-medium tracking-[-0.01em]",
            "text-foreground",

            "transition-colors duration-200"
          )}>
            {title}
          </p>

          <IconLink
            size={16}
            stroke={2}
            className={clsx(
              "text-foreground/25",

              // 🔥 smoother motion
              "transition-all duration-300 ease-out",

              "group-hover:text-foreground/60",
              "group-hover:[transform:translate3d(1px,-1px,0)]"
            )}
          />

        </div>

        {/* DESCRIPTION */}
        <p className={clsx(
          "text-[14px]",
          "text-foreground/55",
          "leading-[1.65]",
          "max-w-[520px]",

          "transition-colors duration-200",
          "group-hover:text-foreground/70"
        )}>
          {desc}
        </p>

      </div>

    </a>
  )
}