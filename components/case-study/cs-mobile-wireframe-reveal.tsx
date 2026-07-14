"use client"

import Image from "next/image"
import {
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type TouchEvent,
} from "react"

import { cn } from "@/lib/utils"
import { IphoneFrame } from "@/components/shared/iphone-frame"

export type MobileWireframeRevealLayer = {
  src?: string
  alt?: string
  children?: ReactNode
  className?: string
}

export interface CsMobileWireframeRevealProps {
  ui: MobileWireframeRevealLayer
  wireframe: MobileWireframeRevealLayer
  frame?: "none" | "iphone"
  variant?: "black" | "white"
  aspect?: string
  lensSize?: number
  eyebrow?: string
  title?: string
  description?: string
  className?: string
}

const DEFAULT_ASPECT = "1206/2622"

function Layer({
  layer,
  priority = false,
}: {
  layer: MobileWireframeRevealLayer
  priority?: boolean
}) {
  if (layer.children) {
    return <div className={cn("absolute inset-0", layer.className)}>{layer.children}</div>
  }

  if (layer.src) {
    return (
      <Image
        src={layer.src}
        alt={layer.alt ?? ""}
        fill
        priority={priority}
        sizes="(max-width: 768px) 86vw, 360px"
        className={cn("object-cover", layer.className)}
      />
    )
  }

  return <div className={cn("absolute inset-0 bg-muted", layer.className)} />
}

function WireframeRevealSurface({
  ui,
  wireframe,
  aspect,
  lensSize,
  framed,
}: {
  ui: MobileWireframeRevealLayer
  wireframe: MobileWireframeRevealLayer
  aspect: string
  lensSize: number
  framed: boolean
}) {
  const [lens, setLens] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const revealed = hovered || focused || pinned

  const updateLensFromPoint = (target: HTMLDivElement, clientX: number, clientY: number) => {
    const rect = target.getBoundingClientRect()
    const x = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100
    const y = ((clientY - rect.top) / Math.max(rect.height, 1)) * 100
    setLens({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
  }

  const updateLens = (event: MouseEvent<HTMLDivElement> | PointerEvent<HTMLDivElement>) => {
    updateLensFromPoint(event.currentTarget, event.clientX, event.clientY)
  }

  const updateTouchLens = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0] ?? event.changedTouches[0]
    if (touch) {
      updateLensFromPoint(event.currentTarget, touch.clientX, touch.clientY)
    }
  }

  const style = {
    "--lens-x": `${lens.x}%`,
    "--lens-y": `${lens.y}%`,
    "--lens-size": `${lensSize}px`,
  } as CSSProperties

  return (
    <div
      tabIndex={0}
      aria-label="Reveal mobile wireframe"
      data-revealed={revealed ? "true" : "false"}
      onPointerEnter={(event) => {
        setHovered(true)
        updateLens(event)
      }}
      onPointerMove={updateLens}
      onPointerDown={(event) => {
        setHovered(true)
        setPinned(true)
        updateLens(event)
      }}
      onPointerLeave={() => {
        setHovered(false)
      }}
      onClick={(event) => {
        setPinned(true)
        updateLens(event)
      }}
      onTouchStart={(event) => {
        setPinned(true)
        updateTouchLens(event)
      }}
      onTouchMove={updateTouchLens}
      onFocus={() => {
        setFocused(true)
        setLens({ x: 50, y: 50 })
      }}
      onBlur={() => {
        setFocused(false)
      }}
      className={cn(
        "group/reveal relative isolate w-full touch-manipulation overflow-hidden outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        framed ? "h-full rounded-[12.5cqw]" : "rounded-[1.75rem]"
      )}
      style={framed ? style : { ...style, aspectRatio: aspect }}
    >
      <div className="absolute inset-0">
        <Layer layer={ui} priority />
      </div>

      <div
        aria-hidden
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-data-[revealed=true]/reveal:opacity-100 motion-reduce:transition-none"
        )}
        style={{
          clipPath: "circle(calc(var(--lens-size) / 2) at var(--lens-x) var(--lens-y))",
        }}
      >
        <Layer layer={wireframe} />
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute size-[var(--lens-size)] -translate-x-1/2 -translate-y-1/2 rounded-full",
          "border border-accent/50 bg-accent/[0.03] opacity-0 shadow-[0_0_34px_rgba(16,185,129,0.22)]",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-safe:scale-95 group-data-[revealed=true]/reveal:opacity-100 group-data-[revealed=true]/reveal:motion-safe:scale-100 motion-reduce:transition-none"
        )}
        style={{ left: "var(--lens-x)", top: "var(--lens-y)" }}
      />
    </div>
  )
}

export function CsMobileWireframeReveal({
  ui,
  wireframe,
  frame = "none",
  variant = "black",
  aspect = DEFAULT_ASPECT,
  lensSize = 164,
  eyebrow,
  title,
  description,
  className,
}: CsMobileWireframeRevealProps) {
  const framed = frame === "iphone"

  const surface = (
    <WireframeRevealSurface
      ui={ui}
      wireframe={wireframe}
      aspect={aspect}
      lensSize={lensSize}
      framed={framed}
    />
  )

  return (
    <div
      className={cn(
        "grid items-center gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(16rem,22rem)] md:gap-12",
        className
      )}
    >
      {(eyebrow || title || description) && (
        <div>
          {eyebrow && (
            <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          {title && (
            <h3 className="max-w-[12ch] text-[clamp(28px,3.2vw,42px)] font-semibold leading-[1.08] tracking-tight text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={cn("mx-auto w-full max-w-[22rem]", !framed && "max-w-[19rem]")}>
        {framed ? (
          <IphoneFrame variant={variant} className="w-full">
            {surface}
          </IphoneFrame>
        ) : (
          <div className="rounded-[1.75rem] border border-border/60 bg-card p-2 shadow-[0_28px_64px_-24px_rgba(0,0,0,0.42)]">
            {surface}
          </div>
        )}
      </div>
    </div>
  )
}
