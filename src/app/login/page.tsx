import type { Metadata } from 'next'
import Image from 'next/image'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
}

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string; message?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo, message } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo + heading */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Ofertita"
              width={180}
              height={54}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>
          <p className="text-muted-foreground text-sm">
            Descubre las mejores ofertas locales cerca de vos
          </p>
        </div>

        {/* Message from middleware */}
        {message && (
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
            {message}
          </div>
        )}

        {/* Auth card */}
        <div className="rounded-xl border bg-card p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold">Bienvenido</h2>
            <p className="text-sm text-muted-foreground">
              Accede con tu cuenta de Google para continuar
            </p>
          </div>

          <GoogleSignInButton redirectTo={redirectTo ?? '/explore'} />

          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            Al continuar, aceptas nuestros{' '}
            <span className="underline underline-offset-2 cursor-pointer">Términos de servicio</span> y{' '}
            <span className="underline underline-offset-2 cursor-pointer">Política de privacidad</span>
          </p>
        </div>
      </div>
    </div>
  )
}
