'use client'

import { useEffect, useRef } from 'react'
import { Loader2, SearchX } from 'lucide-react'
import { OfferCard } from './OfferCard'
import { OfferCardSkeleton } from './OfferCardSkeleton'
import type { NearbyOffer } from '@/types/offer.types'

interface OfferGridProps {
  offers: NearbyOffer[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  savedIds: Set<string>
  onToggleSave: (offerId: string) => void
  onLoadMore: () => void
  error?: string | null
}

/**
 * Bento grid: every 3rd card (index % 3 === 0) is "featured" —
 * takes col-span-2 and renders in horizontal layout (image left / content right).
 * Pattern per row: [wide][normal] / [normal][normal][wide]...
 */
export function OfferGrid({
  offers,
  isLoading,
  isLoadingMore,
  hasMore,
  savedIds,
  onToggleSave,
  onLoadMore,
  error,
}: OfferGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) onLoadMore()
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onLoadMore])

  // ─── Loading state ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={i % 3 === 0 ? 'sm:col-span-2' : ''}>
            <OfferCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  // ─── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-[20px] bg-white px-6 py-16 text-center"
        style={{ boxShadow: '0 2px 16px rgba(99,102,241,0.08), 0 1px 4px rgba(15,23,42,0.05)' }}
      >
        <span className="text-4xl">⚠️</span>
        <p className="text-sm text-[#475569]">{error}</p>
      </div>
    )
  }

  // ─── Empty state ──────────────────────────────────────────────────────────────
  if (offers.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-[20px] bg-white px-6 py-20 text-center"
        style={{ boxShadow: '0 2px 16px rgba(99,102,241,0.08), 0 1px 4px rgba(15,23,42,0.05)' }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6366F1]/8">
          <SearchX className="h-7 w-7 text-[#6366F1]" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#0F172A]">Sin ofertas en esta zona</h3>
          <p className="mt-1 max-w-sm text-sm text-[#94A3B8]">
            No hay ofertas activas cerca de ti en este momento. Prueba aumentando el radio de
            búsqueda.
          </p>
        </div>
      </div>
    )
  }

  // ─── Bento grid ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {offers.map((offer, index) => {
          const isFeatured = index % 3 === 0
          return (
            <div key={offer.id} className={isFeatured ? 'sm:col-span-2' : ''}>
              <OfferCard
                offer={offer}
                isSaved={savedIds.has(offer.id)}
                onToggleSave={onToggleSave}
                featured={isFeatured}
              />
            </div>
          )
        })}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={loadMoreRef} className="h-4" />

      {isLoadingMore && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-[#6366F1]/50" />
        </div>
      )}

      {!hasMore && offers.length > 0 && (
        <p className="py-4 text-center text-xs text-[#94A3B8]">
          Has visto todas las ofertas disponibles
        </p>
      )}
    </div>
  )
}
