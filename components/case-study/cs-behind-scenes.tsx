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

const DEFAULT_ROTATIONS = [-1.5, 0.75, 1.5]
const clampRotation = (rotation: number) => Math.max(-1.5, Math.min(rotation, 1.5))

export function CsBehindScenes({
  eyebrow = "Learn More",
  heading = "There's so much more behind the scene!",
  items,
  className,
}: CsBehindScenesProps) {
  const cards = items.slice(0, 3)

  if (cards.length === 0) return null

  return (
    <section className={clsx("w-full overflow-visible pt-2 pb-6", className)}>
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 lg:px-2">
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
              "mx-auto h-full w-full max-w-[18.5rem]",
              index === 1 && "lg:mt-5",
              index === 2 && "sm:col-span-2 sm:max-w-[18.5rem] lg:col-span-1 lg:mt-1"
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
  const style = { "--card-rotation": `${clampRotation(rotation)}deg` } as CSSProperties

  return (
    <article
      style={style}
      className={clsx(
        "group relative flex h-full min-h-[25rem] flex-col rounded-[1.25rem] border border-border/70 bg-card p-4 text-foreground",
        "shadow-[0_14px_34px_rgba(15,23,42,0.08)] ring-1 ring-foreground/[0.03] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "dark:shadow-[0_18px_44px_rgba(0,0,0,0.34)] dark:ring-white/[0.04]",
        "lg:[transform:rotate(var(--card-rotation))] lg:hover:[transform:rotate(var(--card-rotation))_translateY(-0.35rem)]"
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 z-20 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[linear-gradient(135deg,var(--accent),color-mix(in_srgb,var(--accent)_48%,var(--foreground)))] shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.35)] after:absolute after:left-1/2 after:top-[72%] after:h-7 after:w-3 after:-translate-x-1/2 after:rotate-[24deg] after:rounded-full after:bg-foreground/15 after:blur-md"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <p className="font-mono text-[12px] font-semibold leading-none tracking-[0.02em] text-muted-foreground">
          {item.index}
        </p>

        <h3 className="mt-5 text-[16px] font-semibold leading-tight text-foreground">
          {item.title}
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-auto pt-5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border/50 bg-muted">
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 1024px) 280px, (min-width: 768px) 42vw, 86vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
            />
          </div>

          <CtaLink item={item} />
        </div>
      </div>
    </article>
  )
}

function CtaLink({ item }: { item: CsBehindScenesItem }) {
  const className = clsx(
    "mt-4 inline-flex min-h-10 w-fit items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-muted/45 px-3.5 text-[13px] font-medium text-foreground",
    "shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow,transform,background-color] duration-300",
    "hover:-translate-y-0.5 hover:border-accent/40 hover:bg-muted hover:shadow-[0_12px_24px_rgba(15,23,42,0.09)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  )
  const content = (
    <>
      {item.cta.label}
      <IconArrowRight
        size={18}
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
