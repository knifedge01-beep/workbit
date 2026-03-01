import type { Request, Response } from 'express'
import * as issuesModel from '../models/issues.js'
import { getStore } from '../models/store.js'

export async function getTeamIssues(req: Request, res: Response) {
  try {
    const { teamId } = req.params
    const filter = (req.query.filter as 'all' | 'active' | 'backlog') ?? 'all'
    const issues = await issuesModel.getTeamIssues(teamId, filter)
    const store = await getStore()
    const list = issues.map((i) => {
      const assignee = i.assigneeId
        ? store.members.find((m) => m.id === i.assigneeId)
        : null
      return {
        id: i.id,
        title: i.title,
        assignee: assignee
          ? { id: assignee.id, name: assignee.name }
          : i.assigneeName
            ? { id: '', name: i.assigneeName }
            : null,
        date: i.date,
        status: i.status,
      }
    })
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function getIssue(req: Request, res: Response) {
  try {
    const { issueId } = req.params
    const issue = await issuesModel.getIssueById(issueId)
    if (!issue) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }
    const store = await getStore()
    const assignee = issue.assigneeId
      ? store.members.find((m) => m.id === issue.assigneeId)
      : null
    const team = store.teams.find((t) => t.id === issue.teamId)
    const project = issue.projectId
      ? store.projects.find((p) => p.id === issue.projectId)
      : null

    res.json({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      assignee: assignee
        ? { id: assignee.id, name: assignee.name }
        : issue.assigneeName
          ? { id: '', name: issue.assigneeName }
          : null,
      date: issue.date,
      status: issue.status,
      teamId: issue.teamId,
      team: team ? { id: team.id, name: team.name } : null,
      project: project ? { id: project.id, name: project.name } : null,
    })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function createIssue(req: Request, res: Response) {
  try {
    const body = req.body as {
      projectId?: string
      title?: string
      description?: string
      body?: string
    }
    const projectId = body.projectId
    const title = body.title
    const description = body.description ?? body.body
    if (!projectId || !title) {
      res.status(400).json({ error: 'projectId and title are required' })
      return
    }
    const issue = await issuesModel.createIssue({
      projectId,
      title,
      description,
    })
    const store = await getStore()
    const team = store.teams.find((t) => t.id === issue.teamId)
    const project = store.projects.find((p) => p.id === issue.projectId)
    const assignee = issue.assigneeId
      ? store.members.find((m) => m.id === issue.assigneeId)
      : null
    res.status(201).json({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      assignee: assignee
        ? { id: assignee.id, name: assignee.name }
        : issue.assigneeName
          ? { id: '', name: issue.assigneeName }
          : null,
      date: issue.date,
      status: issue.status,
      teamId: issue.teamId,
      team: team ? { id: team.id, name: team.name } : null,
      project: project ? { id: project.id, name: project.name } : null,
    })
  } catch (e) {
    const msg = (e as Error).message
    if (msg.startsWith('Project not found:')) {
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
    }
    const issue = await issuesModel.updateIssue(issueId, body)
    if (!issue) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }
    res.json(issue)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function createIssue(req: Request, res: Response) {
  try {
    const { teamId } = req.params
    const body = req.body as {
      title: string
      projectId?: string
      assigneeId?: string
      status?: string
    }
    if (!body.title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }
    const issue = await issuesModel.createIssue({
      ...body,
      teamId,
    })
    res.json(issue)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
