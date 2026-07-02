"use client"

import Image from "next/image"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { motion } from "framer-motion"
import clsx from "clsx"
import type { CSSProperties } from "react"

export type CsBehindScenesItem = {
  index: string
  title: string
  description: string
  image: {
    src: string
    alt: string
  }
  cta: {
    label: string
    href: string
    external?: boolean
  }
  rotation?: number
}

export type CsBehindScenesProps = {
  eyebrow?: string
  heading?: string
  items: CsBehindScenesItem[]
  className?: string
}

const DEFAULT_ROTATIONS = [-5, -4, 3]

export function CsBehindScenes({
  eyebrow = "Learn More",
  heading = "There's so much more behind the scene!",
  items,
  className,
}: CsBehindScenesProps) {
  const cards = items.slice(0, 3)

  if (cards.length === 0) return null

  return (
    <section className={clsx("w-full overflow-hidden py-2", className)}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 md:mb-14"
      >
        {eyebrow && (
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2
          className={clsx(
            "max-w-[22ch] font-serif text-[clamp(28px,4vw,44px)] font-normal leading-[1.08] tracking-tight text-foreground",
            eyebrow && "mt-4"
          )}
        >
          {heading}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-9">
        {cards.map((item, index) => (
          <motion.div
            key={`${item.index}-${item.title}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.55,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={clsx(
              "mx-auto w-full max-w-[22rem]",
              index === 1 && "lg:mt-16",
              index === 2 && "md:col-span-2 md:max-w-[22rem] lg:col-span-1 lg:mt-2"
            )}
          >
            <BehindScenesCard
              item={item}
              rotation={item.rotation ?? DEFAULT_ROTATIONS[index] ?? 0}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function BehindScenesCard({
  item,
  rotation,
}: {
  item: CsBehindScenesItem
  rotation: number
}) {
  const style = { "--card-rotation": `${rotation}deg` } as CSSProperties

  return (
    <article
      style={style}
      className={clsx(
        "group relative flex min-h-[31rem] flex-col rounded-[1.5rem] border border-black/[0.06] bg-white p-5 text-neutral-950",
        "shadow-[0_18px_50px_rgba(15,23,42,0.13)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "dark:border-white/[0.08] dark:bg-white dark:text-neutral-950",
        "lg:[transform:rotate(var(--card-rotation))] lg:hover:[transform:rotate(var(--card-rotation))_translateY(-0.35rem)]"
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 z-20 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,#d6d6d6,#8f8f8f_56%,#eeeeee)] shadow-[0_8px_14px_rgba(0,0,0,0.28),inset_0_1px_2px_rgba(255,255,255,0.8)] after:absolute after:left-1/2 after:top-[72%] after:h-9 after:w-4 after:-translate-x-1/2 after:rotate-[28deg] after:rounded-full after:bg-black/20 after:blur-md"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <p className="font-mono text-[17px] font-semibold leading-none tracking-tight text-neutral-500">
          {item.index}
        </p>

        <h3 className="mt-6 text-[20px] font-semibold leading-tight tracking-[-0.01em] md:text-[21px]">
          {item.title}
        </h3>
        <p className="mt-4 text-[15px] leading-snug text-neutral-600 md:text-[16px]">
          {item.description}
        </p>

        <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 44vw, 86vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
        </div>

        <CtaLink item={item} />
      </div>
    </article>
  )
}

function CtaLink({ item }: { item: CsBehindScenesItem }) {
  const className = clsx(
    "mt-5 inline-flex min-h-12 w-fit items-center gap-3 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 text-[15px] font-medium text-neutral-800 md:text-[16px]",
    "shadow-[0_10px_24px_rgba(15,23,42,0.09)] transition-[border-color,box-shadow,transform] duration-300",
    "hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white"
  )
  const content = (
    <>
      {item.cta.label}
      <IconArrowRight
        size={22}
        stroke={1.8}
        className="transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </>
  )

  if (item.cta.external) {
    return (
      <a href={item.cta.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link href={item.cta.href} className={className}>
      {content}
    </Link>
  )
}
