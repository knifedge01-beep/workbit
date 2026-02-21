import styled from 'styled-components'

type Level = 1 | 2 | 3 | 4 | 5 | 6

const StyledHeading = styled.h1<{ $level: Level }>`
  margin: 0;
  line-height: 1.25;
  font-weight: ${(p) => (p.$level === 1 ? 700 : 600)};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => {
    const sizes: Record<Level, string> = {
      1: '1.75rem',
      2: '1.25rem',
      3: '1.125rem',
      4: '1rem',
      5: '0.875rem',
      6: '0.8125rem',
    }
    return sizes[p.$level]
  }};
`

type Props = {
  level?: Level
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
  className?: string
}

export function Heading({ level = 1, as, children, className }: Props) {
  const tag = as ?? (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
  return (
    <StyledHeading $level={level} as={tag} className={className}>
      {children}
    </StyledHeading>
  )
}
