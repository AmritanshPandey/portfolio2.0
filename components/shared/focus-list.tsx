import { type ComponentType } from "react"
import clsx from "clsx"

type FocusIcon = ComponentType<{ size?: number; stroke?: number; className?: string }>
type FocusItem = { icon: FocusIcon; text: string }
type Props = { focus: FocusItem[]; title?: string; variant?: "default" | "compact" }

export function FocusList({ focus, title = "Focus areas", variant = "default" }: Props) {
  const isCompact = variant === "compact"

  return (
    <div>
      {title && (
        <p className="text-[16px] font-medium text-foreground/45 mb-6 tracking-[0.12em] uppercase">
          {title}
        </p>
      )}
      <div className={clsx("grid", isCompact ? "gap-y-6" : "sm:grid-cols-2 gap-x-14 gap-y-9")}>
        {focus.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="group relative flex items-start gap-3">
              <div className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-orange-500/[0.04] dark:bg-orange-400/[0.06]" />
              <Icon
                size={isCompact ? 18 : 20}
                stroke={2}
                className="relative text-foreground/35 transition-colors duration-150 group-hover:text-orange-500"
              />
              <p className={clsx(
                "relative leading-[1.65] transition-colors duration-150 group-hover:text-foreground",
                isCompact ? "text-[14px] text-foreground/70" : "text-[15px] text-foreground/75"
              )}>
                {item.text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
