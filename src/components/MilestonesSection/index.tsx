import { useState } from 'react'
import { ChevronDown, Plus, MoreHorizontal } from 'lucide-react'

import { Text, IconButton, Flex, Menu } from '@design-system'

import { SectionHeader, CollapsibleContent } from '../CollapsibleSection'
import { MILESTONE_MENU_ITEMS } from '../milestoneMenuItems'
import {
  MilestoneList,
  MilestoneRow,
  MilestoneName,
  ProgressTrack,
  ProgressFill,
  ProgressLabel,
  DueDate,
  MsActions,
} from './styles'
import type { MilestonesSectionProps } from './types'
import { DEFAULT_MILESTONES } from './utils/defaultMilestones'
import { getMilestonePercent } from './utils/getMilestonePercent'

export type { MilestoneItem } from './types'

export function MilestonesSection({
  milestones = DEFAULT_MILESTONES,
  defaultOpen = true,
  contentOnly = false,
  onAdd,
}: MilestonesSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  const content = (
    <MilestoneList>
      {milestones.map((milestone, i) => {
        const pct = getMilestonePercent(milestone.progress, milestone.total)

        return (
          <MilestoneRow
            key={milestone.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.06 }}
          >
            <MilestoneName>{milestone.name}</MilestoneName>
            <ProgressTrack>
              <ProgressFill
                initial={{ width: '0%' }}
                animate={{ width: `${pct}%` }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.06 + 0.1,
                  ease: 'easeOut',
                }}
              />
            </ProgressTrack>
            <ProgressLabel>{pct}%</ProgressLabel>
            <DueDate>{milestone.targetDate}</DueDate>
            <MsActions className="ms-actions">
              <Menu
                trigger={
                  <IconButton aria-label="More options">
                    <MoreHorizontal size={14} />
                  </IconButton>
                }
                items={MILESTONE_MENU_ITEMS}
              />
            </MsActions>
          </MilestoneRow>
        )
      })}
    </MilestoneList>
  )

  if (contentOnly) return content

  return (
    <div>
      <SectionHeader type="button" onClick={() => setOpen((o) => !o)}>
        <Flex align="center" gap={2}>
          <ChevronDown
            size={14}
            style={{
              transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Milestones</span>
          <Text size="xs" muted as="span">
            ({milestones.length})
          </Text>
        </Flex>
        <IconButton aria-label="Add milestone" onClick={onAdd}>
          <Plus size={14} />
        </IconButton>
      </SectionHeader>
      <CollapsibleContent $open={open} $maxHeightWhenOpen={2000}>
        {content}
      </CollapsibleContent>
    </div>
  )
}
