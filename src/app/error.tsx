'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error tracking service (e.g. Sentry) here
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="mb-2 text-[1.5rem] font-black tracking-tight text-[#1F2937]">
          Algo salió mal
        </h1>
        <p className="mb-6 text-[15px] leading-relaxed text-[#6B7280]">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver más tarde.
        </p>
        <Button onClick={reset} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
          Intentar de nuevo
        </Button>
      </div>
    </div>
  )
}
