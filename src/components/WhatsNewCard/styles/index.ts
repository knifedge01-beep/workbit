import styled from 'styled-components'

import { Card } from '@design-system'

export const StyledCard = styled(Card)`
  background: transparent;
  border: 1px solid ${(p) => p.theme.colors.border};
  padding: ${(p) => p.theme.spacing[3]}px;
  opacity: 0.95;

  &:hover {
    opacity: 1;
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`
