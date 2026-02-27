import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  PageHeader,
  Stack,
  Text,
  Button,
  Flex,
  Modal,
  Input,
  Select,
} from '@design-system'
import { ProjectsTable } from '../components'
import type { ProjectTableRow } from '../components'
import {
  fetchProjects,
  createProject,
  fetchWorkspaceTeams,
} from '../api/client'
import { useFetch } from '../hooks/useFetch'

export function WorkspaceProjectsScreen() {
  const navigate = useNavigate()
  const { data, loading, error, reload } = useFetch(fetchProjects)
  const { data: teams } = useFetch(fetchWorkspaceTeams)
  const [creating, setCreating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')

  const projects: ProjectTableRow[] = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    team: p.team.name,
    status: p.status,
  }))

  const handleRowClick = (row: ProjectTableRow) => {
    const teamId = data?.find((p) => p.id === row.id)?.team.id ?? row.team
    navigate(`/team/${teamId}/projects/${row.id}`)
  }

  const handleCreateProject = async () => {
    if (!projectName.trim() || !selectedTeam) return

    setCreating(true)
    try {
      await createProject({
        name: projectName,
        teamId: selectedTeam,
        status: 'Active',
      })
      await reload()
      setShowModal(false)
      setProjectName('')
      setSelectedTeam('')
    } catch (err) {
      alert(`Failed to create project: ${err}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Stack gap={4}>
      <Flex align="center" justify="space-between">
        <PageHeader
          title="Workspace projects"
          summary="All projects in your workspace."
        />
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          New Project
        </Button>
      </Flex>
      {error && (
        <Text size="sm" muted>
          Failed to load projects: {error}
        </Text>
      )}
      {!loading && (
        <ProjectsTable projects={projects} onRowClick={handleRowClick} />
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Project"
        primaryLabel="Create"
        onPrimary={handleCreateProject}
        secondaryLabel="Cancel"
        onSecondary={() => setShowModal(false)}
      >
        <Stack gap={3}>
          <div>
            <Text
              as="label"
              size="sm"
              weight="medium"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Project Name
            </Text>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              disabled={creating}
            />
          </div>
          <div>
            <Text
              as="label"
              size="sm"
              weight="medium"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Team
            </Text>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              disabled={creating}
            >
              <option value="">Select a team</option>
              {(teams ?? []).map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Select>
          </div>
        </Stack>
      </Modal>
    </Stack>
  )
}
