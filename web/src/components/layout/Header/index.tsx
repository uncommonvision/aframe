import { Hexagon } from 'lucide-react'
import SearchBar from '../../ui/SearchBar'
import ThemeToggle from '../../ui/ThemeToggle'
import UserMenu from '../../ui/UserMenu'

export default function Header() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    // TODO: Implement search functionality
  }

  return (
    <header className="tw-sticky tw-top-0 tw-z-50 tw-w-full tw-border-b tw-border-border/40 tw-bg-background/95 tw-backdrop-blur supports-[backdrop-filter]:tw-bg-background/60">
      <div className="tw-container tw-mx-auto tw-flex tw-h-16 tw-max-w-7xl tw-items-center tw-justify-between tw-px-4">
        {/* Left side: Logo and Title */}
        <div className="tw-flex tw-items-center tw-space-x-4">
          <div className="tw-flex tw-items-center tw-space-x-2">
            <Hexagon className="tw-h-8 tw-w-8 tw-text-primary" />
            <h1 className="tw-text-xl tw-font-bold tw-text-foreground">Kubey</h1>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="tw-flex-1 tw-max-w-md tw-mx-8">
          <SearchBar 
            placeholder="Search items..." 
            onSearch={handleSearch}
          />
        </div>

        {/* Right side: Theme Toggle and User Menu */}
        <div className="tw-flex tw-items-center tw-space-x-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}