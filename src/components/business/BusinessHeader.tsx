import Image from 'next/image'
import { ExternalLink, MapPin, Phone, Store } from 'lucide-react'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import type { BusinessWithCategory } from '@/types/business.types'

interface BusinessHeaderProps {
  business: BusinessWithCategory
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  return (
    <div>
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden rounded-xl bg-muted md:h-64">
        {business.cover_url ? (
          <Image src={business.cover_url} alt={business.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Store className="h-16 w-16 text-muted-foreground opacity-20" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 flex items-start gap-4">
        {/* Logo */}
        <div className="relative -mt-8 h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-background bg-background shadow">
          {business.logo_url ? (
            <Image src={business.logo_url} alt={business.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <Store className="h-7 w-7 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <CategoryBadge name={business.category.name} color={business.category.color ?? undefined} />

          <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {business.address}, {business.city}
            </span>

            {business.phone && (
              <a href={`tel:${business.phone}`} className="flex items-center gap-1 hover:text-primary">
                <Phone className="h-4 w-4" />
                {business.phone}
              </a>
            )}

            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                Sitio web
              </a>
            )}
          </div>

          {business.description && (
            <p className="pt-2 text-muted-foreground">{business.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
