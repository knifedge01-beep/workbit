export const spacing = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64] as const
export type SpacingScale = (typeof spacing)[number]

export const spacingPx = spacing.map((n) => `${n}px`) as unknown as readonly [
  '0px',
  '2px',
  '4px',
  '6px',
  '8px',
  '10px',
  '12px',
  '16px',
  '20px',
  '24px',
  '32px',
  '40px',
  '48px',
  '64px',
]

export function getSpacing(index: number): string {
  return spacing[index] != null ? `${spacing[index]}px` : '0px'
}
