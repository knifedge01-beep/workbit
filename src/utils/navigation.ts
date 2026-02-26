/**
 * Navigation and routing utilities
 */

/**
 * Build breadcrumb from path segments
 */
export function buildBreadcrumb(
  separator: string,
  ...segments: (string | null | undefined)[]
): string {
  return segments.filter((s) => s != null && s !== '').join(` ${separator} `)
}

/**
 * Parse team ID from various formats
 */
export function parseTeamId(teamId: string | undefined): string | null {
  if (!teamId) return null
  return teamId.trim()
}

/**
 * Build team route path
 */
export function buildTeamRoute(
  teamId: string,
  section: 'issues' | 'projects' | 'views' | 'logs',
  subPath?: string
): string {
  const base = `/team/${teamId}/${section}`
  return subPath ? `${base}/${subPath}` : base
}

/**
 * Build issue route path
 */
export function buildIssueRoute(teamId: string, issueId: string): string {
  return `/team/${teamId}/issue/${issueId}`
}

/**
 * Extract issue ID from full path
 */
export function extractIssueId(path: string): string | null {
  const match = path.match(/\/issue\/([^/]+)/)
  return match ? match[1] : null
}
