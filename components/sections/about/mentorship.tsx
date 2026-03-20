"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { AdvisoryItem } from "@/components/shared/advisory-item"
import { SectionTransition } from "@/components/shared/section-transition"
import { IconArrowRight, IconLink } from "@tabler/icons-react"

export default function AdvisorySection() {

  const advisory = [
    {
      title: "Covera — Product & UX Advisor",
      desc: "Advised on product strategy, customer experience, and early roadmap decisions.",
      logo: "/assets/images/logos/covera.jpeg",
      link: "https://lovecovera.com/",
    },
    {
      title: "Yon Innovations — Design & Tech Advisor",
      desc: "Supported product direction, technology decisions, and brand positioning from early stages.",
      logo: "/assets/images/logos/yosn.png",
      link: "https://www.yosn.events/",
    },
  ]

  const teaching = [
    {
      title: "Masters' Union — MasterCamp (UX Design)",
      desc: "Mentored students on product thinking, UX fundamentals, and real-world problem solving.",
      logo: "/assets/images/logos/mu.jpeg",
      link: "https://mastersunion.org/",
    },
    {
      title: "Designerrs — UI/UX Academy",
      desc: "Guided designers on UX fundamentals, portfolio development, and practical workflows.",
      logo: "/assets/images/logos/da.jpeg",
      link: "https://designerrs.com/",
    },
  ]

  const mentees = [
    {
      name: "Sameen Kazi",
      company: "Product Designer • Microsoft",
      link: "https://www.linkedin.com/in/sameenkazi/",
    },
    {
      name: "Swati Panda",
      company: "Product Designer • Zomato",
      link: "https://www.linkedin.com/in/swati-panda-42b63919b/",
    },
    {
      name: "Simran Koul",
      company: "UX Designer • Aleph Alpha",
      link: "https://www.linkedin.com/in/simran-koul-a8ba79152/",
    },
    {
      name: "Kritika Kant",
      company: "Senior UX Designer • Mastercard",
      link: "https://www.linkedin.com/in/kritika-kant-ui-ux/",
    },
  ]

  return (
    <SectionSubgroup
      label="Advisory & Mentorship"
      description="Supporting startups, mentoring designers, and contributing to the product ecosystem."
      variant="spacious"
    >

      <div className="space-y-12 md:space-y-14">

        {/* ADVISORY */}
        <div className="space-y-5">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.16em]">
            Advisory
          </p>

          <div className="space-y-4">
            {advisory.map((item, i) => (
              <AdvisoryItem key={i} {...item} />
            ))}
          </div>
        </div>

        {/* MENTORSHIP */}
        <div className="space-y-5 pt-6 border-t border-neutral-200">

          <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.16em]">
            Mentorship
          </p>

          <p className="text-neutral-600 text-sm md:text-base max-w-xl leading-[1.6]">
            Mentored early-career designers on portfolio strategy, product thinking, and interviews.
          </p>

          <ul className="space-y-3 text-sm">

            {mentees.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group flex items-center gap-2
                    text-neutral-700
                    transition-all duration-200
                    hover:translate-x-[3px]
                    hover:text-red-600
                  "
                >
                  <span>{item.name}</span>

                  <IconArrowRight size={14} className="opacity-40" />

                  <span className="text-neutral-500 group-hover:text-red-600 transition">
                    {item.company}
                  </span>

                  <IconLink size={14} className="opacity-40 group-hover:opacity-100 transition" />
                </a>
              </li>
            ))}

          </ul>

        </div>

        {/* TEACHING */}
        <div className="space-y-5 pt-6 border-t border-neutral-200">

          <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.16em]">
            Teaching
          </p>

          <div className="space-y-4">
            {teaching.map((item, i) => (
              <AdvisoryItem key={i} {...item} />
            ))}
          </div>

        </div>

      </div>
            <div className="h-px w-full pb-8" />

    </SectionSubgroup>
  )
}