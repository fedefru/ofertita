import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getBusinessesByOwner } from '@/lib/supabase/queries/businesses'
import { Eye, Heart, Tag, TrendingUp, ExternalLink, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Panel de control' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const businesses = await getBusinessesByOwner(user.id)

  let totalViews = 0
  let totalSaves = 0
  let activeOffers = 0
  let totalOffers = 0

  for (const business of businesses) {
    const { data: offers } = await supabase
      .from('offers')
      .select('view_count, save_count, is_active, end_date')
      .eq('business_id', business.id)
      .returns<{ view_count: number; save_count: number; is_active: boolean; end_date: string }[]>()

    for (const offer of offers ?? []) {
      totalViews += offer.view_count ?? 0
      totalSaves += offer.save_count ?? 0
      totalOffers++
      if (offer.is_active && new Date(offer.end_date) >= new Date()) activeOffers++
    }
  }

  const stats = [
    { label: 'Vistas totales', value: totalViews, icon: Eye },
    { label: 'Veces guardada', value: totalSaves, icon: Heart },
    { label: 'Ofertas activas', value: activeOffers, icon: Tag },
    { label: 'Total ofertas', value: totalOffers, icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resumen</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {businesses.length === 0
            ? 'Aún no tienes ningún comercio registrado'
            : `Gestionando ${businesses.length} comercio${businesses.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold tabular-nums">{value.toLocaleString('es-ES')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Businesses list */}
      {businesses.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-2xl mb-4">
            🏪
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Registra tu primer comercio para empezar a publicar ofertas
          </p>
          <Button asChild>
            <Link href="/onboarding">Registrar comercio</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Tus comercios</h2>
          {businesses.map((biz) => (
            <Card key={biz.id}>
              <CardContent className="flex flex-col gap-3 py-4 px-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {biz.logo_url ? (
                    <Image
                      src={biz.logo_url}
                      alt={biz.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-lg">
                      🏪
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{biz.name}</p>
                    <p className="text-xs text-muted-foreground">{biz.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/businesses/${biz.slug}`}>
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Ver página
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/business">
                      <Settings className="mr-1.5 h-3.5 w-3.5" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
