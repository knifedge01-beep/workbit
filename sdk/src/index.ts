export interface WorkbitInitConfig {
  apiKey: string
  baseUrl?: string
}

export interface CreateIssueParams {
  title: string
  projectId: string
  description?: string
  parentIssueId?: string
}

export interface CreatedIssue {
  id: string
  title: string
  description?: string
  date: string
  status: string
  teamId: string
  projectId?: string
  parentIssueId?: string
  assignee?: { id: string; name: string } | null
  team?: { id: string; name: string } | null
  project?: { id: string; name: string } | null
}

/** Matches GET /api/v1/issues/:issueId */
export interface IssueDetail {
  id: string
  title: string
  description?: string
  assignee?: { id: string; name: string } | null
  date: string
  status: string
  teamId: string | null
  team?: { id: string; name: string } | null
  project?: { id: string; name: string } | null
  parentIssueId?: string | null
}

/** Matches GET /api/v1/projects/:projectId (issues list) */
export interface IssueListItem {
  id: string
  title: string
  assignee: { id: string; name: string } | null
  date: string
  status: string
  parentIssueId: string | null
  subIssueCount: number
}

export type IssueListFilter = 'all' | 'active' | 'backlog'

let config: { apiKey: string; baseUrl: string } | null = null

const DEFAULT_BASE_URL = 'http://localhost:3001'

function requireConfig(): { apiKey: string; baseUrl: string } {
  if (!config) {
    throw new Error(
      'Workbit SDK not initialized. Call workbit.init({ apiKey, baseUrl? }) first.'
    )
  }
  return config
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const c = requireConfig()
  const url = `${c.baseUrl.replace(/\/$/, '')}${path}`
  const res = await fetch(url, {
    method: init?.method,
    body: init?.body,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': c.apiKey,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data as { error?: string }).error ?? res.statusText
    throw new Error(msg)
  }
  return data as T
}

export const workbit = {
  init(cfg: WorkbitInitConfig): void {
    config = {
      apiKey: cfg.apiKey,
      baseUrl: cfg.baseUrl ?? DEFAULT_BASE_URL,
    }
  },

  async getIssue(issueId: string): Promise<IssueDetail> {
    return requestJson<IssueDetail>(
      `/api/v1/issues/${encodeURIComponent(issueId)}`
    )
  },

  async getIssuesByProject(
    projectId: string,
    filter: IssueListFilter = 'all'
  ): Promise<IssueListItem[]> {
    const q = new URLSearchParams({ filter })
    return requestJson<IssueListItem[]>(
      `/api/v1/projects/${encodeURIComponent(projectId)}?${q}`
    )
  },

  async issue(params: CreateIssueParams): Promise<CreatedIssue> {
    return requestJson<CreatedIssue>('/api/v1/issues', {
      method: 'POST',
      body: JSON.stringify({ ...params }),
    })
  },
}
