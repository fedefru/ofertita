/**
 * Skeleton that mirrors the normal OfferCard:
 * 4/3 image area → content block with category + title + price + footer
 */
export function OfferCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Image placeholder */}
      <div className="aspect-[4/3] animate-pulse bg-[#F1F5F9]" />

      {/* Content */}
      <div className="space-y-2.5 p-4">
        {/* Category chip + time */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#F1F5F9]" />
          <div className="h-3.5 w-14 animate-pulse rounded bg-[#F1F5F9]" />
        </div>

        {/* Title (2 lines) */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full animate-pulse rounded bg-[#F1F5F9]" />
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#F1F5F9]" />
        </div>

        {/* Business name */}
        <div className="h-3 w-2/5 animate-pulse rounded bg-[#F1F5F9]" />

        {/* Price */}
        <div className="h-6 w-24 animate-pulse rounded bg-[#F1F5F9]" />

        {/* Distance + published */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="h-3 w-24 animate-pulse rounded bg-[#F1F5F9]" />
          <div className="h-3 w-16 animate-pulse rounded bg-[#F1F5F9]" />
        </div>
      </div>
    </div>
  )
}

/** Wider skeleton for the featured (col-span-2) bento slot. */
export function OfferCardSkeletonFeatured() {
  return (
    <div
      className="flex overflow-hidden rounded-[20px] bg-white"
      style={{
        boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        height: '224px',
      }}
    >
      {/* Image side */}
      <div className="w-[42%] flex-shrink-0 animate-pulse bg-[#F1F5F9]" />

      {/* Content side */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#F1F5F9]" />
          <div className="h-3.5 w-14 animate-pulse rounded bg-[#F1F5F9]" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-[#F1F5F9]" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-[#F1F5F9]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#F1F5F9]" />
        </div>
        <div className="h-7 w-28 animate-pulse rounded bg-[#F1F5F9]" />
        <div className="flex justify-between">
          <div className="h-3 w-24 animate-pulse rounded bg-[#F1F5F9]" />
          <div className="h-3 w-16 animate-pulse rounded bg-[#F1F5F9]" />
        </div>
      </div>
    </div>
  )
}
