'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Phone, MapPin, Clock, Store, ArrowLeft, Navigation, ChevronRight } from 'lucide-react'
import { formatTimeLeft, formatDiscountPct, formatCurrency } from '@/lib/formatters'

const EASE = [0.16, 1, 0.3, 1] as const

interface OfferDetailProps {
  offer: {
    id: string
    title: string
    description: string | null
    original_price: number
    offer_price: number
    discount_pct: number
    image_url: string | null
    start_date: string
    end_date: string
    view_count: number
    business: {
      id: string
      name: string
      slug: string
      description: string | null
      address: string
      city: string
      phone: string | null
      website: string | null
      logo_url: string | null
      cover_url: string | null
      lat: number
      lng: number
      category: {
        name: string
        slug: string
        color: string
      }
    }
  }
}

export function OfferDetail({ offer }: OfferDetailProps) {
  const { label: timeLabel, isUrgent, isExpired } = formatTimeLeft(offer.end_date)
  const { business } = offer
  const savings = offer.original_price - offer.offer_price
  const mapsUrl = `https://maps.google.com/?q=${business.lat},${business.lng}`

  const categoryBg = `${business.category.color}1a`
  const categoryColor = business.category.color

  // Time badge colors
  const timeBg = isExpired
    ? 'rgba(239,68,68,0.08)'
    : isUrgent
    ? 'rgba(249,115,22,0.08)'
    : 'rgba(99,102,241,0.08)'
  const timeColor = isExpired ? '#EF4444' : isUrgent ? '#F97316' : '#6366F1'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="mb-8"
      >
        <Link
          href="/explore"
          className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#94A3B8] transition-colors hover:text-[#1F2937]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Volver a explorar
        </Link>
      </motion.div>

      {/* Hero image */}
      {offer.image_url && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: EASE }}
          className="relative mb-8 aspect-video w-full overflow-hidden rounded-[24px]"
          style={{ boxShadow: '0 12px 40px rgba(15,23,42,0.14), 0 2px 8px rgba(15,23,42,0.06)' }}
        >
          <Image
            src={offer.image_url}
            alt={offer.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

          {/* Discount pill — firma del sistema */}
          <div className="absolute bottom-5 left-5">
            <span className="flex items-center gap-2 rounded-full bg-[#6366F1] px-4 py-2 shadow-lg">
              <span className="text-sm font-bold text-white">
                {formatDiscountPct(offer.discount_pct)}
              </span>
              <span className="text-xs text-white/70">· ahorra {formatCurrency(savings)}</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Two-column layout: 3/2 split */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">

        {/* ── Left: offer content ───────────────────────────────── */}
        <div className="space-y-5 md:col-span-3">

          {/* Category pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: EASE }}
          >
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ backgroundColor: categoryBg, color: categoryColor }}
            >
              {business.category.name}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
            className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-black leading-[1.1] tracking-[-0.025em] text-[#1F2937]"
          >
            {offer.title}
          </motion.h1>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
            className="flex items-baseline gap-3"
          >
            <span className="text-[2.2rem] font-black leading-none text-[#10B981]">
              {formatCurrency(offer.offer_price)}
            </span>
            <span className="text-lg text-[#CBD5E1] line-through">
              {formatCurrency(offer.original_price)}
            </span>
          </motion.div>

          {/* Time badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.30, ease: EASE }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold"
              style={{ backgroundColor: timeBg, color: timeColor }}
            >
              <Clock className="h-3.5 w-3.5" />
              {isExpired ? 'Oferta expirada' : `Válida ${timeLabel}`}
            </span>
          </motion.div>

          {/* Description */}
          {offer.description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.36, ease: EASE }}
              className="border-t border-[rgba(15,23,42,0.06)] pt-5 text-[15px] leading-relaxed text-[#6B7280]"
            >
              {offer.description}
            </motion.p>
          )}
        </div>

        {/* ── Right: business card (sticky on desktop) ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="md:col-span-2"
        >
          <div className="md:sticky md:top-24">
            <div
              className="overflow-hidden rounded-[20px] bg-white"
              style={{
                boxShadow:
                  '0 2px 16px rgba(99,102,241,0.08), 0 1px 4px rgba(15,23,42,0.05)',
              }}
            >
              {/* Business header — clickable */}
              <Link
                href={`/businesses/${business.slug}`}
                className="group flex items-center gap-3.5 p-5 transition-colors hover:bg-[#F8FAFC]"
              >
                {business.logo_url ? (
                  <Image
                    src={business.logo_url}
                    alt={business.name}
                    width={52}
                    height={52}
                    className="h-[52px] w-[52px] flex-shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <div
                    className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: categoryBg }}
                  >
                    <Store className="h-5 w-5" style={{ color: categoryColor }} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-[#1F2937] transition-colors group-hover:text-[#6366F1]">
                    {business.name}
                  </p>
                  <p className="text-[12px] text-[#94A3B8]">{business.city}</p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#CBD5E1] transition-colors group-hover:text-[#6366F1]" />
              </Link>

              {/* Divider */}
              <div className="mx-5 h-px bg-[rgba(15,23,42,0.06)]" />

              {/* Contact rows */}
              <div className="space-y-0.5 p-4">
                <div className="flex items-start gap-3 rounded-xl px-2 py-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#CBD5E1]" />
                  <span className="text-[13px] leading-relaxed text-[#6B7280]">
                    {business.address}, {business.city}
                  </span>
                </div>

                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#F8FAFC]"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-[#CBD5E1]" />
                    <span className="text-[13px] font-semibold text-[#6366F1]">
                      {business.phone}
                    </span>
                  </a>
                )}

                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#F8FAFC]"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0 text-[#CBD5E1]" />
                    <span className="text-[13px] font-semibold text-[#6366F1]">Visitar web</span>
                  </a>
                )}
              </div>

              {/* Maps CTA */}
              <div className="px-4 pb-4 pt-1">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#6366F1] py-3 text-[14px] font-bold text-white transition-all duration-200 hover:bg-[#4F46E5]"
                  style={{ boxShadow: '0 4px 14px rgba(99,102,241,0.30)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.30)'
                  }}
                >
                  <Navigation className="h-4 w-4" />
                  Cómo llegar
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
