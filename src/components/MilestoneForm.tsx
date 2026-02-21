import { useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  Text,
  Input,
  DatePicker,
  IconButton,
  Label,
  Menu,
  Avatar,
} from '@design-system'
import {
  Diamond,
  MoreHorizontal,
  GripVertical,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  Paperclip,
} from 'lucide-react'
import { ResourceSelector } from './ResourceSelector'
import { MILESTONE_MENU_ITEMS } from './milestoneMenuItems'

const DatePickerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]}px;
  min-width: 180px;
`

const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background: ${(p) => p.theme.colors.border};
  margin: 0 ${(p) => p.theme.spacing[1]}px;
`

const MutedLabel = styled(Label)`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 0;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  flex-wrap: wrap;
  min-width: 0;
`

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  min-width: 0;
  flex: 1;
`

const DataGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  flex-shrink: 0;
`

/* Chat-style input row: avatar, input, resource selector, send button */
const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  margin-top: ${(p) => p.theme.spacing[3]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  flex-shrink: 0;
  border-radius: 0 0 ${(p) => p.theme.radii?.md ?? 6}px ${(p) => p.theme.radii?.md ?? 6}px;
`

const ChatAvatar = styled(Avatar)`
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.primary};
  color: white;
`

const InputWrap = styled.div`
  flex: 1;
  min-width: 0;
`

const StyledInput = styled(Input)`
  width: 100%;
`

const ResourceWrap = styled.div`
  flex-shrink: 0;
`

const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: background 0.15s ease;
  flex-shrink: 0;
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryHover};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SummaryDot = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.875rem;
  margin: 0 2px;
`

const TARGET_DATE_PLACEHOLDER = 'Select target date'

function formatShortDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

type Props = {
  milestoneName?: string
  description?: string
  targetDate?: Date
  issueCount?: number
  defaultExpanded?: boolean
  /** Display name for the avatar in the description (chat-style) row. */
  currentUserName?: string
  onMilestoneNameChange?: (value: string) => void
  onDescriptionChange?: (value: string) => void
  onTargetDateChange?: (date: Date) => void
  onChooseFile?: () => void
  onCreateDocument?: () => void
  onAddLink?: () => void
}

export function MilestoneForm({
  milestoneName = '',
  description = '',
  targetDate,
  issueCount = 0,
  defaultExpanded = true,
  currentUserName = 'You',
  onMilestoneNameChange,
  onDescriptionChange,
  onTargetDateChange,
  onChooseFile,
  onCreateDocument,
  onAddLink,
}: Props) {
  const [name, setName] = useState(milestoneName)
  const [desc, setDesc] = useState(description)
  const [expanded, setExpanded] = useState(defaultExpanded)

  const progress = 0
  const dateLabel = targetDate ? formatShortDate(targetDate) : '—'

  return (
    <Card>
      <HeaderRow>
        <LeftGroup>
          <IconButton aria-label="Drag to reorder">
            <GripVertical size={18} />
          </IconButton>
          <Diamond size={20} style={{ color: 'var(--milestone-icon, #EAB308)', flexShrink: 0 }} />
          <Input
            variant="ghost"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              onMilestoneNameChange?.(e.target.value)
            }}
            placeholder="Milestone name"
          />
          <IconButton
            aria-label={expanded ? 'Collapse' : 'Expand'}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </IconButton>
        </LeftGroup>
        <DataGroup>
          {expanded ? (
            <>
              <DatePickerGroup>
                <MutedLabel>Set target date</MutedLabel>
                <DatePicker
                  value={targetDate}
                  onChange={(d) => onTargetDateChange?.(d)}
                  placeholder={TARGET_DATE_PLACEHOLDER}
                />
              </DatePickerGroup>
              <Divider aria-hidden />
              <Text size="sm" muted>
                {issueCount} Issues · {progress}%
              </Text>
            </>
          ) : (
            <Text size="sm" muted>
              {dateLabel}
              <SummaryDot>·</SummaryDot>
              {issueCount} issues
              <SummaryDot>·</SummaryDot>
              {progress}%
            </Text>
          )}
          <Menu
            trigger={
              <IconButton aria-label="More options">
                <MoreHorizontal size={18} />
              </IconButton>
            }
            items={MILESTONE_MENU_ITEMS}
          />
        </DataGroup>
      </HeaderRow>
      {expanded && (
        <InputRow>
          <ChatAvatar name={currentUserName} size={32} />
          <InputWrap>
            <StyledInput
              variant="default"
              placeholder="Add a description..."
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value)
                onDescriptionChange?.(e.target.value)
              }}
              aria-label="Milestone description"
            />
          </InputWrap>
          {(onChooseFile || onCreateDocument || onAddLink) && (
            <ResourceWrap>
              <ResourceSelector
                trigger={
                  <IconButton aria-label="Attach file or link">
                    <Paperclip size={18} />
                  </IconButton>
                }
                onChooseFile={onChooseFile}
                onCreateDocument={onCreateDocument}
                onAddLink={onAddLink}
              />
            </ResourceWrap>
          )}
          <SendButton
            type="button"
            disabled={!desc.trim()}
            aria-label="Save description"
            onClick={() => onDescriptionChange?.(desc.trim())}
          >
            <ArrowUp size={18} />
          </SendButton>
        </InputRow>
      )}
    </Card>
  )
}
