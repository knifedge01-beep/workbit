import styled from 'styled-components'

const StyledFlex = styled.div<{
  $direction?: 'row' | 'column'
  $gap?: number
  $align?: string
  $justify?: string
  $wrap?: boolean
}>`
  display: flex;
  flex-direction: ${(p) => p.$direction ?? 'row'};
  gap: ${(p) => (p.$gap != null ? p.theme.spacing[p.$gap] ?? p.$gap : p.theme.spacing[2])}px;
  align-items: ${(p) => p.$align ?? 'stretch'};
  justify-content: ${(p) => p.$justify ?? 'flex-start'};
  flex-wrap: ${(p) => (p.$wrap ? 'wrap' : 'nowrap')};
`

type Props = {
  direction?: 'row' | 'column'
  gap?: number
  align?: string
  justify?: string
  wrap?: boolean
  children: React.ReactNode
  className?: string
}

export function Flex({
  direction,
  gap,
  align,
  justify,
  wrap,
  children,
  className,
}: Props) {
  return (
    <StyledFlex
      $direction={direction}
      $gap={gap}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      className={className}
    >
      {children}
    </StyledFlex>
  )
}
