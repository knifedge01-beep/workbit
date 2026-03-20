import { useNavigate, useParams } from 'react-router-dom'
import { Container, Stack, Heading, Text } from '@design-system'
import { MembersTable } from '../../components'
import { fetchMembers } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { UserPlus } from 'lucide-react'
import { Header, HeaderContent } from './styles'
import type { WorkspaceMemberScreenRouteParams } from './types'
import { mapMembersToRows } from './utils'
import { Button } from '@thedatablitz/button'

export function WorkspaceMemberScreen() {
  const { workspaceId } = useParams<WorkspaceMemberScreenRouteParams>()
  const navigate = useNavigate()
  const { data: members, loading, error } = useFetch(fetchMembers)

  const memberRows = mapMembersToRows(members ?? [])

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
