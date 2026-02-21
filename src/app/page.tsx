import type { Metadata } from 'next'
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CategoryBento } from '@/components/landing/CategoryBento'
import { CtaSection } from '@/components/landing/CtaSection'

export const metadata: Metadata = {
  title: 'Ofertita — Las mejores ofertas locales cerca de ti',
  description:
    'Descubre las mejores ofertas de los comercios de tu barrio. Ahorra en restaurantes, belleza, moda y mucho más.',
}

// Auth redirect for authenticated users is handled in middleware.ts
export default function LandingPage() {
  return (
    <div className="bg-[#F8FAFC]">
      <LandingNav />
      <HeroSection />
      <HowItWorks />
      <CategoryBento />
      <CtaSection />
    </div>
  )
}
