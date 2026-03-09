'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Loader2, AlertCircle, Store, MapPin } from 'lucide-react'
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
 * Bento grid: every 3rd card (index % 3 === 0) spans 2 columns
 * and renders in the horizontal featured layout.
 * Pattern: [wide][normal] / [normal][normal][wide] / ...
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
      (entries) => { if (entries[0].isIntersecting && !isLoadingMore) onLoadMore() },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onLoadMore])

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <OfferCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-[20px] bg-white px-6 py-16 text-center"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>
        <p className="text-[14px] text-[#475569]">{error}</p>
      </div>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (offers.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-5 rounded-[24px] bg-white px-8 py-20 text-center"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        {/* Illustration */}
        <div className="relative">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-[20px]"
            style={{ background: 'rgba(249,115,22,0.08)' }}
          >
            <MapPin className="h-9 w-9 text-[#F97316]" />
          </div>
          {/* Sleeping dot */}
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#F8FAFC] border border-[#E5E7EB]">
            <span className="text-[14px] font-bold text-[#94A3B8]">z</span>
          </div>
        </div>

        <div>
          <h3 className="text-[18px] font-black text-[#1F2937]">
            Tus vecinos están tranquilos hoy
          </h3>
          <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-[#6B7280]">
            No hay ofertas activas cerca tuyo en este momento. ¿Tenés un comercio amigo? Contale
            que puede publicar gratis en Ofertita.
          </p>
        </div>

        <Link
          href="/login?redirectTo=/onboarding"
          className="flex items-center gap-2 rounded-[14px] bg-[#F97316] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#EA580C]"
          style={{ boxShadow: '0 4px 16px rgba(249,115,22,0.32)' }}
        >
          <Store className="h-4 w-4" />
          Registrar un comercio
        </Link>
      </div>
    )
  }

  // ── Grid ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            isSaved={savedIds.has(offer.id)}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={loadMoreRef} className="h-4" />

      {isLoadingMore && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-[#F97316]/50" />
        </div>
      )}

      {!hasMore && offers.length > 0 && (
        <p className="py-4 text-center text-[12px] text-[#94A3B8]">
          Eso es todo por ahora — volvé más tarde para nuevas ofertas
        </p>
      )}
    </div>
  )
}
