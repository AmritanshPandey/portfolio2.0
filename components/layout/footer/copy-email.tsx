"use client"

import { useEffect, useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

interface CopyEmailProps {
  email: string
}

export function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timeout = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className="
        group inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-full
        border border-border/80 bg-background/70 px-4 text-sm font-medium text-foreground
        shadow-none backdrop-blur-sm transition-colors duration-200
        hover:border-accent/45 hover:bg-background
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
        sm:w-auto
      "
    >
      <span className="truncate text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
        {email}
      </span>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted/70 text-muted-foreground transition-colors duration-200 group-hover:border-accent/35 group-hover:text-foreground">
        {copied ? (
          <IconCheck size={13} strokeWidth={2.4} className="text-accent" aria-hidden="true" />
        ) : (
          <IconCopy size={13} strokeWidth={2} aria-hidden="true" />
        )}
      </span>
      <span className="sr-only">{copied ? "Email copied" : "Copy email address"}</span>
    </button>
  )
}
