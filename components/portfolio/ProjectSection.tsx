import { Reveal } from "@/components/shared/motion"
import { ProjectCard } from "./ProjectCard"
import type { PortfolioMode, PortfolioProject } from "@/data/portfolio/types"

/* ----------------------------------------------------------------------------
   ProjectSection — lays out a row of project cards with a staggered scroll
   reveal. Featured = 3 large cards; supporting = 3 smaller cards. Used inside
   the shared <Section> band by PortfolioPage.
---------------------------------------------------------------------------- */

export function ProjectSection({
  projects,
  mode,
  variant,
}: {
  projects: PortfolioProject[]
  mode: PortfolioMode
  variant: "featured" | "supporting"
}) {
  if (projects.length === 0) return null

  return (
    <Reveal
      stagger={0.1}
      y={28}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} mode={mode} variant={variant} />
      ))}
    </Reveal>
  )
}
