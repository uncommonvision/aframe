import type { ReactNode } from 'react'

interface CenteredFullScreenLayoutProps {
  children: ReactNode
}

export default function CenteredFullScreenLayout({ children }: CenteredFullScreenLayoutProps) {
  return (
    <div className="h-screen w-screen bg-background font-sans antialiased flex items-center justify-center">
      {children}
    </div>
  )
}
