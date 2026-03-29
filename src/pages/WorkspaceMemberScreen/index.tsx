import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from '@thedatablitz/alert'
import { Container, PageHeader } from '@design-system'

import { fetchMembers } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { UserPlus } from 'lucide-react'
import { Table } from '@thedatablitz/table'
import { Badge } from '@thedatablitz/badge'
import type { WorkspaceMemberScreenRouteParams } from './types'
import { mapMembersToRows } from './utils'
import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { createMembersColumn } from './utils/createMembersColumn'
import { Text } from '@thedatablitz/text'
import { Stack } from '@thedatablitz/stack'

export function WorkspaceMemberScreen() {
  const { workspaceId } = useParams<WorkspaceMemberScreenRouteParams>()
  const navigate = useNavigate()
  const { data: members, loading, error } = useFetch(fetchMembers)

  const memberRows = mapMembersToRows(members ?? [])

  return (
    <Container maxWidth="1100px">
      <Stack gap="100">
        <PageHeader
          title="Members"
          summary="Workspace members and invitations."
        />

        {error ? (
          <Alert
            variant="error"
            placement="inline"
            description={`Failed to load members: ${error}`}
            className="w-full"
          />
        ) : null}
        {workspaceId ? (
          <Button
            variant="primary"
            icon={<UserPlus size={16} />}
            size="small"
            onClick={() =>
              navigate(`/workspace/${workspaceId}/workspace/member/new`)
            }
          >
            New Member
          </Button>
        ) : null}
        {!loading ? (
          <Stack gap="100">
            <Inline gap="050">
              <Text variant="heading6" as="span">
                Members
              </Text>
              <Badge variant="warning" size="small">
                {memberRows.length}
              </Badge>
            </Inline>
            <Table columns={createMembersColumn()} data={memberRows} />
          </Stack>
        ) : null}
      </Stack>
    </Container>
  )
}
