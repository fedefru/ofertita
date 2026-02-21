import { createClient } from '@/lib/supabase/server'

export async function getSavedOffersByUser(userId: string) {
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

  if (error) throw error
  return data ?? []
}

export async function getSavedOfferIds(userId: string): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('saved_offers')
    .select('offer_id')
    .eq('user_id', userId)

  if (error) throw error
  return (data ?? []).map((r) => r.offer_id)
}
