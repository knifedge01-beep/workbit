import { PageHeader, Stack, Text } from '@design-system'
import { RolesTable } from '../../components'
import { fetchRoles } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { mapRolesToRows } from './utils'

export function WorkspaceRolesScreen() {
  const { data, loading, error } = useFetch(fetchRoles)

  const roles = mapRolesToRows(data ?? [])

  return (
    <Stack gap={4}>
      <PageHeader title="Roles" summary="Workspace roles and permissions." />
      {error && (
        <Text size="sm" muted>
          Failed to load roles: {error}
        </Text>
      )}
      {!loading && <RolesTable roles={roles} />}
    </Stack>
  )
}
