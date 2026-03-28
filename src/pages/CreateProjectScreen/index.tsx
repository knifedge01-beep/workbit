import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ChangeEvent } from 'react'

import { Box } from '@thedatablitz/box'
import { Inline } from '@thedatablitz/inline'
import { Modal } from '@thedatablitz/modal'
import { Stack } from '@thedatablitz/stack'
import { TextBox } from '@thedatablitz/textbox'
import { TextInput } from '@thedatablitz/text-input'
import { Alert } from '@thedatablitz/alert'
import { createProject } from '../../api/client'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { logError } from '../../utils/errorHandling'
import type { RouteParams } from './types'
import { getProjectListPath } from './utils/helpers'
import { Button } from '@thedatablitz/button'
export function CreateProjectScreen() {
  const { workspaceId, teamId: teamIdFromUrl } = useParams<RouteParams>()
  const navigate = useNavigate()
  const { currentWorkspace, refreshTeamsAndProjects } = useWorkspace()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTeamScoped = Boolean(teamIdFromUrl)
  const effectiveTeamId = teamIdFromUrl

  const handleSubmit = async () => {
    if (!name.trim() || !effectiveTeamId) return

    setError(null)
    setSubmitting(true)

    try {
      await createProject({
        name: name.trim(),
        description: description.trim(),
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

          <TextBox
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            placeholder="Write a description, a project brief, or collect ideas..."
            size="medium"
            fullWidth
          />

          {error ? (
            <Alert
              variant="error"
              placement="inline"
              description={error}
              className="w-full"
            />
          ) : null}
        </Stack>
      </Box>
    </Modal>
  )
}
