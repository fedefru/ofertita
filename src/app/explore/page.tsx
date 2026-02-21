'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { List, Map, LocateFixed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OfferGrid } from '@/components/offers/OfferGrid'
import { OfferFilters } from '@/components/offers/OfferFilters'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useNearbyOffers } from '@/hooks/useNearbyOffers'
import { useSavedOffers } from '@/hooks/useSavedOffers'
import { useAuth } from '@/hooks/useAuth'
import { DEFAULT_RADIUS } from '@/lib/constants'
import type { Category } from '@/types/business.types'

// Dynamic import — Leaflet cannot run on server
const MapView = dynamic(
  () => import('@/components/map/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-muted rounded-xl" /> }
)

// Categories are fetched server-side, but for now we pass them via a client fetch
import { useEffect } from 'react'

export default function ExplorePage() {
  const { user } = useAuth()
  const [view, setView] = useState<'list' | 'map'>('list')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [categories, setCategories] = useState<Category[]>([])

  const { coordinates, isLoading: geoLoading, isPermissionDenied, refresh: refreshGeo } = useGeolocation()

  const {
    offers,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
  } = useNearbyOffers({
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

  return (
    <div className="container py-4 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <OfferFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedRadius={radius}
          onCategoryChange={setSelectedCategory}
          onRadiusChange={setRadius}
        />

        <div className="ml-auto flex items-center gap-2">
          {isPermissionDenied && (
            <Button variant="outline" size="sm" onClick={refreshGeo}>
              <LocateFixed className="mr-1.5 h-4 w-4" />
              Usar ubicación
            </Button>
          )}

          {/* View toggle */}
          <div className="flex rounded-md border overflow-hidden">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setView('map')}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <OfferGrid
          offers={offers}
          isLoading={isLoading || geoLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onLoadMore={loadMore}
          error={error}
        />
      ) : (
        <div className="h-[calc(100vh-12rem)]">
          <MapView
            offers={offers}
            userLocation={coordinates}
            center={coordinates ?? { lat: 40.4168, lng: -3.7038 }}
          />
        </div>
      )}
    </div>
  )
}
