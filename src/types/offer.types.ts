import type { Database } from './database.types'

export type Offer = Database['public']['Tables']['offers']['Row']
export type OfferInsert = Database['public']['Tables']['offers']['Insert']
export type OfferUpdate = Database['public']['Tables']['offers']['Update']

// Shape returned by the get_nearby_offers RPC function
export type NearbyOffer = {
  id: string
  title: string
  description: string | null
  original_price: number
  offer_price: number
  discount_pct: number
  image_url: string | null
  start_date: string
  end_date: string
  view_count: number
  save_count: number
  business_id: string
  business_name: string
  business_slug: string
  business_logo: string | null
  business_lat: number
  business_lng: number
  category_name: string
  category_slug: string
  category_color: string
  distance_meters: number
}

export type SavedOffer = {
  id: string
  created_at: string
  offer: Offer & {
    business: {
      name: string
      slug: string
      logo_url: string | null
      city: string
    }
  }
}
