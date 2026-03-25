"use client"

import clsx from "clsx"

type Variant = "vertical" | "horizontal"

type Props = {
  number: string
  title: string
  description: string
  variant?: Variant
  active?: boolean
}

export function ProcessStep({
  number,
  title,
  description,
  variant = "vertical",
  active = false,
}: Props) {

  const isVertical = variant === "vertical"

  return (
    <div
      className={clsx(
        "group/step relative antialiased",

        isVertical
          ? "flex gap-4 pl-6 border-l"
          : "pt-6 border-t",

        "border-border",
        active && "border-border-strong",

        // 🔥 smoother + Safari-safe transform
        "transition-transform duration-300 ease-out",
        "[transform:translateZ(0)]",

        isVertical
          ? "md:hover:[transform:translate3d(2px,0,0)]"
          : "md:hover:[transform:translate3d(0,-2px,0)]"
      )}
    >

      {/* ── ACCENT LINE */}
      <div
        className={clsx(
          "absolute bg-orange-500",

          isVertical
            ? "left-[-1px] top-0 w-[2px] h-full"
            : "top-[-1px] left-0 h-[2px] w-full",

          // 🔥 prevent flicker
          "[transform:translateZ(0)]",
          "transition-opacity duration-300",

          active
            ? "opacity-100"
            : "opacity-0 md:group-hover/step:opacity-40"
        )}
      />

      {/* ── CONTENT */}
      <div className={clsx(isVertical ? "flex gap-4" : "")}>

        {/* NUMBER */}
        <span
          className={clsx(
            "text-[11px] font-medium tracking-[0.14em]",

            isVertical ? "mt-[3px]" : "mb-2 block",

            active
              ? "text-foreground"
              : "text-muted-foreground",

            "transition-colors duration-200"
          )}
        >
          {number}
        </span>

        {/* TEXT */}
        <div
          className={clsx(
            "space-y-1.5",
            isVertical ? "max-w-md" : "max-w-[320px]"
          )}
        >

          {/* TITLE */}
          <h3
            className={clsx(
              "font-medium tracking-tight leading-[1.3]",

              isVertical
                ? "text-base md:text-lg"
                : "text-lg md:text-xl",

              "text-foreground"
            )}
          >
            {title}
          </h3>

          {/* DESCRIPTION */}
          <p
            className={clsx(
              "leading-[1.6]",

              isVertical
                ? "text-sm md:text-[15px]"
                : "text-sm md:text-base",

              active
                ? "text-muted-foreground"
                : "text-muted-foreground/80",

              "transition-colors duration-200"
            )}
          >
            {description}
          </p>

        </div>
      </div>
    </div>
  )
}