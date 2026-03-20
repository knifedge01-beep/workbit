import type { TreeNode } from '@design-system'

import { ActivitySection } from '../../ActivitySection'
import { MilestonesSection } from '../../MilestonesSection'
import { PropertiesSection } from '../../PropertiesSection'
import type { ProjectStatusPanelProps } from '../types'

export function buildProjectStatusNodes({
  milestones,
  activity,
}: ProjectStatusPanelProps): TreeNode[] {
  return [
    {
      id: 'properties',
      label: 'Properties',
      content: <PropertiesSection contentOnly />,
    },
    {
      id: 'milestones',
      label: 'Milestones',
      content: <MilestonesSection contentOnly milestones={milestones} />,
    },
    {
      id: 'activity',
      label: 'Activity',
      content: <ActivitySection contentOnly items={activity} />,
    },
  ]
}
