import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Input, Select } from '@design-system'
import { cn } from '@design-system-v2/lib/utils'
import { createProject, fetchWorkspaceTeams } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { logError } from '../utils/errorHandling'

export function CreateProjectScreen() {
  const { workspaceId, teamId: teamIdFromUrl } = useParams<{
    workspaceId: string
    teamId?: string
  }>()
  const navigate = useNavigate()
  const { currentWorkspace, teams, refreshTeamsAndProjects } = useWorkspace()
  const [name, setName] = useState('')
  const [teamId, setTeamId] = useState(teamIdFromUrl ?? '')
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
    if (!name.trim() || !effectiveTeamId) return
    setError(null)
    setSubmitting(true)
    try {
      await createProject({
        name: name.trim(),
        teamId: effectiveTeamId,
        status: 'Active',
      })
      await refreshTeamsAndProjects()
      if (isTeamScoped && workspaceId && teamIdFromUrl) {
        navigate(`/workspace/${workspaceId}/team/${teamIdFromUrl}/projects`)
      } else if (workspaceId) {
        navigate(`/workspace/${workspaceId}/workspace/projects`)
      }
    } catch (err) {
      logError(err, 'CreateProject')
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (workspaceId) {
      if (isTeamScoped && teamIdFromUrl) {
        navigate(`/workspace/${workspaceId}/team/${teamIdFromUrl}/projects`)
      } else {
        navigate(`/workspace/${workspaceId}/workspace/projects`)
      }
    }
  }

  if (!workspaceId || !currentWorkspace) return <div>Workspace not found.</div>

  const summary =
    isTeamScoped && teamName
      ? `Create a project for ${teamName}.`
      : `Create a project in ${currentWorkspace.name}.`

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 text-[11px] font-semibold text-slate-600">
              {teamName?.slice(0, 3).toUpperCase() ?? 'PRJ'}
            </span>
            <span>&gt;</span>
            <span className="font-medium text-slate-700">New project</span>
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
          <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
            <>□</>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                disabled={submitting}
                autoFocus
                className="text-xl font-semibold"
              />
            </div>

            <div>
              <Input
                placeholder={summary}
                disabled={submitting}
                className="text-sm"
              />
            </div>

            {!isTeamScoped && (
              <div>
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
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
              {[
                'Backlog',
                'No priority',
                'Lead',
                'Members',
                'Start',
                'Target',
                'Labels',
                'Dependencies',
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

            <textarea
              placeholder="Write a description, a project brief, or collect ideas..."
              className="min-h-[320px] w-full resize-none rounded-md border border-slate-200 p-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
            />

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              <span>Milestones</span>
              <span>+</span>
            </button>

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
              disabled={!name.trim() || !effectiveTeamId || submitting}
              className={cn(
                !name.trim() || !effectiveTeamId ? 'opacity-70' : ''
              )}
            >
              {submitting ? 'Creating…' : 'Create project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
