import type { Metadata } from "next"
import { FintechSystemCatalogPage } from "@/components/fintech-system"
import { systemItems } from "@/lib/data"

const system = systemItems.find((s) => s.href === "/systems/fintech-ai-interface")
export const metadata: Metadata = system
  ? { title: system.title, description: system.description }
  : {}

export default function Page() {
  return <FintechSystemCatalogPage />
}
