'use client'

import { SlidersHorizontal } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RADIUS_OPTIONS } from '@/lib/constants'
import type { Category } from '@/types/business.types'

interface OfferFiltersProps {
  categories: Category[]
  selectedCategory: string | null
  selectedRadius: number
  onCategoryChange: (slug: string | null) => void
  onRadiusChange: (meters: number) => void
}

/**
 * Filter toolbar con superficie propia.
 * Fondo blanco, sombra índigo sutil, selects de borde muy suave.
 */
export function OfferFilters({
  categories,
  selectedCategory,
  selectedRadius,
  onCategoryChange,
  onRadiusChange,
}: OfferFiltersProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-[16px] bg-white px-3 py-2"
      style={{ boxShadow: '0 2px 12px rgba(99,102,241,0.07), 0 1px 3px rgba(15,23,42,0.05)' }}
    >
      {/* Icon */}
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6366F1]/8">
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#6366F1]" />
      </div>

      {/* Category filter */}
      <Select
        value={selectedCategory ?? 'all'}
        onValueChange={(v) => onCategoryChange(v === 'all' ? null : v)}
      >
        <SelectTrigger
          className="h-8 w-44 rounded-xl border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] text-xs text-[#0F172A] focus:ring-1 focus:ring-[#6366F1]/30"
        >
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-[rgba(15,23,42,0.08)]">
          <SelectItem value="all" className="text-xs">
            Todas las categorías
          </SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug} className="text-xs">
              {cat.icon} {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Radius filter */}
      <Select
        value={selectedRadius.toString()}
        onValueChange={(v) => onRadiusChange(Number(v))}
      >
        <SelectTrigger
          className="h-8 w-32 rounded-xl border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] text-xs text-[#0F172A] focus:ring-1 focus:ring-[#6366F1]/30"
        >
          <SelectValue placeholder="Radio" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-[rgba(15,23,42,0.08)]">
          {RADIUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value.toString()} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
