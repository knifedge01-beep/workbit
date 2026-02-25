import { PageHeader, Stack, Text } from '@design-system'
import { ViewsTable } from '../components'
import type { ViewTableRow } from '../components'
import { fetchWorkspaceViews } from '../api/client'
import { useFetch } from '../hooks/useFetch'

export function WorkspaceViewsScreen() {
  const { data, loading, error } = useFetch(fetchWorkspaceViews)

  const views: ViewTableRow[] = (data ?? []).map((v) => ({
    id: v.id,
    name: v.name,
    type: v.type,
    owner: v.owner?.name ?? '',
  }))

  return (
    <Stack gap={4}>
      <PageHeader
        title="Workspace views"
        summary="Saved views across the workspace."
      />
      {error && (
        <Text size="sm" muted>
          Failed to load views: {error}
        </Text>
      )}
      {!loading && <ViewsTable views={views} />}
    </Stack>
  )
}
