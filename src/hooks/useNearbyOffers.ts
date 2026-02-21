'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { NearbyOffer } from '@/types/offer.types'
import type { Coordinates } from '@/lib/distance'
import { OFFERS_PAGE_SIZE } from '@/lib/constants'

interface UseNearbyOffersOptions {
  coordinates: Coordinates | null
  radiusMeters: number
  categorySlug?: string | null
}

interface UseNearbyOffersState {
  offers: NearbyOffer[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

export function useNearbyOffers({
  coordinates,
  radiusMeters,
  categorySlug,
}: UseNearbyOffersOptions): UseNearbyOffersState {
  const [offers, setOffers] = useState<NearbyOffer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const offsetRef = useRef(0)

  const fetchOffers = useCallback(
    async (reset: boolean) => {
      if (!coordinates) return

      const isFirstLoad = reset
      if (isFirstLoad) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      const offset = reset ? 0 : offsetRef.current

      try {
        const params = new URLSearchParams({
          lat: coordinates.lat.toString(),
          lng: coordinates.lng.toString(),
          radius: radiusMeters.toString(),
          limit: OFFERS_PAGE_SIZE.toString(),
          offset: offset.toString(),
        })
        if (categorySlug) params.set('category', categorySlug)

        const res = await fetch(`/api/offers/nearby?${params}`)
        if (!res.ok) throw new Error('Error al cargar ofertas')

        const data: NearbyOffer[] = await res.json()

        if (reset) {
          setOffers(data)
          offsetRef.current = data.length
        } else {
          setOffers((prev) => [...prev, ...data])
          offsetRef.current += data.length
        }

        setHasMore(data.length === OFFERS_PAGE_SIZE)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [coordinates, radiusMeters, categorySlug]
  )

  // Reset and refetch when filters change
  useEffect(() => {
    offsetRef.current = 0
    setHasMore(true)
    fetchOffers(true)
  }, [coordinates?.lat, coordinates?.lng, radiusMeters, categorySlug]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchOffers(false)
    }
  }, [fetchOffers, isLoadingMore, hasMore])

  const refresh = useCallback(() => {
    offsetRef.current = 0
    setHasMore(true)
    fetchOffers(true)
  }, [fetchOffers])

  return { offers, isLoading, isLoadingMore, error, hasMore, loadMore, refresh }
}
