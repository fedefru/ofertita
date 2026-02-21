# Ofertita

Plataforma SaaS que conecta comercios locales con usuarios cercanos para mostrar ofertas del día.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (Auth + PostgreSQL + PostGIS + Storage)
- **Tailwind CSS** + **shadcn/ui**
- **Leaflet.js** + OpenStreetMap
- **Zod** + React Hook Form

---

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
# Edita .env.local con tus credenciales de Supabase
```

### 3. Configurar Supabase

#### a) Crear proyecto en [supabase.com](https://supabase.com)

#### b) Ejecutar migrations (en orden):

En el SQL Editor de Supabase, ejecuta cada archivo de `supabase/migrations/` en orden:

```
0001_extensions.sql   → Extensiones PostGIS, uuid-ossp, pg_trgm
0002_categories.sql   → Tabla categorías + seed
0003_profiles.sql     → Tabla profiles + trigger handle_new_user
0004_businesses.sql   → Tabla businesses + índice GIST
0005_offers.sql       → Tabla offers + columna generada discount_pct
0006_saved_offers.sql → Tabla saved_offers + triggers + función get_nearby_offers
0007_rls_policies.sql → RLS policies en todas las tablas
```

#### c) Configurar Auth (Solo Google OAuth)

1. Dashboard → Authentication → Providers → Google → Enable
2. Añade Client ID + Client Secret (de Google Cloud Console)
3. Redirect URL: `https://[proyecto].supabase.co/auth/v1/callback`
4. Site URL: `https://ofertita.vercel.app` (o tu dominio)
5. Additional redirect URLs:
   - `https://ofertita.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
6. **Deshabilitar** Email/Password y Magic Link

#### d) Crear Storage Buckets

En el SQL Editor, ejecuta las sentencias comentadas al final de `0007_rls_policies.sql`.

O manualmente desde Dashboard → Storage:
- `offer-images` (público, 5 MB, jpeg/png/webp)
- `business-assets` (público, 2 MB, jpeg/png/webp)

### 4. Generar tipos TypeScript (opcional, recomendado)

```bash
npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/database.types.ts
```

### 5. Iniciar en desarrollo

```bash
npm run dev
```

---

## Estructura

```
src/
├── app/              # App Router pages y API routes
├── components/       # Componentes React
│   ├── ui/           # shadcn/ui base components
│   ├── offers/       # OfferCard, OfferGrid, OfferForm, SaveButton...
│   ├── map/          # MapView (Leaflet, SSR disabled)
│   ├── business/     # BusinessCard, BusinessForm, BusinessHeader
│   ├── auth/         # GoogleSignInButton
│   ├── layout/       # Navbar, DashboardSidebar, MobileBottomNav
│   └── shared/       # CategoryBadge, PriceDisplay, DistanceBadge, ImageUpload
├── hooks/            # useGeolocation, useNearbyOffers, useSavedOffers, useAuth
├── lib/
│   ├── supabase/     # Clientes browser/server + queries
│   ├── distance.ts   # Haversine distance
│   ├── formatters.ts # Precio, tiempo, descuento
│   ├── validations.ts # Zod schemas
│   └── constants.ts
├── middleware.ts     # Auth guard global
└── types/            # TypeScript types
```

## Deploy

```bash
# Vercel
vercel --prod

# Variables de entorno necesarias en Vercel:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_APP_URL
```

## Roles

| Rol | Acceso |
|-----|--------|
| `viewer` | Explorar, guardar y ver ofertas |
| `business_owner` | Todo lo anterior + crear/gestionar comercios y ofertas |

**Flujo de elevación:** viewer → completa `/onboarding` → INSERT en businesses → UPDATE profiles.role = 'business_owner'
