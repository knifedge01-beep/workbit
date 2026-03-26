import { useNavigate, useParams } from 'react-router-dom'
import { Container, Flex, PageHeader, Stack } from '@design-system'
import { MembersTable } from '../../components'
import { fetchMembers } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { UserPlus } from 'lucide-react'
import type { WorkspaceMemberScreenRouteParams } from './types'
import { mapMembersToRows } from './utils'
import { Button } from '@thedatablitz/button'
import { Text } from '@thedatablitz/text'

export function WorkspaceMemberScreen() {
  const { workspaceId } = useParams<WorkspaceMemberScreenRouteParams>()
  const navigate = useNavigate()
  const { data: members, loading, error } = useFetch(fetchMembers)

  const memberRows = mapMembersToRows(members ?? [])

  return (
    <Container maxWidth="1100px">
      <Stack gap={6}>
        <Flex align="flex-start" justify="space-between" gap={4} wrap>
          <div className="min-w-0 flex-1">
            <PageHeader
              title="Members"
              summary="Workspace members and invitations."
            />
          </div>
          {workspaceId ? (
            <Button
              variant="primary"
              className="shrink-0"
              onClick={() =>
                navigate(`/workspace/${workspaceId}/workspace/member/new`)
              }
            >
              <UserPlus size={16} />
              New Member
            </Button>
          ) : null}
        </Flex>
        {error ? (
          <Text variant="body3" color="color.text.subtle">
            Failed to load members: {error}
          </Text>
        ) : null}
        {!loading ? <MembersTable members={memberRows} /> : null}
      </Stack>
    </Container>
  )
}
