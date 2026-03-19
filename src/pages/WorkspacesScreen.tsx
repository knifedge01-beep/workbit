import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Globe,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Badge,
} from '@design-system-v2'
import {
  createWorkspace,
  fetchWorkspaces,
  fetchMembers,
  type ApiWorkspace,
  type ApiMember,
} from '../api/client'
import { useAuthRequired } from './auth/AuthContext'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { logError } from '../utils/errorHandling'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function WorkspaceInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

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

  // Resolve the current memberId for the logged-in user
  useEffect(() => {
    if (authLoading) return
    let cancelled = false
    async function resolveMember() {
      setMemberError(null)
      try {
        const members: ApiMember[] = await fetchMembers()
        console.log({ members })
        const current = members.find((m) => m.uid && userId && m.uid === userId)
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

  // Load workspaces for the resolved memberId
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
      // Refresh list after creating a workspace
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

  function handleSelectWorkspace(ws: ApiWorkspace) {
    setCurrentWorkspace(ws)
    navigate(`/workspace/${ws.id}/inbox`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
          <Building2 className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sm tracking-tight">Workbit</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your workspaces or create a new one for your team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
          {/* ── Left column: create form ── */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                Create a new workspace
              </CardTitle>
              <CardDescription>
                Workspaces are shared environments where teams can work on
                projects, cycles and issues.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-5">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Workspace name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input
                    id="workspace-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Acme Inc"
                    autoComplete="organization"
                    autoFocus
                  />
                </div>

                {/* Workspace URL */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="workspace-url">Workspace URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center h-9 px-3 rounded-md bg-muted border border-input text-xs text-muted-foreground whitespace-nowrap">
                      workbit.app/
                    </span>
                    <Input
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

                {/* Region */}
                <div className="flex flex-col gap-1.5">
                  <Label>Workspace region</Label>
                  <Select value={region} onValueChange={(v) => setRegion(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Workspace will be hosted in the selected region.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-xs text-destructive">{error}</p>
                  </div>
                )}

                <Separator />

                {/* Footer row */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground truncate">
                    {memberId
                      ? `Logged in member: ${memberId}`
                      : 'Logged in, but no workspace member profile found yet.'}
                  </p>
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="sm"
                    className="shrink-0"
                  >
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
          </Card>

          {/* ── Right column: workspace list ── */}
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
                workspaces.map((ws) => (
                  <Card
                    key={ws.id}
                    className="group transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-5 flex items-center gap-4">
                      {/* Avatar block */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-semibold text-sm shrink-0 select-none">
                        {WorkspaceInitials(ws.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {ws.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Globe className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-xs text-muted-foreground truncate">
                            workbit.app/{ws.slug}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4"
                          >
                            {ws.region.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Select button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectWorkspace(ws)}
                        className="shrink-0 gap-1.5 group-hover:border-primary group-hover:text-primary transition-colors"
                      >
                        Select
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
