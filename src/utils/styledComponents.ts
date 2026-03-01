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
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #f3f4f6;
    color: #111827;
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
  border: 1px solid #e6e8eb;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: #f9fafb;
    border-color: #6b7280;
    color: #111827;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: #e6e8eb;
  margin: 0 4px;
`

export const Section = styled.div<{ spacing?: number }>`
  margin-bottom: ${(p) => p.spacing ?? 32}px;
`

export const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px;
`

export const Breadcrumb = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
  span {
    color: #111827;
    font-weight: 500;
  }
`
