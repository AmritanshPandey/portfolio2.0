"use client"

interface ArchitectureLayer {
  title: string
  items: string[]
  columns?: number
}

interface CaseStudyArchitectureProps {
  title: string
  layers: ArchitectureLayer[]
}

export function CaseStudyArchitecture({
  title,
  layers,
}: CaseStudyArchitectureProps) {
  return (
    <div>
      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-12">
        {title}
      </h3>

      {/* Architecture Layers */}
      <div className="space-y-8">
        {layers.map((layer, layerIndex) => (
          <div key={layerIndex}>
            {/* Layer Content */}
            <div
              className={`grid gap-6 ${
                layer.columns === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {layer.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="border border-gray-300 rounded px-6 py-4 bg-gray-50"
                >
                  <p className="text-base font-medium text-gray-900">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Connector Arrow */}
            {layerIndex < layers.length - 1 && (
              <div className="flex justify-center my-6">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-gray-300" />
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
