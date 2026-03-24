"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { AdvisoryItem } from "@/components/shared/advisory-item"
import { IconBrandLinkedin } from "@tabler/icons-react"

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
      <div className="space-y-14">

        {/* ───────── PRODUCT ADVISORY ───────── */}
        <div className="space-y-5">

          <p className="text-[12px] tracking-[0.18em] uppercase text-foreground/60">
            Product Advisory
          </p>

          <div className="space-y-2">
            {advisory.map((item, i) => (
              <AdvisoryItem key={i} {...item} />
            ))}
          </div>

        </div>

        {/* ───────── MENTORSHIP ───────── */}
        <div className="space-y-5 pt-6 border-t border-border/60">

          <p className="text-[12px] tracking-[0.18em] uppercase text-foreground/60">
            Mentorship
          </p>

          <p className="text-sm md:text-base text-foreground/75 max-w-xl leading-[1.6]">
            Mentored early-career designers on product thinking, portfolio strategy, and interviews.
          </p>

          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">

            {mentees.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group flex items-start gap-3 py-2
                    transition-all duration-300
                    hover:translate-x-[4px]
                  "
                >

                  {/* DOT */}
                  <div className="
                    mt-[6px] w-1.5 h-1.5 rounded-full
                    bg-foreground/30
                    transition-all duration-300

                    group-hover:bg-orange-600
                    dark:group-hover:bg-orange-400
                    group-hover:scale-125
                  " />

                  {/* TEXT */}
                  <div className="flex flex-col leading-tight">

                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>

                    <div className="
                      flex items-center gap-2
                      text-sm text-foreground/60
                      transition-colors duration-200
                      group-hover:text-foreground/80
                    ">
                      <span>{item.company}</span>

                      <IconBrandLinkedin
                        size={16}
                        className="
                          opacity-40
                          transition-all duration-300
                          group-hover:opacity-100
                          group-hover:text-[#0A66C2]
                        "
                      />
                    </div>

                  </div>

                </a>
              </li>
            ))}

          </ul>

        </div>

        {/* ───────── TEACHING ───────── */}
        <div className="space-y-5 pt-6 border-t border-border/60">

          <p className="text-[12px] tracking-[0.18em] uppercase text-foreground/60">
            Teaching & Workshops
          </p>

          <div className="space-y-2">
            {teaching.map((item, i) => (
              <AdvisoryItem key={i} {...item} />
            ))}
          </div>

        </div>

      </div>

      <div className="h-px w-full bg-border/60 mt-12" />
    </SectionSubgroup>
  )
}