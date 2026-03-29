import { Plus } from 'lucide-react'

import { Box } from '@thedatablitz/box'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { Accordion } from '@thedatablitz/accordion'

import type { MilestonesSectionProps } from './types'
import { DEFAULT_MILESTONES } from './utils/defaultMilestones'
import { getMilestonePercent } from './utils/getMilestonePercent'
import { Button } from '@thedatablitz/button'

export type { MilestoneItem } from './types'

export function MilestonesSection({
  milestones = DEFAULT_MILESTONES,
  defaultOpen = true,
  contentOnly = false,
  onAdd,
}: MilestonesSectionProps) {
  const content = (
    <Stack gap="0" fullWidth>
      {milestones.map((milestone) => {
        const pct = getMilestonePercent(milestone.progress, milestone.total)

        return (
          <Box
            key={milestone.id}
            fullWidth
            padding="100"
            className="border-b border-border"
          >
            <Inline align="center" gap="100" fullWidth>
              <Text variant="body3" truncate style={{ flex: 1, minWidth: 0 }}>
                {milestone.name}
              </Text>

              <Box
                inline
                className="w-[120px] h-1.5 rounded-full overflow-hidden bg-muted"
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    borderRadius: 9999,
                    background: 'var(--color-background-brand)',
                    transition: 'width 0.5s ease-out',
                  }}
                />
              </Box>

              <Text
                variant="caption2"
                color="color.text.subtle"
                style={{ minWidth: 28, textAlign: 'right' }}
              >
                {pct}%
              </Text>

              <Text
                variant="caption2"
                color="color.text.subtle"
                style={{ minWidth: 44, textAlign: 'right' }}
              >
                {milestone.targetDate}
              </Text>
            </Inline>
          </Box>
        )
      })}
    </Stack>
  )

  if (contentOnly) return content

  return (
    <Accordion
      defaultExpandedIds={defaultOpen ? ['milestones'] : []}
      size="large"
      variant="primary"
      items={[
        {
          id: 'milestones',
          title: (
            <Inline align="center" justify="space-between" fullWidth>
              <Text variant="body2">Milestones ({milestones.length})</Text>
              <Button
                buttonType="icon"
                size="small"
                icon={<Plus size={14} />}
                onClick={(e) => {
                  e.stopPropagation()
                  onAdd?.()
                }}
                aria-label="Add milestone"
              />
            </Inline>
          ),
          content: <Stack gap="100">{content}</Stack>,
        },
      ]}
    />
  )
}
