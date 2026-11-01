"use client"

import { useEffect } from "react"
import { playNote } from "@/lib/ledger-sound"

// When each drop line starts, in ms from the hero's landing (globals.css,
// "Hero notes", keeps the rest of the timeline).
const DROP_AT = [780, 880]

/**
 * Hangs a drop line from each footnote mark on the statement to its note's
 * rule, and starts the rule drawing from where the line lands. Positions are
 * measured from layout (offsets ignore the landing transforms), once fonts
 * are in and again when the hero resizes; nothing tracks the pointer or the
 * scroll. Phones keep their notes without lines (the CSS hides them).
 *
 * Hovering a claim plays a soft tick, if the visitor has turned sound on.
 */
export function HeroLeaders() {
  useEffect(() => {
    const hero = document.getElementById("hero")
    const leaders = hero?.querySelectorAll<HTMLElement>("[data-leader]")
    const sheet = leaders?.[0]?.parentElement
    if (!hero || !leaders || !sheet) return

    // The landing's own clock: the hero rule starts with the page, so its
    // animation's current time says how far into the landing we are, even
    // after a client-side navigation back home.
    const clock = hero.querySelector("[data-hero-rule]")?.getAnimations()[0]
    const elapsed = typeof clock?.currentTime === "number" ? clock.currentTime : Infinity

    // Offsets up to the sheet. The landed lines keep a transform, which makes
    // each one its mark's offset parent, so walk the chain.
    const offset = (el: HTMLElement) => {
      let left = 0
      let top = 0
      let node: HTMLElement | null = el
      while (node && node !== sheet) {
        left += node.offsetLeft
        top += node.offsetTop
        node = node.offsetParent as HTMLElement | null
      }
      return { left, top }
    }

    const place = () => {
      leaders.forEach((leader, i) => {
        const n = i + 1
        const mark = hero.querySelector<HTMLElement>(`[data-mark="${n}"]`)
        const note = hero.querySelector<HTMLElement>(`[data-note="${n}"]`)
        const rule = note?.querySelector<HTMLElement>("[data-note-rule]")
        if (!mark || !note || !rule) return
        const m = offset(mark)
        const at = offset(note)
        const x = m.left + mark.offsetWidth / 2
        const top = m.top + mark.offsetHeight + 6
        leader.style.left = `${x}px`
        leader.style.top = `${top}px`
        leader.style.height = `${Math.max(0, at.top - top)}px`
        rule.style.setProperty("--o", `${x - at.left}px`)
      })
    }

    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(place)
    }

    place()
    leaders.forEach((leader, i) => {
      leader.style.animationDelay = `${Math.max(0, DROP_AT[i] - elapsed)}ms`
      leader.hidden = false
    })
    document.fonts?.ready.then(schedule)
    const resize = new ResizeObserver(schedule)
    resize.observe(sheet)

    const claims = hero.querySelectorAll<HTMLElement>("[data-claim]")
    const ticks = Array.from(claims, (claim, i) => {
      const tick = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return
        const pan = (e.clientX / window.innerWidth) * 2 - 1
        playNote(20 + i, 0.45, pan)
      }
      claim.addEventListener("pointerenter", tick)
      return () => claim.removeEventListener("pointerenter", tick)
    })

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      ticks.forEach((off) => off())
    }
  }, [])

  return null
}
