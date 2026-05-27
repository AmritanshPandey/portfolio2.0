import type { ComponentType, CSSProperties } from "react"

import { cn } from "@/lib/utils"

export const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
} as const

export type IconSize = keyof typeof iconSizes | number

export type IconComponent = ComponentType<{
  size?: number
  stroke?: number
  className?: string
  style?: CSSProperties
  "aria-hidden"?: boolean
  "aria-label"?: string
}>

type AppIconProps = {
  icon: IconComponent
  size?: IconSize
  stroke?: number
  className?: string
  style?: CSSProperties
  "aria-hidden"?: boolean
  "aria-label"?: string
}

export function getIconSize(size: IconSize = "md") {
  return typeof size === "number" ? size : iconSizes[size]
}

export function AppIcon({
  icon: Icon,
  size = "md",
  stroke = 2,
  className,
  ...props
}: AppIconProps) {
  const ariaHidden = props["aria-label"] ? undefined : props["aria-hidden"] ?? true

  return (
    <Icon
      size={getIconSize(size)}
      stroke={stroke}
      className={cn("shrink-0", className)}
      {...props}
      aria-hidden={ariaHidden}
    />
  )
}
