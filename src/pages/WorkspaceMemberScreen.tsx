import { Container, Stack, Heading, Text, Button } from '@design-system'
import { MembersTable } from '../components'
import type { MemberRow } from '../components'
import { noop } from '../utils/noop'
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

const SAMPLE_MEMBERS: MemberRow[] = [
  {
    id: '1',
    name: 'Manoj Bhat',
    username: 'imanojbhat',
    status: 'Admin',
    joined: 'Feb 11',
    teams: 'TES',
  },
]

export function WorkspaceMemberScreen() {
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
          <Button variant="primary" onClick={noop}>
            <UserPlus size={16} />
            Invite
          </Button>
        </Header>
        <MembersTable members={SAMPLE_MEMBERS} />
      </Stack>
    </Container>
  )
}
