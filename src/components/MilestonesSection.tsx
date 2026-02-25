import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Text, IconButton, Flex, Menu } from '@design-system'
import { ChevronDown, Plus, MoreHorizontal } from 'lucide-react'
import { MILESTONE_MENU_ITEMS } from './milestoneMenuItems'
import { SectionHeader, CollapsibleContent } from './CollapsibleSection'

const MilestoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const MilestoneRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
  &:hover .ms-actions {
    opacity: 1;
  }
`

const MilestoneName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ProgressTrack = styled.div`
  flex: 1;
  max-width: 120px;
  height: 5px;
  background: ${(p) => p.theme.colors.border};
  border-radius: 9999px;
  overflow: hidden;
`

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${(p) => p.theme.colors.primary};
  border-radius: 9999px;
`

const ProgressLabel = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  min-width: 28px;
  text-align: right;
`

const DueDate = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  min-width: 44px;
  text-align: right;
`

const MsActions = styled.div`
  opacity: 0;
  transition: opacity 0.15s;
  display: flex;
  align-items: center;
`

export type MilestoneItem = {
  id: string
  name: string
  progress: number
  total: number
  targetDate: string
}

type Props = {
  milestones?: MilestoneItem[]
  defaultOpen?: boolean
  contentOnly?: boolean
  onAdd?: () => void
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  { id: '1', name: 'test2', progress: 0, total: 5, targetDate: 'Feb 13' },
  { id: '2', name: 'test', progress: 2, total: 8, targetDate: 'Feb 26' },
]

export function MilestonesSection({
  milestones = DEFAULT_MILESTONES,
  defaultOpen = true,
  contentOnly = false,
  onAdd,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  const content = (
    <MilestoneList>
      {milestones.map((m, i) => {
        const pct = m.total > 0 ? Math.round((m.progress / m.total) * 100) : 0
        return (
          <MilestoneRow
            key={m.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.06 }}
          >
            <MilestoneName>{m.name}</MilestoneName>
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
            <DueDate>{m.targetDate}</DueDate>
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
