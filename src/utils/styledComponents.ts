import styled from 'styled-components'

/**
 * Common styled component utilities
 */

export const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    border-color: ${(p) => p.theme.colors.textMuted};
    color: ${(p) => p.theme.colors.text};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${(p) => p.theme.colors.border};
  margin: 0 4px;
`

export const Section = styled.div<{ spacing?: number }>`
  margin-bottom: ${(p) => p.spacing ?? 32}px;
`

export const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 12px;
`

export const Breadcrumb = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 24px;
  span {
    color: ${(p) => p.theme.colors.text};
    font-weight: 500;
  }
`
