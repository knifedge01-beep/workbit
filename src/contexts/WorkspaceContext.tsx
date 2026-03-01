import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchMembers, fetchWorkspaces } from '../api/client'
import type { ApiWorkspace } from '../api/client'
import { useAuth } from '../pages/auth/AuthContext'

const STORAGE_KEY = 'workbit.currentWorkspaceId'

type WorkspaceContextValue = {
  currentWorkspace: ApiWorkspace | null
  setCurrentWorkspace: (ws: ApiWorkspace | null) => void
  workspaces: ApiWorkspace[]
  workspacesLoading: boolean
  workspacesError: string | null
  refreshWorkspaces: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth()
  const userId =
    authState.status === 'authenticated' ? authState.session.user.id : null

  const [currentWorkspace, setCurrentWorkspaceState] =
    useState<ApiWorkspace | null>(null)
  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([])
  const [workspacesLoading, setWorkspacesLoading] = useState(true)
  const [workspacesError, setWorkspacesError] = useState<string | null>(null)

  const setCurrentWorkspace = useCallback((ws: ApiWorkspace | null) => {
    setCurrentWorkspaceState(ws)
    if (ws) {
      try {
        localStorage.setItem(STORAGE_KEY, ws.id)
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    }
  }, [])

  const loadWorkspaces = useCallback(async () => {
    if (!userId) {
      setWorkspaces([])
      setWorkspacesLoading(false)
      return
    }
    setWorkspacesLoading(true)
    setWorkspacesError(null)
    try {
      const members = await fetchMembers()
      const member = members.find((m) => m.uid && m.uid === userId)
      if (!member) {
        setWorkspaces([])
        return
      }
      const list = await fetchWorkspaces(member.id)
      setWorkspaces(list)
      const storedId = localStorage.getItem(STORAGE_KEY)
      if (storedId) {
        const found = list.find((w) => w.id === storedId)
        if (found) setCurrentWorkspaceState(found)
      }
    } catch (e) {
      setWorkspacesError(
        e instanceof Error ? e.message : 'Failed to load workspaces'
      )
      setWorkspaces([])
    } finally {
      setWorkspacesLoading(false)
    }
  }, [userId])

  useEffect(() => {
    let cancelled = false
    if (!userId) {
      setWorkspaces([])
      setWorkspacesLoading(false)
      return
    }
    void (async () => {
      setWorkspacesLoading(true)
      setWorkspacesError(null)
      try {
        const members = await fetchMembers()
        if (cancelled) return
        const member = members.find((m) => m.uid && m.uid === userId)
        if (!member) {
          if (!cancelled) setWorkspaces([])
          return
        }
        const list = await fetchWorkspaces(member.id)
        if (cancelled) return
        setWorkspaces(list)
        const storedId = localStorage.getItem(STORAGE_KEY)
        if (storedId) {
          const found = list.find((w) => w.id === storedId)
          if (found) setCurrentWorkspaceState(found)
        }
      } catch (e) {
        if (!cancelled)
          setWorkspacesError(
            e instanceof Error ? e.message : 'Failed to load workspaces'
          )
        if (!cancelled) setWorkspaces([])
      } finally {
        if (!cancelled) setWorkspacesLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId])

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      currentWorkspace,
      setCurrentWorkspace,
      workspaces,
      workspacesLoading,
      workspacesError,
      refreshWorkspaces: loadWorkspaces,
    }),
    [
      currentWorkspace,
      setCurrentWorkspace,
      workspaces,
      workspacesLoading,
      workspacesError,
      loadWorkspaces,
    ]
  )

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is the public API for this context
export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext)
  if (!ctx)
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  return ctx
}
