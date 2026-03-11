'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Bookmark, LayoutDashboard, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { isOwner, isLoading } = useAuth()

  const items = [
    { href: '/explore', label: 'Explorar', icon: Compass },
    { href: '/saved', label: 'Guardados', icon: Bookmark },
    ...(!isLoading
      ? isOwner
        ? [{ href: '/dashboard', label: 'Panel', icon: LayoutDashboard }]
        : [{ href: '/onboarding', label: 'Mi comercio', icon: Store }]
      : []),
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors',
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
