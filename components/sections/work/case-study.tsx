"use client"

import { motion } from "framer-motion"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"
import { workItems } from "@/lib/data"

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function WorkSection() {
  const featured = workItems.find((p) => p.featured)!
  const rest     = workItems.filter((p) => !p.featured)

  return (
    <SectionSubgroup
      label="Case Studies"
      description="Product explorations addressing complex business and user constraints across fintech and commerce."
      variant="spacious"
    >
      <section data-cursor-zone="work">
        <div className="flex flex-col gap-6">

          {/* Featured */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <VerticalCard
              href={featured.href}
              image={featured.image}
              title={featured.title}
              description={featured.description}
              category={featured.category}
              metric={featured.metric}
              variant="featured"
            />
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((project, i) => (
              <motion.div
                key={project.href}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <VerticalCard
                  href={project.href}
                  image={project.image}
                  title={project.title}
                  description={project.description}
                  category={project.category}
                  metric={project.metric}
                />
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </SectionSubgroup>
  )
}
