import type { Request, Response } from 'express'
import * as issuesModel from '../models/issues.js'
import { logApiError } from '../utils/log.js'

export async function getTeamIssues(req: Request, res: Response) {
  try {
    const { teamId } = req.params
    const filter = (req.query.filter as 'all' | 'active' | 'backlog') ?? 'all'
    const list = await issuesModel.getTeamIssuesForApi(teamId, filter)
    res.json(list)
  } catch (e) {
    logApiError(e, 'issues.getTeamIssues', { teamId: req.params.teamId })
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function getIssue(req: Request, res: Response) {
  try {
    const { issueId } = req.params
    const detail = await issuesModel.getIssueDetailForApi(issueId)
    if (!detail) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }
    res.json(detail)
  } catch (e) {
    logApiError(e, 'issues.getIssue', { issueId: req.params.issueId })
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function createIssue(req: Request, res: Response) {
  try {
    const teamIdFromParams = (req.params as { teamId?: string }).teamId
    const body = req.body as {
      teamId?: string
      projectId?: string
      title?: string
      description?: string
      body?: string
    }
    const teamId =
      teamIdFromParams ??
      (body.teamId && body.teamId !== '' ? body.teamId : undefined)
    const title = body.title
    const description = body.description ?? body.body
    if (!title || !title.trim()) {
      res.status(400).json({ error: 'title is required' })
      return
    }
    const { issue, team } = await issuesModel.createIssueForApi({
      teamId,
      projectId: body.projectId,
      title: title.trim(),
      description,
    })
    const detail = await issuesModel.getIssueDetailForApi(issue.id)
    if (!detail) {
      res.status(201).json({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        assignee: null,
        date: issue.date,
        status: issue.status,
        teamId: issue.teamId ?? null,
        team: team ? { id: team.id, name: team.name } : null,
        project: null,
      })
      return
    }
    res.status(201).json(detail)
  } catch (e) {
    const msg = (e as Error).message
    logApiError(e, 'issues.createIssue', {
      teamId:
        (req.params as { teamId?: string }).teamId ??
        (req.body as { teamId?: string }).teamId,
    })
    if (
      msg.startsWith('Team not found:') ||
      msg.startsWith('Project not found:')
    ) {
      res.status(404).json({ error: msg })
      return
    }
    res.status(500).json({ error: msg })
  }
}

export async function updateIssue(req: Request, res: Response) {
  try {
    const { issueId } = req.params
    const body = req.body as {
      status?: string
      assigneeId?: string
      assigneeName?: string
      projectId?: string | null
      description?: string
    }
    const detail = await issuesModel.updateIssueForApi(issueId, {
      status: body.status,
      assigneeId: body.assigneeId,
      assigneeName: body.assigneeName,
      projectId: body.projectId,
      description: body.description,
    })
    if (!detail) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }
    res.json(detail)
  } catch (e) {
    const msg = (e as Error).message
    logApiError(e, 'issues.updateIssue', { issueId: req.params.issueId })
    if (
      msg.startsWith('Team not found:') ||
      msg.startsWith('Project not found:')
    ) {
      res.status(404).json({ error: msg })
      return
    }
    res.status(500).json({ error: (e as Error).message })
  }
}
