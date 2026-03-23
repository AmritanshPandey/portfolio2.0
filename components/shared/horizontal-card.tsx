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

  const cursorLabel =
    category === "Article"
      ? "Read"
      : ctaLabel === "Explore"
      ? "Open"
      : ctaLabel

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
        data-cursor-card
        data-cursor-label={cursorLabel}
        className="group/card block rounded-2xl"
      >

        <div
          className="
            relative rounded-2xl border border-border overflow-hidden

            /* ✨ LIGHTER SURFACE */
            bg-card
            dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-white/[0.01]

            before:absolute before:inset-x-0 before:top-0 before:h-px
            before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent
            dark:before:via-white/20

            transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            hover:-translate-y-[2px] hover:translate-x-[1px]
            hover:border-border/80
            hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]

            md:grid md:grid-cols-[0.7fr_1.3fr]
          "
        >

          {/* ✨ CLEAN ORANGE GLOW */}
          <div className="
            pointer-events-none absolute inset-0 rounded-2xl
            opacity-0 group-hover/card:opacity-100
            transition-opacity duration-400

            bg-[radial-gradient(300px_160px_at_100%_0%,rgba(255,90,0,0.08),transparent_60%)]
            dark:bg-[radial-gradient(300px_160px_at_100%_0%,rgba(255,140,60,0.12),transparent_60%)]
          " />

          {/* ✨ INNER LIGHT */}
          <div className="
            pointer-events-none absolute inset-0 rounded-2xl
            opacity-0 group-hover/card:opacity-100
            transition-opacity duration-400

            bg-[radial-gradient(200px_120px_at_90%_0%,rgba(255,255,255,0.05),transparent_70%)]
            dark:bg-[radial-gradient(200px_120px_at_90%_0%,rgba(255,255,255,0.07),transparent_70%)]
          " />

          {/* IMAGE */}
          {image && (
            <div className="relative h-[200px] md:h-full overflow-hidden bg-muted">
              <Image
                src={image}
                alt={title}
                fill
                className="
                  object-cover object-center
                  transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover/card:scale-[1.04]
                "
              />

              {/* balanced overlay */}
              <div className="
                absolute inset-0
                bg-gradient-to-t
                from-black/20 via-black/5 to-transparent
                dark:from-black/35
                opacity-80 group-hover/card:opacity-60
                transition-opacity duration-300
              " />

              {/* divider */}
              <div className="hidden md:block absolute inset-y-0 right-0 w-px bg-border/70" />
            </div>
          )}

          {/* CONTENT */}
          <div className="
            relative flex flex-col justify-between
            p-6 md:p-7 md:pl-8
            transition-transform duration-300
            group-hover/card:translate-y-[-1px] group-hover/card:translate-x-[1px]
          ">

            <div className="flex flex-col gap-3 max-w-md">

              {category && (
                <p className="
                  text-[10px] font-medium uppercase tracking-[0.18em]
                  text-foreground/50
                ">
                  {category}
                </p>
              )}

              <h3 className="
                text-lg md:text-xl font-medium tracking-tight leading-[1.25]
                text-foreground
              ">
                {title}
              </h3>

              <p className="
                text-foreground/70 text-sm leading-relaxed
              ">
                {description}
              </p>

            </div>

            {/* CTA */}
            <div className="
              mt-6 pt-5 border-t border-border/60
              flex items-center justify-between
            ">

              <span className="
                text-sm font-medium text-foreground/80
                transition-all duration-200

                group-hover/card:text-orange-600
                dark:group-hover/card:text-orange-400

                group-hover/card:translate-x-[2px]
              ">
                {ctaLabel}
              </span>

              <span className="
                w-9 h-9 rounded-full
                border border-border
                flex items-center justify-center

                transition-all duration-300

                group-hover/card:border-orange-600/40
                dark:group-hover/card:border-orange-400/40

                group-hover/card:bg-orange-600/10
                dark:group-hover/card:bg-orange-400/10
              ">
                <IconArrowUpRight
                  size={16}
                  stroke={2}
                  className="
                    text-foreground/60
                    transition-all duration-300

                    group-hover/card:text-orange-600
                    dark:group-hover/card:text-orange-400

                    group-hover/card:-translate-y-[1.5px]
                    group-hover/card:translate-x-[1.5px]
                  "
                />
              </span>

            </div>

          </div>

        </div>
      </Link>
    </motion.div>
  )
}