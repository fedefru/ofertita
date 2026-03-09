import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Detects MIME type from file magic bytes — not trusting client-supplied file.type.
 * Returns null if the file is not a recognized image format.
 */
function detectMimeFromBytes(buf: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return 'image/png'
  // WebP: RIFF????WEBP
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return 'image/webp'
  return null
}

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

    // Read file content first — magic byte validation ignores client-supplied file.type
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const detectedMime = detectMimeFromBytes(buffer)
    if (!detectedMime) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }
    const ext = mimeToExt[detectedMime]

    // Sanitize folder: only allow alphanumeric, hyphens and underscores
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '')
    const filename = `${user.id}/${safeFolder ? safeFolder + '/' : ''}${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: detectedMime,
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
