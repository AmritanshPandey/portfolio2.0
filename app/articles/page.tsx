import { articleItems } from "@/lib/data"
import { ArticlesIndex } from "@/components/articles/articles-index"

export default function ArticlesPage() {
  return <ArticlesIndex articles={articleItems} />
}
