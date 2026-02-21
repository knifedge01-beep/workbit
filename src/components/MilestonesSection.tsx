import { useState } from 'react'
import styled from 'styled-components'
import { Text, IconButton, Stack, Flex, Menu } from '@design-system'
import { ChevronDown, Plus, Diamond, MoreHorizontal } from 'lucide-react'
import { MILESTONE_MENU_ITEMS } from './milestoneMenuItems'
import { SectionHeader, CollapsibleContent } from './CollapsibleSection'

const MilestoneRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px 0;
  min-height: 36px;
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
  /** When true, render only the content (no header). Use when embedding in Tree. */
  contentOnly?: boolean
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  { id: '1', name: 'test2', progress: 0, total: 0, targetDate: 'Feb 13' },
  { id: '2', name: 'test', progress: 0, total: 0, targetDate: 'Feb 26' },
]

export function MilestonesSection({
  milestones = DEFAULT_MILESTONES,
  defaultOpen = true,
  contentOnly = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  const content = (
    <Stack gap={0}>
      {milestones.map((m) => (
        <MilestoneRow key={m.id}>
          <Flex align="center" gap={2}>
            <Diamond size={16} style={{ color: 'var(--milestone-icon, #EAB308)', flexShrink: 0 }} />
            <Text size="sm">
              {m.name} {m.progress}% of {m.total}
            </Text>
          </Flex>
          <Flex align="center" gap={2}>
            <Text size="sm" muted>{m.targetDate}</Text>
            <Menu
              trigger={
                <IconButton aria-label="More options">
                  <MoreHorizontal size={16} />
                </IconButton>
              }
              items={MILESTONE_MENU_ITEMS}
            />
          </Flex>
        </MilestoneRow>
      ))}
    </Stack>
  )

  if (contentOnly) return content

  return (
    <Stack gap={0}>
      <SectionHeader type="button" onClick={() => setOpen((o) => !o)}>
        <Flex align="center" gap={2}>
          <ChevronDown
            size={16}
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
          <span>Milestones</span>
        </Flex>
        <IconButton aria-label="Add milestone">
          <Plus size={16} />
        </IconButton>
      </SectionHeader>
      <CollapsibleContent $open={open} $maxHeightWhenOpen={2000}>{content}</CollapsibleContent>
    </Stack>
  )
}
