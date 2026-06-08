import type { Metadata } from "next"
import { articleItems } from "@/lib/data"

const article = articleItems.find((a) => a.href === "/articles/color-system")

export const metadata: Metadata = article
  ? { title: article.title, description: article.description }
  : {}

export default function ColorSystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
