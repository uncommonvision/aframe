import type { ReactNode } from 'react'
import Header from '../Header'
import { KeyboardShortcutsOverlay } from '@/components/ui'

interface DefaultLayoutProps {
  children: ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <KeyboardShortcutsOverlay />
    </div>
  )
}