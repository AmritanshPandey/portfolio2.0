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

        py-4

        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
      "
    >

      {/* LOGO */}
      <div className="
        w-12 h-12 rounded-lg overflow-hidden

        flex items-center justify-center

        bg-muted/30
        border border-black/[0.05] dark:border-white/[0.06]

        transition-all duration-300
        group-hover:scale-[1.02]
      ">
        <img
          src={logo}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-1.5">

        {/* TITLE + ICON */}
        <div className="flex items-center gap-2">

          <p className="
            text-[15px] md:text-[16px]
            font-medium tracking-[-0.01em]

            text-foreground

            transition-colors duration-200
            group-hover:text-foreground
          ">
            {title}
          </p>

          <IconLink
            size={16}
            stroke={2}
            className="
              text-foreground/25

              transition-all duration-300

              group-hover:text-foreground/60
              group-hover:translate-x-[1px]
              group-hover:-translate-y-[1px]
            "
          />

        </div>

        {/* DESCRIPTION */}
        <p className="
          text-[14px]
          text-foreground/55
          leading-[1.65]
          max-w-[520px]

          transition-colors duration-200
          group-hover:text-foreground/70
        ">
          {desc}
        </p>

      </div>



    </a>
  )
}