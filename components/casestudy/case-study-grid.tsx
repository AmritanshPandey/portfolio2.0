"use client"

interface GridItem {
  title: string
  description: string
}

interface CaseStudyGridProps {
  items: GridItem[]
}

export function CaseStudyGrid({ items }: CaseStudyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col">
          {/* Title */}
          <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-base md:text-lg leading-relaxed text-gray-700">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}
