"use client"

import { useEffect, useState } from "react"

export function usePerformanceMode() {
  const [mode, setMode] = useState<"high" | "balanced" | "low">("high")

  useEffect(() => {
    const ua = navigator.userAgent

    const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
    const isLowCPU = navigator.hardwareConcurrency <= 4

    if (isSafari || isLowCPU) {
      setMode("balanced")
    }

    if (isSafari && isLowCPU) {
      setMode("low")
    }
  }, [])

  return {
    isHigh: mode === "high",
    isBalanced: mode === "balanced",
    isLow: mode === "low",
  }
}