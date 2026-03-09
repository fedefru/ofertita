'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { offerSchema, type OfferFormValues } from '@/lib/validations'
import { ImageUpload } from '@/components/shared/ImageUpload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STORAGE_BUCKETS } from '@/lib/constants'
import {
  Camera,
  PencilLine,
  Zap,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Store,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Business } from '@/types/business.types'

// ─── Constants ────────────────────────────────────────────────────────────────

type Mode = 'foto' | 'texto'

const DURACIONES = [
  { label: 'Solo hoy', hours: 24 },
  { label: '3 días', hours: 72 },
  { label: 'Toda la semana', hours: 168 },
  { label: '2 semanas', hours: 336 },
] as const

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#1F2937] placeholder-[#B0B7C3] outline-none transition-all focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10'
const labelCls = 'mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]'
const errorCls = 'mt-1.5 text-[12px] text-red-500'

// ─── Preview ─────────────────────────────────────────────────────────────────

function VidrieraPreview({
  mode,
  title,
  description,
  offerPrice,
  originalPrice,
  imageUrl,
  comercio,
}: {
  mode: Mode
  title: string | undefined
  description: string | undefined
  offerPrice: number | undefined
  originalPrice: number | undefined
  imageUrl: string | null
  comercio: string
}) {
  const hasPrice = Boolean(offerPrice && Number(offerPrice) > 0)
  const hasImage = mode === 'foto' && imageUrl

  const discount =
    hasPrice &&
    originalPrice &&
    Number(offerPrice) < Number(originalPrice)
      ? ((Number(originalPrice) - Number(offerPrice)) / Number(originalPrice)) * 100
      : 0

  const displayPrice = hasPrice
    ? `$${Number(offerPrice).toLocaleString('es-AR')}`
    : null
  const displayOriginal =
    originalPrice && Number(originalPrice) > 0
      ? `$${Number(originalPrice).toLocaleString('es-AR')}`
      : null

  const displayTitle = title || 'Título de tu oferta'
  const displayComercio = comercio || 'Tu comercio'

  return (
    <div>
      {/* Label */}
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
          Vista previa en la vidriera
        </span>
      </div>

      {hasImage ? (
        /* ── Image card — with or without price ─── */
        <div
          className="overflow-hidden rounded-[20px] bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.09)' }}
        >
          <div className="relative h-40 w-full">
            <Image src={imageUrl} alt={displayTitle} fill className="object-cover" />
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-[#6366F1] px-2.5 py-1 text-[11px] font-bold text-white">
                -{Math.round(discount)}%
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
              {displayComercio}
            </p>

            {hasPrice ? (
              /* Normal layout when price is present */
              <>
                <p className="mb-2 text-[15px] font-bold leading-snug text-[#1F2937]">
                  {displayTitle}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[22px] font-black text-[#F97316]">{displayPrice}</p>
                  {displayOriginal && discount > 0 && (
                    <p className="text-[12px] text-[#9CA3AF] line-through">{displayOriginal}</p>
                  )}
                </div>
              </>
            ) : (
              /* Title as hero when no price */
              <p className="mb-1 text-[20px] font-black leading-tight text-[#1F2937]">
                {displayTitle}
              </p>
            )}

            {description && (
              <p className="mt-1.5 text-[12px] leading-snug text-[#6B7280] line-clamp-2">
                {description}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#B0B7C3]">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                A 2 cuadras
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Ahora mismo
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ── Pizarra / text card ────────────────── */
        <div
          className="relative overflow-hidden rounded-[20px] p-5"
          style={{
            background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)',
            minHeight: hasPrice ? '196px' : '210px',
            boxShadow: '0 4px 20px rgba(99,102,241,0.25)',
          }}
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
            style={{ background: '#F97316', opacity: 0.18 }}
          />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#F97316]">
                {displayComercio}
              </p>

              {hasPrice ? (
                /* Normal pizarra layout with price */
                <>
                  <p className="mb-2 text-[17px] font-black leading-tight text-white">
                    {displayTitle}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[26px] font-black text-[#F97316]">{displayPrice}</p>
                    {displayOriginal && discount > 0 && (
                      <p className="text-[12px] text-white/40 line-through">{displayOriginal}</p>
                    )}
                  </div>
                  {discount > 0 && (
                    <span className="mt-2 inline-block rounded-full bg-[#F97316]/20 px-2.5 py-1 text-[11px] font-bold text-[#F97316]">
                      -{Math.round(discount)}% de ahorro
                    </span>
                  )}
                </>
              ) : (
                /* Title as protagonist when no price */
                <>
                  <p className="mb-3 text-[24px] font-black leading-tight text-white">
                    {displayTitle}
                  </p>
                  {description && (
                    <p className="text-[13px] leading-snug text-white/60 line-clamp-3">
                      {description}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between text-[11px] text-white/40">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                A 2 cuadras
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Ahora mismo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {!title && !hasPrice && (
        <p className="mt-3 text-center text-[12px] text-[#B0B7C3]">
          Completá el formulario para ver la vista previa
        </p>
      )}
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface OfferFormProps {
  businesses: Business[]
  defaultValues?: Partial<OfferFormValues & { image_url?: string }>
  onSubmit: (data: OfferFormValues & { image_url?: string }) => Promise<void>
  isLoading?: boolean
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function OfferForm({ businesses, defaultValues, onSubmit, isLoading }: OfferFormProps) {
  const [mode, setMode] = useState<Mode>('foto')
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValues?.image_url ?? null)
  const [duracionIdx, setDuracionIdx] = useState(0)
  const [showDesc, setShowDesc] = useState(false)

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
      original_price: defaultValues?.original_price ?? undefined,
      offer_price: defaultValues?.offer_price ?? undefined,
      start_date: defaultValues?.start_date ?? new Date().toISOString().slice(0, 16),
      end_date: defaultValues?.end_date ?? '',
    },
  })

  // Keep start_date = now
  useEffect(() => {
    if (!defaultValues?.start_date) {
      setValue('start_date', new Date().toISOString().slice(0, 16))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Recompute end_date when duration selection changes
  useEffect(() => {
    const dur = DURACIONES[duracionIdx]
    const end = new Date(Date.now() + dur.hours * 60 * 60 * 1000)
    setValue('end_date', end.toISOString().slice(0, 16))
  }, [duracionIdx, setValue])

  const title = watch('title')
  const description = watch('description')
  const offerPrice = watch('offer_price')
  const originalPrice = watch('original_price')
  const businessId = watch('business_id')

  const selectedBusiness = businesses.find((b) => b.id === businessId) ?? businesses[0]

  const hasPrice = Boolean(offerPrice && Number(offerPrice) > 0)
  const hasOriginal = Boolean(originalPrice && Number(originalPrice) > 0)

  const discount =
    hasPrice && hasOriginal && Number(offerPrice) < Number(originalPrice)
      ? ((Number(originalPrice) - Number(offerPrice)) / Number(originalPrice)) * 100
      : 0

  // Auto-expand description when there's no price (it becomes the main content)
  useEffect(() => {
    if (!hasPrice && !hasOriginal && mode === 'foto') {
      setShowDesc(true)
    }
  }, [hasPrice, hasOriginal, mode])

  async function handleFormSubmit(data: OfferFormValues) {
    const now = new Date().toISOString().slice(0, 16)
    const dur = DURACIONES[duracionIdx]
    const end = new Date(Date.now() + dur.hours * 60 * 60 * 1000).toISOString().slice(0, 16)
    await onSubmit({
      ...data,
      start_date: now,
      end_date: end,
      image_url: imageUrl ?? undefined,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
      {/* ── FORM ──────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Hidden date fields — set programmatically */}
        <input type="hidden" {...register('start_date')} />
        <input type="hidden" {...register('end_date')} />

        {/* Mode toggle */}
        <div
          className="flex w-fit rounded-[14px] border border-[#E5E7EB] bg-[#F8FAFC] p-1"
          role="group"
          aria-label="Modo de publicación"
        >
          {([
            { value: 'foto', Icon: Camera, label: 'Modo Foto' },
            { value: 'texto', Icon: PencilLine, label: 'Modo Texto' },
          ] as const).map(({ value, Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn(
                'flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-semibold transition-all',
                mode === value
                  ? 'bg-white text-[#1F2937] shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#6B7280]'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Image upload — hero area in Foto mode */}
        {mode === 'foto' && (
          <div>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              bucket={STORAGE_BUCKETS.OFFER_IMAGES}
              aspectRatio="4/3"
              label="Tocá para subir la foto de tu pizarra"
            />
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className={labelCls}>
            {mode === 'foto' ? 'Título rápido' : 'Título de la oferta'}
          </label>
          <input
            id="title"
            placeholder={
              mode === 'foto'
                ? 'Ej: Pollo al disco — oferta especial'
                : 'Ej: 10% MODO · Nalga $9.000/kg · 2x1 en pizzas'
            }
            className={inputCls}
            {...register('title')}
          />
          {errors.title && <p className={errorCls}>{errors.title.message}</p>}
        </div>

        {/* Description — prominent in Texto mode */}
        {mode === 'texto' && (
          <div>
            <label htmlFor="description" className={labelCls}>
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder={
                !hasPrice
                  ? 'Ej: Válido todos los lunes con tarjetas de crédito'
                  : 'Describí la oferta: condiciones, cantidades, stock disponible...'
              }
              className={cn(inputCls, 'resize-none')}
              {...register('description')}
            />
            {errors.description && (
              <p className={errorCls}>{errors.description.message}</p>
            )}
          </div>
        )}

        {/* Prices */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="offer_price" className={labelCls}>
                Precio oferta{' '}
                <span className="normal-case font-normal text-[#B0B7C3]">(opcional)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#F97316]">
                  $
                </span>
                <input
                  id="offer_price"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="12.000"
                  className={cn(inputCls, 'pl-8')}
                  {...register('offer_price')}
                />
              </div>
              {errors.offer_price && (
                <p className={errorCls}>{errors.offer_price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="original_price" className={labelCls}>
                Precio original{' '}
                <span className="normal-case font-normal text-[#B0B7C3]">(opcional)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-medium text-[#9CA3AF]">
                  $
                </span>
                <input
                  id="original_price"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="18.000"
                  className={cn(inputCls, 'pl-8')}
                  {...register('original_price')}
                />
              </div>
              {errors.original_price && (
                <p className={errorCls}>{errors.original_price.message}</p>
              )}
            </div>
          </div>

          {/* Live discount badge — when both prices present */}
          {discount > 0 && (
            <div className="mt-2.5 flex items-center gap-2.5 rounded-[12px] border border-emerald-100 bg-emerald-50 px-4 py-2.5">
              <Zap className="h-4 w-4 flex-shrink-0 fill-emerald-500 text-emerald-500" />
              <span className="text-[13px] text-emerald-700">
                Tus vecinos ahorran{' '}
                <strong className="font-bold">{Math.round(discount)}%</strong> — ¡Eso atrae
                clientes!
              </span>
            </div>
          )}

          {/* Hint when no price — title & description take over */}
          {!hasPrice && !hasOriginal && (
            <div className="mt-2.5 flex items-start gap-2.5 rounded-[12px] border border-indigo-100 bg-indigo-50 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-400" />
              <p className="text-[12px] leading-snug text-indigo-600">
                <strong className="font-semibold">Sin precio fijo.</strong> El título será el
                protagonista en la vidriera.{' '}
                <span className="text-indigo-500">
                  Usá la descripción para aclarar condiciones.
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Duration chips */}
        <div>
          <label className={labelCls}>¿Hasta cuándo?</label>
          <div className="flex flex-wrap gap-2">
            {DURACIONES.map((d, i) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setDuracionIdx(i)}
                className={cn(
                  'rounded-full border px-4 py-2 text-[13px] font-semibold transition-all',
                  duracionIdx === i
                    ? 'border-[#F97316] bg-[#F97316] text-white shadow-sm'
                    : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#F97316]/40 hover:text-[#F97316]'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible description — Foto mode */}
        {mode === 'foto' && (
          <div>
            <button
              type="button"
              onClick={() => {
                if (showDesc) setValue('description', '')
                setShowDesc((v) => !v)
              }}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6366F1] transition-colors hover:text-[#4F46E5]"
            >
              {showDesc ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {showDesc ? 'Quitar descripción' : '+ Agregar descripción'}
            </button>
            {showDesc && (
              <div className="mt-3">
                <textarea
                  rows={3}
                  placeholder={
                    !hasPrice
                      ? 'Ej: Válido todos los lunes con tarjetas de crédito'
                      : 'Condiciones, cantidades, stock disponible...'
                  }
                  className={cn(inputCls, 'resize-none')}
                  {...register('description')}
                />
                {errors.description && (
                  <p className={errorCls}>{errors.description.message}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Business selector — only shown when user has multiple businesses */}
        {businesses.length > 1 && (
          <div>
            <label className={labelCls}>
              <Store className="mr-1.5 inline h-3.5 w-3.5" />
              Comercio
            </label>
            <Select
              defaultValue={defaultValues?.business_id ?? businesses[0]?.id}
              onValueChange={(v) => setValue('business_id', v)}
            >
              <SelectTrigger className="h-12 rounded-[14px] border-[#E5E7EB] bg-white text-[15px]">
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
              <p className={errorCls}>{errors.business_id.message}</p>
            )}
          </div>
        )}

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2.5 rounded-[16px] py-4 text-[16px] font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: isLoading
              ? '#9CA3AF'
              : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            boxShadow: isLoading ? 'none' : '0 4px 22px rgba(249,115,22,0.42)',
          }}
        >
          <Zap className="h-5 w-5 fill-white/80" />
          {isLoading ? 'Publicando...' : 'Publicar en la vidriera'}
        </button>
      </form>

      {/* ── PREVIEW ───────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <VidrieraPreview
          mode={mode}
          title={title}
          description={description}
          offerPrice={offerPrice}
          originalPrice={originalPrice}
          imageUrl={imageUrl}
          comercio={selectedBusiness?.name ?? ''}
        />
      </div>
    </div>
  )
}
