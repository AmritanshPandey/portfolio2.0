import type { Metadata } from "next"
import { SystemLayout } from "@/components/layout/system-layout"
import { systemItems } from "@/lib/data"

const system = systemItems.find((s) => s.href === "/systems/theming-token-system")
export const metadata: Metadata = system
  ? { title: system.title, description: system.description }
  : {}

export default function Page() {
  return <SystemLayout slug="theming-token-system" />
}
