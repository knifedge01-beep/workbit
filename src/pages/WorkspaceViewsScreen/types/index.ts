import type { ViewTableRow } from '../../components'

export type WorkspaceViewApiItem = {
  id: string
  name: string
  type: string
  owner?: {
    name?: string | null
  } | null
}

export type WorkspaceViewRow = ViewTableRow
