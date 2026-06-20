import type { PortfolioMode, PortfolioProject, SectionKey } from "./types"
import { portfolioModes } from "./modes"
import { projectById } from "./projects"

/* ============================================================================
   ENGINE HELPERS — the small surface the components call.
   ============================================================================ */

export function getModeConfig(mode: PortfolioMode) {
  return portfolioModes[mode]
}

/** Pick the right per-mode summary for a project. */
export function getProjectSummary(project: PortfolioProject, mode: PortfolioMode): string {
  if (mode === "designLead") return project.designLeadSummary
  if (mode === "pm") return project.pmSummary
  return project.defaultSummary
}

export function getProjectById(id: string): PortfolioProject | undefined {
  return projectById[id]
}

/**
 * Ordered projects for a given mode + section, resolved from the section's
 * `projectIds` against the single project database. Unknown ids are dropped.
 */
export function getOrderedProjects(mode: PortfolioMode, section: SectionKey): PortfolioProject[] {
  const config = portfolioModes[mode]
  const sectionConfig = config.sections.find((s) => s.key === section)
  if (!sectionConfig?.projectIds) return []
  return sectionConfig.projectIds
    .map((id) => projectById[id])
    .filter((p): p is PortfolioProject => Boolean(p))
}

export const ALL_MODES: PortfolioMode[] = ["general", "designLead", "pm"]
