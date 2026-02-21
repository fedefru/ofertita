'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { MobileBottomNav } from './MobileBottomNav'

/**
 * Renders the app chrome (Navbar + MobileBottomNav) for all routes
 * except '/' which has its own standalone LandingNav.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/') {
    return <>{children}</>
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
      </div>
      <MobileBottomNav />
    </>
  )
}
