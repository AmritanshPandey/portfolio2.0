"use client"

interface CaseStudyImpactProps {
  points: string[]
}

export function CaseStudyImpact({ points }: CaseStudyImpactProps) {
  return (
    <ul className="space-y-4 md:space-y-6">
      {points.map((point, index) => (
        <li
          key={index}
          className="text-base md:text-lg font-medium text-gray-900 leading-relaxed"
        >
          {point}
        </li>
      ))}
    </ul>
  )
}
