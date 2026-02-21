import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  name: string
  color?: string
  icon?: string
  className?: string
}

export function CategoryBadge({ name, color = '#6366f1', icon, className }: CategoryBadgeProps) {
  return (
    <Badge
      className={cn('gap-1 border-0 text-white', className)}
      style={{ backgroundColor: color }}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {name}
    </Badge>
  )
}
