import styled from 'styled-components'

type BadgeVariant = 'light' | 'solid'
type BadgeSize = 'medium' | 'small'
type BadgeColor = 'blue' | 'grey' | 'green' | 'red' | 'orange'

const sizeStyles = {
  medium: (p: { theme: { spacing: readonly number[]; radii?: { sm: number } } }) => `
    padding: 4px ${p.theme.spacing[2]}px;
    font-size: 0.875rem;
    border-radius: ${p.theme.radii?.sm ?? 4}px;
  `,
  small: (p: { theme: { spacing: readonly number[]; radii?: { sm: number } } }) => `
    padding: 2px ${p.theme.spacing[1]}px;
    font-size: 0.75rem;
    border-radius: ${p.theme.radii?.sm ?? 4}px;
  `,
}

const StyledBadge = styled.span<{
  $variant: BadgeVariant
  $size: BadgeSize
  $color: BadgeColor
}>`
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  ${(p) => sizeStyles[p.$size](p)}
  ${(p) => {
    const badge = p.theme.colors.badge
    if (!badge) {
      return p.$variant === 'solid'
        ? `background: ${p.theme.colors.primary}; color: white; border: none;`
        : `background: ${p.theme.colors.surfaceHover}; color: ${p.theme.colors.text}; border: 1px solid ${p.theme.colors.border};`
    }
    if (p.$variant === 'solid') {
      const bg = badge.solid[p.$color]
      return `background: ${bg}; color: #FFFFFF; border: none;`
    }
    const { bg, border } = badge.light[p.$color]
    return `background: ${bg}; border: 1px solid ${border}; color: #333333;`
  }};
`

type Props = {
  /** 'primary' = solid blue (legacy); 'default' = light grey (legacy) */
  variant?: BadgeVariant | 'primary' | 'default'
  size?: BadgeSize
  color?: BadgeColor
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = 'light',
  size = 'medium',
  color = 'blue',
  children,
  className,
}: Props) {
  const v: BadgeVariant = variant === 'primary' ? 'solid' : variant === 'default' ? 'light' : variant
  const c: BadgeColor = variant === 'default' ? 'grey' : color
  return (
    <StyledBadge $variant={v} $size={size} $color={c} className={className}>
      {children}
    </StyledBadge>
  )
}
