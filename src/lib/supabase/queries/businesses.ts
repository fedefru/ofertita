import { createClient } from '@/lib/supabase/server'

export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      category:categories(name, slug, color, icon),
      offers(
        id, title, offer_price, original_price, discount_pct,
        image_url, end_date, is_active
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data
}

export async function getBusinessesByOwner(ownerId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      category:categories(name, slug, color)
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data ?? []
}

