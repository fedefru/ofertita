import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSavedOffersByUser } from '@/lib/supabase/queries/savedOffers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Store } from 'lucide-react'
import { formatTimeLeft, formatCurrency } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Mis ofertas guardadas' }

export default async function SavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const savedOffers = await getSavedOffersByUser(user.id)

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Guardados</h1>
        <p className="text-muted-foreground">
          {savedOffers.length === 0
            ? 'No has guardado ninguna oferta todavía'
            : `${savedOffers.length} oferta${savedOffers.length !== 1 ? 's' : ''} guardada${savedOffers.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {savedOffers.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-6xl">🤍</span>
          <h3 className="text-lg font-semibold">Aún no tienes guardados</h3>
          <p className="text-muted-foreground max-w-sm">
            Guarda las ofertas que te interesen para encontrarlas fácilmente aquí
          </p>
          <Link
            href="/explore"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Explorar ofertas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedOffers.map((saved) => {
            const offer = saved.offer
            if (!offer) return null
            const { label, isUrgent, isExpired } = formatTimeLeft(offer.end_date)

            return (
              <Link key={saved.id} href={`/offers/${offer.id}`} className="block group">
                <div className="rounded-lg border overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {offer.image_url ? (
                      <Image
                        src={offer.image_url}
                        alt={offer.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl opacity-20">🏷️</span>
                      </div>
                    )}
                    {isExpired && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Expirada</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="font-medium text-sm line-clamp-2">{offer.title}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Store className="h-3 w-3" />
                      {(offer.business as { name: string }).name}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600 text-sm">
                        {formatCurrency(offer.offer_price)}
                      </span>
                      <span
                        className={cn(
                          'flex items-center gap-1 text-xs',
                          isUrgent && !isExpired ? 'text-orange-500' : 'text-muted-foreground'
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
