import { ShieldX } from 'lucide-react'

export default function SuspendidaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-red-50">
          <ShieldX className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="mb-2 text-[1.5rem] font-black tracking-tight text-[#1F2937]">
          Cuenta suspendida
        </h1>
        <p className="text-[15px] leading-relaxed text-[#6B7280]">
          Tu cuenta fue suspendida por incumplimiento de los términos de uso.
          Si creés que es un error, contactanos a{' '}
          <a
            href="mailto:soporte@ofertita.app"
            className="font-semibold text-[#F97316] hover:underline"
          >
            soporte@ofertita.app
          </a>
          .
        </p>
      </div>
    </div>
  )
}
