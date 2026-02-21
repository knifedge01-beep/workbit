import { PageHeader, Stack } from '@design-system'
import { ProjectsTable } from '../components'
import type { ProjectTableRow } from '../components'

const SAMPLE_PROJECTS: ProjectTableRow[] = [
  { id: '1', name: 'TES', team: 'Test94', status: 'Active' },
  { id: '2', name: 'Design system', team: 'Design', status: 'Active' },
  { id: '3', name: 'Platform', team: 'Engineering', status: 'In progress' },
]

export function WorkspaceProjectsScreen() {
  return (
    <Stack gap={4}>
      <PageHeader title="Workspace projects" summary="All projects in your workspace." />
      <ProjectsTable projects={SAMPLE_PROJECTS} />
    </Stack>
  )
}
