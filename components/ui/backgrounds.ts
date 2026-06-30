/**
 * One-stop barrel for the reusable animated backgrounds.
 *
 * Canvas backgrounds (this folder) are fully self-contained: zero required
 * props, theme-aware, and self-pausing off-screen — drop one into any
 * `position: relative` parent, or use `<BackgroundBand>` for a full-width band.
 * The WebGL fields live in `components/shared` and are re-exported here so this
 * is the single import site.
 */

export { DottedGlowBackground, type DottedGlowBackgroundProps } from "./dotted-glow-background"
export { AsciiFlowBackground, type AsciiFlowBackgroundProps } from "./ascii-flow-background"
export { ConstellationNetwork, type ConstellationNetworkProps } from "./constellation-network"
export { GradientShineBackground, type GradientShineBackgroundProps } from "./gradient-shine-background"

export { ShaderGrid } from "@/components/shared/shader-grid"
export { ShaderHaze } from "@/components/shared/shader-haze"
