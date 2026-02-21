import { useState } from 'react'
import styled from 'styled-components'
import {
  Text,
  IconButton,
  Stack,
  Flex,
  DateRange,
} from '@design-system'
import {
  ChevronDown,
  Plus,
  UserPlus,
  Users,
  Building2,
  Tag,
  Circle,
  CircleDot,
  CheckCircle2,
  PauseCircle,
} from 'lucide-react'
import { StatusSelector, type StatusOption } from './StatusSelector'
import { PrioritySelector } from './PrioritySelector'
import { SectionHeader, CollapsibleContent } from './CollapsibleSection'

const projectStatusOptions: StatusOption[] = [
  { id: 'planned', label: 'Planned', icon: <Circle size={16} /> },
  { id: 'in_progress', label: 'In Progress', icon: <CircleDot size={16} style={{ color: 'var(--status-in-progress, #F59E0B)' }} /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={16} style={{ color: 'var(--status-done, #8B5CF6)' }} /> },
  { id: 'on_hold', label: 'On hold', icon: <PauseCircle size={16} style={{ color: 'var(--text-muted, #64748b)' }} /> },
]

const Row = styled.div<{ $alignTop?: boolean }>`
  display: flex;
  align-items: ${(p) => (p.$alignTop ? 'flex-start' : 'center')};
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  padding: ${(p) => p.theme.spacing[2]}px 0;
  font-size: 0.875rem;
  min-height: ${(p) => (p.$alignTop ? 'auto' : '36px')};
  .row-label {
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
    padding-top: ${(p) => (p.$alignTop ? p.theme.spacing[1] : 0)}px;
  }
  .row-value {
    color: ${(p) => p.theme.colors.text};
    display: flex;
    align-items: center;
    gap: ${(p) => p.theme.spacing[1]}px;
  }
  .row-value-date-range {
    align-items: flex-start;
    min-width: 140px;
  }
  .row-icon {
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
`

type Props = {
  defaultOpen?: boolean
  /** When true, render only the content (no header). Use when embedding in Tree. */
  contentOnly?: boolean
}

export function PropertiesSection({ defaultOpen = true, contentOnly = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [status, setStatus] = useState('planned')
  const [priority, setPriority] = useState('high')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const content = (
    <>
      <Row>
        <span className="row-label">Status</span>
        <span className="row-value">
          <StatusSelector
            value={status}
            onChange={setStatus}
            placeholder="Status"
            options={projectStatusOptions}
          />
        </span>
      </Row>
      <Row>
        <span className="row-label">Priority</span>
        <span className="row-value">
          <PrioritySelector
            value={priority}
            onChange={setPriority}
            placeholder="Priority"
          />
        </span>
      </Row>
      <Row>
        <span className="row-label">Lead</span>
        <span className="row-value">
          <UserPlus size={14} className="row-icon" />
          <Text size="sm" muted>Add lead</Text>
        </span>
      </Row>
      <Row>
        <span className="row-label">Members</span>
        <span className="row-value">
          <Users size={14} className="row-icon" />
          <Text size="sm" muted>Add members</Text>
        </span>
      </Row>
      <Row $alignTop>
        <span className="row-label">Dates</span>
        <span className="row-value row-value-date-range">
          <DateRange
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
            startPlaceholder="Start"
            endPlaceholder="Target"
          />
        </span>
      </Row>
      <Row>
        <span className="row-label">Teams</span>
        <span className="row-value">
          <Building2 size={14} className="row-icon" />
          <Text size="sm" muted>Add team</Text>
        </span>
      </Row>
      <Row>
        <span className="row-label">Labels</span>
        <span className="row-value">
          <Tag size={14} className="row-icon" />
          <Text size="sm" muted>Add label</Text>
        </span>
      </Row>
    </>
  )

  if (contentOnly) return <Stack gap={0}>{content}</Stack>

  return (
    <Stack gap={0}>
      <SectionHeader type="button" onClick={() => setOpen((o) => !o)}>
        <Flex align="center" gap={2}>
          <ChevronDown
            size={16}
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
          <span>Properties</span>
        </Flex>
        <IconButton aria-label="Add property">
          <Plus size={16} />
        </IconButton>
      </SectionHeader>
      <CollapsibleContent $open={open}>{content}</CollapsibleContent>
    </Stack>
  )
}
