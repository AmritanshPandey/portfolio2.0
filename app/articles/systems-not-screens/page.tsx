import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/article-layout"
import { articleItems } from "@/lib/data"

const article = articleItems.find((a) => a.href === "/articles/systems-not-screens")
export const metadata: Metadata = article
  ? { title: article.title, description: article.description }
  : {}

export default function Page() {
  return <ArticleLayout slug="systems-not-screens" />
}
