import styled from 'styled-components'

export const Wrap = styled.section`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`

export const SearchRow = styled.div`
  padding: 10px 12px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

export const Head = styled.div`
  display: grid;
  grid-template-columns: minmax(380px, 1fr) 120px 120px;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceSecondary};

  @media (max-width: 980px) {
    grid-template-columns: minmax(280px, 1fr) 110px 100px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`

export const HeadCol = styled.div`
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.textMuted};
`

export const TreeList = styled.div`
  display: flex;
  flex-direction: column;
`

export const TreeNode = styled.div<{ $depth: number }>`
  position: relative;
  margin-left: ${(p) => p.$depth * 18}px;
  padding-left: ${(p) => (p.$depth > 0 ? '12px' : '0')};
  border-top: 1px solid ${(p) => p.theme.colors.border};

  ${(p) =>
    p.$depth > 0 &&
    `
      border-left: 1px solid ${p.theme.colors.border};
    `}
`

export const NodeCard = styled.div<{ $expanded: boolean }>`
  border-radius: 0;
  background: ${(p) =>
    p.$expanded ? p.theme.colors.surfaceSecondary : p.theme.colors.surface};
  transition: background 0.15s ease;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceSecondary};
  }
`

export const NodeHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(380px, 1fr) 120px 120px;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;

  @media (max-width: 980px) {
    grid-template-columns: minmax(280px, 1fr) 110px 100px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`

export const LeftMain = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const ExpandToggle = styled.button<{ $open: boolean }>`
  border: none;
  background: transparent;
  padding: 0;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    transform: ${(p) => (p.$open ? 'rotate(90deg)' : 'rotate(0deg)')};
    transition: transform 0.15s ease;
  }
`

export const NodeBody = styled.div`
  min-width: 0;
  flex: 1;
`

export const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const Author = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

export const MessagePreview = styled.span`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StatusCol = styled.div`
  display: flex;
  align-items: center;
`

export const TimeCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`

export const TimeText = styled.span`
  font-size: 0.78rem;
  color: ${(p) => p.theme.colors.textMuted};
`

export const CommentMeta = styled.span`
  font-size: 0.76rem;
  color: ${(p) => p.theme.colors.primary};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

export const Collapsible = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${(p) => (p.$open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.18s ease;
`

export const CollapsibleInner = styled.div`
  overflow: hidden;
`

export const NodeContent = styled.div`
  margin: 0;
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.5;

  .wmde-markdown {
    padding: 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`

export const ExpandedBody = styled.div`
  padding: 0 12px 12px 40px;
`

export const ActionRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const ActionButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    color: ${(p) => p.theme.colors.text};
  }
`

export const ReactionsRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

export const ReactionButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  border-radius: 999px;
  font-size: 0.75rem;
  padding: 4px 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceSecondary};
  }
`

export const Composer = styled.form`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const ComposerAvatar = styled.div`
  flex-shrink: 0;
`

export const ComposerInput = styled.textarea`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.82rem;
  line-height: 1.4;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  resize: vertical;
  min-height: 40px;
`

export const ChildrenWrap = styled.div`
  margin-top: 10px;
  border-left: 1px solid ${(p) => p.theme.colors.border};
  padding-left: 8px;
`
