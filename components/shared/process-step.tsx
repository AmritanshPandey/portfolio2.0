"use client"

import clsx from "clsx"

type Variant = "vertical" | "horizontal"
type Theme = "dark" | "light"

type Props = {
  number: string
  title: string
  description: string
  variant?: Variant
  active?: boolean
  theme?: Theme
}

export function ProcessStep({
  number,
  title,
  description,
  variant = "vertical",
  active = false,
  theme = "dark",
}: Props) {

  const styles = {
    dark: {
      border: "border-white/10 group-hover/step:border-red-500",
      number: "text-white/30 group-hover/step:text-red-500",
      title: "text-white group-hover/step:text-red-500",
      desc: "text-white/60 group-hover/step:text-white/80",
    },
    light: {
      border: "border-neutral-200 group-hover/step:border-red-500",
      number: "text-neutral-400 group-hover/step:text-red-500",
      title: "text-neutral-900 group-hover/step:text-red-600",
      desc: "text-neutral-600 group-hover/step:text-neutral-800",
    },
  }

  const current = styles[theme]

  // ---------------- VERTICAL ----------------

  if (variant === "vertical") {
    return (
      <div className="group/step cursor-default">

        <div
          className={clsx(
            "flex gap-4 pl-4 border-l",
            "transition-all duration-300 ease-[0.22,1,0.36,1]",
            "hover:translate-x-[6px] hover:scale-[1.01]",
            "will-change-transform",
            active ? "border-red-500" : current.border
          )}
        >

          {/* NUMBER */}
          <span
            className={clsx(
              "text-sm md:text-base font-semibold transition-colors duration-300",
              active ? "text-red-500" : current.number
            )}
          >
            {number}
          </span>

          {/* CONTENT */}
          <div className="max-w-md">

            <h3
              className={clsx(
                "text-base md:text-lg font-semibold mb-1 tracking-tight",
                "transition-colors duration-300",
                active ? "text-red-500" : current.title
              )}
            >
              {title}
            </h3>

            <p
              className={clsx(
                "text-[13px] md:text-sm leading-[1.65]",
                "transition-colors duration-300",
                current.desc
              )}
            >
              {description}
            </p>

          </div>

        </div>
      </div>
    )
  }

  // ---------------- HORIZONTAL ----------------

  return (
    <div
      className={clsx(
        "group/step cursor-default pt-5 border-t",
        "transition-all duration-300 ease-[0.22,1,0.36,1]",
        "hover:-translate-y-[4px]",
        active
          ? "border-red-500"
          : theme === "light"
            ? "border-neutral-300 group-hover/step:border-red-500"
            : "border-white/10 group-hover/step:border-red-500"
      )}
    >

      {/* NUMBER */}
      <p
        className={clsx(
          "text-xs font-semibold tracking-[0.16em] mb-2",
          "transition-colors duration-300",
          active
            ? "text-red-500"
            : theme === "light"
              ? "text-neutral-400 group-hover/step:text-red-500"
              : "text-white/30 group-hover/step:text-red-500"
        )}
      >
        {number}
      </p>

      {/* TITLE */}
      <h3
        className={clsx(
          "text-lg md:text-xl font-semibold mb-2 tracking-tight",
          "transition-colors duration-300",
          active
            ? "text-red-600"
            : theme === "light"
              ? "text-neutral-900 group-hover/step:text-red-600"
              : "text-white group-hover/step:text-red-500"
        )}
      >
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p
        className={clsx(
          "text-sm md:text-base leading-[1.6] max-w-[320px]",
          "transition-colors duration-300",
          theme === "light"
            ? "text-neutral-600 group-hover/step:text-neutral-800"
            : "text-white/60 group-hover/step:text-white/80"
        )}
      >
        {description}
      </p>

    </div>
  )
}