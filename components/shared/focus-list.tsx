import clsx from "clsx"

import { AppIcon, type IconComponent, type IconSize } from "@/components/ui/icon"

type FocusIcon = IconComponent
type FocusItem = { icon: FocusIcon; text: string }
type Props = {
  focus: FocusItem[]
  title?: string
  variant?: "default" | "compact"
  iconSize?: IconSize
}

export function FocusList({
  focus,
  title = "Focus areas",
  variant = "default",
  iconSize = "xl",
}: Props) {
  const isCompact = variant === "compact"

  return (
    <div>
      {title && (
        <p className="type-meta mb-6 text-foreground/45">
          {title}
        </p>
      )}
      <div className={clsx("grid", isCompact ? "gap-y-6" : "sm:grid-cols-2 gap-x-14 gap-y-9")}>
        {focus.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="group relative flex items-start gap-3">
              <div className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-accent/[0.04] dark:bg-accent/[0.06]" />
              <AppIcon
                icon={Icon}
                size={iconSize}
                stroke={2}
                className="relative text-foreground/35 transition-colors duration-150 group-hover:text-accent"
              />
              <p className={clsx(
                "type-card-body relative transition-colors duration-150 group-hover:text-foreground",
                isCompact ? "text-foreground/70" : "text-foreground/75"
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
