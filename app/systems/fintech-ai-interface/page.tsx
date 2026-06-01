import type { Metadata } from "next"
import { SystemLayout } from "@/components/layout/system-layout"
import { systemItems } from "@/lib/data"

const system = systemItems.find((s) => s.href === "/systems/fintech-ai-interface")
export const metadata: Metadata = system
  ? { title: system.title, description: system.description }
  : {}

export default function Page() {
  return <SystemLayout slug="fintech-ai-interface" />
}
