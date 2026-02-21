'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  offerId: string
  isSaved: boolean
  onToggle: (offerId: string) => void
  className?: string
}

export function SaveButton({ offerId, isSaved, onToggle, className }: SaveButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-8 rounded-full bg-background/90 backdrop-blur hover:bg-background',
        className
      )}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle(offerId)
      }}
      aria-label={isSaved ? 'Quitar de guardados' : 'Guardar oferta'}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground'
        )}
      />
    </Button>
  )
}
