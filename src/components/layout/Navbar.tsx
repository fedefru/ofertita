'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/explore', label: 'Explorar' },
  { href: '/saved', label: 'Guardados' },
]

export function Navbar() {
  const { user, profile, isOwner, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [businessSlug, setBusinessSlug] = useState<string | null>(null)

  useEffect(() => {
    if (!isOwner || !user) return
    supabase
      .from('businesses')
      .select('slug')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setBusinessSlug(data?.slug ?? null))
  }, [isOwner, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    console.log('Signing out initiated via server route...')

    // Force redirect function
    const forceRedirect = () => {
      console.log('Redirecting to login...')
      window.location.href = '/login'
    }

    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      })
      console.log('Server sign out request completed')
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      forceRedirect()
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

  const allLinks = isOwner
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
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {!isOwner && (
            <Button size="sm" asChild>
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
                    <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.display_name ?? ''} />
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
                {isOwner && businessSlug && (
                  <DropdownMenuItem asChild>
                    <Link href={`/businesses/${businessSlug}`}>
                      <Store className="mr-2 h-4 w-4" />
                      Ver mi comercio
                    </Link>
                  </DropdownMenuItem>
                )}
                {isOwner && (
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
