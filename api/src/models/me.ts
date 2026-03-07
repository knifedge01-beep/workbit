import type { Team, Notification } from './types.js'
import * as dbTeams from '../db/teams.js'
import * as dbMembers from '../db/members.js'
import * as dbNotifications from '../db/notifications.js'

export async function getNavTeams(): Promise<Team[]> {
  return dbTeams.getTeams()
}

export type MemberForApi = {
  id: string
  name: string
  username: string
  avatarSrc?: string
  status: string
  joined: string
  provisioned: boolean
  uid: string | null
  teams: string
}

export async function getMemberForApi(
  userId: string
): Promise<MemberForApi | null> {
  const member = await dbMembers.getMemberByUid(userId)
  if (!member) return null
  const teams = await dbTeams.getTeams()
  const teamsById = new Map(teams.map((t) => [t.id, t.name]))
  const teamNames = member.teamIds
    .map((tid) => teamsById.get(tid))
    .filter(Boolean) as string[]
  return {
    id: member.id,
    name: member.name,
    username: member.username,
    avatarSrc: member.avatarSrc,
    status: member.status,
    joined: member.joined,
    provisioned: member.provisioned ?? false,
    uid: member.uid ?? member.userAuthId ?? null,
    teams: teamNames.length ? teamNames.join(', ') : '—',
  }
}

export async function getNotifications(
  userId: string,
  first = 50
): Promise<Notification[]> {
  return dbNotifications.getNotifications(userId, first)
}
