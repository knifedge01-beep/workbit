import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Box } from '@thedatablitz/box'
import { Dropdown } from '@thedatablitz/dropdown'
import { Inline } from '@thedatablitz/inline'
import { Modal } from '@thedatablitz/modal'
import { Stack } from '@thedatablitz/stack'
import { TextBox } from '@thedatablitz/textbox'
import { TextInput } from '@thedatablitz/text-input'
import { createProject, fetchWorkspaceTeams } from '../../api/client'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useFetch } from '../../hooks/useFetch'
import { logError } from '../../utils/errorHandling'
import type { RouteParams } from './types'
import {
  getProjectListPath,
  getSummary,
  PROPERTY_CHIPS,
  toTeamOptions,
} from './utils/helpers'
import { Button } from '@thedatablitz/button'
import { Plus } from 'lucide-react'

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

  const handleSubmit = async () => {
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

  if (!workspaceId || !currentWorkspace) return <Box>Workspace not found.</Box>

  const summary = getSummary(isTeamScoped, teamName, currentWorkspace.name)

  return (
    <Modal
      open
      onClose={handleCancel}
      title="New project"
      size="large"
      footer={
        <Inline justify="flex-end" gap="100" fullWidth>
          <Button variant="glass" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => void handleSubmit()}
            disabled={!name.trim() || !effectiveTeamId || submitting}
          >
            {submitting ? 'Creating…' : 'Create project'}
          </Button>
        </Inline>
      }
    >
      <Box>
        <Stack>
          <Box>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              disabled={submitting}
              autoFocus
            />
          </Box>

          <Box>
            <TextInput placeholder={summary} disabled={submitting} />
          </Box>

          {!isTeamScoped ? (
            <Box>
              <Dropdown
                value={teamId}
                onChange={(next) => {
                  if (typeof next === 'string') {
                    setTeamId(next)
                  }
                }}
                options={toTeamOptions(teamsList ?? [])}
                placeholder="Select team"
                size="medium"
              />
            </Box>
          ) : null}

          <Inline gap="100" wrap fullWidth>
            {PROPERTY_CHIPS.map((chip) => (
              <Button key={chip} variant="glass" icon={<Plus size={16} />}>
                {chip}
              </Button>
            ))}
          </Inline>

          <TextBox
            placeholder="Write a description, a project brief, or collect ideas..."
            size="medium"
            fullWidth
          />

          {error ? <Box role="alert">{error}</Box> : null}
        </Stack>
      </Box>
    </Modal>
  )
}
