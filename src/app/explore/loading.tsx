import { OfferCardSkeleton } from '@/components/offers/OfferCardSkeleton'

export default function ExploreLoading() {
  return (
    <div className="container py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <OfferCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
