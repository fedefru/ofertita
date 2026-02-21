import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin } from 'lucide-react'
import { SaveButton } from './SaveButton'
import { formatTimeLeft, formatDiscountPct, formatCurrency } from '@/lib/formatters'
import { formatDistance, metersToKm } from '@/lib/distance'
import type { NearbyOffer } from '@/types/offer.types'
import { cn } from '@/lib/utils'

interface OfferCardProps {
  offer: NearbyOffer
  isSaved: boolean
  onToggleSave: (offerId: string) => void
  featured?: boolean
}

/**
 * Intent: usuario en modo exploración, escaneo rápido, decisión en segundos.
 * Surfaces: blanco puro sobre #F8FAFC canvas. Sombra teñida de índigo.
 * Depth: sombras sutiles — no borders. Una sola estrategia.
 * Signature: discount pill muestra % + euros ahorrados. Horizontal layout en featured.
 */
export function OfferCard({ offer, isSaved, onToggleSave, featured = false }: OfferCardProps) {
  const { label: timeLabel, isUrgent, isExpired } = formatTimeLeft(offer.end_date)
  const savings = offer.original_price - offer.offer_price
  const km = metersToKm(offer.distance_meters)

  const categoryBg = `${offer.category_color}1a`   // ~10% opacity hex
  const categoryColor = offer.category_color ?? '#6366F1'

  const timeClass = cn(
    'inline-flex items-center gap-1 text-[11px] shrink-0',
    isUrgent && !isExpired ? 'font-semibold text-[#EF4444]' : 'text-[#94A3B8]',
    isExpired && 'line-through'
  )

  // Signature element: pill único con % + ahorro en euros
  const discountPill = (
    <span className="flex items-center gap-1.5 rounded-full bg-[#6366F1] px-3 py-1.5 shadow-sm">
      <span className="text-[11px] font-bold text-white">{formatDiscountPct(offer.discount_pct)}</span>
      <span className="hidden text-[10px] text-white/70 sm:inline">
        · ahorra {formatCurrency(savings)}
      </span>
    </span>
  )

  // ─── FEATURED (horizontal) — col-span-2 en bento grid ───────────────────────
  if (featured) {
    return (
      <Link href={`/offers/${offer.id}`} className="block group">
        <div
          className={cn(
            'relative flex flex-col sm:flex-row overflow-hidden rounded-[20px] bg-white',
            'shadow-[0_2px_16px_rgba(99,102,241,0.08),0_1px_4px_rgba(15,23,42,0.05)]',
            'hover:shadow-[0_8px_28px_rgba(99,102,241,0.16),0_3px_8px_rgba(15,23,42,0.08)]',
            'transition-all duration-300 hover:-translate-y-0.5',
            'sm:h-52'
          )}
        >
          {/* Image — full width mobile / 44% desktop */}
          <div className="relative aspect-[3/2] w-full flex-shrink-0 overflow-hidden sm:aspect-auto sm:w-[44%]">
            {offer.image_url ? (
              <Image
                src={offer.image_url}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, 44vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#F1F5F9]">
                <span className="text-5xl opacity-15">🏷️</span>
              </div>
            )}
            {/* Gradient — mobile: bottom, desktop: right edge blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10" />
            {/* Discount ribbon */}
            <div className="absolute bottom-3 left-3">{discountPill}</div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
            {/* Category + time */}
            <div className="flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ backgroundColor: categoryBg, color: categoryColor }}
              >
                {offer.category_name}
              </span>
              <span className={timeClass}>
                <Clock className="h-3 w-3" />
                {timeLabel}
              </span>
            </div>

            {/* Title + business */}
            <div className="mt-2 flex-1">
              <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#0F172A] transition-colors duration-200 group-hover:text-[#6366F1]">
                {offer.title}
              </h3>
              <p className="mt-1 truncate text-xs text-[#94A3B8]">{offer.business_name}</p>
            </div>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#10B981]">
                {formatCurrency(offer.offer_price)}
              </span>
              <span className="text-sm text-[#94A3B8] line-through">
                {formatCurrency(offer.original_price)}
              </span>
            </div>

            {/* Distance */}
            <div className="mt-2 flex items-center gap-1 text-xs text-[#94A3B8]">
              <MapPin className="h-3 w-3" />
              {formatDistance(km)}
            </div>
          </div>

          {/* Save button */}
          <div className="absolute right-3 top-3">
            <SaveButton offerId={offer.id} isSaved={isSaved} onToggle={onToggleSave} />
          </div>
        </div>
      </Link>
    )
  }

  // ─── NORMAL (vertical) ───────────────────────────────────────────────────────
  return (
    <Link href={`/offers/${offer.id}`} className="block group">
      <div
        className={cn(
          'overflow-hidden rounded-[20px] bg-white',
          'shadow-[0_2px_16px_rgba(99,102,241,0.08),0_1px_4px_rgba(15,23,42,0.05)]',
          'hover:shadow-[0_8px_28px_rgba(99,102,241,0.16),0_3px_8px_rgba(15,23,42,0.08)]',
          'transition-all duration-300 hover:-translate-y-0.5'
        )}
      >
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          {offer.image_url ? (
            <Image
              src={offer.image_url}
              alt={offer.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#F1F5F9]">
              <span className="text-4xl opacity-15">🏷️</span>
            </div>
          )}
          {/* Bottom gradient for legibility over image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
          {/* Discount ribbon */}
          <div className="absolute bottom-3 left-3">{discountPill}</div>
          {/* Save button */}
          <div className="absolute right-2.5 top-2.5">
            <SaveButton offerId={offer.id} isSaved={isSaved} onToggle={onToggleSave} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 p-4">
          {/* Category + time */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: categoryBg, color: categoryColor }}
            >
              {offer.category_name}
            </span>
            <span className={timeClass}>
              <Clock className="h-3 w-3" />
              {timeLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#0F172A] transition-colors duration-200 group-hover:text-[#6366F1]">
            {offer.title}
          </h3>

          {/* Business */}
          <p className="truncate text-[11px] text-[#94A3B8]">{offer.business_name}</p>

          {/* Price row + distance */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-bold text-[#10B981]">
                {formatCurrency(offer.offer_price)}
              </span>
              <span className="text-[11px] text-[#94A3B8] line-through">
                {formatCurrency(offer.original_price)}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
              <MapPin className="h-3 w-3" />
              {formatDistance(km)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
