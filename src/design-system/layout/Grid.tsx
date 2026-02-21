import styled from 'styled-components'

const StyledGrid = styled.div<{
  $columns?: number | string
  $gap?: number
}>`
  display: grid;
  grid-template-columns: ${(p) =>
    typeof p.$columns === 'string' ? p.$columns : `repeat(${p.$columns ?? 1}, 1fr)`};
  gap: ${(p) => (p.$gap != null ? p.theme.spacing[p.$gap] ?? p.$gap : p.theme.spacing[2])}px;
`

type Props = {
  columns?: number | string
  gap?: number
  children: React.ReactNode
  className?: string
}

export function Grid({ columns, gap, children, className }: Props) {
  return (
    <StyledGrid $columns={columns} $gap={gap} className={className}>
      {children}
    </StyledGrid>
  )
}
