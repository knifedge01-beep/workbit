import { Text } from '@design-system'

import type { TeamProjectColumnDef, TeamProjectRow } from '../types'

type WorkspaceProject = {
  id: string
  name: string
  status: string
  team: {
    id: string
  }
}

export function createColumns(): TeamProjectColumnDef[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Project',
      enableSorting: true,
      meta: { flex: 1.5 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.name}
        </Text>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.status}
        </Text>
      ),
    },
  ]
}

export function toTeamProjects(
  workspaceProjects: WorkspaceProject[],
  teamId?: string
): TeamProjectRow[] {
  if (!teamId) return []

  return workspaceProjects
    .filter((project) => project.team.id === teamId)
    .map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
    }))
}

export function getTeamProjectPath(
  workspaceId: string,
  teamId: string,
  projectId: string
): string {
  return `/workspace/${workspaceId}/team/${teamId}/projects/${projectId}`
}

export function getNewTeamProjectPath(
  workspaceId: string,
  teamId: string
): string {
  return `/workspace/${workspaceId}/team/${teamId}/projects/new`
}
