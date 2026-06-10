"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { AdvisoryItem } from "@/components/shared/advisory-item"
import { IconBrandLinkedin } from "@tabler/icons-react"
import { advisoryItems, teachingItems, menteeItems } from "@/lib/data"

export default function AdvisorySection() {
  return (
    <SectionSubgroup
      label="Advisory"
      description="Product guidance, UX critique, portfolio mentoring, and early roadmap support for founders, institutions, and designers."
      variant="spacious"
    >
      <div className="space-y-14">

        {/* PRODUCT ADVISORY */}
        <div className="space-y-5">
          <p className="type-meta">
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
          <p className="type-meta">
            Mentorship
          </p>

          {/* STAT CALLOUT */}
          <div className="
            inline-flex items-baseline gap-2
            px-4 py-2.5 rounded-xl
            bg-orange-500/[0.08] dark:bg-orange-400/[0.10]
            border border-orange-500/20 dark:border-orange-400/20
          ">
            <span className="text-2xl font-semibold text-orange-600 dark:text-orange-400 leading-none">
              4
            </span>
            <span className="text-sm text-foreground/70 leading-snug">
              mentees now at{" "}
              <span className="font-medium text-foreground">Microsoft, Zomato, Aleph Alpha,</span>
              {" "}and{" "}
              <span className="font-medium text-foreground">Mastercard</span>
            </span>
          </div>

          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {menteeItems.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group flex items-start gap-3 py-2
                    transition-colors duration-300
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
          <p className="type-meta">
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
