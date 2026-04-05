"use client"

interface CaseStudyFlowProps {
  steps: string[]
}

export function CaseStudyFlow({ steps }: CaseStudyFlowProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-center min-w-max md:min-w-full gap-3 md:gap-4 pb-4 md:pb-0">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3 md:gap-4">
            {/* Step Box */}
            <div className="px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded bg-white whitespace-nowrap">
              <p className="text-sm md:text-base font-medium text-gray-900">
                {step}
              </p>
            </div>

            {/* Arrow Separator */}
            {index < steps.length - 1 && (
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
