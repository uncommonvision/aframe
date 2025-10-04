import { ChevronDown, User, Settings, LogOut } from 'lucide-react'
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
    <div className="tw-relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="tw-flex tw-items-center tw-space-x-2 tw-rounded-md tw-px-3 tw-py-2 tw-text-sm tw-font-medium tw-transition-colors hover:tw-bg-accent hover:tw-text-accent-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2"
      >
        <div className="tw-h-8 tw-w-8 tw-rounded-full tw-bg-muted tw-flex tw-items-center tw-justify-center">
          <User className="tw-h-4 tw-w-4 tw-text-muted-foreground" />
        </div>
        <ChevronDown className={`tw-h-4 tw-w-4 tw-transition-transform ${isOpen ? 'tw-rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="tw-absolute tw-right-0 tw-top-full tw-z-50 tw-mt-2 tw-w-48 tw-rounded-md tw-border tw-bg-popover tw-p-1 tw-text-popover-foreground tw-shadow-md">
          <div className="tw-px-2 tw-py-1.5 tw-text-sm tw-font-semibold">
            John Doe
          </div>
          <div className="tw-px-2 tw-py-1 tw-text-xs tw-text-muted-foreground">
            john.doe@example.com
          </div>
          <div className="tw-my-1 tw-h-px tw-bg-border" />
          
          <button className="tw-relative tw-flex tw-w-full tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-transition-colors hover:tw-bg-accent hover:tw-text-accent-foreground">
            <User className="tw-mr-2 tw-h-4 tw-w-4" />
            Profile
          </button>
          
          <button className="tw-relative tw-flex tw-w-full tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-transition-colors hover:tw-bg-accent hover:tw-text-accent-foreground">
            <Settings className="tw-mr-2 tw-h-4 tw-w-4" />
            Settings
          </button>
          
          <div className="tw-my-1 tw-h-px tw-bg-border" />
          
          <button className="tw-relative tw-flex tw-w-full tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-transition-colors hover:tw-bg-accent hover:tw-text-accent-foreground">
            <LogOut className="tw-mr-2 tw-h-4 tw-w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}