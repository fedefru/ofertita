import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ─── In-process rate limiter (Edge-compatible, resets on cold start) ──────────
// For production scale, replace with Upstash Redis: https://upstash.com
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITS: Record<string, { requests: number; windowMs: number }> = {
  '/api/offers/nearby': { requests: 30, windowMs: 60_000 },  // 30 req/min
  '/api/upload':        { requests: 10, windowMs: 60_000 },  // 10 req/min
  '/api/auth/login':    { requests: 5,  windowMs: 60_000 },  // 5 req/min
}

function isRateLimited(ip: string, pathname: string): boolean {
  const rule = Object.entries(RATE_LIMITS).find(([path]) => pathname.startsWith(path))
  if (!rule) return false

  const [, { requests, windowMs }] = rule
  const key = `${ip}:${rule[0]}`
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count++
  if (entry.count > requests) return true

  return false
}

// Paths that skip auth entirely (exact or prefix match)
const PUBLIC_EXACT = new Set(['/', '/login'])
const PUBLIC_PREFIX = ['/auth/callback', '/api/auth/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Rate limiting ────────────────────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
         ?? request.headers.get('x-real-ip')
         ?? 'unknown'

  if (isRateLimited(ip, pathname)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '60' },
    })
  }

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
