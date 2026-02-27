import styled from 'styled-components'

const StyledCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: ${(p) => p.theme.spacing[4]}px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition:
    box-shadow 0.2s,
    border-color 0.2s;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
`

type Props = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: Props) {
  return <StyledCard className={className}>{children}</StyledCard>
}
