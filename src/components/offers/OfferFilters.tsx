'use client'

import { useRef, useState, useCallback } from 'react'
import { MapPin, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/business.types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuickFilter = 'all' | 'vence-hoy' | 'reciente'

interface OfferFiltersProps {
  categories: Category[]
  selectedCategory: string | null
  selectedRadius: number
  quickFilter: QuickFilter
  onCategoryChange: (slug: string | null) => void
  onRadiusChange: (meters: number) => void
  onQuickFilterChange: (filter: QuickFilter) => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DISTANCE_OPTS = [
  { label: '5 cuadras', value: 500 },
  { label: '10 cuadras', value: 1000 },
  { label: 'Todo el barrio', value: 5000 },
  { label: 'Sin límite', value: 10000 },
] as const

// ─── ScrollRow ────────────────────────────────────────────────────────────────

function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [atEnd, setAtEnd] = useState(false)

  const onScroll = useCallback(() => {
    const el = ref.current
    if (!el) return
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={onScroll}
        className="overflow-x-scroll pb-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div className="flex min-w-max gap-2">{children}</div>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F8FAFC]/80 to-transparent transition-opacity duration-300',
          atEnd ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  )
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({
  active,
  onClick,
  activeClass,
  children,
}: {
  active: boolean
  onClick: () => void
  activeClass?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-all',
        active
          ? activeClass ?? 'border-[#F97316] bg-[#F97316] text-white'
          : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#F97316]/40 hover:text-[#F97316]'
      )}
    >
      {children}
    </button>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

export function OfferFilters({
  categories,
  selectedCategory,
  selectedRadius,
  quickFilter,
  onCategoryChange,
  onRadiusChange,
  onQuickFilterChange,
}: OfferFiltersProps) {
  const toggleQuick = (f: QuickFilter) =>
    onQuickFilterChange(quickFilter === f ? 'all' : f)

  return (
    <div className="space-y-2.5">
      {/* ── Row 1: Categories ────────────────────────────────── */}
      <ScrollRow>
        <Chip active={selectedCategory === null} onClick={() => onCategoryChange(null)}>
          Todas
        </Chip>
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            active={selectedCategory === cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            activeClass={
              cat.color
                ? undefined
                : 'border-[#6366F1] bg-[#6366F1] text-white'
            }
          >
            {cat.name}
          </Chip>
        ))}
      </ScrollRow>

      {/* ── Row 2: Distance + quick filters ─────────────────── */}
      <ScrollRow>
        {DISTANCE_OPTS.map((opt) => (
          <Chip
            key={opt.value}
            active={selectedRadius === opt.value}
            onClick={() => onRadiusChange(opt.value)}
          >
            <MapPin className="h-3 w-3" />
            {opt.label}
          </Chip>
        ))}

        {/* Divider */}
        <div className="mx-0.5 flex-shrink-0 self-center">
          <div className="h-5 w-px bg-[#E5E7EB]" />
        </div>

        {/* Vence hoy */}
        <Chip
          active={quickFilter === 'vence-hoy'}
          onClick={() => toggleQuick('vence-hoy')}
          activeClass="border-amber-500 bg-amber-500 text-white"
        >
          <Clock className="h-3 w-3" />
          Vence hoy
        </Chip>

        {/* Publicado hace menos de 1h */}
        <Chip
          active={quickFilter === 'reciente'}
          onClick={() => toggleQuick('reciente')}
          activeClass="border-emerald-500 bg-emerald-500 text-white"
        >
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <Zap className="h-3 w-3" />
          Publicado hace &lt;1h
        </Chip>
      </ScrollRow>
    </div>
  )
}
