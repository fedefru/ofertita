'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { OfferForm } from '@/components/offers/OfferForm'
import { createClient } from '@/lib/supabase/client'
import type { OfferFormValues } from '@/lib/validations'
import type { Business } from '@/types/business.types'
import type { Offer } from '@/types/offer.types'
import { toast } from 'sonner'

export default function EditOfferPage() {
  const params = useParams()
  const offerId = params.id as string
  const router = useRouter()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: offerData }, { data: bizData }] = await Promise.all([
        supabase.from('offers').select('*').eq('id', offerId).single<Offer>(),
        supabase.from('businesses').select('*').eq('owner_id', user.id),
      ])

      // IDOR check: verify the offer belongs to one of the user's businesses
      const ownedIds = new Set((bizData ?? []).map((b) => b.id))
      if (!offerData || !ownedIds.has(offerData.business_id)) {
        router.replace('/dashboard/offers')
        return
      }

      setOffer(offerData)
      setBusinesses(bizData ?? [])
    }
    load()
  }, [offerId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(data: OfferFormValues & { image_url?: string }) {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Ownership verification
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('id', data.business_id)
        .eq('owner_id', user.id)
        .single<{ id: string }>()

      if (!business) throw new Error('No tienes permiso para editar esta oferta')

      const { error } = await supabase
        .from('offers')
        .update({
          title: data.title,
          description: data.description || null,
          original_price: data.original_price,
          offer_price: data.offer_price,
          image_url: data.image_url || null,
          start_date: data.start_date,
          end_date: data.end_date,
        })
        .eq('id', offerId)

      if (error) throw error

      toast.success('Oferta actualizada')
      router.push('/dashboard/offers')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setIsLoading(false)
    }
  }

  if (!offer || !businesses.length) {
    return (
      <div className="max-w-2xl">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar oferta</h1>
        <p className="text-muted-foreground">{offer.title}</p>
      </div>
      <OfferForm
        businesses={businesses}
        defaultValues={{
          business_id: offer.business_id,
          title: offer.title,
          description: offer.description ?? '',
          original_price: offer.original_price ?? undefined,
          offer_price: offer.offer_price ?? undefined,
          start_date: offer.start_date.slice(0, 16),
          end_date: offer.end_date.slice(0, 16),
          image_url: offer.image_url ?? '',
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
