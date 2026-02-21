'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Store } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const STATS = [
  { value: '1.200+', label: 'ofertas activas' },
  { value: '350+', label: 'comercios' },
  { value: '15', label: 'ciudades' },
]

export function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <>
      {/* CTA dark section */}
      <section ref={ref} className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden rounded-[28px]"
            style={{
              background: 'linear-gradient(145deg, #EDF1F7 0%, #E6EDF6 100%)',
              border: '1px solid rgba(99,102,241,0.10)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.08), 0 2px 8px rgba(15,23,42,0.04)',
            }}
          >
            {/* Decorative orange glow — top center */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
              style={{ background: 'rgba(249,115,22,0.25)' }}
            />

            <div className="relative px-8 py-16 text-center md:px-16">
              {/* Stats row */}
              <motion.div
                className="mb-12 flex flex-wrap items-center justify-center gap-8"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              >
                {STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-[2rem] font-black leading-none tracking-tight text-[#1F2937]">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[13px] text-[#9CA3AF]">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Headline */}
              <motion.h2
                className="mx-auto mb-4 max-w-2xl text-[clamp(1.8rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.025em] text-[#1F2937]"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
              >
                Miles de ofertas te están{' '}
                <span
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #FB923C, #EA580C)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  esperando.
                </span>
              </motion.h2>

              <motion.p
                className="mx-auto mb-10 max-w-md text-[15px] leading-relaxed text-[#6B7280]"
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              >
                Empieza ahora mismo. Sin registro para ver las ofertas, sin tarjeta de crédito, sin
                sorpresas.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.38, ease: EASE }}
              >
                <Link
                  href="/explore"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-[#F97316] px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#EA580C]"
                  style={{ boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(249,115,22,0.5)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.35)' }}
                >
                  Explorar ofertas
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/login?redirectTo=/onboarding"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#1F2937]/12 bg-white/60 px-7 py-3.5 text-[15px] font-semibold text-[#374151] transition-all hover:border-[#6366F1]/25 hover:bg-white hover:text-[#4F46E5]"
                >
                  <Store className="h-4 w-4" />
                  Registrar comercio
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB]/60 px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-[13px] text-[#9CA3AF]">
            © 2025 Ofertita
          </span>
          <div className="flex items-center gap-5 text-[13px] text-[#9CA3AF]">
            <Link href="/login" className="transition-colors hover:text-[#6B7280]">
              Iniciar sesión
            </Link>
            <Link href="/login?redirectTo=/onboarding" className="transition-colors hover:text-[#6B7280]">
              Para comercios
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
