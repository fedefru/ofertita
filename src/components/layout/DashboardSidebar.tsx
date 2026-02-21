'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  Tag,
  PlusCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/business', label: 'Mi comercio', icon: Store },
  { href: '/dashboard/offers', label: 'Mis ofertas', icon: Tag, exact: true },
  { href: '/dashboard/offers/new', label: 'Nueva oferta', icon: PlusCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center px-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Panel
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 pb-6">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              {isActive && (
                <span className="absolute left-3 h-4 w-0.5 rounded-full bg-primary" />
              )}
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
