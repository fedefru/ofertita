import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getOfferById, incrementViewCount } from '@/lib/supabase/queries/offers'
import { OfferDetail } from '@/components/offers/OfferDetail'

interface OfferPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const offer = await getOfferById(id)
    return {
      title: offer.title,
      description: offer.description ?? (offer.business ? `Oferta en ${offer.business.name}` : 'Oferta'),
      openGraph: {
        images: offer.image_url ? [offer.image_url] : [],
      },
    }
  } catch {
    return { title: 'Oferta' }
  }
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { id } = await params

  let offer
  try {
    offer = await getOfferById(id)
  } catch {
    notFound()
  }

  // Fire-and-forget: no bloqueamos el render si falla
  incrementViewCount(id).catch(() => {})

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <OfferDetail offer={offer as Parameters<typeof OfferDetail>[0]['offer']} />
    </div>
  )
}
