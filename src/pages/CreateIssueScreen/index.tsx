import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Input, Select, RichText } from '@design-system'
import { cn } from '@design-system-v2/lib/utils'

import { createIssue, fetchWorkspaceTeams } from '../../api/client'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useFetch } from '../../hooks/useFetch'
import { logError } from '../../utils/errorHandling'
import { createIssueScreenClasses as classes } from './styles/classes'
import type { RouteParams } from './types'
import {
  getCancelPath,
  getIssueDetailPath,
  getSummary,
  getTeamBadge,
  ISSUE_PROPERTY_CHIPS,
  toTeamOptions,
} from './utils/helpers'
import { Button } from '@thedatablitz/button'

export function CreateIssueScreen() {
  const { workspaceId, teamId: teamIdFromUrl } = useParams<RouteParams>()
  const navigate = useNavigate()
  const { currentWorkspace, teams } = useWorkspace()
  const [teamId, setTeamId] = useState(teamIdFromUrl ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
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
        if (teamIdOptional) {
          navigate(getIssueDetailPath(workspaceId, teamIdOptional, issue.id))
        } else {
          navigate(`/workspace/${workspaceId}/inbox`)
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
    if (!workspaceId) return
    navigate(getCancelPath(workspaceId, isTeamScoped, teamIdFromUrl))
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
            <span className={classes.headerTitle}>New issue</span>
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
          {!isTeamScoped && (
            <div className={classes.teamSelectWrap}>
              <Select
                value={teamId}
                onChange={setTeamId}
                options={toTeamOptions(teamsList ?? [])}
              />
              <p className={classes.teamSelectHint}>
                The team must have a project; the issue will be created under
                that project.
              </p>
            </div>
          )}

          <div className={classes.stack}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              disabled={submitting}
              autoFocus
              className={classes.titleInput}
            />

            <Input
              placeholder={summary}
              disabled={submitting}
              className={classes.summaryInput}
            />

            <div className={classes.chipsWrap}>
              {ISSUE_PROPERTY_CHIPS.map((chip) => (
                <button key={chip} type="button" className={classes.chip}>
                  {chip}
                </button>
              ))}
            </div>

            <div className={classes.editorWrap}>
              <RichText
                value={description}
                onChange={setDescription}
                placeholder="Write a description, acceptance criteria, or notes..."
                disabled={submitting}
                minHeight={220}
              />
            </div>

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
