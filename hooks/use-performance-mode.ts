"use client"

import { useSyncExternalStore } from "react"

type PerformanceMode = "high" | "balanced" | "low"

function getPerformanceMode(): PerformanceMode {
  if (typeof navigator === "undefined") {
    return "high"
  }

  const ua = navigator.userAgent
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
  const isLowCPU = navigator.hardwareConcurrency <= 4

  if (isSafari && isLowCPU) {
    return "low"
  }

  if (isSafari || isLowCPU) {
    return "balanced"
  }

  return "high"
}

export function usePerformanceMode() {
  const mode = useSyncExternalStore(
    () => () => {},
    getPerformanceMode,
    () => "high"
  )

  return {
    isHigh: mode === "high",
    isBalanced: mode === "balanced",
    isLow: mode === "low",
  }
}