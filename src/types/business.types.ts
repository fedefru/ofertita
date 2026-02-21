import type { Database } from './database.types'

export type Business = Database['public']['Tables']['businesses']['Row']
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert']
export type BusinessUpdate = Database['public']['Tables']['businesses']['Update']

export type Category = Database['public']['Tables']['categories']['Row']

export type Profile = Database['public']['Tables']['profiles']['Row']

export type BusinessWithCategory = Business & {
  category: Category
}
