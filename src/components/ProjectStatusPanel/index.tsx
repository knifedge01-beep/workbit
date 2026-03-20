import { Tree } from '@design-system'

import { PanelContent } from './styles'
import type { ProjectStatusPanelProps } from './types'
import { buildProjectStatusNodes } from './utils/buildProjectStatusNodes'

export function ProjectStatusPanel({
  milestones,
  activity,
}: ProjectStatusPanelProps) {
  const nodes = buildProjectStatusNodes({ milestones, activity })

  return (
    <PanelContent>
      <Tree
        nodes={nodes}
        defaultExpandedIds={['properties', 'milestones', 'activity']}
      />
    </PanelContent>
  )
}
