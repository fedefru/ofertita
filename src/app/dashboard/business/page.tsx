'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BusinessForm } from '@/components/business/BusinessForm'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import type { BusinessFormValues } from '@/lib/validations'
import type { Category, Business } from '@/types/business.types'
import { toast } from 'sonner'

export default function BusinessPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [business, setBusiness] = useState<Business | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: cats }, { data: biz }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('businesses').select('*').eq('owner_id', user.id).maybeSingle(),
      ])

      setCategories(cats ?? [])
      setBusiness(biz ?? null)  // null = no business yet, undefined = still loading
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(data: BusinessFormValues & { logo_url?: string; cover_url?: string }) {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      if (business) {
        // Update
        const { error } = await supabase
          .from('businesses')
          .update({
            name: data.name,
            category_id: data.category_id,
            description: data.description,
            address: data.address,
            city: data.city,
            phone: data.phone || null,
            website: data.website || null,
            lat: data.lat,
            lng: data.lng,
            logo_url: data.logo_url || null,
            cover_url: data.cover_url || null,
          })
          .eq('id', business.id)

        if (error) throw error
        toast.success('Comercio actualizado')
      } else {
        // Create
        const slug = generateSlug(data.name)
        const { error } = await supabase.from('businesses').insert({
          owner_id: user.id,
          name: data.name,
          slug,
          category_id: data.category_id,
          description: data.description,
          address: data.address,
          city: data.city,
          phone: data.phone || null,
          website: data.website || null,
          lat: data.lat,
          lng: data.lng,
          logo_url: data.logo_url || null,
          cover_url: data.cover_url || null,
        })

        if (error) throw error

        // Promote to business_owner
        await supabase
          .from('profiles')
          .update({ role: 'business_owner' })
          .eq('id', user.id)

        toast.success('Comercio creado')
      }

      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  if (business === undefined) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        <div className="space-y-3 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{business ? 'Editar comercio' : 'Mi comercio'}</h1>
        <p className="text-muted-foreground">
          {business
            ? 'Actualiza la información de tu comercio'
            : 'Completa los datos de tu comercio'}
        </p>
      </div>

      <BusinessForm
        key={business?.id ?? 'new'}
        categories={categories}
        defaultValues={business ?? undefined}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
