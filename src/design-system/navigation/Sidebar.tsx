import styled from 'styled-components'

const StyledSidebar = styled.aside`
  width: 200px;
  min-width: 200px;
  background: ${(p) => p.theme.colors.surface};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  padding: ${(p) => p.theme.spacing[2]}px;
`

type Props = {
  children: React.ReactNode
  className?: string
}

export function Sidebar({ children, className }: Props) {
  return <StyledSidebar className={className}>{children}</StyledSidebar>
}
