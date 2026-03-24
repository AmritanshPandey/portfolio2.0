"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

type FocusItem = {
    icon: any
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
    const containerRef = useRef<HTMLDivElement>(null)

    // ── Magnetic proximity
    const handleMove = (e: React.MouseEvent) => {
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const cx = e.clientX
        const cy = e.clientY

        const items = container.querySelectorAll("[data-item]")

        items.forEach((el) => {
            const node = el as HTMLElement
            const r = node.getBoundingClientRect()

            const x = r.left + r.width / 2
            const y = r.top + r.height / 2

            const dx = cx - x
            const dy = cy - y
            const dist = Math.sqrt(dx * dx + dy * dy)

            const maxDist = 140

            if (dist < maxDist) {
                const power = 1 - dist / maxDist

                const moveX = dx * 0.05 * power
                const moveY = dy * 0.05 * power
                const scale = 1 + power * 0.035

                node.style.transform = `
          translate(${moveX}px, ${moveY}px)
          scale(${scale})
        `
                node.style.opacity = `${0.7 + power * 0.3}`
            } else {
                node.style.transform = "translate(0px,0px) scale(1)"
                node.style.opacity = "0.75"
            }
        })
    }

    const handleLeave = () => {
        const container = containerRef.current
        if (!container) return

        const items = container.querySelectorAll("[data-item]")

        items.forEach((el) => {
            const node = el as HTMLElement
            node.style.transform = "translate(0px,0px) scale(1)"
            node.style.opacity = "0.75"
        })
    }

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
                ref={containerRef}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
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