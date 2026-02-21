import 'styled-components'
import type { AppTheme } from '../colors/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
