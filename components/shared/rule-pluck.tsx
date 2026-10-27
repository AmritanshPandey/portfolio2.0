"use client"

import { useEffect } from "react"
import { playNote, wakeSoundOnGesture } from "@/lib/ledger-sound"
import { PLUCK, amplitude, crossingX, isAtRest, rulePath, stepString, type Point } from "@/lib/pluck"

const SVG_NS = "http://www.w3.org/2000/svg"
// Room above and below a rule for its drawn copy to bend into (px).
const ROOM = PLUCK.pull + 4

interface Pluck {
  el: HTMLElement
  svg: SVGSVGElement
  path: SVGPathElement
  width: number
  /** Grab point along the rule (px from its left end). */
  x0: number
  d: number
  v: number
  held: boolean
  /** Let go since the last frame: drawn where it slipped free before it rings. */
  slipped: boolean
}

/**
 * Pluckable rules. On a desktop pointer the ink rules (`.rule-ink`) behave
 * like strings: sweep across one and it catches, bends toward the pointer,
 * slips free past `PLUCK.pull` and rings flat again, lit ultramarine by how
 * hard it was plucked. With sound on (<SoundToggle>) each release plays a note.
 *
 * While a rule moves, an SVG copy bends inside it and its own line is hidden;
 * once it is flat the copy is removed, so a resting rule is just the plain
 * element. Only pointer movement plucks: a rule scrolled past a still pointer
 * stays put. Phones, touch and reduced motion never pluck.
 */
export function RulePluck() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const live = () => fine.matches && !reduce.matches

    const active = new Map<HTMLElement, Pluck>()
    let client: Point | null = null // last pointer position, viewport coordinates
    let prev: Point | null = null // the same position in page coordinates
    let raf = 0
    let last = 0

    const rules = () => Array.from(document.querySelectorAll<HTMLElement>(".rule-ink"))
    // Each rule's line in page coordinates, measured on the first move after
    // a scroll or resize. A move then only measures the rule it crosses, not
    // every rule on the page.
    let lines: { el: HTMLElement; y: number }[] | null = null
    const measure = () =>
      (lines = rules().map((el) => {
        const box = el.getBoundingClientRect()
        return { el, y: box.top + window.scrollY + box.height / 2 }
      }))

    const begin = (el: HTMLElement, width: number): Pluck => {
      const existing = active.get(el)
      if (existing) return existing
      const svg = document.createElementNS(SVG_NS, "svg")
      svg.setAttribute("aria-hidden", "true")
      svg.setAttribute("class", "rule-pluck")
      svg.setAttribute("width", String(width))
      svg.setAttribute("height", String(ROOM * 2))
      svg.setAttribute("viewBox", `0 ${-ROOM} ${width} ${ROOM * 2}`)
      // Centre the copy's y = 0 on the rule's own line.
      svg.style.top = `${el.offsetHeight / 2 - ROOM}px`
      const path = document.createElementNS(SVG_NS, "path")
      path.setAttribute("d", rulePath(width, 0, 0))
      svg.append(path)
      el.append(svg)
      el.setAttribute("data-plucking", "")
      const p: Pluck = { el, svg, path, width, x0: 0, d: 0, v: 0, held: false, slipped: false }
      active.set(el, p)
      return p
    }

    const end = (p: Pluck) => {
      p.svg.remove()
      p.el.removeAttribute("data-plucking")
      active.delete(p.el)
    }

    const release = (p: Pluck, d: number) => {
      p.held = false
      p.slipped = true
      p.d = Math.max(-PLUCK.pull, Math.min(PLUCK.pull, d))
      p.v = 0
      playNote(rules().indexOf(p.el), Math.abs(p.d) / PLUCK.pull, (p.x0 / p.width) * 2 - 1)
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20)
      last = now
      for (const p of active.values()) {
        if (!p.el.isConnected) {
          end(p)
          continue
        }
        // A rule that has just slipped free is drawn there first, then rings.
        // Stepping it straight away would skip the slip by a whole frame,
        // further the slower the frames, and the pluck would look weaker.
        if (p.slipped) p.slipped = false
        else if (!p.held) {
          const s = stepString(p, dt)
          p.d = s.d
          p.v = s.v
          if (isAtRest(p)) {
            end(p)
            continue
          }
        }
        p.path.setAttribute("d", rulePath(p.width, p.x0, p.d))
        const glow = Math.min(1, (p.held ? Math.abs(p.d) : amplitude(p)) / PLUCK.pull)
        p.svg.style.setProperty("--pluck-glow", glow.toFixed(3))
      }
      raf = active.size ? requestAnimationFrame(frame) : 0
    }

    const run = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const endAll = () => active.forEach(end)

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      client = { x: e.clientX, y: e.clientY }
      const from = prev
      const cur = { x: e.clientX, y: e.clientY + window.scrollY }
      prev = cur
      if (!live()) return

      for (const line of lines ?? measure()) {
        const el = line.el
        const p = active.get(el)
        // Neither held nor crossed by this move: nothing to measure.
        if (!p?.held && (!from || crossingX(from, cur, line.y) === null)) continue
        const box = el.getBoundingClientRect()
        const y = box.top + window.scrollY + box.height / 2

        // A caught rule follows the pointer until it is drawn past the pull
        // limit or the pointer leaves either end, then it slips free.
        if (p?.held) {
          const d = cur.y - y
          const x0 = cur.x - box.left
          if (Math.abs(d) > PLUCK.pull || x0 < 0 || x0 > box.width) release(p, d)
          else {
            p.d = d
            p.x0 = Math.min(Math.max(x0, PLUCK.edge), box.width - PLUCK.edge)
          }
          continue
        }

        if (!from) continue
        const xc = crossingX(from, cur, y)
        if (xc === null) continue
        const at = xc - box.left
        if (at < PLUCK.edge || at > box.width - PLUCK.edge) continue
        // Only a rule that is on screen and fully drawn in can be caught.
        if (box.bottom < 0 || box.top > window.innerHeight) continue
        if (box.width < el.offsetWidth - 1) continue

        const caught = begin(el, box.width)
        caught.x0 = at
        const d = cur.y - y
        if (Math.abs(d) > PLUCK.pull) {
          // Flicked straight through in one move: plucked in passing, harder
          // the faster the pointer went.
          const force = Math.min(0.85, 0.45 + Math.abs(d) / (PLUCK.pull * 8))
          release(caught, Math.sign(d) * PLUCK.pull * force)
        } else {
          caught.held = true
          caught.d = d
          caught.v = 0
        }
        run()
      }
    }

    // Scrolling moves the rules, not the pointer: re-base the pointer so the
    // next move is not read as a sweep, and let go of anything held.
    const onScroll = () => {
      lines = null
      if (client) prev = { x: client.x, y: client.y + window.scrollY }
      active.forEach((p) => p.held && release(p, p.d))
    }

    const onLeave = () => {
      prev = null
      active.forEach((p) => p.held && release(p, p.d))
    }

    const onModeChange = () => {
      if (!live()) endAll()
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    const onResize = () => {
      lines = null
      endAll()
    }
    window.addEventListener("resize", onResize)
    document.documentElement.addEventListener("pointerleave", onLeave)
    fine.addEventListener("change", onModeChange)
    reduce.addEventListener("change", onModeChange)
    const unwake = wakeSoundOnGesture()

    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      fine.removeEventListener("change", onModeChange)
      reduce.removeEventListener("change", onModeChange)
      unwake()
      cancelAnimationFrame(raf)
      endAll()
    }
  }, [])

  return null
}
