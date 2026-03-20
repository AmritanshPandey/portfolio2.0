"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

type Props = {
  title: string
  description: string
  image: string
  href: string
  tags: string[]
  span?: string
}

export function ExplorationCard({
  title,
  description,
  image,
  href,
  tags,
  span,
}: Props) {

  return (
    <Link
      href={href}
      className={clsx(
        "group relative isolate rounded-2xl overflow-hidden cursor-pointer",
        "aspect-square md:aspect-auto",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-[3px]",
        "hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]",
        span
      )}
    >

      {/* IMAGE */}

      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width:768px) 100vw, 60vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* SINGLE CLEAN OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent transition duration-300 group-hover:from-black/85" />

      {/* CONTENT */}

      <div className="absolute bottom-0 p-5 md:p-6 text-white translate-y-[6px] group-hover:translate-y-0 transition-all duration-300 ease-out">

        {/* TITLE */}

        <h3 className="text-lg md:text-xl font-semibold leading-snug tracking-tight mb-1.5">
          {title}
        </h3>

        {/* DESCRIPTION */}

        <p className="text-sm text-white/70 leading-[1.6] max-w-md mb-4 line-clamp-3 group-hover:text-white/85 transition">
          {description}
        </p>

        {/* TAGS */}

        <div className="flex flex-wrap gap-2">

          {tags.map((tag, i) => (

            <span
              key={i}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-white/80 transition-all duration-300 group-hover:bg-white/20 group-hover:text-white"
            >
              {tag}
            </span>

          ))}

        </div>

      </div>

      {/* SUBTLE EDGE RING */}

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-white/10 transition duration-300" />

    </Link>
  )
}