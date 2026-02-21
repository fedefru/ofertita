import { createClient } from '@/lib/supabase/server'
import type { NearbyOffer } from '@/types/offer.types'

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
    filter_category: categorySlug ?? null,
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
    .single()

  if (error) throw error
  return data
}

export async function incrementViewCount(offerId: string) {
  const supabase = await createClient()

  await supabase.rpc('increment_view_count' as never, { offer_id: offerId })
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
