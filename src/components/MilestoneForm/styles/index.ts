import styled from 'styled-components'

import { Avatar, Input, Label } from '@design-system'

export const DatePickerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]}px;
  min-width: 180px;
`

export const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background: ${(p) => p.theme.colors.border};
  margin: 0 ${(p) => p.theme.spacing[1]}px;
`

export const MutedLabel = styled(Label)`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 0;
`

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  flex-wrap: wrap;
  min-width: 0;
`

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  min-width: 0;
  flex: 1;
`

export const DataGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  flex-shrink: 0;
`

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  margin-top: ${(p) => p.theme.spacing[3]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  flex-shrink: 0;
  border-radius: 0 0 ${(p) => p.theme.radii?.md ?? 6}px
    ${(p) => p.theme.radii?.md ?? 6}px;
`

export const ChatAvatar = styled(Avatar)`
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.primary};
  color: white;
`

export const InputWrap = styled.div`
  flex: 1;
  min-width: 0;
`

export const StyledInput = styled(Input)`
  width: 100%;
`

export const ResourceWrap = styled.div`
  flex-shrink: 0;
`

export const SendButton = styled.button`
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

export const SummaryDot = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.875rem;
  margin: 0 2px;
`
