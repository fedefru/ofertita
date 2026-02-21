import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  originalPrice: number
  offerPrice: number
  discountPct: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PriceDisplay({
  originalPrice,
  offerPrice,
  discountPct,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: { offer: 'text-base font-bold', original: 'text-xs' },
    md: { offer: 'text-xl font-bold', original: 'text-sm' },
    lg: { offer: 'text-3xl font-bold', original: 'text-base' },
  }

  const classes = sizeClasses[size]

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('text-[#10B981]', classes.offer)}>
        {formatCurrency(offerPrice)}
      </span>
      <span className={cn('text-[#94A3B8] line-through', classes.original)}>
        {formatCurrency(originalPrice)}
      </span>
    </div>
  )
}
