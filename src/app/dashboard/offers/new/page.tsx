'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OfferForm } from '@/components/offers/OfferForm'
import { createClient } from '@/lib/supabase/client'
import type { OfferFormValues } from '@/lib/validations'
import type { Business } from '@/types/business.types'
import { toast } from 'sonner'
import { Store } from 'lucide-react'
import Link from 'next/link'

export default function NewOfferPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setIsLoadingBusinesses(false)
        return
      }

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
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Server-side ownership validation (layer 2)
      const { data: business } = await supabase
        .from('businesses')
        .select('id, city')
        .eq('id', data.business_id)
        .eq('owner_id', user.id)
        .single()

      if (!business) throw new Error('No tienes permiso para crear ofertas en este comercio')

      const { error } = await supabase.from('offers').insert({
        business_id: data.business_id,
        title: data.title,
        description: data.description || null,
        // Prices are optional — send null when absent so DB stores NULL (not 0)
        original_price: data.original_price ?? null,
        offer_price: data.offer_price ?? null,
        image_url: data.image_url || null,
        start_date: data.start_date,
        end_date: data.end_date,
      })

      if (error) throw error

      const selectedBusiness = businesses.find((b) => b.id === data.business_id)
      const city = selectedBusiness?.city ?? 'tu ciudad'

      toast.success(`Tu oferta ya está visible para los vecinos de ${city}`, {
        duration: 5000,
      })
      router.push('/dashboard/offers')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear la oferta')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading skeleton
  if (isLoadingBusinesses) {
    return (
      <div className="max-w-4xl animate-pulse space-y-4">
        <div className="h-8 w-52 rounded-xl bg-[#E2E8F0]" />
        <div className="h-4 w-80 rounded bg-[#E2E8F0]" />
        <div className="h-[480px] w-full rounded-[20px] bg-[#E2E8F0]" />
      </div>
    )
  }

  // No business registered yet
  if (!businesses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px]"
          style={{ background: 'rgba(249,115,22,0.10)' }}
        >
          <Store className="h-7 w-7 text-[#F97316]" />
        </div>
        <h2 className="mb-2 text-[18px] font-bold text-[#1F2937]">
          Primero registrá tu comercio
        </h2>
        <p className="mb-6 max-w-sm text-[14px] text-[#6B7280]">
          Para publicar ofertas necesitás tener al menos un comercio activo en tu cuenta.
        </p>
        <Link
          href="/dashboard/business"
          className="inline-flex items-center gap-2 rounded-[14px] bg-[#F97316] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#EA580C]"
          style={{ boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}
        >
          Registrar mi comercio
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[1.5rem] font-black tracking-tight text-[#1F2937]">
          Nueva oferta
        </h1>
        <p className="mt-1 text-[14px] text-[#6B7280]">
          Publicá en segundos — tus vecinos la verán de inmediato.
        </p>
      </div>

      <OfferForm
        businesses={businesses}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
