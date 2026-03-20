"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { CTA } from "@/components/shared/section-cta"

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
      <div
        className="
          group/card
          rounded-2xl border border-neutral-200 overflow-hidden bg-white
          transition-all duration-200 ease-out
          hover:border-neutral-300 hover:shadow-[0_10px_32px_rgba(0,0,0,0.06)] hover:-translate-y-[2px]
        "
      >

        <Link
          href={href}
          className="
            block
            md:grid md:grid-cols-[0.7fr_1.3fr]
          "
        >

          {/* IMAGE */}
          {image && (
            <div className="relative h-[200px] md:h-full overflow-hidden md:border-r md:border-neutral-200">
              <Image
                src={image}
                alt={title}
                fill
                className="
                  object-cover object-center
                  transition-all duration-500 ease-out
                  brightness-[0.96]
                  group-hover/card:scale-[1.03]
                  group-hover/card:brightness-100
                "
              />
              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition duration-300" />
            </div>
          )}

          {/* CONTENT */}
          <div className="
            flex flex-col justify-between
            p-6 md:p-7 md:pl-8
          ">

            {/* TEXT BLOCK */}
            <div className="flex flex-col gap-3 max-w-md">

              {category && (
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600">
                  {category}
                </p>
              )}

              <h3 className="
                font-medium tracking-tight text-neutral-900
                leading-[1.35]
                text-lg md:text-xl
                transition-colors duration-200
                group-hover/card:text-red-600
              ">
                {title}
              </h3>

              <p className="text-neutral-500 text-sm leading-[1.6]">
                {description}
              </p>

            </div>

            {/* CTA (integrated) */}
            <div className="mt-6 group/cta">
              <CTA
                variant="tertiary"
                label={ctaLabel}
                href={href}
              />
            </div>

          </div>

        </Link>

      </div>
    </motion.div>
  )
}