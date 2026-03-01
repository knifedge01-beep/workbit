import { getStore, saveStore, generateId } from './store.js'
import type { Issue } from './types.js'

export async function getTeamIssues(
  teamId: string,
  filter?: 'all' | 'active' | 'backlog'
): Promise<Issue[]> {
  const s = await getStore()
  let list = s.issues.filter((i) => i.teamId === teamId)
  if (filter === 'active') {
    list = list.filter((i) => i.status !== 'backlog' && i.status !== 'done')
  } else if (filter === 'backlog') {
    list = list.filter((i) => i.status === 'backlog')
  }
  return list
}

export async function getMyIssues(assigneeId: string): Promise<Issue[]> {
  const s = await getStore()
  return s.issues.filter((i) => i.assigneeId === assigneeId)
}

export async function updateIssue(
  issueId: string,
  patch: Partial<Pick<Issue, 'status' | 'assigneeId' | 'assigneeName'>>
): Promise<Issue | null> {
  const s = await getStore()
  const issue = s.issues.find((i) => i.id === issueId)
  if (!issue) return null
  Object.assign(issue, patch)
  await saveStore(s)
  return issue
}

export async function getIssueById(issueId: string): Promise<Issue | null> {
  const s = await getStore()
  return s.issues.find((i) => i.id === issueId) ?? null
}

export async function createIssue(input: {
  title: string
  teamId: string
  projectId?: string
  assigneeId?: string
  status?: string
  description?: string
}): Promise<Issue> {
  const s = await getStore()
  const team = s.teams.find((t) => t.id === input.teamId)
  if (!team) {
    throw new Error('Team not found')
  }

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

  s.issues.push(issue)
  await saveStore(s)
  return issue
}
