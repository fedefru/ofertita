'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OfferForm } from '@/components/offers/OfferForm'
import { createClient } from '@/lib/supabase/client'
import type { OfferFormValues } from '@/lib/validations'
import type { Business } from '@/types/business.types'
import { toast } from 'sonner'

export default function NewOfferPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setIsLoadingBusinesses(false); return }

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_active', true)

      setBusinesses(data ?? [])
      setIsLoadingBusinesses(false)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(data: OfferFormValues & { image_url?: string }) {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Server-side ownership validation (layer 2)
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('id', data.business_id)
        .eq('owner_id', user.id)
        .single()

      if (!business) throw new Error('No tienes permiso para crear ofertas en este comercio')

      const { error } = await supabase.from('offers').insert({
        business_id: data.business_id,
        title: data.title,
        description: data.description || null,
        original_price: data.original_price,
        offer_price: data.offer_price,
        image_url: data.image_url || null,
        start_date: data.start_date,
        end_date: data.end_date,
      })

      if (error) throw error

      toast.success('Oferta creada con éxito')
      router.push('/dashboard/offers')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear la oferta')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingBusinesses) {
    return (
      <div className="max-w-2xl space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-[#E2E8F0]" />
        <div className="h-4 w-72 rounded bg-[#E2E8F0]" />
        <div className="h-96 w-full rounded-[20px] bg-[#E2E8F0]" />
      </div>
    )
  }

  if (!businesses.length) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">
          Primero debes registrar un comercio antes de crear ofertas
        </p>
        <a href="/dashboard/business" className="text-primary underline underline-offset-4">
          Registrar comercio
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nueva oferta</h1>
        <p className="text-muted-foreground">Crea una nueva oferta para tu comercio</p>
      </div>
      <OfferForm businesses={businesses} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
