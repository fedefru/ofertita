'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { businessSchema, type BusinessFormValues } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { STORAGE_BUCKETS } from '@/lib/constants'
import type { Category } from '@/types/business.types'

interface BusinessFormProps {
  categories: Category[]
  defaultValues?: Partial<BusinessFormValues & { logo_url?: string; cover_url?: string }>
  onSubmit: (data: BusinessFormValues & { logo_url?: string; cover_url?: string }) => Promise<void>
  isLoading?: boolean
}

export function BusinessForm({ categories, defaultValues, onSubmit, isLoading }: BusinessFormProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(defaultValues?.logo_url ?? null)
  const [coverUrl, setCoverUrl] = useState<string | null>(defaultValues?.cover_url ?? null)
  const [isGeocoding, setIsGeocoding] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      category_id: defaultValues?.category_id ?? '',
      description: defaultValues?.description ?? '',
      address: defaultValues?.address ?? '',
      city: defaultValues?.city ?? '',
      phone: defaultValues?.phone ?? '',
      website: defaultValues?.website ?? '',
      lat: defaultValues?.lat ?? 40.4168,
      lng: defaultValues?.lng ?? -3.7038,
    },
  })

  const address = watch('address')
  const city = watch('city')

  async function geocodeAddress() {
    const query = `${address}, ${city}`
    if (!query.trim()) return

    setIsGeocoding(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        setValue('lat', parseFloat(data[0].lat))
        setValue('lng', parseFloat(data[0].lon))
      }
    } catch {
      // Silently fail — user can manually adjust
    } finally {
      setIsGeocoding(false)
    }
  }

  async function handleFormSubmit(data: BusinessFormValues) {
    await onSubmit({
      ...data,
      logo_url: logoUrl ?? undefined,
      cover_url: coverUrl ?? undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del comercio *</Label>
        <Input id="name" {...register('name')} placeholder="Pizzería La Italiana" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Categoría *</Label>
        <Select
          defaultValue={defaultValues?.category_id}
          onValueChange={(v) => setValue('category_id', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && (
          <p className="text-sm text-destructive">{errors.category_id.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Cuéntanos sobre tu negocio..."
          rows={3}
        />
      </div>

      {/* Address + City */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Dirección *</Label>
          <Input id="address" {...register('address')} placeholder="Calle Mayor 10" />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad *</Label>
          <Input id="city" {...register('city')} placeholder="Madrid" />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={geocodeAddress}
        disabled={isGeocoding || !address || !city}
      >
        {isGeocoding ? 'Buscando...' : 'Obtener coordenadas de la dirección'}
      </Button>

      {/* Lat/Lng (hidden inputs, shown for manual override) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitud</Label>
          <Input id="lat" type="number" step="any" {...register('lat', { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng">Longitud</Label>
          <Input id="lng" type="number" step="any" {...register('lng', { valueAsNumber: true })} />
        </div>
      </div>

      {/* Phone + Website */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...register('phone')} placeholder="+34 600 000 000" />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Web</Label>
          <Input id="website" {...register('website')} placeholder="https://..." />
          {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label>Logo (cuadrado, máx 2 MB)</Label>
        <ImageUpload
          value={logoUrl}
          onChange={setLogoUrl}
          bucket={STORAGE_BUCKETS.BUSINESS_ASSETS}
          folder="logos"
          maxSizeMB={2}
          aspectRatio="1/1"
          label="Subir logo"
          className="max-w-[200px]"
        />
      </div>

      {/* Cover */}
      <div className="space-y-2">
        <Label>Portada (máx 2 MB)</Label>
        <ImageUpload
          value={coverUrl}
          onChange={setCoverUrl}
          bucket={STORAGE_BUCKETS.BUSINESS_ASSETS}
          folder="covers"
          maxSizeMB={2}
          aspectRatio="16/9"
          label="Subir imagen de portada"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Guardando...' : 'Guardar comercio'}
      </Button>
    </form>
  )
}
