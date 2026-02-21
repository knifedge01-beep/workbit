import styled from 'styled-components'

const StyledAvatar = styled.div<{ $size: number; $src?: string }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.surfaceHover};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => p.$size * 0.4}px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;
  flex-shrink: 0;
  ${(p) =>
    p.$src
      ? `background-image: url(${p.$src}); background-size: cover; background-position: center;`
      : ''}
`

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

type Props = {
  src?: string
  name?: string
  size?: number
  className?: string
}

export function Avatar({ src, name, size = 32, className }: Props) {
  return (
    <StyledAvatar $size={size} $src={src} className={className}>
      {!src && name != null ? getInitials(name) : null}
    </StyledAvatar>
  )
}
