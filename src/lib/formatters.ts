import { formatDistanceToNow, isPast, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return ''
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

export function formatDiscountPct(pct: number | null | undefined): string {
  if (!pct) return ''
  return `-${Math.round(pct)}%`
}

/** How long ago the offer was published. Uses start_date as proxy. */
export function formatTimeAgo(dateStr: string): { label: string; isRecent: boolean } {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMin = Math.floor(diffMs / 60_000)

  if (diffMin < 1) return { label: 'Ahora mismo', isRecent: true }
  if (diffMin < 60) return { label: `Hace ${diffMin} min`, isRecent: true }

  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return { label: `Hace ${diffH} h`, isRecent: false }

  const diffD = Math.floor(diffH / 24)
  return { label: `Hace ${diffD} ${diffD === 1 ? 'día' : 'días'}`, isRecent: false }
}
