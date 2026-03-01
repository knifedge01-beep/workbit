import type { Team, Notification } from './types.js'
import * as dbTeams from '../db/teams.js'
import * as dbNotifications from '../db/notifications.js'

export async function getNavTeams(): Promise<Team[]> {
  return dbTeams.getTeams()
}

export async function getNotifications(
  userId: string,
  first = 50
): Promise<Notification[]> {
  return dbNotifications.getNotifications(userId, first)
}
