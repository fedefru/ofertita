import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = formData.get('bucket') as string | null
    const folder = (formData.get('folder') as string) || ''

    if (!file || !bucket) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const maxSize = bucket === 'business-assets' ? 2 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Archivo demasiado grande' }, { status: 413 })
    }

    const allowedBuckets = ['offer-images', 'business-assets']
    if (!allowedBuckets.includes(bucket)) {
      return NextResponse.json({ error: 'Bucket inválido' }, { status: 400 })
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }
    const ext = mimeToExt[file.type]

    // Sanitize folder: only allow alphanumeric, hyphens and underscores
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '')
    const filename = `${user.id}/${safeFolder ? safeFolder + '/' : ''}${Date.now()}.${ext}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('[/api/upload]', err)
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
  }
}
