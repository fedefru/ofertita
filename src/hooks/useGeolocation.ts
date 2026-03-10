'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Coordinates } from '@/lib/distance'

const DEFAULT_FALLBACK: Coordinates = {
  lat: Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 40.4168),
  lng: Number(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? -3.7038),
}

interface GeolocationState {
  coordinates: Coordinates | null
  isLoading: boolean
  error: string | null
  isPermissionDenied: boolean
  refresh: () => void
}

export function useGeolocation(fallback: Coordinates = DEFAULT_FALLBACK): GeolocationState {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPermissionDenied, setIsPermissionDenied] = useState(false)

  const startWatch = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible en este navegador')
      setIsLoading(false)
      setCoordinates(fallback)
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoading(false)
        setIsPermissionDenied(false)
      },
      (err) => {
        if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
          setIsPermissionDenied(true)
          setError('Permiso de ubicación denegado')
        } else {
          setError('No se pudo obtener tu ubicación')
        }
        setCoordinates(fallback)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }, [fallback])

  useEffect(() => {
    startWatch()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => {
    startWatch()
  }, [startWatch])

  return { coordinates, isLoading, error, isPermissionDenied, refresh }
}
