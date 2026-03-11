import { createClient } from '@/lib/supabase/server'
import type { NearbyOffer, Offer } from '@/types/offer.types'

export type OfferWithBusiness = Offer & {
  business: {
    id: string
    name: string
    slug: string
    description: string | null
    address: string
    city: string
    phone: string | null
    website: string | null
    logo_url: string | null
    cover_url: string | null
    lat: number
    lng: number
    category: {
      name: string
      slug: string
      color: string | null
    }
  } | null
}

export async function getNearbyOffers({
  lat,
  lng,
  radiusMeters = 5000,
  categorySlug,
  limit = 20,
  offset = 0,
}: {
  lat: number
  lng: number
  radiusMeters?: number
  categorySlug?: string | null
  limit?: number
  offset?: number
}): Promise<NearbyOffer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_nearby_offers', {
    user_lat: lat,
    user_lng: lng,
    radius_meters: radiusMeters,
    filter_category: categorySlug ?? undefined,
    limit_count: limit,
    offset_count: offset,
  })

  if (error) throw error
  return (data as NearbyOffer[]) ?? []
}

export async function getOfferById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      business:businesses(
        id, name, slug, description, address, city,
        phone, website, logo_url, cover_url, lat, lng,
        category:categories(name, slug, color)
      )
    `)
    .eq('id', id)
    .single<OfferWithBusiness>()

  if (error) throw error
  return data
}

export async function incrementViewCount(offerId: string) {
  const supabase = await createClient()

  await (supabase as any).rpc('increment_view_count', { offer_id: offerId })
}

export async function getOffersByBusiness(businessId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
