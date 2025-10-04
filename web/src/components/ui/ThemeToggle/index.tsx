import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../../theme-provider'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [systemIsDark, setSystemIsDark] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemIsDark(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'light') {
      return <Sun className="h-4 w-4 text-foreground" />
    } else if (theme === 'dark') {
      return <Moon className="h-4 w-4 text-foreground" />
    } else {
      return <Monitor className="h-4 w-4 text-foreground" />
    }
  }

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light'
    if (theme === 'dark') return 'Dark'
    return `System (${systemIsDark ? 'Dark' : 'Light'})`
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8"
      title={`Current theme: ${getThemeLabel()}. Click to toggle.`}
    >
      <div className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted cursor-pointer transition-colors">
        {getIcon()}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
