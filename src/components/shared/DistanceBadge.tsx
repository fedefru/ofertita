import { MapPin } from 'lucide-react'
import { formatDistance, metersToKm } from '@/lib/distance'
import { cn } from '@/lib/utils'

interface DistanceBadgeProps {
  distanceMeters: number
  className?: string
}

export function DistanceBadge({ distanceMeters, className }: DistanceBadgeProps) {
  const km = metersToKm(distanceMeters)
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs text-muted-foreground', className)}>
      <MapPin className="h-3 w-3" />
      {formatDistance(km)}
    </span>
  )
}
