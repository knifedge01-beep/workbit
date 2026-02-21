import { Sun, Moon } from 'lucide-react'
import { IconButton } from '../ui/IconButton'
import { useTheme } from './ThemeContext'

export function ThemeToggle() {
  const { mode, toggle } = useTheme()
  return (
    <IconButton
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
    >
      {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  )
}
