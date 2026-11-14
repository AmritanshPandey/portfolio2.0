"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

type Status = "poster" | "loading" | "ready" | "failed"

// How long the demo gets to answer before the poster says it didn't load.
const GIVE_UP_MS = 8000

/**
 * A live demo that costs nothing until someone asks for it: a still of its
 * first screen with a "Try the live demo" button, and the iframe only after
 * the click. If the demo hasn't loaded within 8s (its host asleep or down),
 * the still stays and says so, with a link to open it in a new tab, so the
 * section always looks finished. Fills its parent (a device screen).
 */
export function DemoPoster({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [status, setStatus] = useState<Status>("poster")

  useEffect(() => {
    if (status !== "loading") return
    const timer = window.setTimeout(() => setStatus("failed"), GIVE_UP_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  return (
    <div className="absolute inset-0">
      <Image src={poster} alt="" fill sizes="320px" className="object-cover object-top" />

      {(status === "loading" || status === "ready") && (
        <iframe
          src={src}
          title={title}
          allow="microphone"
          onLoad={() => setStatus((s) => (s === "loading" ? "ready" : s))}
          className={`absolute inset-0 h-full w-full border-none transition-opacity duration-300 ${
            status === "ready" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {status !== "ready" && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-[#F8F6F3]/90 px-5 pb-8 pt-5 text-center text-[#111]">
          {status === "failed" ? (
            <p className="text-[14px] leading-snug" role="status">
              The demo didn&apos;t load.{" "}
              <a href={src} target="_blank" rel="noopener noreferrer" className="underline underline-offset-[0.2em]">
                Open it in a new tab.
              </a>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setStatus("loading")}
              disabled={status === "loading"}
              className="inline-flex h-11 items-center justify-center bg-[#111] px-5 text-[14px] font-medium text-[#F8F6F3] disabled:opacity-70"
            >
              {status === "loading" ? "Loading the demo…" : "Try the live demo"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
