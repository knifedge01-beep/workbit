export type TeamRouteParams = {
  workspaceId: string
  teamId: string
}

export type TeamProjectRouteParams = {
  workspaceId: string
  teamId: string
  projectId: string
}

export type TeamProjectDocumentRouteParams = TeamProjectRouteParams & {
  documentId: string
}

export type TeamIssueRouteParams = {
  teamId: string
  issueId: string
}
