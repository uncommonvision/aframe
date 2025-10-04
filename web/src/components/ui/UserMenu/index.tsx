import { User, Settings, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 cursor-pointer"
      >
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent cursor-pointer transition-colors">
          <User className="h-7 w-7 text-muted-foreground" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
          <div className="px-2 py-1.5 text-sm font-semibold">
            John Doe
          </div>
          <div className="px-2 py-1 text-xs text-muted-foreground">
            john.doe@example.com
          </div>
          <div className="my-1 h-px bg-border" />
          
          <button className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-foreground">
            <User className="mr-2 h-4 w-4" />
            Profile
          </button>
          
          <button className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-foreground">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </button>
          
          <div className="my-1 h-px bg-border" />
          
          <button className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}