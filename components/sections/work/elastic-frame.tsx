"use client"

import Image from "next/image"
import { useEffect, useRef, type ReactNode } from "react"
import { useAmbientMode } from "@/hooks/use-ambient-still"
import type { WorkMedia } from "@/lib/types/content"

/**
 * One frame of the work gallery.
 *
 * With media: the still or loop, as plain DOM, so it shows everywhere. On a
 * desktop pointer with motion allowed, the frame also becomes an elastic
 * sheet (elastic-sheet.ts): a WebGL canvas over the frame draws the media
 * and bends it with the scroll and the pointer, and the DOM media steps back
 * once the canvas has its picture. A loop plays only while it is on screen,
 * and never under reduced motion.
 *
 * Without media: the study's drawn specimen (children), filling the frame,
 * until its media arrives.
 */
export function ElasticFrame({
  media,
  ratio,
  children,
}: {
  media?: WorkMedia
  ratio: number
  children: ReactNode
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mode = useAmbientMode("desktop")

  // A loop runs only while its frame is on screen.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => {})
      else video.pause()
    })
    io.observe(video)
    return () => io.disconnect()
  }, [])

  // The elastic sheet: desktop, motion allowed, media present.
  useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    if (!media || mode !== "live" || !box || !canvas) return
    const source = (media.kind === "video" ? videoRef.current : box.querySelector("img")) as
      | HTMLImageElement
      | HTMLVideoElement
      | null
    if (!source) return
    let dispose: (() => void) | undefined
    let cancelled = false
    void import("./elastic-sheet").then(({ mountSheet }) => {
      if (cancelled) return
      dispose = mountSheet({ box, canvas, source })
    })
    // Opening a study: hand the frame back to the DOM first, so the view
    // transition morphs the picture rather than an empty box.
    const link = box.closest("a")
    const release = () => {
      dispose?.()
      dispose = undefined
    }
    link?.addEventListener("click", release)
    return () => {
      cancelled = true
      link?.removeEventListener("click", release)
      release()
    }
  }, [media, mode])

  return (
    <div
      ref={boxRef}
      className="elastic-frame relative w-full"
      style={{ aspectRatio: ratio }}
      data-media={media ? "" : undefined}
    >
      {media ? (
        <>
          {media.kind === "video" ? (
            <video
              ref={videoRef}
              data-sheet-media
              className="absolute inset-0 h-full w-full rounded-[4px] object-cover"
              src={media.src}
              poster={media.poster}
              width={media.width}
              height={media.height}
              aria-label={media.alt}
              muted
              loop
              playsInline
              preload="none"
            />
          ) : (
            <Image
              data-sheet-media
              src={media.src}
              alt={media.alt}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="rounded-[4px] object-cover"
            />
          )}
          <canvas ref={canvasRef} aria-hidden className="elastic-canvas pointer-events-none absolute" />
        </>
      ) : (
        // The specimen is its own 16:10 card, the same shape as the frame, so
        // it simply fills it.
        <div className="absolute inset-0">{children}</div>
      )}
    </div>
  )
}
