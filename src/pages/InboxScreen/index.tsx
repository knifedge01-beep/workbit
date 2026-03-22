import { PageHeader, Stack as View } from '@design-system'
import { useNavigate, useParams } from 'react-router-dom'
import { Mail, Plus, FolderKanban } from 'lucide-react'
import { Text } from '@thedatablitz/text'
import { EmptyIconWrapper } from './styles'
import { Box } from '@thedatablitz/box'
import { Stack } from '@thedatablitz/stack'
import { Button } from '@thedatablitz/button'

export function InboxScreen() {
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const base = workspaceId ? `/workspace/${workspaceId}` : ''

  return (
    <View gap={4}>
      <PageHeader
        title="Inbox"
        summary="Your notifications and updates will appear here."
      />
      <div
        style={{
          maxWidth: 340,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flex: 1,
        }}
      >
        <Box border align="center" justify="center">
          <Stack>
            <EmptyIconWrapper>
              <Mail size={36} />
            </EmptyIconWrapper>

            <Text as="h3" variant="heading3" style={{ marginBottom: 8 }}>
              No notifications yet
            </Text>
            <Text
              as="p"
              variant="body2"
              color="color.text.subtle"
              style={{ marginBottom: 24, maxWidth: 380 }}
            >
              When you have new updates, mentions, or assignments, they'll
              appear here. Get started by creating an issue or exploring
              projects.
            </Text>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                variant="primary"
                onClick={() => navigate(`${base}/issues/new`)}
              >
                <Plus size={16} />
                Create Issue
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`${base}/workspace/projects`)}
              >
                <FolderKanban size={16} />
                View Projects
              </Button>
            </div>
          </Stack>
        </Box>
      </div>
    </View>
  )
}
