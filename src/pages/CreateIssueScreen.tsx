import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Input, Select, RichText } from '@design-system'
import { cn } from '@design-system-v2/lib/utils'
import { createIssue, fetchWorkspaceTeams } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { logError } from '../utils/errorHandling'

export function CreateIssueScreen() {
  const { workspaceId, teamId: teamIdFromUrl } = useParams<{
    workspaceId: string
    teamId?: string
  }>()
  const navigate = useNavigate()
  const { currentWorkspace, teams } = useWorkspace()
  const [teamId, setTeamId] = useState(teamIdFromUrl ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTeamScoped = Boolean(teamIdFromUrl)
  const effectiveTeamId = teamIdFromUrl ?? teamId
  const teamName = teams.find((t) => t.id === effectiveTeamId)?.name

  const { data: teamsList } = useFetch(
    () =>
      currentWorkspace && !isTeamScoped
        ? fetchWorkspaceTeams(currentWorkspace.id)
        : Promise.resolve([]),
    [currentWorkspace?.id, isTeamScoped]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      const teamIdOptional =
        effectiveTeamId && effectiveTeamId.trim() ? effectiveTeamId : undefined
      const issue = await createIssue(teamIdOptional, {
        title: title.trim(),
        description: description.trim() || undefined,
        status: 'todo',
      })
      if (workspaceId) {
        if (teamIdOptional && isTeamScoped) {
          navigate(
            `/workspace/${workspaceId}/team/${teamIdOptional}/issue/${issue.id}`
          )
        } else if (teamIdOptional) {
          navigate(
            `/workspace/${workspaceId}/team/${teamIdOptional}/issue/${issue.id}`
          )
        } else {
          navigate(`/workspace/${workspaceId}/my-issues`)
        }
      }
    } catch (err) {
      logError(err, 'CreateIssue')
      setError(err instanceof Error ? err.message : 'Failed to create issue')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (workspaceId) {
      if (isTeamScoped && teamIdFromUrl) {
        navigate(
          `/workspace/${workspaceId}/team/${teamIdFromUrl}/issues/active`
        )
      } else {
        navigate(`/workspace/${workspaceId}/my-issues`)
      }
    }
  }

  if (!workspaceId || !currentWorkspace) return <div>Workspace not found.</div>

  const summary =
    isTeamScoped && teamName
      ? `Create an issue for ${teamName}.`
      : `Create an issue in ${currentWorkspace.name}. Choose a team that has a project.`

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 text-[11px] font-semibold text-slate-600">
              {teamName?.slice(0, 3).toUpperCase() ?? 'ISS'}
            </span>
            <span>&gt;</span>
            <span className="font-medium text-slate-700">New issue</span>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {!isTeamScoped && (
            <div className="mb-4">
              <Select
                value={teamId}
                onChange={setTeamId}
                options={[
                  { value: '', label: 'Select a team' },
                  ...(teamsList ?? []).map((t) => ({
                    value: t.id,
                    label: t.name,
                  })),
                ]}
              />
              <p className="mt-2 text-xs text-slate-500">
                The team must have a project; the issue will be created under
                that project.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              disabled={submitting}
              autoFocus
              className="text-xl font-semibold"
            />

            <Input
              placeholder={summary}
              disabled={submitting}
              className="text-sm"
            />

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
              {[
                'Todo',
                'No priority',
                'Assignee',
                'Labels',
                'Project',
                'Due date',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-3">
              <RichText
                value={description}
                onChange={setDescription}
                placeholder="Write a description, acceptance criteria, or notes..."
                disabled={submitting}
                minHeight={220}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
              >
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!title.trim() || submitting}
              className={cn(!title.trim() ? 'opacity-70' : '')}
            >
              {submitting ? 'Creating…' : 'Create issue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
