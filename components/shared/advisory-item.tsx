"use client"

import { IconLink } from "@tabler/icons-react"

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
      className="
        group relative flex items-start gap-4

        py-3

        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:translate-x-[4px]
      "
    >

      {/* LOGO */}
      <div className="
        w-14 h-14 rounded-xl overflow-hidden

        flex items-center justify-center
        bg-muted/50 border border-border

        transition-all duration-300
        group-hover:scale-[1.04]
      ">
        <img
          src={logo}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="flex-1 space-y-1.5">

        {/* TITLE + ICON */}
        <div className="flex items-start justify-between gap-4">

          <p className="
            text-base md:text-lg font-medium
            text-foreground

            transition-colors duration-200
            group-hover:text-orange-600
            dark:group-hover:text-orange-400
          ">
            {title}
          </p>

          {/* ICON */}
          <IconLink
            size={18}
            className="
              shrink-0 mt-[3px]

              text-foreground/30
              transition-all duration-300

              group-hover:text-orange-600
              dark:group-hover:text-orange-400
              group-hover:translate-x-[2px]
              group-hover:-translate-y-[2px]
            "
          />

        </div>

        {/* DESCRIPTION */}
        <p className="
          text-sm md:text-[15px]
          text-foreground/60
          leading-[1.6]
          max-w-xl

          transition-colors duration-200
          group-hover:text-foreground/75
        ">
          {desc}
        </p>

      </div>

      {/* ✨ SUBTLE TOP EDGE (premium detail) */}
      <div className="
        pointer-events-none absolute inset-x-0 top-0 h-px
        bg-gradient-to-r from-transparent via-foreground/10 to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
      " />

    </a>
  )
}