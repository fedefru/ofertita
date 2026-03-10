'use client'

import Link from 'next/link'
import { Edit, PlusCircle, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

interface BusinessOwnerBarProps {
  businessSlug: string
  businessId: string
}

export function BusinessOwnerBar({ businessSlug, businessId }: BusinessOwnerBarProps) {
  const { businessSlug: authSlug, isLoading } = useAuth()

  // Only show if this page belongs to the logged-in user's business
  if (isLoading || authSlug !== businessSlug) return null

  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-[#FDBA74] bg-[#FFF7ED] px-4 py-3 sm:flex-row sm:items-center">
      <p className="text-[13px] font-semibold text-[#92400E] sm:mr-auto">
        Este es tu comercio
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-[#FDBA74] text-[#92400E] hover:bg-[#FED7AA] hover:text-[#92400E] sm:flex-none"
          asChild
        >
          <Link href={`/dashboard/business`}>
            <Edit className="mr-1.5 h-3.5 w-3.5" />
            Editar
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-[#F97316] text-white hover:bg-[#EA580C] sm:flex-none"
          asChild
        >
          <Link href="/dashboard/offers/new">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
            Nueva oferta
          </Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-[#FDBA74] text-[#92400E] hover:bg-[#FED7AA] hover:text-[#92400E] sm:flex-none"
          asChild
        >
          <Link href="/dashboard">
            <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
            Mi panel
          </Link>
        </Button>
      </div>
    </div>
  )
}
