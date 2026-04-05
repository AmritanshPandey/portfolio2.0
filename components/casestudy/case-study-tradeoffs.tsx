"use client"

interface CaseStudyTradeoffsProps {
  items: string[]
}

export function CaseStudyTradeoffs({ items }: CaseStudyTradeoffsProps) {
  return (
    <ul className="space-y-4 md:space-y-6">
      {items.map((item, index) => (
        <li
          key={index}
          className="text-base md:text-lg text-gray-700 leading-relaxed"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
