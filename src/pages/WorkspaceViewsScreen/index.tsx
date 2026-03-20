import { PageHeader, Stack, Text } from '@design-system'

import { ViewsTable } from '../../components'
import { fetchWorkspaceViews } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { workspaceViewsText } from './styles'
import type { WorkspaceViewApiItem } from './types'
import { toWorkspaceViewRows } from './utils/helpers'

export function WorkspaceViewsScreen() {
  const { data, loading, error } = useFetch(fetchWorkspaceViews)

  const views = toWorkspaceViewRows((data ?? []) as WorkspaceViewApiItem[])

  return (
    <Stack gap={4}>
      <PageHeader
        title={workspaceViewsText.title}
        summary={workspaceViewsText.summary}
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
