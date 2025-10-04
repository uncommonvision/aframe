import type { ReactNode } from 'react'
import Header from '../Header'

interface DefaultLayoutProps {
  children: ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="tw-min-h-screen tw-bg-background tw-font-sans tw-antialiased">
      <Header />
      <main className="tw-container tw-mx-auto tw-px-4 tw-py-6 tw-max-w-7xl">
        {children}
      </main>
    </div>
  )
}