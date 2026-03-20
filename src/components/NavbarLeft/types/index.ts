import type { ApiWorkspace } from '../../../api/client'

export type NavbarLeftProps = {
  workspaces: ApiWorkspace[]
  currentWorkspace: ApiWorkspace | null
  onSelectWorkspace: (ws: ApiWorkspace) => void
}

export type NavbarRightProps = {
  workspaceId: string
}
