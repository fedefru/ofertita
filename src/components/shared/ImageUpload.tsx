'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  bucket: string
  folder?: string
  maxSizeMB?: number
  aspectRatio?: '4/3' | '1/1' | '16/9'
  label?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  bucket,
  folder = '',
  maxSizeMB = 5,
  aspectRatio = '4/3',
  label = 'Subir imagen',
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) await upload(file)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await upload(file)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`La imagen no puede superar ${maxSizeMB} MB`)
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Error al subir la imagen')

      const { url } = await res.json()
      onChange(url)
    } catch {
      toast.error('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const aspectClass = {
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '16/9': 'aspect-video',
  }[aspectRatio]

  return (
    <div className={cn('relative', className)}>
      {value ? (
        <div className={cn('relative overflow-hidden rounded-lg', aspectClass)}>
          <Image src={value} alt="Preview" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 transition-colors hover:border-muted-foreground/50 hover:bg-muted/20 cursor-pointer',
            aspectClass
          )}
        >
          <label className="flex flex-col items-center gap-2 cursor-pointer w-full h-full items-center justify-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleChange}
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-xs text-muted-foreground/60">
                  JPG, PNG, WEBP · Máx {maxSizeMB} MB
                </span>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  )
}
