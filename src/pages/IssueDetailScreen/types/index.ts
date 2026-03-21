export type IssueDetailScreenProps = {
  issueId: string
  teamId: string
  teamName: string
  projectName?: string
}

export type WorkspaceProjectLite = {
  id: string
  name: string
  status: string
  team: {
    id: string
  }
}

export type MemberLite = {
  id: string
  name: string
}

export type IssueDataLite = {
  id: string
  title: string
  description?: string | null
  date: string
  status: string
  teamId: string
  assignee?: {
    id?: string
    name: string
  } | null
  project?: {
    id?: string
    name: string
  } | null
}
