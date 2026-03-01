import type { Request, Response } from 'express'
import * as issuesModel from '../models/issues.js'
import { getMemberById } from '../db/members.js'
import { getTeamById } from '../db/teams.js'
import { getProjectById } from '../db/projects.js'

export async function getTeamIssues(req: Request, res: Response) {
  try {
    const { teamId } = req.params
    const filter = (req.query.filter as 'all' | 'active' | 'backlog') ?? 'all'
    const issues = await issuesModel.getTeamIssues(teamId, filter)
    const list = await Promise.all(
      issues.map(async (i) => {
        const assignee = i.assigneeId ? await getMemberById(i.assigneeId) : null
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
    )
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
    const [assignee, team, project] = await Promise.all([
      issue.assigneeId ? getMemberById(issue.assigneeId) : null,
      getTeamById(issue.teamId),
      issue.projectId ? getProjectById(issue.projectId) : null,
    ])

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
    const { teamId } = req.params as { teamId: string }
    const body = req.body as {
      projectId?: string
      title?: string
      description?: string
      body?: string
    }
    const title = body.title
    const description = body.description ?? body.body
    if (!teamId || !title) {
      res.status(400).json({ error: 'teamId and title are required' })
      return
    }
    const team = await getTeamById(teamId)
    if (!team) {
      res.status(404).json({ error: `Team not found: ${teamId}` })
      return
    }
    let projectId: string | undefined = body.projectId
    if (projectId != null && projectId !== '') {
      const project = await getProjectById(projectId)
      if (!project) {
        res.status(404).json({ error: `Project not found: ${projectId}` })
        return
      }
      if (project.teamId !== teamId) {
        res.status(400).json({ error: 'Project does not belong to this team' })
        return
      }
    } else {
      projectId = undefined
    }
    const issue = await issuesModel.createIssue({
      teamId,
      projectId,
      title,
      description,
    })
    const [assignee, project] = await Promise.all([
      issue.assigneeId ? getMemberById(issue.assigneeId) : null,
      issue.projectId ? getProjectById(issue.projectId) : null,
    ])
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
      team: { id: team.id, name: team.name },
      project: project ? { id: project.id, name: project.name } : null,
    })
  } catch (e) {
    const msg = (e as Error).message
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
    const existing = await issuesModel.getIssueById(issueId)
    if (!existing) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }
    let projectId: string | undefined | null = body.projectId
    if (projectId !== undefined) {
      if (projectId != null && projectId !== '') {
        const project = await getProjectById(projectId)
        if (!project) {
          res.status(404).json({ error: `Project not found: ${projectId}` })
          return
        }
        if (project.teamId !== existing.teamId) {
          res
            .status(400)
            .json({ error: "Project does not belong to this issue's team" })
          return
        }
      } else {
        projectId = undefined
      }
    }
    const patch = {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.assigneeId !== undefined && { assigneeId: body.assigneeId }),
      ...(body.assigneeName !== undefined && {
        assigneeName: body.assigneeName,
      }),
      ...(projectId !== undefined && { projectId: projectId ?? undefined }),
      ...(body.description !== undefined && { description: body.description }),
    }
    const issue = await issuesModel.updateIssue(issueId, patch)
    if (!issue) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }
    const [assignee, team, project] = await Promise.all([
      issue.assigneeId ? getMemberById(issue.assigneeId) : null,
      getTeamById(issue.teamId),
      issue.projectId ? getProjectById(issue.projectId) : null,
    ])
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
