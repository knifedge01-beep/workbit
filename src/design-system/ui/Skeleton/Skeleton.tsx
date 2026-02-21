import styled from 'styled-components'

const StyledSkeleton = styled.div<{ $width?: string; $height?: string }>`
  width: ${(p) => p.$width ?? '100%'};
  height: ${(p) => p.$height ?? '1em'};
  background: ${(p) => p.theme.colors.surfaceHover};
  border-radius: 4px;
  animation: skeleton-pulse 1.2s ease-in-out infinite;

  @keyframes skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`

type Props = {
  width?: string
  height?: string
  className?: string
}

export function Skeleton({ width, height, className }: Props) {
  return (
    <StyledSkeleton $width={width} $height={height} className={className} />
  )
}
