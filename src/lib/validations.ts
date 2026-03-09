import { z } from 'zod'

export const businessSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  category_id: z.string().uuid('Selecciona una categoría'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  address: z.string().min(5, 'Introduce una dirección válida'),
  city: z.string().min(2, 'Introduce una ciudad'),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]{9,15}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

// Coerces empty strings / null / undefined → undefined (field not filled).
// Validates as positive number only when a value is present.
const optionalPositivePrice = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return undefined
    return val
  },
  z.coerce.number().positive('El precio debe ser mayor que 0').optional()
)

export const offerSchema = z
  .object({
    business_id: z.string().uuid('Selecciona un comercio'),
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
    description: z.string().max(500, 'Máximo 500 caracteres').optional(),
    original_price: optionalPositivePrice,
    offer_price: optionalPositivePrice,
    start_date: z.string().min(1, 'Selecciona una fecha de inicio'),
    end_date: z.string().min(1, 'Selecciona una fecha de fin'),
  })
  .refine(
    (data) => {
      // Skip price comparison when either price is absent
      if (data.offer_price === undefined || data.original_price === undefined) return true
      return data.offer_price < data.original_price
    },
    {
      message: 'El precio de oferta debe ser menor que el precio original',
      path: ['offer_price'],
    }
  )
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: 'La fecha de fin debe ser posterior a la de inicio',
    path: ['end_date'],
  })

export type BusinessFormValues = z.infer<typeof businessSchema>
export type OfferFormValues = z.infer<typeof offerSchema>
