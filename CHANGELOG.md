# ofertita

## [0.2.1] - 2026-03-09

## Chore:

  - Remove debug console.logs from Navbar signOut
  - Add global not-found and error pages
  - Add robots.txt (block dashboard/api, allow offers/businesses)
  - Add is_blocked to profiles + middleware redirect to /suspendida
  - Add /suspendida page for blocked users


## [0.2.0] - 2026-03-09

### Feat
- feat: geocodificación automática con debounce en BusinessForm (700ms, sin botón manual)
- feat: bias de país Argentina (`countrycodes=ar`) en query a Nominatim
- feat: lat/lng se gestionan como inputs ocultos; el usuario nunca los ve
- feat: indicador de estado de geocodificación (buscando / encontrada / error)
- feat: eliminar oferta desde /dashboard/offers con confirmación inline
- feat: agrupación de markers en el mapa por ubicación (comercio con múltiples ofertas)
- feat: popup multi-oferta en el mapa lista todas las ofertas del comercio

### Fix
- fix: foto del usuario en el navbar con fallback a `user.user_metadata.avatar_url`
- fix: "Registrar comercio" no aparece cuando el usuario ya tiene un comercio registrado
- fix: "Registrar comercio" no aparece cuando `isLoading` es true (evita flash)
- fix: "Ver mi comercio" ahora depende de `businessSlug` en lugar del rol del perfil
- fix: race condition en `useAuth` eliminando `getSession()` redundante; solo usa `onAuthStateChange`
- fix: cliente Supabase movido a nivel de módulo en `useAuth` para evitar instancias inconsistentes
- fix: `businessSlug` se carga en paralelo con el perfil en `useAuth`
- fix: precios opcionales en `OfferDetail` (tipos `number | null`, secciones condicionales)
- fix: dropdown del usuario queda sobre el mapa con `z-[1000]`
- fix: open redirect en `/auth/callback` — `next` solo acepta rutas relativas del mismo origen
- fix: colores del navbar activo y hover usan naranja (`#F97316`) en lugar de indigo/verde
- fix: colores del sidebar del dashboard usan naranja en lugar de verde accent
- fix: botones CTA de dashboard/offers usan naranja en lugar de indigo
- fix: badge "Activa" en dashboard/offers usa paleta naranja

### Security
- fix: XSS en MapView — todos los strings de datos de usuario pasan por `esc()` antes de interpolarse en HTML de Leaflet
- fix: upload route valida MIME type server-side (no confía en `file.type` del cliente)
- fix: extensión del archivo en upload se deriva del MIME validado, no del nombre del archivo
- fix: parámetro `folder` en upload sanitizado contra path traversal (`[^a-zA-Z0-9_-]`)
- fix: validación de tamaño de archivo server-side en upload (2MB / 5MB según bucket)
- feat: security headers HTTP en todas las rutas (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- feat: rate limiting en middleware para `/api/offers/nearby` (30 req/min), `/api/upload` (10 req/min), `/api/auth/login` (5 req/min)
