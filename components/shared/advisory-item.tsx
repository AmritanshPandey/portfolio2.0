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
      className="group flex items-start gap-4 transition-all duration-300 hover:translate-x-[4px]"
    >
      <img
        src={logo}
        alt={title}
        className="w-11 h-11 rounded-lg object-contain bg-white p-1 shadow-sm transition-transform duration-300 group-hover:scale-105"
      />

      <div>
        <div className="flex items-center gap-2">

          <p className="text-base md:text-lg font-semibold text-neutral-900 group-hover:text-red-600 transition">
            {title}
          </p>

          <IconLink
            size={14}
            className="text-neutral-400 group-hover:text-red-600 transition"
          />

        </div>

        <p className="text-neutral-600 text-sm mt-1 max-w-xl leading-[1.6]">
          {desc}
        </p>
      </div>
    </a>
  )
}