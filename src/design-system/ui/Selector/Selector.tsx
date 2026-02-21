import styled from 'styled-components'

type SelectorSize = 'large' | 'medium' | 'small'

const Group = styled.div<{ $size: SelectorSize }>`
  display: inline-flex;
  gap: 0;
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.colors.border};
`

const Segment = styled.button<{
  $selected: boolean
  $disabled: boolean
  $size: SelectorSize
}>`
  padding: ${(p) =>
    p.$size === 'large'
      ? `${p.theme.spacing[2]}px ${p.theme.spacing[4]}px`
      : p.$size === 'medium'
        ? `${p.theme.spacing[2]}px ${p.theme.spacing[3]}px`
        : `${p.theme.spacing[1]}px ${p.theme.spacing[2]}px`};
  font-size: ${(p) =>
    p.$size === 'large' ? '1rem' : p.$size === 'medium' ? '0.875rem' : '0.8125rem'};
  font-weight: 500;
  color: ${(p) =>
    p.$selected ? '#FFFFFF' : p.$disabled ? p.theme.colors.textMuted : p.theme.colors.text};
  background: ${(p) =>
    p.$selected
      ? p.theme.colors.primary
      : p.$disabled
        ? p.theme.colors.surfaceHover
        : p.theme.colors.surface};
  border: none;
  border-right: 1px solid ${(p) => p.theme.colors.border};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  &:last-child {
    border-right: none;
  }
  &:hover:not(:disabled) {
    background: ${(p) =>
      p.$selected ? p.theme.colors.primaryHover : p.theme.colors.infoBg ?? '#E0F2FE'};
    color: ${(p) => (p.$selected ? '#FFFFFF' : p.theme.colors.primary)};
  }
  &:disabled {
    opacity: 0.8;
  }
`

export type SelectorOption = { id: string; label: string; disabled?: boolean }

type Props = {
  options: SelectorOption[]
  value: string
  onChange: (id: string) => void
  size?: SelectorSize
  className?: string
}

export function Selector({
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
          $disabled={opt.disabled ?? false}
          $size={size}
          disabled={opt.disabled}
          onClick={() => !opt.disabled && onChange(opt.id)}
        >
          {opt.label}
        </Segment>
      ))}
    </Group>
  )
}
