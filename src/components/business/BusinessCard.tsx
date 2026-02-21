import Link from 'next/link'
import Image from 'next/image'
import { Store } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import type { BusinessWithCategory } from '@/types/business.types'

interface BusinessCardProps {
  business: BusinessWithCategory
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link href={`/businesses/${business.slug}`} className="block group">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {/* Cover */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {business.cover_url ? (
            <Image
              src={business.cover_url}
              alt={business.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Store className="h-8 w-8 text-muted-foreground opacity-30" />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Logo */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-muted">
              {business.logo_url ? (
                <Image src={business.logo_url} alt={business.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Store className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="font-semibold truncate">{business.name}</h3>
              <p className="text-xs text-muted-foreground">{business.city}</p>
              <CategoryBadge
                name={business.category.name}
                color={business.category.color}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
