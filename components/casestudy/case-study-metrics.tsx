"use client"

interface Metric {
  label: string
  value: string
}

interface CaseStudyMetricsProps {
  metrics: Metric[]
}

export function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
      {metrics.map((metric, index) => (
        <div key={index} className="flex flex-col items-start">
          {/* Value */}
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            {metric.value}
          </p>

          {/* Label */}
          <p className="text-sm md:text-base text-gray-600">
            {metric.label}
          </p>
        </div>
      ))}
    </div>
  )
}
