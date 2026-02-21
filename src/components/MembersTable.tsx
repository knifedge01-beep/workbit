import styled from 'styled-components'
import { UserPlus, Plus } from 'lucide-react'
import { Table, Avatar, Badge, Button, Text } from '@design-system'
import type { ColumnDef } from '@design-system'

export type MemberRow = {
  id: string
  name: string
  username: string
  avatarSrc?: string
  status: string
  joined: string
  teams: string
}

const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  padding-bottom: ${(p) => p.theme.spacing[2]}px;
  margin-bottom: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const TitleBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const Count = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textMuted};
`

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  min-width: 0;
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const MemberName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
`

const TeamsCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  color: ${(p) => p.theme.colors.text};
  svg {
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
`

function createColumns(): ColumnDef<MemberRow, unknown>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      meta: { flex: 1.5 },
      cell: ({ row }) => {
        const { name, username, avatarSrc } = row.original
        return (
          <NameCell>
            <Avatar name={name} src={avatarSrc} size={40} />
            <NameBlock>
              <MemberName>{name}</MemberName>
              <Text size="sm" muted as="span">
                {username}
              </Text>
            </NameBlock>
          </NameCell>
        )
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      meta: { flex: 0.8 },
      cell: ({ row }) => (
        <Badge variant="solid" color="blue" size="small">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'joined',
      accessorKey: 'joined',
      header: 'Joined',
      meta: { flex: 0.8 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.joined}
        </Text>
      ),
    },
    {
      id: 'teams',
      accessorKey: 'teams',
      header: 'Teams',
      meta: { flex: 1 },
      cell: ({ row }) => (
        <TeamsCell>
          <UserPlus size={14} />
          <Text size="sm" as="span">
            {row.original.teams}
          </Text>
        </TeamsCell>
      ),
    },
  ]
}

const columns = createColumns()

type Props = {
  members: MemberRow[]
  onInvite?: () => void
  className?: string
}

export function MembersTable({ members, onInvite, className }: Props) {
  return (
    <section className={className}>
      <SectionHeader>
        <TitleBlock>
          <Title>Members</Title>
          <Count>{members.length}</Count>
        </TitleBlock>
        {onInvite && (
          <Button variant="ghost" size="sm" onClick={onInvite}>
            <Plus size={16} />
            Invite
          </Button>
        )}
      </SectionHeader>
      <Table<MemberRow>
        columns={columns}
        data={members}
        enableSorting
        initialState={{ sorting: [{ id: 'name', desc: false }] }}
      />
    </section>
  )
}
