import { PageHeader, Stack, Button } from '@design-system'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Mail, Plus, FolderKanban } from 'lucide-react'

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(100%, 440px);
  align-self: center;
  margin: 8vh auto 0;
  text-align: center;
  padding: ${(p) => p.theme.spacing[8]}px ${(p) => p.theme.spacing[6]}px;
  background: ${(p) => p.theme.colors.surface};
  border-radius: 16px;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 640px) {
    width: 100%;
    margin-top: 4vh;
    padding: ${(p) => p.theme.spacing[6]}px ${(p) => p.theme.spacing[4]}px;
  }
`

const EmptyIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: ${(p) => p.theme.spacing[4]}px;
  background: ${(p) =>
    p.theme.colors.backgroundSubtle || p.theme.colors.surfaceSecondary};
  border-radius: 50%;
  opacity: 0.9;

  svg {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 ${(p) => p.theme.spacing[2]}px 0;
  line-height: 1.3;
`

const EmptyDescription = styled.p`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.textMuted};
  margin: 0 0 ${(p) => p.theme.spacing[6]}px 0;
  line-height: 1.5;
  font-weight: 400;
  max-width: 380px;
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing[3]}px;
  width: 100%;
  justify-content: center;

  > * {
    min-height: 40px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    > * {
      width: 100%;
    }
  }
`

export function InboxScreen() {
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const base = workspaceId ? `/workspace/${workspaceId}` : ''

  return (
    <Stack gap={4}>
      <PageHeader
        title="Inbox"
        summary="Your notifications and updates will appear here."
      />

      <EmptyStateContainer>
        <EmptyIconWrapper>
          <Mail size={36} />
        </EmptyIconWrapper>

        <EmptyTitle>No notifications yet</EmptyTitle>
        <EmptyDescription>
          When you have new updates, mentions, or assignments, they'll appear
          here. Get started by creating an issue or exploring projects.
        </EmptyDescription>

        <ActionButtons>
          <Button
            variant="primary"
            onClick={() => navigate(`${base}/my-issues`)}
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
        </ActionButtons>
      </EmptyStateContainer>
    </Stack>
  )
}
