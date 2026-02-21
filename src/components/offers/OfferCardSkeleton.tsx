/**
 * Skeleton matches the normal (vertical) OfferCard layout.
 * Uses the same rounded-[20px] + shadow system for visual consistency.
 */
export function OfferCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: '0 2px 16px rgba(99,102,241,0.08), 0 1px 4px rgba(15,23,42,0.05)' }}
    >
      {/* Image placeholder */}
      <div className="aspect-[3/2] animate-pulse bg-[#F1F5F9]" />

      {/* Content */}
      <div className="space-y-2.5 p-4">
        {/* Category + time row */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#F1F5F9]" />
          <div className="h-3.5 w-14 animate-pulse rounded bg-[#F1F5F9]" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full animate-pulse rounded bg-[#F1F5F9]" />
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#F1F5F9]" />
        </div>

        {/* Business name */}
        <div className="h-3 w-2/5 animate-pulse rounded bg-[#F1F5F9]" />

        {/* Price + distance */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="h-5 w-16 animate-pulse rounded bg-[#F1F5F9]" />
          <div className="h-3 w-10 animate-pulse rounded bg-[#F1F5F9]" />
        </div>
      </div>
    </div>
  )
}
