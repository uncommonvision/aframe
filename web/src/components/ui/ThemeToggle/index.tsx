import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../theme-provider'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'light') {
      return <Sun className="tw-h-4 tw-w-4" />
    } else if (theme === 'dark') {
      return <Moon className="tw-h-4 tw-w-4" />
    } else {
      // System theme - show appropriate icon based on system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 
        <Moon className="tw-h-4 tw-w-4" /> : 
        <Sun className="tw-h-4 tw-w-4" />
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-colors hover:tw-bg-accent hover:tw-text-accent-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50 tw-h-9 tw-w-9"
      title={`Current theme: ${theme}. Click to cycle through light, dark, and system.`}
    >
      {getIcon()}
      <span className="tw-sr-only">Toggle theme</span>
    </button>
  )
}