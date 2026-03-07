import type { Issue } from './types.js'
import * as db from '../db/issues.js'
import { getTeamById } from '../db/teams.js'
import { getMemberById } from '../db/members.js'
import { getProjectById } from '../db/projects.js'

export type IssueListItemApi = {
  id: string
  title: string
  assignee: { id: string; name: string } | null
  date: string
  status: string
}

export type IssueDetailApi = {
  id: string
  title: string
  description?: string
  assignee: { id: string; name: string } | null
  date: string
  status: string
  teamId: string | null
  team: { id: string; name: string } | null
  project: { id: string; name: string } | null
}

export async function getTeamIssues(
  teamId: string,
  filter?: 'all' | 'active' | 'backlog'
): Promise<Issue[]> {
  const team = await getTeamById(teamId)
  if (team?.projectId) {
    return db.getIssuesByProjectId(team.projectId, filter)
  }
  return db.getIssuesByTeamId(teamId, filter)
}

export async function getProjectIssues(
  projectId: string,
  filter?: 'all' | 'active' | 'backlog'
): Promise<Issue[]> {
  return db.getIssuesByProjectId(projectId, filter)
}

export async function getMyIssues(assigneeId: string): Promise<Issue[]> {
  return db.getIssuesByAssigneeId(assigneeId)
}

export async function updateIssue(
  issueId: string,
  patch: Partial<
    Pick<
      Issue,
      'status' | 'assigneeId' | 'assigneeName' | 'projectId' | 'description'
    >
  >
): Promise<Issue | null> {
  return db.updateIssue(issueId, patch)
}

export async function getIssueById(issueId: string): Promise<Issue | null> {
  return db.getIssueById(issueId)
}

export async function createIssue(input: {
  title: string
  teamId?: string
  projectId?: string
  assigneeId?: string
  status?: string
  description?: string
}): Promise<Issue> {
  if (input.teamId) {
    const team = await getTeamById(input.teamId)
    if (!team) {
      throw new Error('Team not found')
    }
  }
  console.log('input', input)
  const issue: Issue = {
    id: `ISS-${Date.now()}`,
    title: input.title,
    teamId: input.teamId,
    projectId: input.projectId,
    assigneeId: input.assigneeId,
    status: input.status ?? 'todo',
    date: new Date().toISOString(),
    description: input.description,
  }

  await db.insertIssue(issue)
  return issue
}

export async function getTeamIssuesForApi(
  teamId: string,
  filter?: 'all' | 'active' | 'backlog'
): Promise<IssueListItemApi[]> {
  const issues = await getTeamIssues(teamId, filter)
  return Promise.all(
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
}

export async function getIssueDetailForApi(
  issueId: string
): Promise<IssueDetailApi | null> {
  const issue = await getIssueById(issueId)
  if (!issue) return null
  const [assignee, team, project] = await Promise.all([
    issue.assigneeId ? getMemberById(issue.assigneeId) : null,
    issue.teamId ? getTeamById(issue.teamId) : null,
    issue.projectId ? getProjectById(issue.projectId) : null,
  ])
  return {
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
    teamId: issue.teamId ?? null,
    team: team ? { id: team.id, name: team.name } : null,
    project: project ? { id: project.id, name: project.name } : null,
  }
}

export async function createIssueForApi(input: {
  teamId?: string
  projectId?: string
  title: string
  description?: string
}): Promise<{ issue: Issue; team: { id: string; name: string } | null }> {
  let team: { id: string; name: string } | null = null
  if (input.teamId) {
    team = await getTeamById(input.teamId)
    if (!team) throw new Error('Team not found: ' + input.teamId)
  }
  const projectId = input.projectId
  if (projectId != null && projectId !== '' && input.teamId) {
    const project = await getProjectById(projectId)
    if (!project) throw new Error('Project not found: ' + projectId)
    if (project.teamId !== input.teamId) {
      throw new Error('Project does not belong to this team')
    }
  }

  const issue = await createIssue({
    teamId: input.teamId,
    projectId,
    title: input.title.trim(),
    description: input.description,
  })
  return { issue, team }
}

export async function updateIssueForApi(
  issueId: string,
  patch: {
    status?: string
    assigneeId?: string
    assigneeName?: string
    projectId?: string | null
    description?: string
  }
): Promise<IssueDetailApi | null> {
  const existing = await getIssueById(issueId)
  if (!existing) return null
  let projectId: string | undefined | null = patch.projectId
  if (projectId !== undefined) {
    if (projectId != null && projectId !== '') {
      const project = await getProjectById(projectId)
      if (!project) throw new Error('Project not found: ' + projectId)
      if (project.teamId !== existing.teamId) {
        throw new Error("Project does not belong to this issue's team")
      }
    } else {
      projectId = undefined
    }
  }
  const updatePayload: Partial<
    Pick<
      Issue,
      'status' | 'assigneeId' | 'assigneeName' | 'projectId' | 'description'
    >
  > = {
    ...(patch.status !== undefined && { status: patch.status }),
    ...(patch.assigneeId !== undefined && { assigneeId: patch.assigneeId }),
    ...(patch.assigneeName !== undefined && {
      assigneeName: patch.assigneeName,
    }),
    ...(projectId !== undefined && { projectId: projectId ?? undefined }),
    ...(patch.description !== undefined && { description: patch.description }),
  }
  const issue = await updateIssue(issueId, updatePayload)
  if (!issue) return null
  return getIssueDetailForApi(issue.id)
}

export async function getMyIssuesForApi(userId: string): Promise<
  Array<{
    id: string
    title: string
    assignee: { id: string; name: string } | null
    date: string
    status: string
    team: { id: string; name: string } | null
    project: { id: string; name: string } | null
  }>
> {
  const issues = await getMyIssues(userId)
  return Promise.all(
    issues.map(async (i) => {
      const [team, project] = await Promise.all([
        i.teamId ? getTeamById(i.teamId) : null,
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
        team: team ? { id: team.id, name: team.name } : null,
        project: project ? { id: project.id, name: project.name } : null,
      }
    })
  )
}
