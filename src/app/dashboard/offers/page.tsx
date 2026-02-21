import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Edit, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatTimeLeft } from '@/lib/formatters'

export const metadata: Metadata = { title: 'Mis ofertas' }

export default async function OffersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get owner's businesses
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)

  const businessIds = (businesses ?? []).map((b) => b.id)

  const { data: offers } = await supabase
    .from('offers')
    .select('*, business:businesses(name, slug)')
    .in('business_id', businessIds.length ? businessIds : [''])
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis ofertas</h1>
          <p className="text-muted-foreground">{offers?.length ?? 0} ofertas en total</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/offers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva oferta
          </Link>
        </Button>
      </div>

      {!offers?.length ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Aún no has creado ninguna oferta</p>
          <Button asChild>
            <Link href="/dashboard/offers/new">Crear primera oferta</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => {
            const { label, isExpired } = formatTimeLeft(offer.end_date)
            const isActive = offer.is_active && !isExpired

            return (
              <div
                key={offer.id}
                className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium truncate">{offer.title}</p>
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                      {isActive ? 'Activa' : isExpired ? 'Expirada' : 'Inactiva'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span>{(offer.business as { name: string }).name}</span>
                    <span>{formatCurrency(offer.offer_price)}</span>
                    <span>-{Math.round(offer.discount_pct)}%</span>
                    <span>{label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    👁 {offer.view_count} · ❤ {offer.save_count}
                  </span>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/offers/${offer.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
