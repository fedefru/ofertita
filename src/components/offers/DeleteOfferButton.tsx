'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function DeleteOfferButton({ offerId }: { offerId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    setIsDeleting(true)
    const { error } = await supabase.from('offers').delete().eq('id', offerId)
    if (error) {
      toast.error('No se pudo eliminar la oferta')
      setIsDeleting(false)
      setConfirming(false)
      return
    }
    toast.success('Oferta eliminada')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">¿Eliminar?</span>
        <Button
          variant="destructive"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Eliminando…' : 'Sí'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => setConfirming(false)}
          disabled={isDeleting}
        >
          No
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive"
      onClick={() => setConfirming(true)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
