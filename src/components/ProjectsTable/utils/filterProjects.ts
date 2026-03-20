import type { ProjectTableRow } from '../types'

export function filterProjects(
  projects: ProjectTableRow[],
  query: string
): ProjectTableRow[] {
  if (!query) {
    return projects
  }

  const normalized = query.toLowerCase()
  return projects.filter(
    (project) =>
      project.name.toLowerCase().includes(normalized) ||
      project.team.toLowerCase().includes(normalized)
  )
}
