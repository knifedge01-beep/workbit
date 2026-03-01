import styled from 'styled-components'

const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

type Props = {
  'aria-label': string
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function IconButton({
  'aria-label': ariaLabel,
  onClick,
  disabled,
  children,
  className,
}: Props) {
  return (
    <StyledIconButton
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </StyledIconButton>
  )
}
