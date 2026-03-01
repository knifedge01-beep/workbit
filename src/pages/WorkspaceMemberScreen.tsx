import { useNavigate, useParams } from 'react-router-dom'
import { Container, Stack, Heading, Text, Button } from '@design-system'
import { MembersTable } from '../components'
import type { MemberRow } from '../components'
import { fetchMembers } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { formatDateTime } from '../utils/format'
import styled from 'styled-components'
import { UserPlus } from 'lucide-react'

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[4]}px;
  margin-bottom: ${(p) => p.theme.spacing[6]}px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${(p) => p.theme.spacing[4]}px;
  }
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[2]}px;
`

export function WorkspaceMemberScreen() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const navigate = useNavigate()
  const { data: members, loading, error } = useFetch(fetchMembers)

  const memberRows: MemberRow[] = (members ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    username: m.username,
    avatarSrc: m.avatarSrc,
    status: m.status,
    joined: formatDateTime(m.joined),
    teams: m.teams ?? '—',
  }))

  return (
    <Container maxWidth="1100px">
      <Stack gap={0}>
        <Header>
          <HeaderContent>
            <Heading level={1} as="h1">
              Members
            </Heading>
            <Text size="md" muted>
              Workspace members and invitations.
            </Text>
          </HeaderContent>
          {workspaceId && (
            <Button
              variant="primary"
              onClick={() =>
                navigate(`/workspace/${workspaceId}/workspace/member/new`)
              }
            >
              <UserPlus size={16} />
              New Member
            </Button>
          )}
        </Header>
        {error && (
          <Text size="sm" muted>
            Failed to load members: {error}
          </Text>
        )}
        {!loading && <MembersTable members={memberRows} />}
      </Stack>
    </Container>
  )
}
