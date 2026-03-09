'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Camera, PencilLine, Zap } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

export function PublicarCard() {
  return (
    <section className="px-4 pb-10">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="relative overflow-hidden rounded-[24px] p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #1E3A5F 100%)',
            boxShadow:
              '0 12px 40px rgba(99,102,241,0.22), 0 2px 8px rgba(0,0,0,0.10)',
          }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#6366F1]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-4 h-36 w-36 rounded-full bg-[#F97316]/12 blur-2xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Copy */}
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 fill-[#F97316] text-[#F97316]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#F97316]">
                  Para comercios
                </span>
              </div>
              <h2 className="text-[1.45rem] font-black leading-tight text-white md:text-[1.65rem]">
                ¿Tenés comercio?
              </h2>
              <p className="mt-1.5 text-[15px] text-indigo-200/90">
                Publicá tu oferta de hoy en{' '}
                <span className="font-semibold text-white">30 segundos.</span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5 sm:flex-row md:flex-shrink-0">
              {/* Photo option */}
              <Link
                href="/login?redirectTo=/dashboard/offers/new"
                className="group flex items-center justify-center gap-2.5 rounded-[14px] border border-white/12 bg-white/10 px-5 py-3 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/18"
              >
                <Camera className="h-4 w-4 flex-shrink-0 text-indigo-200 transition-transform group-hover:scale-110" />
                Subir foto de la pizarra
              </Link>

              {/* Manual option */}
              <Link
                href="/login?redirectTo=/dashboard/offers/new"
                className="group flex items-center justify-center gap-2.5 rounded-[14px] bg-[#F97316] px-5 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#EA580C]"
                style={{ boxShadow: '0 4px 16px rgba(249,115,22,0.40)' }}
              >
                <PencilLine className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                Escribir oferta manual
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
