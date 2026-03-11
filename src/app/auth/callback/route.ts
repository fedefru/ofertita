import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/explore'
  // Prevent open redirect: only allow relative paths on the same origin
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/explore'

  if (code) {
    // Create the redirect response first so session cookies are set directly on it
    const redirectResponse = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            redirectResponse.cookies.set(name, value, options)
          },
          remove(name: string, options: CookieOptions) {
            redirectResponse.cookies.set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return redirectResponse
    }

    console.error('[auth/callback] exchangeCodeForSession error:', error)
  }

  return NextResponse.redirect(
    `${origin}/login?message=${encodeURIComponent('Error al iniciar sesión. Inténtalo de nuevo.')}`
  )
}
