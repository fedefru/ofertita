import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBusinessBySlug } from '@/lib/supabase/queries/businesses'
import { BusinessHeader } from '@/components/business/BusinessHeader'
import { BusinessOwnerBar } from '@/components/business/BusinessOwnerBar'
import { BusinessOffersSection } from '@/components/business/BusinessOffersSection'
import type { BusinessWithCategory } from '@/types/business.types'
import type { NearbyOffer } from '@/types/offer.types'

interface BusinessPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const business = await getBusinessBySlug(slug)
    return {
      title: business.name,
      description: business.description ?? `Ofertas de ${business.name} en ${business.city}`,
    }
  } catch {
    return { title: 'Comercio' }
  }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params

  let business
  try {
    business = await getBusinessBySlug(slug)
  } catch {
    notFound()
  }

  const biz = business!

  const activeOffers = (biz.offers ?? [])
    .filter((o: { is_active: boolean; end_date: string }) =>
      o.is_active && new Date(o.end_date) >= new Date()
    )
    .map((offer: Record<string, unknown>) => ({
      ...offer,
      business_id: biz.id,
      business_name: biz.name,
      business_slug: biz.slug,
      business_logo: biz.logo_url,
      business_lat: biz.lat,
      business_lng: biz.lng,
      category_name: biz.category.name,
      category_slug: biz.category.slug,
      category_color: biz.category.color,
      distance_meters: 0,
    })) as NearbyOffer[]

  return (
    <div className="container py-8 space-y-8">
      <BusinessHeader business={biz as unknown as BusinessWithCategory} />
      <BusinessOwnerBar businessSlug={biz.slug} businessId={biz.id} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Ofertas activas{' '}
          {activeOffers.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({activeOffers.length})
            </span>
          )}
        </h2>

        {/* Client component — manages save state internally */}
        <BusinessOffersSection offers={activeOffers} />
      </div>
    </div>
  )
}
