'use client'

import { useAuth } from '@/hooks/useAuth'
import { useSavedOffers } from '@/hooks/useSavedOffers'
import { OfferCard } from '@/components/offers/OfferCard'
import type { NearbyOffer } from '@/types/offer.types'

interface BusinessOffersSectionProps {
  offers: NearbyOffer[]
}

export function BusinessOffersSection({ offers }: BusinessOffersSectionProps) {
  const { user } = useAuth()
  const { isSaved, toggleSave, savedIds } = useSavedOffers({
    userId: user?.id ?? '',
    initialSavedIds: [],
  })

  if (offers.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No hay ofertas activas en este momento
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          isSaved={isSaved(offer.id)}
          onToggleSave={toggleSave}
        />
      ))}
    </div>
  )
}
