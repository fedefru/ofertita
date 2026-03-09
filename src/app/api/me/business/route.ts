import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ slug: null }, { status: 401 })
  }

  const { data } = await supabase
    .from('businesses')
    .select('slug')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle<{ slug: string }>()

  return NextResponse.json({ slug: data?.slug ?? null })
}
