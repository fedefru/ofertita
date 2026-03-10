import { createClient } from '@/lib/supabase/server'
import type { SavedOffer } from '@/types/offer.types'

export async function getSavedOffersByUser(userId: string): Promise<SavedOffer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('saved_offers')
    .select(`
      id,
      created_at,
      offer:offers(
        id, title, offer_price, original_price, discount_pct,
        image_url, end_date, is_active,
        business:businesses(name, slug, logo_url, city)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .returns<SavedOffer[]>()

  if (error) throw error
  return (data ?? []).filter((s) => s.offer !== null) as SavedOffer[]
}

export async function getSavedOfferIds(userId: string): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('saved_offers')
    .select('offer_id')
    .eq('user_id', userId)
    .returns<{ offer_id: string }[]>()

  if (error) throw error
  return (data ?? []).map((r) => r.offer_id)
}
