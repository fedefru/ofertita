import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#FFF7ED]">
          <SearchX className="h-8 w-8 text-[#F97316]" />
        </div>
        <h1 className="mb-2 text-[1.5rem] font-black tracking-tight text-[#1F2937]">
          Página no encontrada
        </h1>
        <p className="mb-6 text-[15px] leading-relaxed text-[#6B7280]">
          La página que buscás no existe o fue eliminada.
        </p>
        <Button asChild className="bg-[#F97316] hover:bg-[#EA580C] text-white">
          <Link href="/explore">Volver a explorar</Link>
        </Button>
      </div>
    </div>
  )
}
