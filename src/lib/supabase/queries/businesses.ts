import { createClient } from '@/lib/supabase/server'
import type { Business, Category } from '@/types/business.types'

type BusinessOffer = {
  id: string
  title: string
  offer_price: number | null
  original_price: number | null
  discount_pct: number | null
  image_url: string | null
  end_date: string
  is_active: boolean
}

type BusinessCategory = {
  name: string
  slug: string
  color: string | null
  icon: string | null
}

export type BusinessWithDetails = Business & {
  category: BusinessCategory
  offers: BusinessOffer[]
}

export type BusinessWithCategoryRow = Business & {
  category: { name: string; slug: string; color: string | null }
}

export async function getBusinessBySlug(slug: string): Promise<BusinessWithDetails> {
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
    .single<BusinessWithDetails>()

  if (error) throw error
  return data
}

export async function getBusinessesByOwner(ownerId: string): Promise<BusinessWithCategoryRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      category:categories(name, slug, color)
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })
    .returns<BusinessWithCategoryRow[]>()

  if (error) throw error
  return data ?? []
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
    .returns<Category[]>()

  if (error) throw error
  return data ?? []
}

