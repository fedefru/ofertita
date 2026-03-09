'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { List, Map, LocateFixed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OfferGrid } from '@/components/offers/OfferGrid'
import { OfferFilters, type QuickFilter } from '@/components/offers/OfferFilters'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useNearbyOffers } from '@/hooks/useNearbyOffers'
import { useSavedOffers } from '@/hooks/useSavedOffers'
import { useAuth } from '@/hooks/useAuth'
import { DEFAULT_RADIUS } from '@/lib/constants'
import type { Category } from '@/types/business.types'

// Dynamic import — Leaflet cannot run on server
const MapView = dynamic(
  () => import('@/components/map/MapView').then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-[20px] bg-[#E2E8F0]" />
    ),
  }
)

export default function ExplorePage() {
  const { user } = useAuth()
  const [view, setView] = useState<'list' | 'map'>('list')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const [categories, setCategories] = useState<Category[]>([])

  const { coordinates, isLoading: geoLoading, isPermissionDenied, refresh: refreshGeo } =
    useGeolocation()

  const { offers, isLoading, isLoadingMore, hasMore, error, loadMore } = useNearbyOffers({
    coordinates,
    radiusMeters: radius,
    categorySlug: selectedCategory,
  })

  const { isSaved, toggleSave, savedIds } = useSavedOffers({
    userId: user?.id ?? '',
    initialSavedIds: [],
  })

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  // Client-side quick filters (server already handles category + radius)
  const filteredOffers = useMemo(() => {
    if (quickFilter === 'all') return offers

    const now = new Date()

    if (quickFilter === 'vence-hoy') {
      return offers.filter((o) => {
        const end = new Date(o.end_date)
        return end.toDateString() === now.toDateString()
      })
    }

    if (quickFilter === 'reciente') {
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      return offers.filter((o) => new Date(o.start_date) >= oneHourAgo)
    }

    return offers
  }, [offers, quickFilter])

  const offerCount = filteredOffers.length

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container space-y-5 py-5">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[1.25rem] font-black tracking-tight text-[#1F2937]">
              La vidriera del barrio
            </h1>
            {!isLoading && !geoLoading && (
              <p className="mt-0.5 text-[13px] text-[#9CA3AF]">
                {offerCount > 0
                  ? `${offerCount} oferta${offerCount !== 1 ? 's' : ''} activa${offerCount !== 1 ? 's' : ''} cerca tuyo`
                  : 'Buscando ofertas cerca tuyo…'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Geo recovery */}
            {isPermissionDenied && (
              <Button variant="outline" size="sm" onClick={refreshGeo} className="rounded-xl">
                <LocateFixed className="mr-1.5 h-4 w-4" />
                Usar ubicación
              </Button>
            )}

            {/* List / Map toggle */}
            <div className="flex overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white">
              <button
                onClick={() => setView('list')}
                className={`flex h-9 w-9 items-center justify-center transition-colors ${
                  view === 'list'
                    ? 'bg-[#F97316] text-white'
                    : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('map')}
                className={`flex h-9 w-9 items-center justify-center transition-colors ${
                  view === 'map'
                    ? 'bg-[#F97316] text-white'
                    : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                <Map className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <OfferFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedRadius={radius}
          quickFilter={quickFilter}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat)
            setQuickFilter('all')
          }}
          onRadiusChange={setRadius}
          onQuickFilterChange={setQuickFilter}
        />

        {/* ── Content ─────────────────────────────────────────────────── */}
        {view === 'list' ? (
          <OfferGrid
            offers={filteredOffers}
            isLoading={isLoading || geoLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore && quickFilter === 'all'}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onLoadMore={loadMore}
            error={error}
          />
        ) : (
          <div className="h-[calc(100vh-14rem)] overflow-hidden rounded-[20px]">
            <MapView
              offers={filteredOffers}
              userLocation={coordinates}
              center={coordinates ?? { lat: -34.705, lng: -58.271 }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
