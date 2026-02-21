'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { offerSchema, type OfferFormValues } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { formatDiscountPct } from '@/lib/formatters'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { useState } from 'react'
import type { Business } from '@/types/business.types'

interface OfferFormProps {
  businesses: Business[]
  defaultValues?: Partial<OfferFormValues & { image_url?: string }>
  onSubmit: (data: OfferFormValues & { image_url?: string }) => Promise<void>
  isLoading?: boolean
}

export function OfferForm({ businesses, defaultValues, onSubmit, isLoading }: OfferFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValues?.image_url ?? null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      business_id: defaultValues?.business_id ?? businesses[0]?.id ?? '',
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      original_price: defaultValues?.original_price,
      offer_price: defaultValues?.offer_price,
      start_date: defaultValues?.start_date ?? new Date().toISOString().slice(0, 16),
      end_date: defaultValues?.end_date ?? '',
    },
  })

  const originalPrice = watch('original_price')
  const offerPrice = watch('offer_price')
  const discountPct =
    originalPrice && offerPrice && offerPrice < originalPrice
      ? ((originalPrice - offerPrice) / originalPrice) * 100
      : 0

  async function handleFormSubmit(data: OfferFormValues) {
    await onSubmit({ ...data, image_url: imageUrl ?? undefined })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Business selector */}
      {businesses.length > 1 && (
        <div className="space-y-2">
          <Label>Comercio</Label>
          <Select
            defaultValue={defaultValues?.business_id ?? businesses[0]?.id}
            onValueChange={(v) => setValue('business_id', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un comercio" />
            </SelectTrigger>
            <SelectContent>
              {businesses.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.business_id && (
            <p className="text-sm text-destructive">{errors.business_id.message}</p>
          )}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título de la oferta *</Label>
        <Input id="title" {...register('title')} placeholder="Ej: 30% dto en pizzas" />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe la oferta..."
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="original_price">Precio original (€) *</Label>
          <Input
            id="original_price"
            type="number"
            step="0.01"
            min="0"
            {...register('original_price')}
            placeholder="19.99"
          />
          {errors.original_price && (
            <p className="text-sm text-destructive">{errors.original_price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="offer_price">Precio oferta (€) *</Label>
          <Input
            id="offer_price"
            type="number"
            step="0.01"
            min="0"
            {...register('offer_price')}
            placeholder="12.99"
          />
          {errors.offer_price && (
            <p className="text-sm text-destructive">{errors.offer_price.message}</p>
          )}
        </div>
      </div>

      {/* Live discount preview */}
      {discountPct > 0 && (
        <div className="rounded-lg bg-green-50 p-3 flex items-center gap-2">
          <span className="text-sm text-green-700">Descuento calculado:</span>
          <span className="font-bold text-green-700">{formatDiscountPct(discountPct)}</span>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Inicio *</Label>
          <Input id="start_date" type="datetime-local" {...register('start_date')} />
          {errors.start_date && (
            <p className="text-sm text-destructive">{errors.start_date.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Fin *</Label>
          <Input id="end_date" type="datetime-local" {...register('end_date')} />
          {errors.end_date && (
            <p className="text-sm text-destructive">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label>Imagen de la oferta</Label>
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          bucket={STORAGE_BUCKETS.OFFER_IMAGES}
          aspectRatio="4/3"
          label="Subir imagen de la oferta"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Guardando...' : 'Guardar oferta'}
      </Button>
    </form>
  )
}
