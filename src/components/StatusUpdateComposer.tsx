import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Activity, AlertTriangle, TrendingDown, Paperclip } from 'lucide-react'
import { Button, Menu, type MenuEntry, IconButton, EmojiSelector } from '@design-system'
import { ResourceSelector } from './ResourceSelector'

export type ProjectStatus = 'on-track' | 'at-risk' | 'off-track'

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; Icon: typeof Activity }
> = {
  'on-track': { label: 'On track', color: 'success', Icon: Activity },
  'at-risk': { label: 'At risk', color: 'warning', Icon: AlertTriangle },
  'off-track': { label: 'Off track', color: 'error', Icon: TrendingDown },
}

const Container = styled.div`
  --status-on-track: ${(p) => p.theme.colors.success};
  --status-at-risk: ${(p) => p.theme.colors.warning};
  --status-off-track: ${(p) => p.theme.colors.error};
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  /* Avoid overflow: hidden so the status Menu dropdown positions relative to its trigger, not this card */
  overflow: visible;
`

const StatusRow = styled.div`
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
`

const StatusPill = styled.button<{ $color: 'success' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  border-radius: 9999px;
  border: 1px solid ${(p) => p.theme.colors[p.$color]};
  background: transparent;
  color: ${(p) => p.theme.colors[p.$color]};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
  &:hover {
    opacity: 0.9;
  }
`

const TextAreaWrap = styled.div`
  padding: 0 ${(p) => p.theme.spacing[3]}px ${(p) => p.theme.spacing[2]}px;
`

const StyledTextarea = styled.textarea`
  width: 100%;
  font-size: 0.875rem;
  padding: ${(p) => p.theme.spacing[2]}px 0;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${(p) => p.theme.colors.border};
  margin: 0;
`

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  flex-shrink: 0;
`

const ActionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
`

const ActionRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
`

type Props = {
  status?: ProjectStatus
  onStatusChange?: (status: ProjectStatus) => void
  placeholder?: string
  onPost?: (content: string, status: ProjectStatus) => void
  onCancel?: () => void
  onChooseFile?: () => void
  onCreateDocument?: () => void
  onAddLink?: () => void
  className?: string
}

export function StatusUpdateComposer({
  status: controlledStatus,
  onStatusChange,
  placeholder = 'Write a project update...',
  onPost,
  onCancel,
  onChooseFile,
  onCreateDocument,
  onAddLink,
  className,
}: Props) {
  const [internalStatus, setInternalStatus] = useState<ProjectStatus>('on-track')
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const status = controlledStatus ?? internalStatus
  const setStatus = (s: ProjectStatus) => {
    if (onStatusChange) onStatusChange(s)
    else setInternalStatus(s)
  }

  const config = STATUS_CONFIG[status]
  const StatusIcon = config.Icon

  const statusItems: MenuEntry[] = (['on-track', 'at-risk', 'off-track'] as const).map(
    (key) => {
      const c = STATUS_CONFIG[key]
      const Icon = c.Icon
      return {
        id: key,
        label: c.label,
        icon: <Icon size={16} style={{ color: `var(--status-${key})` } as React.CSSProperties} />,
        onClick: () => setStatus(key),
      }
    }
  )

  const handlePost = () => {
    const trimmed = draft.trim()
    if (!trimmed || !onPost) return
    onPost(trimmed, status)
    setDraft('')
  }

  return (
    <Container className={className}>
      <StatusRow>
        <Menu
          placement="right"
          trigger={
            <StatusPill $color={config.color as 'success' | 'warning' | 'error'}>
              <StatusIcon size={14} />
              {config.label}
            </StatusPill>
          }
          items={statusItems}
        />
      </StatusRow>

      <TextAreaWrap>
        <StyledTextarea
          ref={textareaRef}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Project update"
        />
      </TextAreaWrap>

      <Divider aria-hidden />

      <ActionBar>
        <ActionLeft>
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
          <EmojiSelector targetRef={textareaRef} placement="top" />
        </ActionLeft>
        <ActionRight>
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handlePost}
            disabled={!draft.trim()}
          >
            Post update
          </Button>
        </ActionRight>
      </ActionBar>
    </Container>
  )
}
