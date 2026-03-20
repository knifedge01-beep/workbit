import type { WorkspaceViewApiItem, WorkspaceViewRow } from '../types'

export function toWorkspaceViewRows(
  data: WorkspaceViewApiItem[]
): WorkspaceViewRow[] {
  return data.map((view) => ({
    id: view.id,
    name: view.name,
    type: view.type,
    owner: view.owner?.name ?? '',
  }))
}
