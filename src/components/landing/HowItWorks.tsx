'use client'

import { motion } from 'framer-motion'
import { Store, MapPin, ShoppingBag, type LucideIcon } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

type Paso = {
  Icon: LucideIcon
  numero: string
  titulo: string
  desc: string
}

const PASOS: Paso[] = [
  {
    Icon: Store,
    numero: '01',
    titulo: 'El comercio publica',
    desc: 'El dueño sube una foto de su pizarra o escribe la oferta del día. Listo en 30 segundos.',
  },
  {
    Icon: MapPin,
    numero: '02',
    titulo: 'Descubrís por cercanía',
    desc: 'Ves las ofertas de los comercios más cercanos a donde estás, sin registrarte ni instalar nada.',
  },
  {
    Icon: ShoppingBag,
    numero: '03',
    titulo: 'Comprás en el local',
    desc: 'Vas al comercio y comprás directo. Sin cupones, sin comisiones, sin intermediarios.',
  },
]

export function HowItWorks() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 className="text-[1.8rem] font-black tracking-tight text-[#1F2937]">
            Sin vueltas.
          </h2>
          <p className="mt-2 text-[15px] text-[#6B7280]">Así de simple funciona Ofertita.</p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PASOS.map(({ Icon, numero, titulo, desc }, i) => (
            <motion.div
              key={numero}
              className="rounded-[20px] bg-white p-6"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(249,115,22,0.10)' }}
                >
                  <Icon className="h-5 w-5 text-[#F97316]" />
                </div>
                <span className="text-[2.4rem] font-black leading-none text-[#F3F4F6]">
                  {numero}
                </span>
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-[#1F2937]">{titulo}</h3>
              <p className="text-[14px] leading-relaxed text-[#6B7280]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
