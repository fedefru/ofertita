'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BusinessForm } from '@/components/business/BusinessForm'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import type { BusinessFormValues } from '@/lib/validations'
import type { Category } from '@/types/business.types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => setCategories(data ?? []))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(
    data: BusinessFormValues & { logo_url?: string; cover_url?: string }
  ) {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const slug = generateSlug(data.name)

      const { error: bizError } = await supabase.from('businesses').insert({
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

      if (bizError) throw bizError

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'business_owner' })
        .eq('id', user.id)

      if (profileError) throw profileError

      toast.success('¡Comercio registrado! Ya puedes crear ofertas.')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al registrar el comercio')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { n: 1, label: 'Datos del comercio', active: true },
    { n: 2, label: 'Tus ofertas', active: false },
  ]

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Registra tu comercio</h1>
        <p className="text-muted-foreground text-sm">
          Completa los datos de tu negocio para empezar a publicar ofertas
        </p>
        {message && (
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-primary mt-3">
            {message}
          </div>
        )}
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.n} className="contents">
            <div className={cn('flex items-center gap-2 text-sm', !step.active && 'opacity-40')}>
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  step.active
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground'
                )}
              >
                {step.n}
              </span>
              <span className={cn('font-medium', step.active ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px flex-1 bg-border" />
            )}
          </div>
        ))}
      </div>

      <BusinessForm
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
