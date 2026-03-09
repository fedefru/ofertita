import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { NearbyOffer } from '@/types/offer.types'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lng = parseFloat(searchParams.get('lng') ?? '')
  const radius = parseInt(searchParams.get('radius') ?? '5000')
  const category = searchParams.get('category') || undefined
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
  const offset = parseInt(searchParams.get('offset') ?? '0')

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat y lng son requeridos' }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('get_nearby_offers', {
      user_lat: lat,
      user_lng: lng,
      radius_meters: radius,
      filter_category: category,
      limit_count: limit,
      offset_count: offset,
    })

    if (error) throw error

    return NextResponse.json(data as NearbyOffer[], {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    console.error('[/api/offers/nearby]', err)
    return NextResponse.json({ error: 'Error al obtener ofertas' }, { status: 500 })
  }
}
