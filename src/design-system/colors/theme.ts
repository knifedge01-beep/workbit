import { colorsLight, colorsDark } from './colors'
import { spacing } from '../spacing/spacing'

export const radii = { sm: 4, md: 6, lg: 8 } as const

export type AppTheme = {
  colors: typeof colorsLight
  spacing: readonly number[]
  radii: typeof radii
}

export const lightTheme: AppTheme = {
  colors: colorsLight,
  spacing: [...spacing],
  radii,
}

export const darkTheme: AppTheme = {
  colors: colorsDark,
  spacing: [...spacing],
  radii,
}
