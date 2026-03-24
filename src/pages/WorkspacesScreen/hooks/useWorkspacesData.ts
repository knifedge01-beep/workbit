import { useCallback, useEffect, useState } from 'react'
import {
  fetchMembers,
  fetchWorkspaces,
  type ApiMember,
  type ApiWorkspace,
} from '../../../api/client'
import { logError } from '../../../utils/errorHandling'

type UseWorkspacesDataParams = {
  userId: string | null
  authLoading: boolean
}

type UseWorkspacesDataResult = {
  memberId: string | null
  memberError: string | null
  workspaces: ApiWorkspace[]
  workspacesLoading: boolean
  workspacesError: string | null
  reloadWorkspaces: () => Promise<void>
}

export function useWorkspacesData({
  userId,
  authLoading,
}: UseWorkspacesDataParams): UseWorkspacesDataResult {
  const [memberId, setMemberId] = useState<string | null>(null)
  const [memberError, setMemberError] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([])
  const [workspacesError, setWorkspacesError] = useState<string | null>(null)
  const [workspacesLoading, setWorkspacesLoading] = useState(true)

  const reloadWorkspaces = useCallback(async () => {
    if (!memberId) return
    setWorkspacesLoading(true)
    setWorkspacesError(null)
    try {
      const data = await fetchWorkspaces(memberId)
      setWorkspaces(data)
    } catch (e) {
      logError(e, 'WorkspacesScreen.loadWorkspaces')
      setWorkspacesError(
        e instanceof Error ? e.message : 'Failed to load workspaces.'
      )
    } finally {
      setWorkspacesLoading(false)
    }
  }, [memberId])

  useEffect(() => {
    if (authLoading) return
    if (!userId) {
      setMemberId(null)
      setMemberError(null)
      setWorkspaces([])
      setWorkspacesLoading(false)
      setWorkspacesError(null)
      return
    }

    let cancelled = false
    async function resolveMember() {
      setMemberError(null)
      try {
        const members: ApiMember[] = await fetchMembers()
        const current = members.find(
          (member) => member.uid && member.uid === userId
        )
        if (cancelled) return
        setMemberId(current?.id ?? null)
        if (!current) {
          setMemberError(
            'No workspace member profile found for this account. Ask an admin to add you as a member.'
          )
        }
      } catch (e) {
        if (cancelled) return
        logError(e, 'WorkspacesScreen.resolveMember')
        setMemberError(
          e instanceof Error ? e.message : 'Failed to resolve workspace member.'
        )
      }
    }

    void resolveMember()
    return () => {
      cancelled = true
    }
  }, [authLoading, userId])

  useEffect(() => {
    if (!memberId) {
      setWorkspaces([])
      setWorkspacesLoading(false)
      setWorkspacesError(null)
      return
    }
    void reloadWorkspaces()
  }, [memberId, reloadWorkspaces])

  return {
    memberId,
    memberError,
    workspaces,
    workspacesLoading,
    workspacesError,
    reloadWorkspaces,
  }
}
