'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Clock,
  MapPin,
  ArrowRight,
  Leaf,
  Utensils,
  Coffee,
  Fish,
  Wheat,
  ShoppingBasket,
  type LucideIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type BaseOferta = {
  id: number
  comercio: string
  producto: string
  precio: string
  unidad: string
  ubicacion: string
  hace: string
}

type ImageOferta = BaseOferta & {
  type: 'image'
  gradiente: string
  Icon: LucideIcon
  iconColor: string
}

type TextOferta = BaseOferta & {
  type: 'text'
  bg: string
  acento: string
  tag: string
}

type Oferta = ImageOferta | TextOferta

// ─── Mock data — barrio porteño realista ─────────────────────────────────────

const OFERTAS: Oferta[] = [
  {
    id: 1,
    type: 'text',
    comercio: 'Carnicería El Tony',
    tag: 'Carnicería',
    producto: 'Nalga',
    precio: '$10.000',
    unidad: '/ kg',
    ubicacion: 'A 2 cuadras',
    hace: 'Hace 15 min',
    bg: 'linear-gradient(145deg, #1C0A00 0%, #3D1100 100%)',
    acento: '#F97316',
  },
  {
    id: 2,
    type: 'image',
    comercio: 'Verdulería Los Hermanos',
    producto: 'Tomate perita',
    precio: '$2.000',
    unidad: '/ kg',
    ubicacion: 'A 4 cuadras',
    hace: 'Hace 32 min',
    gradiente: 'linear-gradient(145deg, #052E16 0%, #166534 100%)',
    Icon: Leaf,
    iconColor: '#4ADE80',
  },
  {
    id: 3,
    type: 'text',
    comercio: 'Panadería La Tradicional',
    tag: 'Panadería',
    producto: 'Medialunas',
    precio: '$150',
    unidad: 'c/u',
    ubicacion: 'A 1 cuadra',
    hace: 'Hace 8 min',
    bg: 'linear-gradient(145deg, #3B0D02 0%, #7C2D12 100%)',
    acento: '#FBBF24',
  },
  {
    id: 4,
    type: 'image',
    comercio: 'Rotisería Don Miguel',
    producto: 'Pollo entero',
    precio: '$7.500',
    unidad: '/ kg',
    ubicacion: 'A 6 cuadras',
    hace: 'Hace 45 min',
    gradiente: 'linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)',
    Icon: Utensils,
    iconColor: '#A5B4FC',
  },
  {
    id: 5,
    type: 'text',
    comercio: 'Pescadería El Mar',
    tag: 'Pescadería',
    producto: 'Merluza filet',
    precio: '$12.000',
    unidad: '/ kg',
    ubicacion: 'A 3 cuadras',
    hace: 'Hace 1 hora',
    bg: 'linear-gradient(145deg, #082F49 0%, #0C4A6E 100%)',
    acento: '#38BDF8',
  },
  {
    id: 6,
    type: 'image',
    comercio: 'Cafetería El Rincón',
    producto: 'Café + medialunas',
    precio: '$2.500',
    unidad: 'combo',
    ubicacion: 'A 5 cuadras',
    hace: 'Hace 22 min',
    gradiente: 'linear-gradient(145deg, #1C1007 0%, #44230A 100%)',
    Icon: Coffee,
    iconColor: '#D97706',
  },
]

// ─── Animations ───────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const

function cardMotion(index: number) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.55, delay: index * 0.07, ease: EASE },
  }
}

// ─── OfertaCard — Image variant ───────────────────────────────────────────────

function ImageCard({ oferta, index }: { oferta: ImageOferta; index: number }) {
  const { Icon } = oferta
  return (
    <motion.article
      className="group overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
      {...cardMotion(index)}
    >
      {/* Image / placeholder area */}
      <div
        className="relative flex h-44 items-center justify-center overflow-hidden"
        style={{ background: oferta.gradiente }}
      >
        {/* When real images are available, replace the div content with:
            <Image src={oferta.image_url} fill className="object-cover" alt={oferta.producto} />
        */}
        <Icon
          className="h-16 w-16 transition-transform duration-500 group-hover:scale-110"
          style={{ color: oferta.iconColor, opacity: 0.28 }}
        />
        {/* Category badge */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
        >
          {oferta.comercio}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="mb-2 text-[18px] font-bold leading-snug text-[#1F2937]">
          {oferta.producto}
        </p>
        <p className="mb-3 text-[24px] font-black text-[#F97316]">
          {oferta.precio}{' '}
          <span className="text-[13px] font-medium text-[#9CA3AF]">{oferta.unidad}</span>
        </p>
        <div className="flex items-center justify-between text-[12px] text-[#9CA3AF]">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            {oferta.ubicacion}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 flex-shrink-0" />
            {oferta.hace}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

// ─── OfertaCard — Text / Pizarra variant ─────────────────────────────────────

function TextCard({ oferta, index }: { oferta: TextOferta; index: number }) {
  return (
    <motion.article
      className="relative overflow-hidden rounded-[20px] p-5"
      style={{
        background: oferta.bg,
        boxShadow: '0 2px 16px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)',
        minHeight: '232px',
      }}
      {...cardMotion(index)}
    >
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl"
        style={{ background: oferta.acento, opacity: 0.18 }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          {/* Category tag */}
          <p
            className="mb-3 text-[11px] font-bold uppercase tracking-widest"
            style={{ color: oferta.acento }}
          >
            {oferta.tag}
          </p>
          {/* Business name */}
          <p className="mb-1.5 text-[12px] font-medium text-white/55">
            {oferta.comercio}
          </p>
          {/* Product name — hero typography */}
          <p className="mb-3 text-[22px] font-black leading-tight text-white">
            {oferta.producto}
          </p>
          {/* Price */}
          <p className="text-[30px] font-black leading-none" style={{ color: oferta.acento }}>
            {oferta.precio}
            <span className="ml-1.5 text-[14px] font-medium text-white/45">
              {oferta.unidad}
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between text-[12px] text-white/45">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            {oferta.ubicacion}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 flex-shrink-0" />
            {oferta.hace}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

// ─── OfertaCard — dispatcher ──────────────────────────────────────────────────

export function OfertaCard({ oferta, index }: { oferta: Oferta; index: number }) {
  if (oferta.type === 'image') return <ImageCard oferta={oferta} index={index} />
  return <TextCard oferta={oferta} index={index} />
}

// ─── PizarraFeed ─────────────────────────────────────────────────────────────

export function PizarraFeed() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                En vivo
              </span>
            </div>
            <h2 className="text-[1.65rem] font-black tracking-tight text-[#1F2937]">
              La Pizarra del Día{' '}
              <span className="font-medium text-[#9CA3AF]">· Wilde</span>
            </h2>
          </div>

          <Link
            href="/explore"
            className="group hidden items-center gap-1.5 text-[14px] font-semibold text-[#6366F1] transition-colors hover:text-[#4F46E5] sm:flex"
          >
            Ver todas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid — 1 col mobile / 2 tablet / 3 desktop */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFERTAS.map((oferta, i) => (
            <OfertaCard key={oferta.id} oferta={oferta} index={i} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/explore"
            className="group flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-6 py-3 text-[14px] font-semibold text-[#374151] transition-all hover:border-[#6366F1]/20 hover:text-[#4F46E5]"
          >
            Ver todas las ofertas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
