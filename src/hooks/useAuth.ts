'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/business.types'

interface AuthState {
  user: User | null
  profile: Profile | null
  role: 'viewer' | 'business_owner' | 'admin' | null
  isOwner: boolean
  isLoading: boolean
  businessSlug: string | null
}

// Single client instance for the lifetime of the app
const supabase = createClient()

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [businessSlug, setBusinessSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION immediately — no need for getSession()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await Promise.all([
          fetchProfile(session.user.id),
          fetchBusinessSlug(session.user.id),
        ])
      } else {
        setProfile(null)
        setBusinessSlug(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
  }

  async function fetchBusinessSlug(userId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('slug')
      .eq('owner_id', userId)
      .limit(1)
      .maybeSingle()

    setBusinessSlug(data?.slug ?? null)
  }

  const role = profile?.role ?? null
  const isOwner = role === 'business_owner'

  return { user, profile, role, isOwner, isLoading, businessSlug }
}
