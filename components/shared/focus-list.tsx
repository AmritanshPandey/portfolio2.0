"use client"

import { useRef, type ComponentType } from "react"
import { motion } from "framer-motion"

type FocusIcon = ComponentType<{
    size?: number
    stroke?: number
    className?: string
}>

type FocusItem = {
    icon: FocusIcon
    text: string
}

type Props = {
    focus: FocusItem[]
    title?: string
    variant?: "default" | "compact"
}

export function FocusList({
    focus,
    title = "Focus areas",
    variant = "default",
}: Props) {


    return (
        <div>
            {/* ── TITLE */}
            <p
                className="
          text-[16px]
          font-medium
          text-foreground/45
          mb-6
          tracking-[0.12em]
          uppercase
        "
            >
                {title}
            </p>

            {/* ── LIST */}
                        <div
                                className={`
                    grid
                    ${variant === "compact" ? "gap-y-6" : "sm:grid-cols-2 gap-x-14 gap-y-9"}
                `}
                        >
                {focus.map((item, index) => {
                    const Icon = item.icon

                    return (
                        <motion.div
                            key={index}
                            data-item
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 0.75, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.05,
                            }}
                            className="
                group relative flex items-start gap-3
                transition-[transform,opacity] duration-200 ease-out
                will-change-transform
              "
                        >
                            {/* ✨ Glow */}
                            <div className="
  absolute -inset-2 rounded-lg
  opacity-0 group-hover:opacity-100
  transition-opacity duration-300

  bg-orange-500/[0.04]
  dark:bg-orange-400/[0.06]
" />

                            {/* ICON */}
                            <div className="relative">
                                <Icon
                                    size={variant === "compact" ? 18 : 20}
                                    stroke={2}
                                    className="
                    text-foreground/35
                    transition-all duration-200

                    group-hover:text-orange-500
                    group-hover:scale-105
                  "
                                />

                                {/* subtle pulse */}
                                <div
                                    className="
                    absolute inset-0 rounded-full
                    opacity-0 group-hover:opacity-100
                    transition duration-500

                    bg-orange-500/10 blur-lg
                  "
                                />
                            </div>

                            {/* TEXT */}
                            <p
                                className={`
                  leading-[1.65]
                  transition-colors duration-200

                  ${variant === "compact"
                                        ? "text-[14px] text-foreground/70"
                                        : "text-[15px] text-foreground/75"
                                    }

                  group-hover:text-foreground
                `}
                            >
                                {item.text}
                            </p>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}