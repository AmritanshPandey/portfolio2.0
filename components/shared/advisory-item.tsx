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
        group flex items-start gap-4
        transition-all duration-300
        hover:translate-x-[4px]
      "
    >

      {/* LOGO */}
      <div className="
        w-16 h-16 rounded-lg overflow-hidden
        flex items-center justify-center
        bg-muted border border-border
        transition-all duration-300
        group-hover:scale-105
      ">
        <img
          src={logo}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="flex-1">

        {/* TITLE + ICON */}
        <div className="flex items-start justify-between gap-4">

          <p className="
            text-base md:text-lg font-semibold
            text-foreground
            transition-colors duration-200
            group-hover:text-primary
          ">
            {title}
          </p>

          <IconLink
            size={18}
            className="
              shrink-0 mt-[4px]
              text-muted-foreground
              transition-all duration-200
              group-hover:text-primary
              group-hover:translate-x-[2px]
              group-hover:-translate-y-[2px]
            "
          />

        </div>

        {/* DESCRIPTION */}
        <p className="
          text-muted-foreground text-sm
          mt-2 max-w-xl leading-[1.6]
        ">
          {desc}
        </p>

      </div>

    </a>
  )
}