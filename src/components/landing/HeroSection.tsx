'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const TRUST_ITEMS = [
  'Sin registro para ver ofertas',
  'Actualizado en tiempo real',
  'Comercios verificados',
]

export function HeroSection() {
  return (
    <section
      className="relative px-4 pb-16 pt-32 text-center"
      style={{
        background:
          'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(249,115,22,0.07) 0%, transparent 70%), #F8FAFC',
      }}
    >
      {/* Dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Live badge */}
        <motion.div
          className="mb-7 flex justify-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[13px] font-semibold text-emerald-700">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            12 ofertas activas ahora en Wilde
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mb-5 font-black tracking-[-0.03em] text-[#1F2937]"
          style={{ fontSize: 'clamp(2.4rem, 7.5vw, 5rem)', lineHeight: 0.95 }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease: EASE }}
        >
          Las ofertas de tu barrio,{' '}
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #DC5810 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            en tu pantalla.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mb-9 max-w-[540px] text-[1.05rem] leading-relaxed text-[#6B7280]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
        >
          Encuentra precios reales de los comercios que visitas a diario.{' '}
          <strong className="font-semibold text-[#374151]">
            Sin cupones, sin registro previo.
          </strong>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44, ease: EASE }}
        >
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2 rounded-2xl bg-[#F97316] px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#EA580C]"
            style={{ boxShadow: '0 4px 22px rgba(249,115,22,0.38)' }}
          >
            Ver ofertas ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/login?redirectTo=/onboarding"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-7 py-3.5 text-[15px] font-semibold text-[#374151] transition-all hover:border-[#6366F1]/30 hover:bg-[#6366F1]/5 hover:text-[#4F46E5]"
          >
            Soy comerciante
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[#9CA3AF]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.62, ease: EASE }}
        >
          {TRUST_ITEMS.map((text) => (
            <span key={text} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#10B981]" strokeWidth={2.5} />
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
    </section>
  )
}
