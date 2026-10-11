"use client"

import { useActionState } from "react"
import { unlock, type UnlockState } from "./actions"

const INITIAL: UnlockState = { error: false }

export function UnlockForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(unlock, INITIAL)

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password" className="block text-[13px] font-medium text-foreground">
        Password
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          aria-describedby="unlock-error"
          className="h-11 w-full min-w-0 rounded-xl border sm:flex-1 border-border bg-background px-3.5 text-[15px] text-foreground transition-colors duration-200 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-11 shrink-0 rounded-full bg-accent px-6 text-[14px] font-medium text-white transition-[background-color,transform] duration-200 hover:bg-accent/85 active:translate-y-px disabled:opacity-70 dark:text-neutral-950"
        >
          Unlock
        </button>
      </div>
      <p id="unlock-error" aria-live="polite" className="min-h-5 text-[13px] text-red-600 dark:text-red-400">
        {state.error ? "That password didn't work." : ""}
      </p>
    </form>
  )
}
