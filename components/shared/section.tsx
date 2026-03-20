"use client"

import clsx from "clsx"
import { SectionHeader } from "./section-header"
import { SectionTransition } from "./section-transition"

type Bg = "light" | "dark" | "subtle"
type Density = "default" | "compact"
type Container = "default" | "narrow"

export function Section({
  id,
  bg = "light",
  density = "default",
  container = "default",
  divider = false,

  eyebrow,
  title,
  description,
  headerVariant = "default",

  transition,
  transitionEyebrow,
  transitionVariant = "default",

  children,
}: {
  id: string
  bg?: Bg
  density?: Density
  container?: Container
  divider?: boolean

  eyebrow?: string
  title?: string
  description?: string
  headerVariant?: "default" | "compact" | "hero"

  transition?: string
  transitionEyebrow?: string
  transitionVariant?: "default" | "muted" | "highlight"

  children: React.ReactNode
}) {

  const bgStyles = {
    light: "bg-[var(--bg1)] text-neutral-900",
    subtle: "bg-[var(--bg2)] text-neutral-900",
    dark: "bg-neutral-950 text-white",
  }

  const spacing = {
    default: "py-12 md:py-16",
    compact: "py-10 md:py-12",
  }

  const containerWidth = {
    default: "max-w-7xl",
    narrow: "max-w-4xl",
  }

  return (
    <section
      id={id}
      className={clsx("relative", bgStyles[bg])}
    >

      {divider && (
        <div className="absolute top-0 left-0 w-full h-px bg-neutral-200/70" />
      )}

      <div
        className={clsx(
          "mx-auto px-5 md:px-6",
          spacing[density],
          containerWidth[container]
        )}
      >

        {title && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            variant={headerVariant}
          />
        )}

        <div>{children}</div>

        {transition && (
          <SectionTransition
            eyebrow={transitionEyebrow}
            text={transition}
            variant={transitionVariant}
          />
        )}

      </div>
    </section>
  )
}