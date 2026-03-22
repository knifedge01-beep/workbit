import type { Request, Response } from 'express'
import * as issuesModel from '../models/issues.js'
import { logApiError } from '../utils/log.js'

const DEFAULT_AUTHOR_NAME = 'You'

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

export async function getProjectIssues(req: Request, res: Response) {
  try {
    const { id } = req.params
    const filter = (req.query.filter as 'all' | 'active' | 'backlog') ?? 'all'
    const list = await issuesModel.getProjectIssuesForApi(id, filter)
    res.json(list)
  } catch (e) {
    logApiError(e, 'issues.getProjectIssues', { projectId: req.params.id })
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

export async function getSubIssues(req: Request, res: Response) {
  try {
    const { issueId } = req.params
    const parentIssue = await issuesModel.getIssueById(issueId)
    if (!parentIssue) {
      res.status(404).json({ error: 'Issue not found' })
      return
    }
    const list = await issuesModel.getSubIssuesForApi(issueId)
    res.json(list)
  } catch (e) {
    logApiError(e, 'issues.getSubIssues', { issueId: req.params.issueId })
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function generateSubIssues(req: Request, res: Response) {
  try {
    const { issueId } = req.params
    const subIssues = await issuesModel.generateSubIssuesDraftForIssue(issueId)
    res.json({ issueId, subIssues })
  } catch (e) {
    logApiError(e, 'issues.generateSubIssues', {
      issueId: req.params.issueId,
    })
    const err = e as Error
    if (err.message === 'Issue not found') {
      res.status(404).json({ error: err.message })
      return
    }
    res.status(500).json({ error: err.message })
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
      status?: string
      body?: string
      parentIssueId?: string
    }
    const teamId =
      teamIdFromParams ??
      (body.teamId && body.teamId !== '' ? body.teamId : undefined)
    const title = body.title
    const description = body.description
    const status = body.status
    const parentIssueId =
      body.parentIssueId && body.parentIssueId !== ''
        ? body.parentIssueId
        : undefined

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'title is required' })
      return
    }
    const { issue, team } = await issuesModel.createIssueForApi({
      teamId,
      projectId: body.projectId,
      title: title.trim(),
      description,
      status,
      parentIssueId,
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
        project_id: issue.projectId ?? null,
        parentIssueId: issue.parentIssueId ?? null,
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
      msg.startsWith('Project not found:') ||
      msg.startsWith('Parent issue not found:')
    ) {
      res.status(404).json({ error: msg })
      return
    }
    if (msg === 'Parent issue does not belong to this team') {
      res.status(400).json({ error: msg })
      return
    }
    res.status(500).json({ error: msg })
  }
}

export async function getIssueComments(req: Request, res: Response) {
  try {
    const { issueId } = req.params
    const comments = await issuesModel.getIssueComments(issueId)
    res.json(
      comments.map((c) => ({
        id: c.id,
        entityId: c.entityId,
        authorName: c.authorName,
        authorAvatarSrc: c.authorAvatarSrc,
        content: c.content,
        createdAt: c.createdAt,
        parentCommentId: c.parentCommentId,
        likes: c.likes,
        mentionAuthorIds: c.mentionAuthorIds,
        commentOptions: c.commentOptions,
      }))
    )
  } catch (e) {
    logApiError(e, 'issues.getIssueComments', {
      issueId: req.params.issueId,
    })
    res.status(500).json({ error: (e as Error).message })
  }
}

export async function postIssueComment(req: Request, res: Response) {
  try {
    const { issueId } = req.params
    const { content, parentCommentId } = req.body as {
      content?: string
      parentCommentId?: string | null
    }
    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'content is required' })
      return
    }
    const authorName = req.user?.email ?? DEFAULT_AUTHOR_NAME
    const comment = await issuesModel.addIssueComment(
      issueId,
      content,
      {
        name: authorName,
        avatarSrc: undefined,
      },
      {
        parentCommentId:
          parentCommentId === undefined || parentCommentId === ''
            ? null
            : parentCommentId,
      }
    )
    res.status(201).json({
      id: comment.id,
      entityId: comment.entityId,
      authorName: comment.authorName,
      authorAvatarSrc: comment.authorAvatarSrc,
      content: comment.content,
      createdAt: comment.createdAt,
      parentCommentId: comment.parentCommentId,
      likes: comment.likes,
      mentionAuthorIds: comment.mentionAuthorIds,
      commentOptions: comment.commentOptions,
    })
  } catch (e) {
    logApiError(e, 'issues.postIssueComment', {
      issueId: req.params.issueId,
    })
    const err = e as Error
    if (err.message === 'Issue not found') {
      res.status(404).json({ error: err.message })
      return
    }
    if (err.message === 'Parent comment not found') {
      res.status(400).json({ error: err.message })
      return
    }
    res.status(500).json({ error: err.message })
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
      parentIssueId?: string | null
    }
    const detail = await issuesModel.updateIssueForApi(issueId, {
      status: body.status,
      assigneeId: body.assigneeId,
      assigneeName: body.assigneeName,
      projectId: body.projectId,
      description: body.description,
      parentIssueId: body.parentIssueId,
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
