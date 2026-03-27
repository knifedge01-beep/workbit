import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

import { Dropdown } from '@thedatablitz/dropdown'
import { TextInput as Input } from '@thedatablitz/text-input'
import { Text } from '@thedatablitz/text'
import { Badge } from '@thedatablitz/badge'
import { Box } from '@thedatablitz/box'
import { Avatar } from '@thedatablitz/avatar'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Card, CardContent } from '@thedatablitz/card'

import { createWorkspace, type ApiWorkspace } from '../../api/client'
import { useAuthRequired } from '../auth/AuthContext'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { logError } from '../../utils/errorHandling'
import { REGION_OPTIONS, slugify, workspaceInitials } from './utils'
import { useWorkspacesData } from './hooks/useWorkspacesData'
import { Button } from '@thedatablitz/button'

export function WorkspacesScreen() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [region, setRegion] = useState('us')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuthRequired()
  const userId = user?.id ?? null
  const navigate = useNavigate()
  const { setCurrentWorkspace, refreshWorkspaces } = useWorkspace()
  const {
    memberId,
    memberError,
    workspaces,
    workspacesError,
    workspacesLoading,
    reloadWorkspaces,
  } = useWorkspacesData({
    userId,
    authLoading,
  })

  const derivedSlug = useMemo(() => {
    if (slug) return slug
    return slugify(name || 'workspace')
  }, [name, slug])

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
      await reloadWorkspaces()
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
    <Box>
      <Inline padding="200" align="center" gap="100">
        <Avatar name="Workbit" size="small" variant="brand" />
        <Text className="font-semibold text-sm tracking-tight">Workbit</Text>
      </Inline>

      <Stack justify="center" gap="600" align="center">
        <Stack align="center">
          <Text variant="heading1">Workspaces</Text>
          <Text>Manage your workspaces or create a new one for your team.</Text>
        </Stack>

        <Inline gap="600">
          <Card>
            <CardContent className="pb-4">
              <Text variant="heading3">Create a new workspace</Text>
              <Text variant="body3">
                Workspaces are shared environments where teams can work on
                projects, cycles and issues.
              </Text>
            </CardContent>

            <Box className="border-t border-border" />

            <CardContent className="pt-5">
              <form onSubmit={handleSubmit}>
                <Stack gap="200">
                  <Stack gap="100">
                    <Input
                      label="Workspace name"
                      id="workspace-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Acme Inc"
                      autoComplete="organization"
                      autoFocus
                    />
                  </Stack>

                  <Stack gap="100">
                    <Inline align="center" gap="100">
                      <Input
                        required
                        label="Workspace URL"
                        id="workspace-url"
                        value={slug}
                        onChange={(e) => setSlug(slugify(e.target.value))}
                        placeholder={derivedSlug}
                        className="flex-1"
                      />
                    </Inline>
                    <Text className="text-xs text-muted-foreground">
                      This URL will be used to access your workspace and must be
                      unique.
                    </Text>
                  </Stack>

                  <Stack gap="100">
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
                  </Stack>

                  {error && (
                    <Inline
                      className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5"
                      align="flex-start"
                      gap="100"
                    >
                      <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <Text className="text-xs text-destructive">{error}</Text>
                    </Inline>
                  )}

                  <Box className="border-t border-border" />

                  <Inline align="center" justify="space-between" gap="100">
                    <Text className="text-xs text-muted-foreground truncate">
                      {memberId
                        ? `Logged in member: ${memberId}`
                        : 'Logged in, but no workspace member profile found yet.'}
                    </Text>
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
                  </Inline>
                </Stack>
              </form>
            </CardContent>
          </Card>

          <Stack gap="300">
            <Stack>
              <Text variant="heading3">Your workspaces</Text>
              <Text variant="body3">Select a workspace to open it.</Text>
            </Stack>

            <Stack gap="200">
              {workspacesLoading && (
                <Stack gap="200">
                  <Box className="h-20 w-full rounded-xl animate-pulse bg-muted/60" />
                  <Box className="h-20 w-full rounded-xl animate-pulse bg-muted/60" />
                  <Box className="h-20 w-full rounded-xl animate-pulse bg-muted/60" />
                </Stack>
              )}

              {workspacesError && (
                <Inline
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3"
                  align="flex-start"
                  gap="100"
                >
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <Text className="text-sm text-destructive">
                    Failed to load workspaces: {workspacesError}
                  </Text>
                </Inline>
              )}

              {!workspacesLoading &&
                !workspacesError &&
                workspaces.length === 0 && (
                  <Box padding="600" border>
                    <Building2 size={32} className="mx-auto mb-3 opacity-50" />
                    <Text>
                      No workspaces yet. Create your first one in the form.
                    </Text>
                  </Box>
                )}

              {!workspacesLoading &&
                !workspacesError &&
                workspaces.map((workspace) => (
                  <Card key={workspace.id}>
                    <CardContent>
                      <Inline align="center" gap="200">
                        <Avatar
                          name={workspaceInitials(workspace.name)}
                          size="medium"
                          variant="brand"
                        />

                        <Box>
                          <Text>{workspace.name}</Text>
                          <Inline align="center">
                            <Text variant="caption2">
                              workbit.app/{workspace.slug}
                            </Text>
                            <Badge variant="info" size="small">
                              {workspace.region.toUpperCase()}
                            </Badge>
                          </Inline>
                        </Box>

                        <Button
                          variant="glass"
                          size="small"
                          onClick={() => handleSelectWorkspace(workspace)}
                        >
                          Select
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Inline>
                    </CardContent>
                  </Card>
                ))}
            </Stack>
          </Stack>
        </Inline>
      </Stack>
    </Box>
  )
}
