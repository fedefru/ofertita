import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from 'sonner'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Ofertita — Ofertas locales cerca de ti',
    template: '%s | Ofertita',
  },
  description: 'Descubre las mejores ofertas de los comercios locales de tu ciudad',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Ofertita',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={jakarta.className}>
        <AppShell>{children}</AppShell>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
