import clsx from "clsx"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"
import { explorationItems, systemItems } from "@/lib/data"

const systemExplorations = systemItems.map((item) => ({
  title: item.title,
  description: item.description,
  href: item.href,
  category: item.category,
  ctaLabel: item.ctaLabel,
  tags: item.tags,
}))

const productExplorations = explorationItems.map((item) => ({
  title: item.title,
  description: item.description,
  href: item.href,
  category: item.status ? `Product Exploration · ${item.status}` : "Product Exploration",
  ctaLabel: "View product",
  tags: item.tags,
}))

const explorations = [...systemExplorations, ...productExplorations]

export default function ExplorationsSection() {
  return (
    <SectionSubgroup
      label="Explorations"
      description="Personal products and system experiments built to test ideas around finance, planning, behavior, and reusable product foundations."
      variant="spacious"
    >
      <section data-cursor-zone="exploration">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {explorations.map((item, index) => (
            <div key={item.href} className={clsx(index === 0 && explorations.length > 2 ? "md:col-span-2" : undefined)}>
              <VerticalCard
                href={item.href}
                title={item.title}
                category={item.category}
                metric={item.description}
                ctaLabel={item.ctaLabel}
                tags={item.tags}
                index={index + 1}
                showImage={false}
                variant={index === 0 && explorations.length > 2 ? "featured" : "default"}
              />
            </div>
          ))}
        </div>
      </section>
    </SectionSubgroup>
  )
}
