import styled from 'styled-components'
import { Tree } from '@design-system'
import type { TreeNode } from '@design-system'
import { PropertiesSection } from './PropertiesSection'
import { MilestonesSection } from './MilestonesSection'
import { ActivitySection } from './ActivitySection'

const PanelContent = styled.div`
  padding: ${(p) => p.theme.spacing[2]}px 0;
`

type Props = {
  /** Optional milestone list override. */
  milestones?: React.ComponentProps<typeof MilestonesSection>['milestones']
  /** Optional activity list override. */
  activity?: React.ComponentProps<typeof ActivitySection>['items']
}

export function ProjectStatusPanel({ milestones, activity }: Props) {
  const nodes: TreeNode[] = [
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

  return (
    <PanelContent>
      <Tree
        nodes={nodes}
        defaultExpandedIds={['properties', 'milestones', 'activity']}
      />
    </PanelContent>
  )
}
