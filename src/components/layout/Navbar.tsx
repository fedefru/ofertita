'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, Bookmark, Store } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/explore', label: 'Explorar' },
  { href: '/saved', label: 'Guardados' },
]

export function Navbar() {
  const { user, profile, isOwner, isLoading, businessSlug } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  async function handleSignOut() {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch {
      // Redirect regardless
    } finally {
      window.location.href = '/login'
    }
  }

  const initials = profile?.display_name
    ? profile.display_name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : '?'

  const allLinks = businessSlug
    ? [...navLinks, { href: '/dashboard', label: 'Mi panel' }]
    : navLinks

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center">
          <Image
            src="/logo.png"
            alt="Ofertita"
            width={120}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {allLinks.map(({ href, label }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-3 py-1.5 text-sm rounded-md transition-colors',
                  isActive
                    ? 'text-[#EA580C] font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-[#FFF7ED]'
                )}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#F97316]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {!isLoading && user && !isOwner && !businessSlug && (
            <Button size="sm" asChild className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              <Link href="/onboarding">Registrar comercio</Link>
            </Button>
          )}

          {/* User menu */}
          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? undefined} alt={profile?.display_name ?? ''} />
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[1000]">
                <DropdownMenuLabel>
                  <p className="font-semibold">{profile?.display_name ?? 'Usuario'}</p>
                  <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1.5 text-xs">
                    {isOwner ? 'Propietario' : 'Visor'}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/saved">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Guardados
                  </Link>
                </DropdownMenuItem>
                {businessSlug && (
                  <DropdownMenuItem asChild>
                    <Link href={`/businesses/${businessSlug}`}>
                      <Store className="mr-2 h-4 w-4" />
                      Ver mi comercio
                    </Link>
                  </DropdownMenuItem>
                )}
                {businessSlug && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Mi panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isLoading && pathname !== '/login' && (
              <Button asChild variant="default" size="sm">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  )
}
