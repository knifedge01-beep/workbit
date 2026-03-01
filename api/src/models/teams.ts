import { generateId } from './store.js'
import type {
  Team,
  StatusUpdate,
  StatusUpdateComment,
  ProjectProperties,
  Milestone,
  View,
} from './types.js'
import * as dbTeams from '../db/teams.js'
import * as dbStatusUpdates from '../db/statusUpdates.js'
import * as dbStatusUpdateComments from '../db/statusUpdateComments.js'
import * as dbProjectProperties from '../db/projectProperties.js'
import * as dbMilestones from '../db/milestones.js'
import * as dbActivity from '../db/activity.js'
import * as dbViews from '../db/views.js'

export async function getTeamById(teamId: string): Promise<Team | null> {
  return dbTeams.getTeamById(teamId)
}

export async function getTeamProject(teamId: string) {
  const team = await dbTeams.getTeamById(teamId)
  if (!team) return null
  if (team.projectId == null || team.projectId === '') {
    return {
      team: { id: team.id, name: team.name },
      project: null,
    }
  }
  const [updates, properties, milestones, activity] = await Promise.all([
    dbStatusUpdates.getStatusUpdatesByTeamId(teamId, 20),
    dbProjectProperties.getProjectPropertiesByTeamId(teamId),
    dbMilestones.getMilestonesByTeamId(teamId),
    dbActivity.getActivityByTeamId(teamId),
  ])
  const sortedActivity = [...activity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return {
    team: { id: team.id, name: team.name },
    project: {
      id: team.projectId,
      statusUpdates: { nodes: updates },
      properties,
      milestones,
      activity: sortedActivity,
    },
  }
}

export async function getStatusUpdateComments(
  updateId: string
): Promise<StatusUpdateComment[]> {
  return dbStatusUpdateComments.getStatusUpdateCommentsByUpdateId(updateId)
}

export async function addStatusUpdate(
  teamId: string,
  content: string,
  status: 'on-track' | 'at-risk' | 'off-track',
  author: { id: string; name: string; avatarSrc?: string }
): Promise<StatusUpdate> {
  const update: StatusUpdate = {
    id: generateId(),
    teamId,
    status,
    content,
    authorId: author.id,
    authorName: author.name,
    authorAvatarSrc: author.avatarSrc,
    createdAt: new Date().toISOString(),
    commentCount: 0,
  }
  await dbStatusUpdates.insertStatusUpdate(update)
  return update
}

export async function addStatusUpdateComment(
  teamId: string,
  updateId: string,
  content: string,
  authorName: string,
  authorAvatarSrc?: string
): Promise<StatusUpdateComment> {
  const update = await dbStatusUpdates.getStatusUpdateById(updateId)
  if (!update || update.teamId !== teamId) throw new Error('Update not found')
  const comment: StatusUpdateComment = {
    id: generateId(),
    updateId,
    authorName,
    authorAvatarSrc,
    content,
    timestamp: new Date().toISOString(),
  }
  await dbStatusUpdateComments.insertStatusUpdateComment(comment)
  await dbStatusUpdates.updateStatusUpdateCommentCount(
    updateId,
    (update.commentCount ?? 0) + 1
  )
  return comment
}

export async function updateProjectProperties(
  teamId: string,
  patch: Partial<ProjectProperties>
): Promise<ProjectProperties> {
  const current = await dbProjectProperties.getProjectPropertiesByTeamId(teamId)
  const merged = { ...current, ...patch }
  await dbProjectProperties.upsertProjectProperties(teamId, merged)
  return merged
}

export async function addMilestone(
  teamId: string,
  body: { name: string; targetDate?: string; description?: string }
): Promise<Milestone> {
  const milestone: Milestone = {
    id: generateId(),
    teamId,
    name: body.name,
    progress: 0,
    total: 0,
    targetDate: body.targetDate ?? '',
    description: body.description,
  }
  await dbMilestones.insertMilestone(milestone)
  return milestone
}

export async function updateMilestone(
  teamId: string,
  milestoneId: string,
  patch: Partial<
    Pick<
      Milestone,
      'name' | 'targetDate' | 'description' | 'progress' | 'total'
    >
  >
): Promise<Milestone | null> {
  const list = await dbMilestones.getMilestonesByTeamId(teamId)
  const m = list.find((x) => x.id === milestoneId)
  if (!m) return null
  await dbMilestones.updateMilestone(milestoneId, patch)
  return { ...m, ...patch }
}

export async function getTeamViews(teamId: string): Promise<View[]> {
  return dbViews.getViewsByTeamId(teamId)
}

export async function getTeamLogs(teamId: string, first = 50) {
  const activity = await dbActivity.getActivityByTeamId(teamId, first)
  return {
    nodes: activity.map((a) => ({
      id: a.id,
      action: a.icon,
      actor: { id: '1', name: a.message.split(' ')[0] ?? 'System' },
      timestamp: a.date,
      details: a.message,
    })),
  }
}
