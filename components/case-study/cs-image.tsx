"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import clsx from "clsx"

type AspectRatio = "16/9" | "4/3" | "3/2"

interface Props {
  src: string
  alt: string
  caption?: string
  aspectRatio?: AspectRatio
  dark?: boolean
  className?: string
}

const ASPECT: Record<AspectRatio, string> = {
  "16/9": "aspect-video",
  "4/3":  "aspect-[4/3]",
  "3/2":  "aspect-[3/2]",
}

export function CsImage({ src, alt, caption, aspectRatio = "16/9", dark = false, className }: Props) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={clsx("w-full", className)}
    >
      <div className={clsx(
        "relative w-full rounded-xl overflow-hidden",
        dark
          ? "bg-neutral-900 border border-white/[0.06]"
          : "bg-muted border border-border/40",
        ASPECT[aspectRatio]
      )}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1000px"
        />
      </div>

      {caption && (
        <figcaption className={clsx(
          "mt-3 text-xs text-center leading-relaxed",
          dark ? "text-neutral-600" : "text-muted-foreground"
        )}>
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
