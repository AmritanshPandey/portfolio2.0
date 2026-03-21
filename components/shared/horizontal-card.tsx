"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"

type Props = {
  href: string
  title: string
  description: string
  category?: string
  image?: string
  ctaLabel?: string
  index?: number
}

export function HorizontalCard({
  href,
  title,
  description,
  category,
  image,
  ctaLabel = "Explore",
  index = 0,
}: Props) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true, margin: "-80px" }}
    >
      <Link
        href={href}
        className="group/card block focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-2xl"
      >
        <div
          className="
            rounded-2xl border border-neutral-200 overflow-hidden bg-white
            transition-all duration-300 ease-out
            hover:border-neutral-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1
            md:grid md:grid-cols-[0.7fr_1.3fr]
          "
        >

          {/* IMAGE */}
          {image && (
            <div className="relative h-[200px] md:h-full overflow-hidden bg-neutral-100">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
              />
              {/* Darkening overlay — lifts on hover to reveal image */}
              <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover/card:opacity-0" />
              {/* Right border on desktop only */}
              <div className="hidden md:block absolute inset-y-0 right-0 w-px bg-neutral-200" />
            </div>
          )}

          {/* CONTENT */}
          <div className="flex flex-col justify-between p-6 md:p-7 md:pl-8">

            <div className="flex flex-col gap-3 max-w-md">
              {category && (
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {category}
                </p>
              )}

              <h3 className="
                font-medium tracking-tight text-neutral-900 leading-[1.3]
                text-lg md:text-xl
                transition-colors duration-200
                group-hover/card:text-neutral-600
              ">
                {title}
              </h3>

              <p className="text-neutral-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* CTA row — no nested <a>, parent Link handles navigation */}
            <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-900 group-hover/card:underline underline-offset-4 decoration-neutral-300">
                {ctaLabel}
              </span>
              <span className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center transition-all duration-200 group-hover/card:bg-neutral-900 group-hover/card:border-neutral-900">
                <IconArrowUpRight
                  size={16}
                  stroke={2}
                  className="text-neutral-400 transition-colors duration-200 group-hover/card:text-white"
                />
              </span>
            </div>

          </div>

        </div>
      </Link>
    </motion.div>
  )
}