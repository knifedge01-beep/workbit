export type TeamProjectDetailScreenProps = {
  projectName: string
  teamId: string
  initialTab?: 'overview' | 'updates' | 'issues' | 'documentation' | 'decisions'
  /** When set, Documentation tab shows the multi-document list (used on /documentation URL). */
  documentationMode?: 'list'
}
