"use client"

import { useActionState, useEffect, useRef } from "react"
import { unlock, type UnlockState } from "./actions"

const INITIAL: UnlockState = { error: false }

export function UnlockForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(unlock, INITIAL)
  const field = useRef<HTMLInputElement>(null)

  // Each failed attempt returns a new state object: put the visitor back in
  // the field so they can retype straight away.
  useEffect(() => {
    if (state.error) field.current?.focus()
  }, [state])

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password" className="ledger-label block text-foreground">
        Password
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={field}
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          aria-describedby="unlock-error"
          className="h-12 w-full min-w-0 border border-foreground/40 bg-surface-1 px-3.5 font-mono text-[15px] text-foreground transition-colors duration-200 focus:border-foreground focus:outline-none sm:flex-1"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-ink shrink-0 disabled:opacity-70"
        >
          Unlock
        </button>
      </div>
      <p id="unlock-error" aria-live="polite" className="min-h-5 text-[13px] text-red-600 dark:text-red-400">
        {/* Cleared while pending, so a repeat error is announced again. */}
        {state.error && !pending ? "That password didn't work." : ""}
      </p>
    </form>
  )
}
