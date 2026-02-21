import styled from 'styled-components'

const StyledCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  padding: ${(p) => p.theme.spacing[3]}px;
`

type Props = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: Props) {
  return <StyledCard className={className}>{children}</StyledCard>
}
