import type { Request, Response } from 'express'
import * as meModel from '../models/me.js'
import * as issuesModel from '../models/issues.js'
import { getTeamById } from '../db/teams.js'
import { getProjectById } from '../db/projects.js'
import { getUserId } from '../middleware/auth.js'

const DEFAULT_USER_ID = 'current-user'

export async function getTeams(_req: Request, res: Response) {
  try {
    const teams = await meModel.getNavTeams()
    res.json(teams.map((t) => ({ id: t.id, name: t.name })))
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function getMyIssues(req: Request, res: Response) {
  try {
    const userId = getUserId(
      req,
      (req.headers['x-user-id'] as string) ?? DEFAULT_USER_ID
    )
    const issues = await issuesModel.getMyIssues(userId)
    const list = await Promise.all(
      issues.map(async (i) => {
        const [team, project] = await Promise.all([
          getTeamById(i.teamId),
          i.projectId ? getProjectById(i.projectId) : null,
        ])
        return {
          id: i.id,
          title: i.title,
          assignee: i.assigneeName
            ? { id: i.assigneeId ?? '', name: i.assigneeName }
            : null,
          date: i.date,
          status: i.status,
          team: team ? { id: i.teamId, name: team.name } : null,
          project: project ? { id: i.projectId!, name: project.name } : null,
        }
      })
    )
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = getUserId(
      req,
      (req.headers['x-user-id'] as string) ?? DEFAULT_USER_ID
    )
    const first = req.query.first ? Number(req.query.first) : 50
    const notifications = await meModel.getNotifications(userId, first)
    const list = notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
      createdAt: n.createdAt,
      actor: { id: n.actorId, name: n.actorName },
      targetUrl: n.targetUrl,
    }))
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
