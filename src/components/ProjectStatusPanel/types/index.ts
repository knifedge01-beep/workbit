import type { ActivitySection } from '../../ActivitySection'
import type { MilestonesSection } from '../../MilestonesSection'

export type ProjectStatusPanelProps = {
  /** Optional milestone list override. */
  milestones?: React.ComponentProps<typeof MilestonesSection>['milestones']
  /** Optional activity list override. */
  activity?: React.ComponentProps<typeof ActivitySection>['items']
}
