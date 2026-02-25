import { useState } from 'react'
import styled from 'styled-components'
import {
  Search,
  UserPlus,
  Users,
  MoreHorizontal,
  Eye,
  Shield,
  UserMinus,
} from 'lucide-react'
import { Table, Avatar, Badge, Button, Text, Menu } from '@design-system'
import type { ColumnDef } from '@design-system'
import type { MenuEntry } from '@design-system'

export type MemberRow = {
  id: string
  name: string
  username: string
  avatarSrc?: string
  status: string
  joined: string
  teams: string
}

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  margin-bottom: ${(p) => p.theme.spacing[3]}px;
`

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  flex: 1;
  max-width: 280px;
  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    width: 100%;
    &::placeholder {
      color: ${(p) => p.theme.colors.textMuted};
    }
  }
  svg {
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
`

const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
`

const TitleBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const Count = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textMuted};
`

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`

const MemberName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
`

const TeamsCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 13px;
  svg {
    flex-shrink: 0;
  }
`

const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
`

const MoreBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }
`

const MEMBER_MENU_ITEMS: MenuEntry[] = [
  {
    id: 'view',
    label: 'View profile',
    icon: <Eye size={16} />,
    onClick: () => {},
  },
  {
    id: 'role',
    label: 'Change role',
    icon: <Shield size={16} />,
    onClick: () => {},
  },
  { type: 'divider' },
  {
    id: 'remove',
    label: 'Remove from workspace',
    icon: <UserMinus size={16} />,
    onClick: () => {},
  },
]

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
            <Avatar name={name} src={avatarSrc} size={28} />
            <NameBlock>
              <MemberName>{name}</MemberName>
              <Text size="xs" muted as="span">
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
      header: 'Role',
      meta: { flex: 0.7 },
      cell: ({ row }) => (
        <Badge variant="light" color="grey" size="small">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'joined',
      accessorKey: 'joined',
      header: 'Joined',
      meta: { flex: 0.7 },
      cell: ({ row }) => (
        <Text size="xs" muted as="span">
          {row.original.joined}
        </Text>
      ),
    },
    {
      id: 'teams',
      accessorKey: 'teams',
      header: 'Teams',
      meta: { flex: 0.8 },
      cell: ({ row }) => (
        <TeamsCell>
          <Users size={12} />
          <span>{row.original.teams}</span>
        </TeamsCell>
      ),
    },
    {
      id: 'actions',
      header: '',
      meta: { flex: 0.3 },
      cell: () => (
        <ActionsCell className="member-actions">
          <Menu
            trigger={
              <MoreBtn aria-label="More options">
                <MoreHorizontal size={14} />
              </MoreBtn>
            }
            items={MEMBER_MENU_ITEMS}
          />
        </ActionsCell>
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
  const [query, setQuery] = useState('')
  const filtered = query
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.username.toLowerCase().includes(query.toLowerCase())
      )
    : members

  return (
    <section className={className}>
      <SectionHeader>
        <TitleBlock>
          <Title>Members</Title>
          <Count>{members.length}</Count>
        </TitleBlock>
        {onInvite && (
          <Button variant="primary" size="sm" onClick={onInvite}>
            <UserPlus size={14} />
            Invite
          </Button>
        )}
      </SectionHeader>
      <Toolbar>
        <SearchBox>
          <Search size={13} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
          />
        </SearchBox>
      </Toolbar>
      <Table<MemberRow>
        columns={columns}
        data={filtered}
        enableSorting
        initialState={{ sorting: [{ id: 'name', desc: false }] }}
      />
    </section>
  )
}
