"use client"

interface CaseStudyHeroProps {
  title: string
  subtitle: string
  meta: {
    role?: string
    duration?: string
    platform?: string
  }
}

export function CaseStudyHero({
  title,
  subtitle,
  meta,
}: CaseStudyHeroProps) {
  const metaItems = [meta.role, meta.duration, meta.platform].filter(Boolean)

  return (
    <div className="py-16 md:py-24 lg:py-32">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 md:mb-8">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 md:mb-12 leading-relaxed">
        {subtitle}
      </p>

      {/* Meta */}
      {metaItems.length > 0 && (
        <div className="flex flex-wrap gap-4 md:gap-6">
          {metaItems.map((item, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-1">
                {index === 0 ? "Role" : index === 1 ? "Duration" : "Platform"}
              </p>
              <p className="text-sm md:text-base font-medium text-gray-900">
                {item}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
