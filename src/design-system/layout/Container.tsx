import styled from 'styled-components'

const StyledContainer = styled.div<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${(p) => p.$maxWidth ?? '1200px'};
  margin-left: auto;
  margin-right: auto;
  padding-left: ${(p) => p.theme.spacing[4]}px;
  padding-right: ${(p) => p.theme.spacing[4]}px;
`

type Props = {
  maxWidth?: string
  children: React.ReactNode
  className?: string
}

export function Container({ maxWidth, children, className }: Props) {
  return (
    <StyledContainer $maxWidth={maxWidth} className={className}>
      {children}
    </StyledContainer>
  )
}
