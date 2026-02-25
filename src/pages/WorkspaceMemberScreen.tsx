import { useState } from 'react'
import { PageHeader, Stack, Text } from '@design-system'
import { MembersTable } from '../components'
import type { MemberRow } from '../components'
import { fetchMembers, inviteMember } from '../api/client'
import { useFetch } from '../hooks/useFetch'

export function WorkspaceMemberScreen() {
  const { data, loading, error, reload } = useFetch(fetchMembers)
  const [inviteError, setInviteError] = useState<string | null>(null)

  const members: MemberRow[] = data ?? []

  const handleInvite = () => {
    const email = window.prompt('Enter email address to invite:')
    if (!email) return
    setInviteError(null)
    void inviteMember(email)
      .then(() => {
        reload()
        alert(`Invitation sent to ${email}`)
      })
      .catch((e: Error) => setInviteError(e.message))
  }

  return (
    <Stack gap={4}>
      <PageHeader
        title="Members"
        summary="Workspace members and invitations."
      />
      {error && (
        <Text size="sm" muted>
          Failed to load members: {error}
        </Text>
      )}
      {inviteError && (
        <Text size="sm" muted>
          Invite failed: {inviteError}
        </Text>
      )}
      {!loading && <MembersTable members={members} onInvite={handleInvite} />}
    </Stack>
  )
}
