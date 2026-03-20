import styled from 'styled-components'

import type { CollapsibleContentProps } from '../types'

export const SectionHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${(p) => p.theme.spacing[2]}px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  svg {
    flex-shrink: 0;
    color: ${(p) => p.theme.colors.textMuted};
  }
`

export const CollapsibleContent = styled.div<CollapsibleContentProps>`
  overflow: hidden;
  max-height: ${(p) => (p.$open ? `${p.$maxHeightWhenOpen ?? 800}px` : '0')};
  opacity: ${(p) => (p.$open ? 1 : 0)};
  transition:
    max-height 0.2s ease,
    opacity 0.2s ease;
`
