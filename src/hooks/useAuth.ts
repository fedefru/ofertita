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
    // onAuthStateChange fires INITIAL_SESSION immediately with the current session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await Promise.all([fetchProfile(), fetchBusinessSlug()])
      } else {
        setProfile(null)
        setBusinessSlug(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchProfile() {
    try {
      const res = await fetch('/api/me/profile')
      if (res.ok) {
        const json = await res.json()
        setProfile(json.profile ?? null)
      } else {
        setProfile(null)
      }
    } catch {
      setProfile(null)
    }
  }

  async function fetchBusinessSlug() {
    try {
      const res = await fetch('/api/me/business')
      if (res.ok) {
        const json = await res.json()
        setBusinessSlug(json.slug ?? null)
      } else {
        setBusinessSlug(null)
      }
    } catch {
      setBusinessSlug(null)
    }
  }

  const role = profile?.role ?? null
  const isOwner = role === 'business_owner'

  return { user, profile, role, isOwner, isLoading, businessSlug }
}
