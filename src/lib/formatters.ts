import { formatDistanceToNow, isPast, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatTimeLeft(endDate: string | Date): {
  label: string
  isUrgent: boolean
  isExpired: boolean
} {
  const end = new Date(endDate)

  if (isPast(end)) {
    return { label: 'Expirada', isUrgent: false, isExpired: true }
  }

  const hoursLeft = differenceInHours(end, new Date())
  const isUrgent = hoursLeft < 24

  const label = formatDistanceToNow(end, { addSuffix: true, locale: es })

  return { label, isUrgent, isExpired: false }
}

export function formatDiscountPct(pct: number): string {
  return `-${Math.round(pct)}%`
}
