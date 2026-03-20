export type RoleTableRow = {
  id: string
  role: string
  members: string
  description: string
}

export type RolesTableProps = {
  roles: RoleTableRow[]
  className?: string
}
