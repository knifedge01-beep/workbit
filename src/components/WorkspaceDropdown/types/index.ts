import type { ApiWorkspace } from '../../../api/client'

export type WorkspaceDropdownProps = {
  workspaces: ApiWorkspace[]
  selectedWorkspace: ApiWorkspace | null
  onSelect: (ws: ApiWorkspace) => void
}
