'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="flex items-center rounded-full px-2 py-1.5 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo */}
        {/* Logo */}
        <Link href="/" className="flex items-center px-3 py-1">
          <Image
            src="/logo.png"
            alt="Ofertita"
            width={120}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Separator — hidden on mobile */}
        <div className="mx-1 hidden h-5 w-px bg-black/8 md:block" />

        {/* Nav links — hidden on mobile */}
        <nav className="hidden items-center md:flex">
          <Link
            href="/explore"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-[#6B7280] transition-colors hover:bg-black/5 hover:text-[#1F2937]"
          >
            Explorar
          </Link>
          <Link
            href="/login?redirectTo=/onboarding"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-[#6B7280] transition-colors hover:bg-black/5 hover:text-[#1F2937]"
          >
            Para comercios
          </Link>
        </nav>

        {/* Separator — hidden on mobile */}
        <div className="mx-1 hidden h-5 w-px bg-black/8 md:block" />

        {/* CTA — icon only on mobile, text + icon on sm+ */}
        <Link
          href="/explore"
          className="group flex items-center justify-center gap-1.5 rounded-full bg-[#F97316] p-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#EA580C] hover:shadow-[0_4px_16px_rgba(249,115,22,0.4)] sm:px-4 sm:py-2"
        >
          <span className="hidden sm:inline">Explorar</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
        </Link>
      </div>
    </motion.header>
  )
}
