"use client"

import type { ReactNode } from "react"
import clsx from "clsx"

export interface BrowserFrameProps {
  children: ReactNode
  /** Shown in the address bar. Label the product, don't fake a real URL. */
  url?: string
  /** Frame chrome tone. "dark" suits product UI shot in dark mode. */
  tone?: "light" | "dark"
  className?: string
}

/**
 * Browser chrome around a screenshot or video.
 *
 * A bare screenshot of a web app reads as a flat image; the frame tells the
 * reader "this ran in a browser" without a caption doing it. Purely
 * decorative, so the whole chrome is aria-hidden and only the wrapped content
 * carries meaning.
 *
 * The address bar is a label, not a claim: pass the product name rather than a
 * fabricated internal URL.
 */
export function BrowserFrame({
  children,
  url,
  tone = "dark",
  className,
}: BrowserFrameProps) {
  const dark = tone === "dark"

  return (
    <div
      className={clsx(
        "overflow-hidden rounded-xl border",
        dark
          ? "border-white/[0.08] bg-neutral-900"
          : "border-border/60 bg-muted",
        className
      )}
    >
      <div
        aria-hidden
        className={clsx(
          "flex items-center gap-3 border-b px-3.5 py-2.5",
          dark ? "border-white/[0.07]" : "border-border/50"
        )}
      >
        <div className="flex shrink-0 gap-1.5">
          {["bg-red-400/70", "bg-yellow-400/70", "bg-green-400/70"].map((c) => (
            <span key={c} className={clsx("size-2.5 rounded-full", c)} />
          ))}
        </div>

        {url && (
          <div
            className={clsx(
              "min-w-0 flex-1 truncate rounded-md px-2.5 py-1 text-center font-mono text-[10px]",
              dark
                ? "bg-white/[0.05] text-white/45"
                : "bg-foreground/[0.04] text-muted-foreground"
            )}
          >
            {url}
          </div>
        )}
      </div>

      <div className="relative">{children}</div>
    </div>
  )
}
