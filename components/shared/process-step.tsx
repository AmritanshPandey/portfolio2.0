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

  // ───────────── VERTICAL ─────────────
  if (variant === "vertical") {
    return (
      <div
        className={clsx(
          "group/step relative flex gap-4 pl-5 border-l",
          "border-border",
          active && "border-orange-500",
          "transition-all duration-300 md:hover:translate-x-[3px]"
        )}
      >

        {/* NUMBER */}
        <span
          className={clsx(
            "text-xs font-semibold tracking-[0.12em] mt-[2px]",
            "text-muted-foreground",
            "transition-colors duration-300",

            // 👇 subtle hover + active
            "group-hover/step:text-orange-500",
            active && "text-orange-500"
          )}
        >
          {number}
        </span>

        {/* CONTENT */}
        <div className="max-w-md space-y-1">

          <h3
            className={clsx(
              "text-base md:text-lg font-medium tracking-tight",
              "text-foreground",
              "transition-colors duration-300",

              // 👇 main emphasis
              "group-hover/step:text-orange-500",
              active && "text-orange-500"
            )}
          >
            {title}
          </h3>

          <p
            className="
              text-sm md:text-[15px]
              leading-[1.6]
              text-muted-foreground
              transition-colors duration-300

              /* 👇 very subtle lift */
              group-hover/step:text-foreground/80
            "
          >
            {description}
          </p>

        </div>

        {/* ACTIVE LINE */}
        <div
          className={clsx(
            "absolute left-[-1px] top-0 h-full w-px transition-all duration-300",

            active
              ? "bg-orange-500"
              : "bg-transparent group-hover/step:bg-orange-500/60"
          )}
        />

      </div>
    )
  }

  // ───────────── HORIZONTAL ─────────────
  return (
    <div
      className={clsx(
        "group/step pt-5 border-t",
        "border-border",
        active && "border-orange-500",
        "transition-all duration-300 md:hover:-translate-y-[2px]"
      )}
    >

      {/* NUMBER */}
      <p
        className={clsx(
          "text-[11px] font-semibold tracking-[0.16em] mb-2",
          "text-muted-foreground",
          "transition-colors duration-300",

          "group-hover/step:text-orange-500",
          active && "text-orange-500"
        )}
      >
        {number}
      </p>

      {/* TITLE */}
      <h3
        className={clsx(
          "text-lg md:text-xl font-medium tracking-tight mb-2",
          "text-foreground",
          "transition-colors duration-300",

          "group-hover/step:text-orange-500",
          active && "text-orange-500"
        )}
      >
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p
        className="
          text-sm md:text-base leading-[1.6]
          text-muted-foreground max-w-[320px]
          transition-colors duration-300

          group-hover/step:text-foreground/80
        "
      >
        {description}
      </p>

    </div>
  )
}