import styled from 'styled-components'

type ToggleSize = 'large' | 'medium' | 'small'

const Group = styled.div<{ $size: ToggleSize }>`
  display: inline-flex;
  gap: 0;
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.colors.border};
`

const Segment = styled.button<{ $selected: boolean; $size: ToggleSize }>`
  padding: ${(p) =>
    p.$size === 'large'
      ? `${p.theme.spacing[2]}px ${p.theme.spacing[4]}px`
      : p.$size === 'medium'
        ? `${p.theme.spacing[2]}px ${p.theme.spacing[3]}px`
        : `${p.theme.spacing[1]}px ${p.theme.spacing[2]}px`};
  font-size: ${(p) =>
    p.$size === 'large' ? '1rem' : p.$size === 'medium' ? '0.875rem' : '0.8125rem'};
  font-weight: 500;
  color: ${(p) => (p.$selected ? p.theme.colors.primary : p.theme.colors.text)};
  background: ${(p) => p.theme.colors.surface};
  border: none;
  border-right: 1px solid ${(p) => p.theme.colors.border};
  cursor: pointer;
  ${(p) =>
    p.$selected &&
    `border: 1px solid ${p.theme.colors.primary}; box-shadow: inset 0 0 0 1px ${p.theme.colors.primary};`}
  &:last-child {
    border-right: none;
  }
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`

export type AdvancedToggleOption = { id: string; label: string }

type Props = {
  options: AdvancedToggleOption[]
  value: string
  onChange: (id: string) => void
  size?: ToggleSize
  className?: string
}

export function AdvancedToggle({
  options,
  value,
  onChange,
  size = 'medium',
  className,
}: Props) {
  return (
    <Group $size={size} className={className}>
      {options.map((opt) => (
        <Segment
          key={opt.id}
          type="button"
          $selected={value === opt.id}
          $size={size}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </Segment>
      ))}
    </Group>
  )
}
