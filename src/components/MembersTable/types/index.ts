export type MemberRow = {
  id: string
  name: string
  username: string
  avatarSrc?: string
  status: string
  joined: string
  teams: string
}

export type MembersTableProps = {
  members: MemberRow[]
  className?: string
}
