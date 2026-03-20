import styled from 'styled-components'
import { PrioritySelector, StatusSelector } from '../../../components'

export const TableWrap = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

export const HeadRow = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 2fr) 110px 120px 120px 92px;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 500;
`

export const DataRow = styled.div`
  width: 100%;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px;
  cursor: pointer;
  text-align: left;
  display: grid;
  grid-template-columns: minmax(320px, 2fr) 110px 120px 120px 92px;
  gap: ${(p) => p.theme.spacing[2]}px;
  align-items: center;
  min-height: 46px;
  transition: background 0.12s ease;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

export const NameCol = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
`

export const IssueId = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.75rem;
  flex-shrink: 0;
`

export const IssueTitle = styled.span`
  color: ${(p) => p.theme.colors.text};
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const MetaText = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const PriorityInline = styled(PrioritySelector)`
  min-width: 0;

  button {
    height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    gap: 6px;
    transition: background 0.12s ease;
  }

  button:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

export const StatusInline = styled(StatusSelector)`
  min-width: 0;

  button {
    height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    gap: 6px;
    transition: background 0.12s ease;
  }

  button:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`
