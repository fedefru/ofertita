export const DEFAULT_LOCATION = {
  lat: Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 40.4168),
  lng: Number(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? -3.7038),
}

export const RADIUS_OPTIONS = [
  { label: '500 m', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
]

export const DEFAULT_RADIUS = 5000

export const OFFERS_PAGE_SIZE = 20

export const MAX_IMAGE_SIZE_MB = 5
export const MAX_LOGO_SIZE_MB = 2

export const STORAGE_BUCKETS = {
  OFFER_IMAGES: 'offer-images',
  BUSINESS_ASSETS: 'business-assets',
} as const
