import styled from 'styled-components'

export const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[2]}px;
`

export const Label = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textMuted};
`
