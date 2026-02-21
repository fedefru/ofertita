import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Paths that skip auth entirely (exact or prefix match)
const PUBLIC_EXACT = new Set(['/', '/login'])
const PUBLIC_PREFIX = ['/auth/callback', '/api/auth/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pure public paths — skip Supabase call completely
  if (PUBLIC_PREFIX.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set(name, value)
          response = NextResponse.next({ request })
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set(name, '')
          response = NextResponse.next({ request })
          response.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Landing page ('/') — show to guests, send auth users to app
  if (pathname === '/') {
    if (user) return NextResponse.redirect(new URL('/explore', request.url))
    return NextResponse.next()
  }

  // Login page — send auth users to app
  if (pathname === '/login') {
    if (user) return NextResponse.redirect(new URL('/explore', request.url))
    return NextResponse.next()
  }

  // All other routes require auth
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Dashboard requires business_owner role
  if (pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'business_owner') {
      const onboardingUrl = new URL('/onboarding', request.url)
      onboardingUrl.searchParams.set('message', 'Registra tu comercio para acceder al panel')
      return NextResponse.redirect(onboardingUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
