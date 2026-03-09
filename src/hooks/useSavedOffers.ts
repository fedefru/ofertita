'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'
import { toast } from 'sonner'

type SavedOfferInsert = Database['public']['Tables']['saved_offers']['Insert']

interface UseSavedOffersOptions {
  userId: string
  initialSavedIds?: string[]
}

export function useSavedOffers({ userId, initialSavedIds = [] }: UseSavedOffersOptions) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(initialSavedIds))
  const supabase = createClient()

  const isSaved = useCallback(
    (offerId: string) => savedIds.has(offerId),
    [savedIds]
  )

  const toggleSave = useCallback(
    async (offerId: string) => {
      const wasSaved = savedIds.has(offerId)

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (wasSaved) {
          next.delete(offerId)
        } else {
          next.add(offerId)
        }
        return next
      })

      try {
        if (wasSaved) {
          const { error } = await supabase
            .from('saved_offers')
            .delete()
            .eq('user_id', userId)
            .eq('offer_id', offerId)

          if (error) throw error
        } else {
          const row: SavedOfferInsert = { user_id: userId, offer_id: offerId }
          const { error } = await supabase
            .from('saved_offers')
            .insert(row)

          if (error) throw error
          toast.success('Oferta guardada')
        }
      } catch {
        // Revert optimistic update
        setSavedIds((prev) => {
          const next = new Set(prev)
          if (wasSaved) {
            next.add(offerId)
          } else {
            next.delete(offerId)
          }
          return next
        })
        toast.error('Error al guardar la oferta')
      }
    },
    [savedIds, userId, supabase]
  )

  return { isSaved, toggleSave, savedIds }
}
