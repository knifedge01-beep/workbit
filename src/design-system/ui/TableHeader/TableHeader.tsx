import styled from 'styled-components'

const Row = styled.div<{ $variant: 'light' | 'solid' }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[4]}px;
  padding: ${(p) => p.theme.spacing[2]}px 0;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 400;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  ${(p) =>
    p.$variant === 'solid' &&
    `
    background: #F5F5F5;
    padding: ${p.theme.spacing[2]}px ${p.theme.spacing[3]}px;
    border-radius: ${p.theme.radii?.sm ?? 4}px;
    border-bottom: none;
    color: #424242;
  `}
`

type Props = {
  columns: string[]
  variant?: 'light' | 'solid'
  className?: string
}

export function TableHeader({
  columns,
  variant = 'light',
  className,
}: Props) {
  return (
    <Row $variant={variant} className={className} role="row">
      {columns.map((col, i) => (
        <span key={i} style={{ flex: 1 }}>
          {col}
        </span>
      ))}
    </Row>
  )
}
