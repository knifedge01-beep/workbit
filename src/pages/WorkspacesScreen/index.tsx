import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

import { Dropdown } from '@thedatablitz/dropdown'
import { TextInput as Input } from '@thedatablitz/text-input'
import { Text } from '@thedatablitz/text'
import { Badge } from '@thedatablitz/badge'
import { Box } from '@thedatablitz/box'
import { Avatar } from '@thedatablitz/avatar'
import { Inline } from '@thedatablitz/inline'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from '@design-system-v2'
import {
  createWorkspace,
  fetchWorkspaces,
  fetchMembers,
  type ApiWorkspace,
  type ApiMember,
} from '../../api/client'
import { useAuthRequired } from '../auth/AuthContext'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { logError } from '../../utils/errorHandling'
import { REGION_OPTIONS, slugify, workspaceInitials } from './utils'
import { Button } from '@thedatablitz/button'

export function WorkspacesScreen() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [region, setRegion] = useState('us')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([])
  const [workspacesError, setWorkspacesError] = useState<string | null>(null)
  const [workspacesLoading, setWorkspacesLoading] = useState(true)
  const [memberId, setMemberId] = useState<string | null>(null)
  const [memberError, setMemberError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuthRequired()
  const userId = user?.id ?? null
  const navigate = useNavigate()
  const { setCurrentWorkspace, refreshWorkspaces } = useWorkspace()

  const derivedSlug = useMemo(() => {
    if (slug) return slug
    return slugify(name || 'workspace')
  }, [name, slug])

  useEffect(() => {
    if (authLoading) return
    let cancelled = false
    async function resolveMember() {
      setMemberError(null)
      try {
        const members: ApiMember[] = await fetchMembers()
        console.log({ members })
        const current = members.find(
          (member) => member.uid && userId && member.uid === userId
        )
        if (!cancelled) {
          setMemberId(current?.id ?? null)
          if (!current) {
            setMemberError(
              'No workspace member profile found for this account. Ask an admin to add you as a member.'
            )
          }
        }
      } catch (e) {
        if (!cancelled) {
          logError(e, 'WorkspacesScreen.resolveMember')
          setMemberError(
            e instanceof Error
              ? e.message
              : 'Failed to resolve workspace member.'
          )
        }
      }
    }
    console.log({ userId })
    if (userId) {
      void resolveMember()
    }
    return () => {
      cancelled = true
    }
  }, [authLoading, userId])

  useEffect(() => {
    console.log({ memberId })
    if (!memberId) return
    let cancelled = false
    async function load() {
      setWorkspacesLoading(true)
      setWorkspacesError(null)
      try {
        const data = await fetchWorkspaces(memberId as string)
        console.log({ data })
        if (!cancelled) {
          setWorkspaces(data)
        }
      } catch (e) {
        if (!cancelled) {
          logError(e, 'WorkspacesScreen.loadWorkspaces')
          setWorkspacesError(
            e instanceof Error ? e.message : 'Failed to load workspaces.'
          )
        }
      } finally {
        if (!cancelled) {
          setWorkspacesLoading(false)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [memberId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError('Workspace name is required.')
      return
    }
    const finalSlug = slugify(derivedSlug)
    if (!finalSlug) {
      setError('Workspace URL is required.')
      return
    }
    if (!memberId) {
      setError(
        memberError ??
          'Could not resolve your workspace member profile. Please refresh or contact an admin.'
      )
      return
    }
    setSubmitting(true)
    try {
      await createWorkspace({
        name: name.trim(),
        slug: finalSlug,
        region,
        memberId,
      })
      const updated = await fetchWorkspaces(memberId)
      setWorkspaces(updated)
      void refreshWorkspaces()
      setName('')
      setSlug('')
    } catch (e) {
      logError(e, 'WorkspacesScreen.createWorkspace')
      const msg = e instanceof Error ? e.message : 'Failed to create workspace.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  function handleSelectWorkspace(workspace: ApiWorkspace) {
    setCurrentWorkspace(workspace)
    navigate(`/workspace/${workspace.id}/inbox`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
          <Building2 className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sm tracking-tight">Workbit</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Text variant="heading1">Workspaces</Text>
          <Text>Manage your workspaces or create a new one for your team.</Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
          <Box border>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                <Text variant="heading3">Create a new workspace</Text>
              </CardTitle>
              <CardDescription>
                <Text variant="body3">
                  Workspaces are shared environments where teams can work on
                  projects, cycles and issues.
                </Text>
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-5">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Input
                    label="Workspace name"
                    id="workspace-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Acme Inc"
                    autoComplete="organization"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Input
                      required
                      label="Workspace URL"
                      id="workspace-url"
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      placeholder={derivedSlug}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This URL will be used to access your workspace and must be
                    unique.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Text variant="body3">Workspace region</Text>
                  <Dropdown
                    size="medium"
                    value={region}
                    options={REGION_OPTIONS}
                    onChange={(v) => setRegion(v)}
                    placeholder="Select region"
                  />
                  <Text className="text-xs text-muted-foreground">
                    Workspace will be hosted in the selected region.
                  </Text>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-xs text-destructive">{error}</p>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground truncate">
                    {memberId
                      ? `Logged in member: ${memberId}`
                      : 'Logged in, but no workspace member profile found yet.'}
                  </p>
                  <Button variant="primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      'Create workspace'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Box>

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold">Your workspaces</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Select a workspace to open it.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {workspacesLoading && (
                <>
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </>
              )}

              {workspacesError && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-destructive">
                    Failed to load workspaces: {workspacesError}
                  </p>
                </div>
              )}

              {!workspacesLoading &&
                !workspacesError &&
                workspaces.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
                    <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No workspaces yet. Create your first one in the form.
                    </p>
                  </div>
                )}

              {!workspacesLoading &&
                !workspacesError &&
                workspaces.map((workspace) => (
                  <Box border key={workspace.id}>
                    <CardContent className="p-5 flex items-center gap-4">
                      <Avatar
                        name={workspaceInitials(workspace.name)}
                        size="medium"
                        variant="brand"
                      />

                      <div className="flex-1 min-w-0">
                        <Text>{workspace.name}</Text>
                        <Inline align="center">
                          workbit.app/{workspace.slug}
                          <Badge variant="success" size="small">
                            {workspace.region.toUpperCase()}
                          </Badge>
                        </Inline>
                      </div>

                      <Button
                        variant="info"
                        size="medium"
                        onClick={() => handleSelectWorkspace(workspace)}
                      >
                        Select
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </CardContent>
                  </Box>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
