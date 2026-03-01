import { PageHeader, Stack, Text } from '@design-system'
import { RolesTable } from '../components'
import type { RoleTableRow } from '../components'
import { fetchRoles } from '../api/client'
import { useFetch } from '../hooks/useFetch'

export function WorkspaceRolesScreen() {
  const { data, loading, error } = useFetch(fetchRoles)

  const roles: RoleTableRow[] = (data ?? []).map((r) => ({
    id: r.id,
    role: r.role,
    members: String(r.memberCount),
    description: r.description,
  }))

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
