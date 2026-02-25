import styled from 'styled-components'

const StyledNavbar = styled.nav<{ $variant: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 ${(p) => p.theme.spacing[3]}px;
  background: ${(p) =>
    p.$variant === 'dark' ? p.theme.colors.navDarkBg : p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const Left = styled.div<{ $variant: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[3]}px;
  color: ${(p) => (p.$variant === 'dark' ? '#FFFFFF' : 'inherit')};
  flex: 1;
  a {
    color: inherit;
  }
`

const Center = styled.div<{ $variant: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(p) => (p.$variant === 'dark' ? '#FFFFFF' : 'inherit')};
  font-weight: 500;
  font-size: 14px;
`

const Right = styled.div<{ $variant: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing[2]}px;
  color: ${(p) => (p.$variant === 'dark' ? '#FFFFFF' : 'inherit')};
  flex: 1;
`

type Props = {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
  children?: React.ReactNode
  /** White (default) or dark (#2C3042) background */
  variant?: 'light' | 'dark'
  className?: string
}

export function Navbar({
  left,
  center,
  right,
  children,
  variant = 'light',
  className,
}: Props) {
  return (
    <StyledNavbar className={className} $variant={variant}>
      {(left ?? children) != null && (
        <Left $variant={variant}>{left ?? children}</Left>
      )}
      {center != null && <Center $variant={variant}>{center}</Center>}
      {right != null && <Right $variant={variant}>{right}</Right>}
    </StyledNavbar>
  )
}
