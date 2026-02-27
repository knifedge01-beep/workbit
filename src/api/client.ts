import { getAccessToken } from '../pages/auth/supabaseClient'

const _apiUrl =
  typeof import.meta.env.VITE_API_URL === 'string' &&
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3001'
const API_BASE = _apiUrl.replace(/\/api\/v1\/?$/, '') + '/api/v1'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getAccessToken()
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options?.headers as Record<string, string> | undefined),
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(body || `${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// ---- API response types ----

export interface ApiProject {
  id: string
  name: string
  team: { id: string; name: string }
  status: string
}

export interface ApiTeam {
  id: string
  name: string
  memberCount: number
  project: { id: string; name: string } | null
}

export interface ApiMember {
  id: string
  name: string
  username: string
  avatarSrc?: string
  status: string
  joined: string
  provisioned: boolean
  uid?: string | null
  teams: string
}

export interface ApiView {
  id: string
  name: string
  type: string
  owner: { id: string; name: string }
  teamId?: string
}

export interface ApiRole {
  id: string
  role: string
  memberCount: number
  description: string
}

export interface ApiIssue {
  id: string
  title: string
  assignee: { id: string; name: string } | null
  date: string
  status: string
}

export interface ApiIssueDetail extends ApiIssue {
  teamId: string
  team: { id: string; name: string } | null
  project: { id: string; name: string } | null
}

export interface ApiStatusUpdate {
  id: string
  status: 'on-track' | 'at-risk' | 'off-track'
  content: string
  author: { id: string; name: string; avatarSrc?: string }
  createdAt: string
  commentCount: number
}

export interface ApiComment {
  id: string
  authorName: string
  authorAvatarSrc?: string
  content: string
  timestamp: string
}

export interface ApiMilestone {
  id: string
  teamId: string
  name: string
  progress: number
  total: number
  targetDate: string
}

export interface ApiActivityItem {
  id: string
  teamId: string
  icon: 'milestone' | 'project'
  message: string
  date: string
}

export interface ApiProjectProperties {
  status: string
  priority: string
  leadId?: string
  startDate?: string
  endDate?: string
  teamIds: string[]
  labelIds: string[]
}

export interface ApiTeamProject {
  team: { id: string; name: string }
  project: {
    id: string
    statusUpdates: { nodes: ApiStatusUpdate[] }
    properties: ApiProjectProperties
    milestones: ApiMilestone[]
    activity: ApiActivityItem[]
  }
}

export interface ApiNotification {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  createdAt: string
  actor: { id: string; name: string }
  targetUrl?: string
}

export interface ApiWorkspace {
  id: string
  name: string
  slug: string
  region: string
}

export interface ApiMyIssue extends ApiIssue {
  team: { id: string; name: string } | null
  project: { id: string; name: string } | null
}

// ---- Workspace ----

export const fetchProjects = () => apiFetch<ApiProject[]>('/workspace/projects')
export const fetchWorkspaceTeams = () => apiFetch<ApiTeam[]>('/workspace/teams')
export const fetchMembers = () => apiFetch<ApiMember[]>('/workspace/members')

export const createMember = (body: {
  name: string
  username: string
  status?: string
  teamIds?: string[]
}) =>
  apiFetch<ApiMember>('/workspace/members', {
    method: 'POST',
    body: JSON.stringify(body),
  })

export const provisionMember = (memberId: string, email: string) =>
  apiFetch<ApiMember>(`/workspace/members/${memberId}/provision`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
export const inviteMember = (email: string, roleId?: string) =>
  apiFetch<{ id: string }>('/workspace/members/invite', {
    method: 'POST',
    body: JSON.stringify({ email, roleId }),
  })
export const fetchWorkspaceViews = () => apiFetch<ApiView[]>('/workspace/views')
export const fetchRoles = () => apiFetch<ApiRole[]>('/workspace/roles')

// ---- Teams ----

export const fetchTeamIssues = (
  teamId: string,
  filter: 'all' | 'active' | 'backlog' = 'all'
) => apiFetch<ApiIssue[]>(`/teams/${teamId}/issues?filter=${filter}`)

export const fetchTeamProject = (teamId: string) =>
  apiFetch<ApiTeamProject>(`/teams/${teamId}/project`)

export const postStatusUpdate = (
  teamId: string,
  content: string,
  status: string
) =>
  apiFetch<ApiStatusUpdate>(`/teams/${teamId}/project/updates`, {
    method: 'POST',
    body: JSON.stringify({ content, status }),
  })

export const postComment = (
  teamId: string,
  updateId: string,
  content: string
) =>
  apiFetch<ApiComment>(
    `/teams/${teamId}/project/updates/${updateId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    }
  )

export const createMilestone = (
  teamId: string,
  body: { name: string; targetDate?: string; total?: number }
) =>
  apiFetch<ApiMilestone>(`/teams/${teamId}/project/milestones`, {
    method: 'POST',
    body: JSON.stringify(body),
  })

export const patchMilestone = (
  teamId: string,
  milestoneId: string,
  body: Partial<ApiMilestone>
) =>
  apiFetch<ApiMilestone>(`/teams/${teamId}/project/milestones/${milestoneId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

export const patchProject = (
  teamId: string,
  body: Partial<ApiProjectProperties>
) =>
  apiFetch<ApiProjectProperties>(`/teams/${teamId}/project`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

export const fetchTeamViews = (teamId: string) =>
  apiFetch<ApiView[]>(`/teams/${teamId}/views`)

export const fetchTeamLogs = (teamId: string) =>
  apiFetch<{
    nodes: Array<{
      id: string
      action: string
      actor: { id: string; name: string }
      timestamp: string
      details: string
    }>
  }>(`/teams/${teamId}/logs`)

// ---- Issues ----

export const fetchIssue = (issueId: string) =>
  apiFetch<ApiIssueDetail>(`/issues/${issueId}`)

export const updateIssue = (
  issueId: string,
  body: { status?: string; assigneeId?: string; assigneeName?: string }
) =>
  apiFetch(`/issues/${issueId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

// ---- Me ----

export const fetchMyIssues = () => apiFetch<ApiMyIssue[]>('/me/issues')
export const fetchNotifications = (first = 50) =>
  apiFetch<ApiNotification[]>(`/me/notifications?first=${first}`)
export const fetchMyTeams = () =>
  apiFetch<{ id: string; name: string }[]>('/me/teams')

// ---- Workspaces ----

export const fetchWorkspaces = (memberId: string) =>
  apiFetch<ApiWorkspace[]>(
    `/workspaces?memberId=${encodeURIComponent(memberId)}`
  )

export const createWorkspace = (body: {
  name: string
  slug: string
  region?: string
  memberId: string
}) =>
  apiFetch<ApiWorkspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify(body),
  })

// ---- Create Project ----

export const createProject = (body: {
  name: string
  teamId: string
  status?: string
}) =>
  apiFetch<ApiProject>('/workspace/projects', {
    method: 'POST',
    body: JSON.stringify(body),
  })

// ---- Create Issue ----

export const createIssue = (
  teamId: string,
  body: {
    title: string
    projectId?: string
    assigneeId?: string
    status?: string
  }
) =>
  apiFetch<ApiIssue>(`/teams/${teamId}/issues`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
