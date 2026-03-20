import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button, Input, Select } from '@design-system'
import { cn } from '@design-system-v2/lib/utils'

import { createProject, fetchWorkspaceTeams } from '../../api/client'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useFetch } from '../../hooks/useFetch'
import { logError } from '../../utils/errorHandling'
import { createProjectScreenClasses as classes } from './styles/classes'
import type { RouteParams } from './types'
import {
  getProjectListPath,
  getSummary,
  getTeamBadge,
  PROPERTY_CHIPS,
  toTeamOptions,
} from './utils/helpers'

export function CreateProjectScreen() {
  const { workspaceId, teamId: teamIdFromUrl } = useParams<RouteParams>()
  const navigate = useNavigate()
  const { currentWorkspace, teams, refreshTeamsAndProjects } = useWorkspace()
  const [name, setName] = useState('')
  const [teamId, setTeamId] = useState(teamIdFromUrl ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTeamScoped = Boolean(teamIdFromUrl)
  const effectiveTeamId = teamIdFromUrl ?? teamId
  const teamName = teams.find((team) => team.id === effectiveTeamId)?.name

  const { data: teamsList } = useFetch(
    () =>
      currentWorkspace && !isTeamScoped
        ? fetchWorkspaceTeams(currentWorkspace.id)
        : Promise.resolve([]),
    [currentWorkspace?.id, isTeamScoped]
  )

  const handleSubmit = async (e: FormEvent) => {
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

      if (workspaceId) {
        navigate(getProjectListPath(workspaceId, isTeamScoped, teamIdFromUrl))
      }
    } catch (err) {
      logError(err, 'CreateProject')
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (!workspaceId) return
    navigate(getProjectListPath(workspaceId, isTeamScoped, teamIdFromUrl))
  }

  if (!workspaceId || !currentWorkspace) return <div>Workspace not found.</div>

  const summary = getSummary(isTeamScoped, teamName, currentWorkspace.name)

  return (
    <div className={classes.root}>
      <div className={classes.card}>
        <div className={classes.cardHeader}>
          <div className={classes.headerLeft}>
            <span className={classes.teamBadge}>{getTeamBadge(teamName)}</span>
            <span>&gt;</span>
            <span className={classes.headerTitle}>New project</span>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className={classes.closeButton}
            aria-label="Close"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.iconWrap}>
            <>□</>
          </div>

          <div className={classes.stack}>
            <div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                disabled={submitting}
                autoFocus
                className={classes.nameInput}
              />
            </div>

            <div>
              <Input
                placeholder={summary}
                disabled={submitting}
                className={classes.summaryInput}
              />
            </div>

            {!isTeamScoped && (
              <div>
                <Select
                  value={teamId}
                  onChange={setTeamId}
                  options={toTeamOptions(teamsList ?? [])}
                />
              </div>
            )}

            <div className={classes.chipsWrap}>
              {PROPERTY_CHIPS.map((chip) => (
                <button key={chip} type="button" className={classes.chip}>
                  {chip}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a description, a project brief, or collect ideas..."
              className={classes.description}
            />

            <button type="button" className={classes.milestonesButton}>
              <span>Milestones</span>
              <span>+</span>
            </button>

            {error && (
              <div role="alert" className={classes.error}>
                {error}
              </div>
            )}
          </div>

          <div className={classes.formFooter}>
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
