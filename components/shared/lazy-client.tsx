"use client"

import { useEffect, useState, type ComponentType, type ReactNode } from "react"

/**
 * A client-only component whose code loads when it first mounts: the same
 * job as next/dynamic with `ssr: false`, minus Suspense. Declare it at module
 * scope, as with dynamic().
 *
 * Use this instead of next/dynamic for anything under the root layout.
 * next/dynamic reveals through Suspense, and React runs the layout's
 * <ViewTransition> on a Suspense reveal just as on a route change: the whole
 * page blanks for a frame and fades back in, seconds after it loaded. Here the
 * component arrives with a plain state update, which is not a transition, so
 * nothing fades. (e2e/motion.spec.ts holds pages to that.)
 */
export function lazyClient<P extends object>(
  load: () => Promise<ComponentType<P>>,
  options: { fallback?: () => ReactNode } = {},
): ComponentType<P> {
  let Loaded: ComponentType<P> | null = null
  let loading: Promise<void> | null = null

  function LazyClient(props: P) {
    const [, setArrived] = useState(Loaded !== null)

    useEffect(() => {
      if (Loaded) return
      let mounted = true
      loading ??= load().then((component) => {
        Loaded = component
      })
      loading.then(() => {
        if (mounted) setArrived(true)
      })
      return () => {
        mounted = false
      }
    }, [])

    return Loaded ? <Loaded {...props} /> : (options.fallback?.() ?? null)
  }

  return LazyClient
}
