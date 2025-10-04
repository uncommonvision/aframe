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
      return <Sun className="h-4 w-4" />
    } else if (theme === 'dark') {
      return <Moon className="h-4 w-4" />
    } else {
      // System theme - show appropriate icon based on system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 
        <Moon className="h-4 w-4" /> : 
        <Sun className="h-4 w-4" />
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9"
      title={`Current theme: ${theme}. Click to cycle through light, dark, and system.`}
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}