import styled from 'styled-components'

const StyledStack = styled.div<{
  $direction?: 'vertical' | 'horizontal'
  $gap?: number
}>`
  display: flex;
  flex-direction: ${(p) => (p.$direction === 'horizontal' ? 'row' : 'column')};
  gap: ${(p) => (p.$gap != null ? p.theme.spacing[p.$gap] ?? p.$gap : p.theme.spacing[2])}px;
`

type Props = {
  direction?: 'vertical' | 'horizontal'
  gap?: number
  children: React.ReactNode
  className?: string
}

export function Stack({
  direction = 'vertical',
  gap,
  children,
  className,
}: Props) {
  return (
    <StyledStack $direction={direction} $gap={gap} className={className}>
      {children}
    </StyledStack>
  )
}
