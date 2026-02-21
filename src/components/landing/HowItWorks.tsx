'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Search, Heart } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const STEPS = [
  {
    number: '01',
    icon: MapPin,
    iconBg: 'rgba(249,115,22,0.10)',
    iconColor: '#F97316',
    title: 'Activa tu ubicación',
    description:
      'El sistema detecta automáticamente los comercios en un radio de hasta 10 km a tu alrededor. Sin registro previo.',
  },
  {
    number: '02',
    icon: Search,
    iconBg: 'rgba(99,102,241,0.10)',
    iconColor: '#6366F1',
    title: 'Descubre las ofertas',
    description:
      'Filtra por categoría, distancia o mayor descuento. Más de 350 comercios locales con ofertas actualizadas cada hora.',
  },
  {
    number: '03',
    icon: Heart,
    iconBg: 'rgba(16,185,129,0.10)',
    iconColor: '#10B981',
    title: 'Guarda y visita',
    description:
      'Guarda las ofertas que más te interesen y visita el comercio. Sin cupones, sin impresiones. 100% local.',
  },
]

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.25 })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: EASE }}
      className="group relative rounded-[20px] bg-white p-7"
      style={{
        boxShadow: '0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(15,23,42,0.05)',
      }}
    >
      {/* Step number */}
      <span
        className="mb-5 inline-block text-[11px] font-black tracking-widest"
        style={{ color: step.iconColor, letterSpacing: '0.12em' }}
      >
        {step.number}
      </span>

      {/* Icon */}
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: step.iconBg }}
      >
        <Icon className="h-5 w-5" style={{ color: step.iconColor }} />
      </div>

      {/* Content */}
      <h3 className="mb-2 text-[17px] font-bold tracking-tight text-[#1F2937]">
        {step.title}
      </h3>
      <p className="text-[14px] leading-relaxed text-[#6B7280]">{step.description}</p>

      {/* Connector line (desktop only — not on last card) */}
      {index < STEPS.length - 1 && (
        <div
          className="absolute -right-[2px] top-[52px] hidden h-px w-[calc(var(--gap)+4px)] lg:block"
          style={{
            background: 'linear-gradient(90deg, rgba(99,102,241,0.2), transparent)',
            '--gap': '1rem',
          } as React.CSSProperties}
        />
      )}
    </motion.div>
  )
}

export function HowItWorks() {
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, amount: 0.5 })

  return (
    <section className="px-4 py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div ref={headingRef} className="mb-16 text-center">
          <motion.span
            className="mb-3 inline-block text-[12px] font-bold uppercase tracking-[0.12em] text-[#F97316]"
            initial={{ opacity: 0, y: 10 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Así funciona
          </motion.span>

          <motion.h2
            className="text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-[#1F2937]"
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          >
            Tres pasos, miles de ahorros.
          </motion.h2>

          <motion.p
            className="mx-auto mt-3 max-w-md text-[15px] text-[#6B7280]"
            initial={{ opacity: 0, y: 14 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            Sin apps adicionales. Sin comisiones. Sin complicaciones.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
