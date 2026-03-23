"use client"

import { motion } from "framer-motion"

type Step = {
  number: string
  title: string
  description: string
}

export function ProcessStepsCard({ steps }: { steps: Step[] }) {
  return (
    <div
      className="
        relative rounded-3xl p-8 md:p-12

        bg-card text-card-foreground
        border border-border

        overflow-hidden
      "
    >

      {/* ✨ LEFT EDGE LIGHT (cleaner orange) */}
      <div className="
        pointer-events-none absolute inset-y-0 left-0 w-20
        bg-gradient-to-r
        from-[rgba(255,90,0,0.08)]
        via-[rgba(255,90,0,0.04)]
        to-transparent
        blur-xl
        opacity-70
      " />

      {/* ✨ AMBIENT LIGHT */}
      <div className="
        pointer-events-none absolute -top-28 -right-28 w-[300px] h-[300px]
        bg-[radial-gradient(circle,rgba(255,90,0,0.06),transparent_70%)]
        dark:bg-[radial-gradient(circle,rgba(255,140,60,0.12),transparent_70%)]
        blur-3xl
      " />

      {/* ✨ SUBTLE SHEEN */}
      <div className="
        pointer-events-none absolute inset-0
        bg-[linear-gradient(110deg,transparent,rgba(255,90,0,0.05),transparent)]
        dark:bg-[linear-gradient(110deg,transparent,rgba(255,140,60,0.08),transparent)]
        bg-[length:220%_220%]
        animate-[sheen_18s_ease-in-out_infinite]
        opacity-50
      " />

      {/* GLASS LAYER */}
      <div className="
        pointer-events-none absolute inset-0 rounded-3xl
        bg-gradient-to-b from-white/[0.035] to-transparent
        dark:from-white/[0.025]
      " />

      {/* TOP EDGE */}
      <div className="
        absolute inset-x-0 top-0 h-px
        bg-gradient-to-r from-transparent via-foreground/10 to-transparent
        dark:via-white/20
      " />

      {/* GRID */}
      <div className="relative grid md:grid-cols-2 gap-10 md:gap-12">

        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.45,
              delay: i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              group relative flex gap-4
              transition-all duration-300
              md:hover:translate-x-[3px]
            "
          >

            {/* CONTENT */}
            <div className="relative pl-4">

              {/* LINE */}
              <div className="
                absolute left-0 top-[6px] bottom-[6px] w-px
                bg-border/70
                transition-all duration-300
                group-hover:bg-orange-600/50
                dark:group-hover:bg-orange-400/50
              " />

              <div className="flex items-baseline gap-3">

                {/* NUMBER */}
                <span className="
                  text-xs font-semibold tracking-[0.14em]
                  text-foreground/50
                  transition-colors duration-300
                  group-hover:text-orange-600
                  dark:group-hover:text-orange-400
                ">
                  {step.number}
                </span>

                {/* TITLE */}
                <h3 className="
                  text-base md:text-lg font-medium
                  text-foreground tracking-tight
                  transition-colors duration-300
                  group-hover:text-orange-600
                  dark:group-hover:text-orange-400
                ">
                  {step.title}
                </h3>

              </div>

              {/* DESCRIPTION */}
              <p className="
                mt-2 text-sm md:text-[15px]
                text-foreground/65
                leading-[1.65]
                max-w-[340px]
              ">
                {step.description}
              </p>

            </div>

          </motion.div>
        ))}

      </div>

    </div>
  )
}