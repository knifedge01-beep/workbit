import { Dropdown } from '@thedatablitz/dropdown'
import { StatusSelector } from '../StatusSelector'
import { PrioritySelector } from '../PrioritySelector'
import { Inline } from '@thedatablitz/inline'
import { Box } from '@thedatablitz/box'

type Option = {
  value: string
  label: string
}

export type IssuePropertiesProps = {
  status: string
  onStatusChange: (value: string) => void | Promise<void>
  priority: string
  onPriorityChange: (value: string) => void
  assigneeValue: string
  assigneeOptions: Option[]
  onAssigneeChange: (value: string) => void | Promise<void>
  projectValue: string
  projectOptions: Option[]
  onProjectChange: (value: string) => void | Promise<void>
}

export function IssueProperties({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  assigneeValue,
  assigneeOptions,
  onAssigneeChange,
  projectValue,
  projectOptions,
  onProjectChange,
}: IssuePropertiesProps) {
  return (
    <Box>
      <Inline wrap={false}>
        <StatusSelector value={status} onChange={onStatusChange} />

        <PrioritySelector value={priority} onChange={onPriorityChange} />

        <Dropdown
          value={assigneeValue}
          onChange={onAssigneeChange}
          options={assigneeOptions}
          size="medium"
          placeholder="No assignee"
        />

        <Dropdown
          value={projectValue}
          onChange={onProjectChange}
          options={projectOptions}
          placeholder="No project"
          size="medium"
        />
      </Inline>
    </Box>
  )
}
