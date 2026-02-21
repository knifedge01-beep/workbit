import { PageHeader, Stack } from '@design-system'
import { ViewsTable } from '../components'
import type { ViewTableRow } from '../components'

const SAMPLE_VIEWS: ViewTableRow[] = [
  { id: '1', name: 'Active issues', type: 'List', owner: 'You' },
  { id: '2', name: 'My backlog', type: 'Board', owner: 'You' },
  { id: '3', name: 'Team roadmap', type: 'Roadmap', owner: 'Manoj Bhat' },
]

export function WorkspaceViewsScreen() {
  return (
    <Stack gap={4}>
      <PageHeader title="Workspace views" summary="Saved views across the workspace." />
      <ViewsTable views={SAMPLE_VIEWS} />
    </Stack>
  )
}
