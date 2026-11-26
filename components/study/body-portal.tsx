"use client"

import { useSyncExternalStore, type ReactNode } from "react"
import { createPortal } from "react-dom"

const noop = () => () => {}

/**
 * Renders into <body>. <main> carries a transform (a compositing hint), and
 * a transformed ancestor turns position: fixed into position: absolute, so
 * anything pinned to the screen from inside a page has to live outside it.
 * Renders nothing on the server and before hydration.
 */
export function BodyPortal({ children }: { children: ReactNode }) {
  const body = useSyncExternalStore(noop, () => document.body, () => null)
  return body ? createPortal(children, body) : null
}
