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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left side: Logo and Title */}
        <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-foreground" />
            <h1 className="text-xl font-bold text-foreground">Kubey</h1>
          </div>
        </div>

        {/* Right side: Search Bar, Theme Toggle and User Menu */}
        <div className="flex items-center space-x-2 flex-1 justify-end ml-48">
          <SearchBar 
            placeholder="Type / to search" 
            onSearch={handleSearch}
          />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}