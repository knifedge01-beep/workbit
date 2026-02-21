import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ArrowUp } from 'lucide-react'
import { Avatar } from '../Avatar'
import { Input } from '../Input'
import { ResourceSelector } from '../../../components/ResourceSelector'

export type ChatMessage = {
  id: string
  authorName: string
  authorAvatarSrc?: string
  timestamp: string
  content: string
}

export type ChatUser = {
  name: string
  avatarSrc?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: ${(p) => p.theme.colors.background};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  overflow: hidden;
`

const MessagesScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(p) => p.theme.spacing[3]}px;
  display: flex;
  flex-direction: column;
  gap: 0;
`

const MessageBlock = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing[2]}px;
  align-items: flex-start;
  padding: ${(p) => p.theme.spacing[2]}px 0;
`

const ChatAvatar = styled(Avatar)`
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.primary};
  color: white;
`

const MessageBody = styled.div`
  flex: 1;
  min-width: 0;
`

const MessageHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(p) => p.theme.spacing[1]}px;
  margin-bottom: ${(p) => p.theme.spacing[1]}px;
`

const AuthorName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
`

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
`

const MessageContent = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${(p) => p.theme.colors.border};
  margin: ${(p) => p.theme.spacing[1]}px 0;
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  flex-shrink: 0;
`

const ResourceSelectorWrap = styled.div`
  flex-shrink: 0;
  display: inline-flex;
  & > div {
    display: inline-flex;
    align-items: center;
  }
  & > div > span:first-of-type {
    display: none;
  }
`

const InputWrap = styled.div`
  flex: 1;
  min-width: 0;
`

const StyledInput = styled(Input)`
  width: 100%;
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
  &:hover {
    background: ${(p) => p.theme.colors.primaryHover};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

type Props = {
  messages: ChatMessage[]
  currentUser?: ChatUser
  placeholder?: string
  onSend?: (text: string) => void
  onChooseFile?: () => void
  onCreateDocument?: () => void
  onAddLink?: () => void
  className?: string
}

export function Chat({
  messages,
  currentUser,
  placeholder = 'Leave a reply...',
  onSend,
  onChooseFile,
  onCreateDocument,
  onAddLink,
  className,
}: Props) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed || !onSend) return
    onSend(trimmed)
    setDraft('')
  }

  const displayName = currentUser?.name ?? 'You'

  return (
    <Wrapper className={className}>
      <MessagesScroll ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={msg.id}>
            {i > 0 && <Divider aria-hidden />}
            <MessageBlock>
              <ChatAvatar
                name={msg.authorName}
                src={msg.authorAvatarSrc}
                size={32}
              />
              <MessageBody>
                <MessageHeader>
                  <AuthorName>{msg.authorName}</AuthorName>
                  <Timestamp>{msg.timestamp}</Timestamp>
                </MessageHeader>
                <MessageContent>{msg.content}</MessageContent>
              </MessageBody>
            </MessageBlock>
          </div>
        ))}
      </MessagesScroll>

      <form onSubmit={handleSubmit}>
        <InputRow>
          <ChatAvatar
            name={displayName}
            src={currentUser?.avatarSrc}
            size={32}
          />
          <InputWrap>
            <StyledInput
              variant="default"
              placeholder={placeholder}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Reply"
            />
          </InputWrap>
          {(onChooseFile || onCreateDocument || onAddLink) && (
            <ResourceSelectorWrap>
              <ResourceSelector
                label=""
                triggerLabel=""
                onChooseFile={onChooseFile}
                onCreateDocument={onCreateDocument}
                onAddLink={onAddLink}
              />
            </ResourceSelectorWrap>
          )}
          <SendButton
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
          >
            <ArrowUp size={18} />
          </SendButton>
        </InputRow>
      </form>
    </Wrapper>
  )
}
