import { PageHeader, Stack } from '@design-system'
import { MembersTable } from '../components'
import type { MemberRow } from '../components'
import { noop } from '../utils/noop'

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
    <Stack gap={4}>
      <PageHeader title="Members" summary="Workspace members and invitations." />
      <MembersTable members={SAMPLE_MEMBERS} onInvite={noop} />
    </Stack>
  )
}
