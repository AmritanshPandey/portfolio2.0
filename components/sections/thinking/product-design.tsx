"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ProcessStepsCard } from "@/components/shared/process-steps-card"

export default function ProductDesignApproachSection() {

  const steps = [
    {
      number: "01",
      title: "Frame the Problem",
      description:
        "Align user needs, business goals, and constraints before exploring solutions.",
    },
    {
      number: "02",
      title: "Structure the System",
      description:
        "Define architecture and flows that scale across use cases and edge conditions.",
    },
    {
      number: "03",
      title: "Design & Operationalize",
      description:
        "Translate concepts into production-ready systems with engineering.",
    },
    {
      number: "04",
      title: "Learn & Evolve",
      description:
        "Refine continuously using feedback, signals, and constraints.",
    },
  ]

  return (
    <SectionSubgroup
      label="Approach"
      description="How I move from ambiguity to scalable outcomes."
      variant="spacious"
    >

      <ProcessStepsCard steps={steps} />

    </SectionSubgroup>
  )
}