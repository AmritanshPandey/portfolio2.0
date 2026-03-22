"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { AdvisoryItem } from "@/components/shared/advisory-item"
import { IconArrowRight, IconLink } from "@tabler/icons-react"

export default function AdvisorySection() {

  const advisory = [
    {
      title: "Covera — Product & UX Advisor",
      desc: "Advised on product strategy, customer experience, and early-stage roadmap decisions.",
      logo: "/assets/images/logos/covera.jpeg",
      link: "https://lovecovera.com/",
    },
    {
      title: "Yon Innovations — Design & Tech Advisor",
      desc: "Guided product direction, technology choices, and brand positioning from early stages.",
      logo: "/assets/images/logos/yosn.png",
      link: "https://www.yosn.events/",
    },
  ]

  const teaching = [
    {
      title: "Masters' Union — MasterCamp (UX Design)",
      desc: "Mentored students on product thinking and real-world UX problem solving.",
      logo: "/assets/images/logos/mu.jpeg",
      link: "https://mastersunion.org/",
    },
    {
      title: "Designerrs — UI/UX Academy",
      desc: "Guided designers on UX fundamentals, portfolio building, and practical workflows.",
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
      company: "Sr. UX Designer • Mastercard",
      link: "https://www.linkedin.com/in/kritika-kant-ui-ux/",
    },
  ]

  return (
    <SectionSubgroup
      label="Advisory"
      description="Trusted by startups and institutions to shape product direction and mentor designers."
      variant="spacious"
    >

      <div className="space-y-12 md:space-y-14">

        {/* ADVISORY (PRIMARY) */}
        <div className="space-y-5">

          <p className="
            text-[11px] tracking-[0.18em] uppercase
            text-muted-foreground
          ">
            Product Advisory
          </p>

          <div className="space-y-4">
            {advisory.map((item, i) => (
              <AdvisoryItem key={i} {...item} />
            ))}
          </div>

        </div>

        {/* MENTORSHIP */}
        <div className="
          space-y-5 pt-6
          border-t border-border
        ">

          <p className="
            text-[11px] tracking-[0.18em] uppercase
            text-muted-foreground
          ">
            Mentorship
          </p>

          <p className="
            text-sm md:text-base
            text-foreground/70
            max-w-xl leading-[1.6]
          ">
            Mentored early-career designers on product thinking, portfolio strategy, and interviews.
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
                    text-foreground/80
                    transition-all duration-200
                    hover:translate-x-[3px]
                    hover:text-orange-500
                  "
                >
                  <span>{item.name}</span>

                  <IconArrowRight
                    size={16}
                    className="opacity-40"
                  />

                  <span className="
                    text-muted-foreground
                    group-hover:text-orange-500
                    transition
                  ">
                    {item.company}
                  </span>

                  <IconLink
                    size={15}
                    className="
                      opacity-40
                      group-hover:opacity-100
                      transition
                    "
                  />
                </a>
              </li>
            ))}

          </ul>

        </div>

        {/* TEACHING */}
        <div className="
          space-y-5 pt-6
          border-t border-border
        ">

          <p className="
            text-[11px] tracking-[0.18em] uppercase
            text-muted-foreground
          ">
            Teaching & Workshops
          </p>

          <div className="space-y-4">
            {teaching.map((item, i) => (
              <AdvisoryItem key={i} {...item} />
            ))}
          </div>

        </div>

      </div>

      {/* Divider */}
      <div className="h-px w-full bg-border/60 mt-10 md:mt-12" />

    </SectionSubgroup>
  )
}