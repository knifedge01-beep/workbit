import type { MemberStatus } from '../types'

export const STATUS_OPTIONS: Array<{ value: MemberStatus; label: string }> = [
  { value: 'Member', label: 'Member' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Guest', label: 'Guest' },
]

export function getReturnPath(
  workspaceId: string,
  isTeamScoped: boolean,
  teamIdFromUrl?: string
): string {
  if (isTeamScoped && teamIdFromUrl) {
    return `/workspace/${workspaceId}/team/${teamIdFromUrl}/issues/active`
  }

  return `/workspace/${workspaceId}/workspace/member`
}

export function getSummary(
  isTeamScoped: boolean,
  workspaceName: string,
  teamName: string | undefined
): string {
  if (isTeamScoped && teamName) {
    return `Add a member to ${workspaceName} and assign to ${teamName}.`
  }

  return `Invite a member to ${workspaceName}.`
}

export function toggleTeamIds(current: string[], teamId: string): string[] {
  return current.includes(teamId)
    ? current.filter((id) => id !== teamId)
    : [...current, teamId]
}

export function canSubmit(
  name: string,
  username: string,
  email: string,
  submitting: boolean
): boolean {
  return !!name.trim() && !!username.trim() && !!email.trim() && !submitting
}
