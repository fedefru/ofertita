import type { Metadata } from 'next'
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { PublicarCard } from '@/components/landing/PublicarCard'
import { PizarraFeed } from '@/components/landing/PizarraFeed'
import { HowItWorks } from '@/components/landing/HowItWorks'

export const metadata: Metadata = {
  title: 'Ofertita — Las ofertas de tu barrio, en tu pantalla',
  description:
    'Encuentra precios reales de los comercios que visitas a diario. Sin cupones, sin registro previo.',
}

// Auth redirect for authenticated users is handled in middleware.ts
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingNav />
      <HeroSection />
      <PublicarCard />
      <PizarraFeed />
      <HowItWorks />
    </div>
  )
}
