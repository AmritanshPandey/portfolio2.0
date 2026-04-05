"use client"

interface CaseStudyDecisionProps {
  title: string
  problem: string
  decision: string
  tradeoff: string
}

export function CaseStudyDecision({
  title,
  problem,
  decision,
  tradeoff,
}: CaseStudyDecisionProps) {
  return (
    <div className="py-6 md:py-8">
      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">
        {title}
      </h3>

      {/* Problem */}
      <div className="mb-6">
        <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
          Problem
        </p>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          {problem}
        </p>
      </div>

      {/* Decision */}
      <div className="mb-6">
        <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
          Decision
        </p>
        <p className="text-base md:text-lg text-gray-900 font-medium leading-relaxed">
          {decision}
        </p>
      </div>

      {/* Tradeoff */}
      <div>
        <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
          Tradeoff
        </p>
        <p className="text-base text-gray-600 leading-relaxed">
          {tradeoff}
        </p>
      </div>

      {/* Divider */}
      <div className="mt-8 pt-6 border-t border-gray-200" />
    </div>
  )
}
