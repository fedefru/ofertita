'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const CATEGORIES = [
  {
    emoji: '🍕',
    name: 'Restaurantes',
    description: 'Menús, tapas y mucho más',
    count: '140+',
    bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    accent: '#F97316',
    accentSoft: 'rgba(249,115,22,0.12)',
    colSpan: 'md:col-span-2',
  },
  {
    emoji: '☕',
    name: 'Cafeterías',
    description: 'Tu pausa del día',
    count: '85+',
    bg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    accent: '#059669',
    accentSoft: 'rgba(5,150,105,0.10)',
    colSpan: 'md:col-span-1',
  },
  {
    emoji: '💄',
    name: 'Belleza',
    description: 'Salones y spas',
    count: '95+',
    bg: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
    accent: '#7C3AED',
    accentSoft: 'rgba(124,58,237,0.10)',
    colSpan: 'md:col-span-1',
  },
  {
    emoji: '🏋️',
    name: 'Deporte',
    description: 'Gimnasios y actividades',
    count: '60+',
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    accent: '#2563EB',
    accentSoft: 'rgba(37,99,235,0.10)',
    colSpan: 'md:col-span-2',
  },
  {
    emoji: '👗',
    name: 'Moda',
    description: 'Tiendas locales',
    count: '110+',
    bg: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    accent: '#BE185D',
    accentSoft: 'rgba(190,24,93,0.10)',
    colSpan: 'md:col-span-1',
  },
  {
    emoji: '💻',
    name: 'Tecnología',
    description: 'Accesorios y reparaciones',
    count: '45+',
    bg: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    accent: '#4F46E5',
    accentSoft: 'rgba(79,70,229,0.10)',
    colSpan: 'md:col-span-1',
  },
] as const

function CategoryCard({
  cat,
  index,
}: {
  cat: (typeof CATEGORIES)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className={`${cat.colSpan}`}
    >
      <Link href="/explore" className="group block h-full">
        <div
          className="relative h-full min-h-[160px] overflow-hidden rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: cat.bg,
            boxShadow: '0 2px 16px rgba(99,102,241,0.06), 0 1px 4px rgba(15,23,42,0.04)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 8px 28px ${cat.accentSoft}, 0 2px 8px rgba(15,23,42,0.06)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 16px rgba(99,102,241,0.06), 0 1px 4px rgba(15,23,42,0.04)'
          }}
        >
          {/* Large emoji */}
          <span className="mb-4 block text-4xl leading-none">{cat.emoji}</span>

          {/* Category name */}
          <h3
            className="text-[17px] font-bold tracking-tight text-[#1F2937] transition-colors"
            style={{}}
          >
            {cat.name}
          </h3>

          {/* Description */}
          <p className="mt-0.5 text-[13px] text-[#6B7280]">{cat.description}</p>

          {/* Count badge */}
          <div className="mt-4 flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-bold"
              style={{ background: cat.accentSoft, color: cat.accent }}
            >
              {cat.count} ofertas
            </span>

            <span
              className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110"
              style={{ background: cat.accentSoft, color: cat.accent }}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function CategoryBento() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, amount: 0.5 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  // Very subtle grid drift on scroll
  const gridY = useTransform(scrollYProgress, [0, 1], ['0px', '-20px'])

  return (
    <section ref={sectionRef} className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 text-center">
          <motion.span
            className="mb-3 inline-block text-[12px] font-bold uppercase tracking-[0.12em] text-[#6366F1]"
            initial={{ opacity: 0, y: 10 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Categorías
          </motion.span>

          <motion.h2
            className="text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-[#1F2937]"
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          >
            Todo lo que tu barrio ofrece.
          </motion.h2>

          <motion.p
            className="mx-auto mt-3 max-w-md text-[15px] text-[#6B7280]"
            initial={{ opacity: 0, y: 14 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            Desde el restaurante de la esquina hasta el gimnasio más cercano.
          </motion.p>
        </div>

        {/* Bento grid */}
        {/* Pattern: [2cols][1col] / [1col][2cols] / [2cols][1col] */}
        <motion.div
          style={{ y: gridY }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
