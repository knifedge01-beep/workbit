import { useParams } from 'react-router-dom'
import { PageHeader, Stack, Text } from '@design-system'
import { ViewsTable } from '../components'
import type { ViewTableRow } from '../components'
import { fetchTeamViews } from '../api/client'
import { useFetch } from '../hooks/useFetch'

type Props = { teamName: string }

export function TeamViewsScreen({ teamName }: Props) {
  const { teamId } = useParams<{ teamId: string }>()
  const { data, loading, error } = useFetch(
    () => (teamId ? fetchTeamViews(teamId) : Promise.resolve([])),
    [teamId]
  )

  const views: ViewTableRow[] = (data ?? []).map((v) => ({
    id: v.id,
    name: v.name,
    type: v.type,
    owner: v.owner?.name ?? '',
  }))

  return (
    <Stack gap={4}>
      <PageHeader
        title={`${teamName} – Views`}
        summary="Saved views for this team."
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
