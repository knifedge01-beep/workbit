import styled from 'styled-components'

export const Row = styled.div<{ $alignTop?: boolean }>`
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
