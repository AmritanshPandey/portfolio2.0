import ContentPage from "@/components/layout/content-page"
import { ArticleCard } from "@/components/shared/article-card"
import { articleItems } from "@/lib/data"

export default function Page() {
  return (
    <ContentPage
      title="Articles"
      description="Descriptions of my latest thinking on product design, strategy, and leadership."
    >
      <div className="space-y-2">
        {articleItems.map((article) => (
          <ArticleCard
            key={article.href}
            title={article.title}
            description={article.description}
            href={article.href}
            image={article.image}
            date={article.date}
            category={article.category}
          />
        ))}
      </div>
    </ContentPage>
  )
}
