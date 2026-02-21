import { PageHeader, Stack } from '@design-system'
import { RolesTable } from '../components'
import type { RoleTableRow } from '../components'

const SAMPLE_ROLES: RoleTableRow[] = [
  { id: '1', role: 'Admin', members: '1', description: 'Full workspace access' },
  { id: '2', role: 'Member', members: '0', description: 'Standard member permissions' },
  { id: '3', role: 'Guest', members: '0', description: 'Limited access for external collaborators' },
]

export function WorkspaceRolesScreen() {
  return (
    <Stack gap={4}>
      <PageHeader title="Roles" summary="Workspace roles and permissions." />
      <RolesTable roles={SAMPLE_ROLES} />
    </Stack>
  )
}
