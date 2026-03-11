import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Utensils, Leaf, Wheat, Fish, Coffee, ShoppingBag, type LucideIcon } from 'lucide-react'
import { SaveButton } from './SaveButton'
import { formatTimeLeft, formatTimeAgo, formatDiscountPct, formatCurrency } from '@/lib/formatters'
import { metersToBlocks } from '@/lib/distance'
import type { NearbyOffer } from '@/types/offer.types'
import { cn } from '@/lib/utils'

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Darkens a hex color by `amount` per channel for gradient backgrounds. */
function darkHex(hex: string, amount = 70): string {
  const c = hex.replace('#', '')
  if (c.length !== 6) return '#0F172A'
  const r = Math.max(0, parseInt(c.slice(0, 2), 16) - amount)
  const g = Math.max(0, parseInt(c.slice(2, 4), 16) - amount)
  const b = Math.max(0, parseInt(c.slice(4, 6), 16) - amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/** Maps category slug to a Lucide icon. */
function getSlugIcon(slug: string): LucideIcon {
  const s = slug.toLowerCase()
  if (s.includes('carn')) return Utensils
  if (s.includes('verdur') || s.includes('frut') || s.includes('hort')) return Leaf
  if (s.includes('panad') || s.includes('alfaj') || s.includes('reposter')) return Wheat
  if (s.includes('pesc') || s.includes('marisq')) return Fish
  if (s.includes('cafe') || s.includes('rest') || s.includes('rotis') || s.includes('comid')) return Coffee
  return ShoppingBag
}

// ─── Sub-elements ─────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface OfferCardProps {
  offer: NearbyOffer
  isSaved: boolean
  onToggleSave: (offerId: string) => void
  featured?: boolean
}

export function OfferCard({ offer, isSaved, onToggleSave, featured = false }: OfferCardProps) {
  const { label: timeLabel, isUrgent, isExpired } = formatTimeLeft(offer.end_date)
  const { label: publishedLabel, isRecent } = formatTimeAgo(offer.start_date)

  const hasPrice = offer.offer_price !== null && offer.offer_price > 0
  const hasOriginal = offer.original_price !== null && (offer.original_price ?? 0) > 0
  const hasDiscount = offer.discount_pct !== null && (offer.discount_pct ?? 0) > 0

  const categoryColor = offer.category_color ?? '#6366F1'
  const categoryBg = `${categoryColor}1a`
  const Icon = getSlugIcon(offer.category_slug)
  const placeholderGradient = `linear-gradient(145deg, ${darkHex(categoryColor, 90)} 0%, ${darkHex(categoryColor, 55)} 100%)`

  const cardShadow = '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'
  const cardHoverShadow = '0 14px 36px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.07)'

  const timeClass = cn(
    'inline-flex items-center gap-1 text-[11px] flex-shrink-0',
    isUrgent && !isExpired ? 'font-semibold text-red-500' : 'text-[#94A3B8]',
    isExpired && 'line-through opacity-60'
  )

  // ── FEATURED (horizontal, col-span-2) ────────────────────────────────────────
  if (featured) {
    return (
      <Link href={`/offers/${offer.id}`} className="block group">
        <div
          className="relative flex flex-col overflow-hidden rounded-[20px] bg-white transition-all duration-300 hover:-translate-y-1 sm:flex-row sm:h-56"
          style={{ boxShadow: cardShadow }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = cardHoverShadow }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = cardShadow }}
        >
          {/* Image / placeholder */}
          <div className="relative aspect-[3/2] w-full flex-shrink-0 overflow-hidden sm:aspect-auto sm:w-[42%]">
            {offer.image_url ? (
              <>
                <Image
                  src={offer.image_url}
                  alt={offer.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10" />
              </>
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: placeholderGradient }}
              >
                <Icon className="h-16 w-16 text-white/20 transition-transform duration-500 group-hover:scale-110" />
              </div>
            )}
            {/* Live badge */}
            {isRecent && (
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                <LiveDot />
                Live
              </span>
            )}
            {/* Discount badge */}
            {hasDiscount && (
              <span
                className="absolute bottom-3 left-3 rounded-full bg-[#6366F1] px-3 py-1.5 text-[12px] font-black text-white"
                style={{ boxShadow: '0 2px 8px rgba(99,102,241,0.45)' }}
              >
                {formatDiscountPct(offer.discount_pct)}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-5">
            {/* Top */}
            <div className="flex items-start justify-between gap-2">
              <span
                className="min-w-0 truncate inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
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
            <div className="my-3 flex-1">
              <h3 className="line-clamp-2 text-[16px] font-bold leading-snug text-[#0F172A] transition-colors group-hover:text-[#6366F1]">
                {offer.title}
              </h3>
              <p className="mt-1 truncate text-[12px] text-[#94A3B8]">{offer.business_name}</p>
            </div>

            {/* Price */}
            {hasPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-[22px] font-black text-[#F97316]">
                  {formatCurrency(offer.offer_price)}
                </span>
                {hasOriginal && hasDiscount && (
                  <span className="text-[13px] text-[#94A3B8] line-through">
                    {formatCurrency(offer.original_price)}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[14px] font-semibold text-[#6366F1]">Consultá condiciones</p>
            )}

            {/* Distance + published */}
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[12px] text-[#94A3B8]">
                <MapPin className="h-3.5 w-3.5" />
                {metersToBlocks(offer.distance_meters)}
              </span>
              <span
                className={cn(
                  'flex items-center gap-1.5 text-[11px]',
                  isRecent ? 'font-semibold text-emerald-600' : 'text-[#94A3B8]'
                )}
              >
                {isRecent && <LiveDot />}
                {publishedLabel}
              </span>
            </div>
          </div>

          {/* Save */}
          <div className="absolute right-3 top-3">
            <SaveButton offerId={offer.id} isSaved={isSaved} onToggle={onToggleSave} />
          </div>
        </div>
      </Link>
    )
  }

  // ── NORMAL (vertical) ────────────────────────────────────────────────────────
  return (
    <Link href={`/offers/${offer.id}`} className="block group">
      <div
        className="overflow-hidden rounded-[20px] bg-white transition-all duration-300 hover:-translate-y-1"
        style={{ boxShadow: cardShadow }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = cardHoverShadow }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = cardShadow }}
      >
        {/* Image / placeholder */}
        <div className="relative aspect-video overflow-hidden">
          {offer.image_url ? (
            <>
              <Image
                src={offer.image_url}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            </>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: placeholderGradient }}
            >
              <Icon className="h-10 w-10 text-white/20 transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}

          {/* Live badge */}
          {isRecent && (
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <LiveDot />
              Live
            </span>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <span
              className="absolute bottom-3 left-3 rounded-full bg-[#6366F1] px-2.5 py-1.5 text-[10px] font-black text-white"
              style={{ boxShadow: '0 2px 8px rgba(99,102,241,0.45)' }}
            >
              {formatDiscountPct(offer.discount_pct)}
            </span>
          )}

          {/* Save */}
          <div className="absolute right-2.5 top-2.5">
            <SaveButton offerId={offer.id} isSaved={isSaved} onToggle={onToggleSave} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5 p-3">
          {/* Category + time until expiry */}
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <span
              className="inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: categoryBg, color: categoryColor }}
            >
              {offer.category_name}
            </span>
            <span className={cn(timeClass, 'hidden sm:inline-flex')}>
              <Clock className="h-3 w-3" />
              {timeLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-[#0F172A] transition-colors group-hover:text-[#6366F1]">
            {offer.title}
          </h3>

          {/* Business */}
          <p className="truncate text-[11px] text-[#94A3B8]">{offer.business_name}</p>

          {/* Price */}
          {hasPrice ? (
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-[16px] font-black text-[#F97316]">
                {formatCurrency(offer.offer_price)}
              </span>
              {hasOriginal && hasDiscount && (
                <span className="text-[11px] text-[#94A3B8] line-through">
                  {formatCurrency(offer.original_price)}
                </span>
              )}
            </div>
          ) : (
            <p className="text-[13px] font-semibold text-[#6366F1]">Consultá condiciones</p>
          )}

          {/* Distance + time since published */}
          <div className="flex flex-col gap-0.5 pt-0.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
              <MapPin className="h-3 w-3" />
              {metersToBlocks(offer.distance_meters)}
            </span>
            <span
              className={cn(
                'flex items-center gap-1.5 text-[10px]',
                isRecent ? 'font-semibold text-emerald-600' : 'text-[#94A3B8]'
              )}
            >
              {isRecent && <LiveDot />}
              {publishedLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
