'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

// SVG approximation del tag icon de Ofertita
function TagMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-tag-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB923C" />
          <stop offset="1" stopColor="#DC5810" />
        </linearGradient>
        <filter id="hero-tag-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Body — rounded squircle */}
      <rect x="8" y="8" width="84" height="84" rx="28" fill="url(#hero-tag-grad)" filter="url(#hero-tag-glow)" />
      {/* Tag hole */}
      <circle cx="70" cy="28" r="7.5" fill="white" opacity="0.92" />
      {/* Main ring */}
      <circle cx="46" cy="58" r="19" stroke="white" strokeWidth="5.5" fill="none" />
      {/* Center dot */}
      <circle cx="46" cy="58" r="7.5" fill="white" />
    </svg>
  )
}

const EASE = [0.16, 1, 0.3, 1] as const

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20"
      style={{
        background:
          'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(249,115,22,0.09) 0%, transparent 68%), #F8FAFC',
      }}
    >
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scrolling content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-4xl text-center"
      >
        {/* Floating tag icon */}
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="drop-shadow-2xl"
            >
              <TagMark className="h-20 w-20" />
            </motion.div>
          </motion.div>
        </div>

        {/* Eyebrow badge */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-[#EA580C]"
            style={{
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.18)',
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            350+ comercios · 15 ciudades
          </span>
        </motion.div>

        {/* Headline — 3 lines with staggered slide-up */}
        <h1
          className="mb-6 font-black tracking-[-0.03em] text-[#1F2937]"
          style={{ fontSize: 'clamp(2.6rem, 8vw, 5.5rem)', lineHeight: 0.93 }}
        >
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '108%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.18, ease: EASE }}
            >
              Descubre,
            </motion.span>
          </span>

          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '108%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.28, ease: EASE }}
            >
              <span
                style={{
                  backgroundImage: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #DC5810 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ahorra
              </span>{' '}
              y apoya
            </motion.span>
          </span>

          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '108%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.38, ease: EASE }}
            >
              tu barrio.
            </motion.span>
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mb-10 max-w-[560px] text-[1.05rem] leading-relaxed text-[#6B7280]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.52, ease: EASE }}
        >
          Las mejores ofertas de los comercios de tu ciudad, filtradas por tu ubicación en tiempo real.
          Restaurantes, moda, belleza y mucho más.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.62, ease: EASE }}
        >
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2 rounded-2xl bg-[#F97316] px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#EA580C]"
            style={{ boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(249,115,22,0.48)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.35)' }}
          >
            Explorar ofertas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/login?redirectTo=/onboarding"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-7 py-3.5 text-[15px] font-semibold text-[#374151] transition-all hover:border-[#6366F1]/25 hover:bg-[#6366F1]/4 hover:text-[#4F46E5]"
          >
            Registrar mi comercio
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[#9CA3AF]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.78, ease: EASE }}
        >
          {[
            'Gratis para usuarios',
            'Sin tarjeta de crédito',
            'Actualizado cada hora',
          ].map((text) => (
            <span key={text} className="flex items-center gap-1.5">
              <span className="font-bold text-[#10B981]">✓</span>
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
    </section>
  )
}
