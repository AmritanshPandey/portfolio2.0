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
          "group/step relative flex gap-4 pl-6",

          // base line
          "border-l border-border",

          // ✨ active = stronger system signal
          active && "border-border-strong",

          "transition-all duration-300 md:hover:translate-x-[2px]"
        )}
      >

        {/* ACTIVE ACCENT LINE */}
        <div
          className={clsx(
            "absolute left-[-1px] top-0 h-full w-[2px] transition-all duration-300",

            active
              ? "bg-orange-500"
              : "bg-transparent group-hover/step:bg-orange-500/40"
          )}
        />

        {/* NUMBER */}
        <span
          className={clsx(
            "text-[11px] font-medium tracking-[0.14em] mt-[3px]",

            // 👇 hierarchy fix
            active
              ? "text-foreground"
              : "text-muted-foreground",

            "transition-colors duration-300"
          )}
        >
          {number}
        </span>

        {/* CONTENT */}
        <div className="max-w-md space-y-1.5">

          {/* TITLE */}
          <h3
            className={clsx(
              "text-base md:text-lg font-medium tracking-tight leading-[1.3]",
              "transition-colors duration-300",

              // 👇 active is primary, hover is secondary
              active
                ? "text-foreground"
                : "text-foreground group-hover/step:text-foreground"
            )}
          >
            {title}
          </h3>

          {/* DESCRIPTION */}
          <p
            className={clsx(
              "text-sm md:text-[15px] leading-[1.6]",
              "transition-colors duration-300",

              active
                ? "text-muted-foreground"
                : "text-muted-foreground/80 group-hover/step:text-muted-foreground"
            )}
          >
            {description}
          </p>

        </div>
      </div>
    )
  }

  // ───────────── HORIZONTAL ─────────────
  return (
    <div
      className={clsx(
        "group/step pt-5 border-t border-border",
        active && "border-border-strong",
        "transition-all duration-300 md:hover:-translate-y-[2px]"
      )}
    >

      {/* NUMBER */}
      <p
        className={clsx(
          "text-[11px] font-medium tracking-[0.16em] mb-2",
          active
            ? "text-foreground"
            : "text-muted-foreground",
          "transition-colors duration-300"
        )}
      >
        {number}
      </p>

      {/* TITLE */}
      <h3
        className={clsx(
          "text-lg md:text-xl font-medium tracking-tight mb-2 leading-[1.3]",
          active
            ? "text-foreground"
            : "text-foreground group-hover/step:text-foreground",
          "transition-colors duration-300"
        )}
      >
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p
        className={clsx(
          "text-sm md:text-base leading-[1.6] max-w-[320px]",
          active
            ? "text-muted-foreground"
            : "text-muted-foreground/80 group-hover/step:text-muted-foreground",
          "transition-colors duration-300"
        )}
      >
        {description}
      </p>

    </div>
  )
}