"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { AdvisoryItem } from "@/components/shared/advisory-item"
import { IconBrandLinkedin } from "@tabler/icons-react"
import { advisoryItems, teachingItems, menteeItems } from "@/lib/data"

export default function AdvisorySection() {
  return (
    <SectionSubgroup
      label="Advisory"
      description="Trusted by startups and institutions to shape product direction and mentor designers."
      variant="spacious"
    >
      <div className="space-y-14">

        {/* PRODUCT ADVISORY */}
        <div className="space-y-5">
          <p className="text-[12px] tracking-[0.18em] uppercase text-foreground/60">
            Product Advisory
          </p>
          <div className="space-y-2">
            {advisoryItems.map((item, i) => (
              <AdvisoryItem key={i} {...item} />
            ))}
          </div>
        </div>

        {/* MENTORSHIP */}
        <div className="space-y-5 pt-6 border-t border-border/60">
          <p className="text-[12px] tracking-[0.18em] uppercase text-foreground/60">
            Mentorship
          </p>

          <p className="text-sm md:text-base text-foreground/75 max-w-xl leading-[1.6]">
            Mentored early-career designers on product thinking, portfolio strategy, and interviews.
          </p>

          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {menteeItems.map((item, i) => (
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
                    group-hover:bg-orange-600 dark:group-hover:bg-orange-400
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
                          opacity-40 transition-all duration-300
                          group-hover:opacity-100 group-hover:text-[#0A66C2]
                        "
                      />
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* TEACHING */}
        <div className="space-y-5 pt-6 border-t border-border/60">
          <p className="text-[12px] tracking-[0.18em] uppercase text-foreground/60">
            Teaching & Workshops
          </p>
          <div className="space-y-2">
            {teachingItems.map((item, i) => (
              <AdvisoryItem key={i} {...item} />
            ))}
          </div>
        </div>

      </div>

      <div className="h-px w-full bg-border/60 mt-12" />
    </SectionSubgroup>
  )
}
