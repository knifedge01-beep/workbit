import styled from 'styled-components'

type Level = 1 | 2 | 3 | 4 | 5 | 6

const StyledHeading = styled.h1<{ $level: Level }>`
  margin: 0;
  line-height: 1.25;
  font-weight: ${(p) => (p.$level === 1 ? 600 : 500)};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => {
    const sizes: Record<Level, string> = {
      1: '20px',
      2: '16px',
      3: '14px',
      4: '14px',
      5: '12px',
      6: '12px',
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
