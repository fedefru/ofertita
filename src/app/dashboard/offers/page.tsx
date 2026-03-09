import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDiscountPct, formatTimeLeft } from '@/lib/formatters'
import { DeleteOfferButton } from '@/components/offers/DeleteOfferButton'
import type { Offer } from '@/types/offer.types'

type OfferWithBusiness = Offer & { business: { name: string; slug: string } | null }

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
    .returns<{ id: string }[]>()

  const businessIds = (businesses ?? []).map((b) => b.id)

  const { data: offers } = await supabase
    .from('offers')
    .select('*, business:businesses(name, slug)')
    .in('business_id', businessIds.length ? businessIds : [''])
    .order('created_at', { ascending: false })
    .returns<OfferWithBusiness[]>()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis ofertas</h1>
          <p className="text-muted-foreground">{offers?.length ?? 0} ofertas en total</p>
        </div>
        <Button asChild className="bg-[#F97316] hover:bg-[#EA580C] text-white">
          <Link href="/dashboard/offers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva oferta
          </Link>
        </Button>
      </div>

      {!offers?.length ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Aún no has creado ninguna oferta</p>
          <Button asChild className="bg-[#F97316] hover:bg-[#EA580C] text-white">
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
                    <Badge
                      className={isActive ? 'bg-[#FFF7ED] text-[#EA580C] border-[#FDBA74]' : ''}
                      variant={isActive ? 'outline' : 'secondary'}
                    >
                      {isActive ? 'Activa' : isExpired ? 'Expirada' : 'Inactiva'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span>{(offer.business as { name: string }).name}</span>
                    {offer.offer_price != null && (
                      <span>{formatCurrency(offer.offer_price)}</span>
                    )}
                    {offer.discount_pct != null && offer.discount_pct > 0 && (
                      <span>{formatDiscountPct(offer.discount_pct)}</span>
                    )}
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
                  <DeleteOfferButton offerId={offer.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
