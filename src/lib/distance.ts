export interface Coordinates {
  lat: number
  lng: number
}

export function haversineDistance(from: Coordinates, to: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) // km
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function metersToKm(meters: number): number {
  return meters / 1000
}

// 1 cuadra ≈ 100 m (Argentine city block)
export function metersToBlocks(meters: number): string {
  if (meters < 120) return 'A menos de 1 cuadra'
  if (meters < 1100) {
    const blocks = Math.round(meters / 100)
    return `A ${blocks} cuadra${blocks !== 1 ? 's' : ''} de vos`
  }
  return `A ${(meters / 1000).toFixed(1)} km de vos`
}
