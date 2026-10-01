import type { Metadata } from "next"

import { PlaygroundWall } from "./playground-wall"

export const metadata: Metadata = {
  title: "Lab",
  description: "Working experiments — interactive components, diagrams, and models you can open and use.",
}

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative isolate h-screen min-h-[680px] overflow-hidden border-b border-white/10 bg-black">
        <PlaygroundWall />
      </section>
    </div>
  )
}
