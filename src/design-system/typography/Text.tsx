import styled from 'styled-components'

const sizeMap = { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem', lg: '1rem' } as const

const StyledText = styled.p<{ $size: keyof typeof sizeMap; $muted?: boolean }>`
  margin: 0;
  line-height: 1.5;
  font-size: ${(p) => sizeMap[p.$size]};
  color: ${(p) => (p.$muted ? p.theme.colors.textMuted : p.theme.colors.text)};
`

type Props = {
  size?: keyof typeof sizeMap
  muted?: boolean
  as?: 'p' | 'span' | 'div'
  children: React.ReactNode
  className?: string
}

export function Text({
  size = 'md',
  muted = false,
  as = 'p',
  children,
  className,
}: Props) {
  return (
    <StyledText $size={size} $muted={muted} as={as} className={className}>
      {children}
    </StyledText>
  )
}
