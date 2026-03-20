import type { RoleTableRow } from '../../../components'
import type { ApiRole } from '../../../api/client'

export function mapRolesToRows(roles: ApiRole[]): RoleTableRow[] {
  return roles.map((role) => ({
    id: role.id,
    role: role.role,
    members: String(role.memberCount),
    description: role.description,
  }))
}
