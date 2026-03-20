export function getTeamInitials(id: string): string {
  return id.slice(0, 2).toUpperCase()
}
