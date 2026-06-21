"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface DottedGravityBackgroundProps {
  className?: string
  /** Overall opacity of the dot field (0–1). */
  opacity?: number
  /** Spacing between dot centres, in px. */
  gap?: number
  /** Dot radius at rest, in px. */
  radius?: number
  /** CSS variable names for the base dot colour. */
  colorLightVar?: string
  colorDarkVar?: string
  /** CSS variable names for the colour dots glow toward near the cursor. */
  glowColorLightVar?: string
  glowColorDarkVar?: string
  /** Radius of the cursor's pull, in px. */
  pullRadius?: number
  /** How strongly dots are pulled toward the cursor (0–1, fraction of distance). */
  pullStrength?: number
}

// rx/ry: rest position · ox/oy: current offset from rest · vx/vy: velocity
type Dot = { rx: number; ry: number; ox: number; oy: number; vx: number; vy: number }

/**
 * A dot grid whose dots are pulled toward the cursor like a gravity well — the
 * closer a dot is, the more it slides toward the pointer and brightens, easing
 * back to its rest position when the cursor leaves. Canvas-based, theme-aware,
 * static under prefers-reduced-motion. Place as an absolute background layer.
 */
export function DottedGravityBackground({
  className,
  opacity = 1,
  gap = 22,
  radius = 1.4,
  colorLightVar,
  colorDarkVar,
  glowColorLightVar,
  glowColorDarkVar,
  pullRadius = 180,
  pullStrength = 0.45,
}: DottedGravityBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Normalise any CSS colour (incl. oklch theme vars) to rgba().
    const probe = document.createElement("canvas")
    probe.width = probe.height = 1
    const pctx = probe.getContext("2d")
    const toRGBA = (value: string) => {
      if (!pctx) return value
      pctx.clearRect(0, 0, 1, 1)
      pctx.fillStyle = "#000"
      pctx.fillStyle = value
      pctx.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = pctx.getImageData(0, 0, 1, 1).data
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`
    }
    const resolveVar = (name: string | undefined, fallback: string) => {
      const raw = name
        ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        : ""
      return toRGBA(raw || fallback)
    }

    const colors = { base: "#737373", glow: "#737373" }
    const refreshColors = () => {
      const dark = document.documentElement.classList.contains("dark")
      colors.base = resolveVar(dark ? colorDarkVar : colorLightVar, "#737373")
      colors.glow = resolveVar(dark ? glowColorDarkVar : glowColorLightVar, colors.base)
    }

    let dots: Dot[] = []
    let width = 0
    let height = 0

    // Smoothed cursor (canvas-local px) + ease in/out intensity.
    let mx = -9999
    let my = -9999
    let targetX = -9999
    let targetY = -9999
    let intensity = 0
    let targetIntensity = 0
    let visible = true
    let raf = 0
    let lastT = 0

    const approach = (cur: number, target: number, rate: number, dt: number) =>
      cur + (target - cur) * (1 - Math.exp(-rate * dt))

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      dots = []
      for (let y = gap / 2; y < height; y += gap) {
        for (let x = gap / 2; x < width; x += gap) {
          dots.push({ rx: x, ry: y, ox: 0, oy: 0, vx: 0, vy: 0 })
        }
      }
    }

    const draw = (t = 0) => {
      const dt = lastT ? Math.min(Math.max((t - lastT) / 1000, 1 / 240), 1 / 30) : 1 / 60
      lastT = t

      mx = approach(mx, targetX, 14, dt)
      my = approach(my, targetY, 14, dt)
      intensity = approach(intensity, targetIntensity, 8, dt)

      ctx.clearRect(0, 0, width, height)

      // Spring constants — low stiffness + heavy damping gives a viscous,
      // water-like follow that lags the cursor and settles without snapping.
      const STIFF = 50
      const DAMP = 13

      const active = !reduced && intensity > 0.001
      for (const d of dots) {
        // Target offset: how far this dot wants to be pulled toward the cursor.
        let tox = 0
        let toy = 0
        let prox = 0

        if (active) {
          const dx = mx - d.rx
          const dy = my - d.ry
          const dist = Math.hypot(dx, dy) || 0.0001
          const f = Math.max(0, 1 - dist / pullRadius)
          const ease = f * f
          const pull = dist * pullStrength * ease * intensity
          tox = (dx / dist) * pull
          toy = (dy / dist) * pull
          prox = ease * intensity
        }

        if (reduced) {
          d.ox = tox
          d.oy = toy
        } else {
          // Damped spring toward the target — the resistance lives here.
          const ax = (tox - d.ox) * STIFF - d.vx * DAMP
          const ay = (toy - d.oy) * STIFF - d.vy * DAMP
          d.vx += ax * dt
          d.vy += ay * dt
          d.ox += d.vx * dt
          d.oy += d.vy * dt
        }

        const x = d.rx + d.ox
        const y = d.ry + d.oy
        const size = radius * (1 + prox * 1.8) // swell toward the cursor

        // resting dot — kept very faint so the field reads as quiet texture
        ctx.globalAlpha = opacity * (0.12 + prox * 0.45)
        ctx.fillStyle = colors.base
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()

        // glow bloom near the cursor — the only place brightness lifts
        if (prox > 0.02) {
          ctx.globalAlpha = opacity * prox * 0.9
          ctx.fillStyle = colors.glow
          ctx.beginPath()
          ctx.arc(x, y, size * 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      draw(t)
      raf = visible ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      if (!raf && visible && !reduced) raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const lx = e.clientX - rect.left
      const ly = e.clientY - rect.top
      targetX = lx
      targetY = ly
      const inside =
        lx >= -pullRadius &&
        lx <= width + pullRadius &&
        ly >= -pullRadius &&
        ly <= height + pullRadius
      targetIntensity = inside ? 1 : 0
      kick()
    }
    const onLeave = () => {
      targetIntensity = 0
    }

    refreshColors()
    build()
    draw(0)
    if (!reduced) kick()

    const ro = new ResizeObserver(() => build())
    ro.observe(canvas)
    const mo = new MutationObserver(() => {
      refreshColors()
      if (reduced) draw(0)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) kick()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("blur", onLeave)
    document.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("blur", onLeave)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [
    opacity,
    gap,
    radius,
    colorLightVar,
    colorDarkVar,
    glowColorLightVar,
    glowColorDarkVar,
    pullRadius,
    pullStrength,
  ])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  )
}
