'use client'

import { useEffect, useRef } from 'react'
import type { NearbyOffer } from '@/types/offer.types'
import type { Coordinates } from '@/lib/distance'
import { formatCurrency, formatDiscountPct } from '@/lib/formatters'

interface MapViewProps {
  offers: NearbyOffer[]
  userLocation: Coordinates | null
  center: Coordinates
  onOfferClick?: (offerId: string) => void
}

// ─── Marker HTML ─────────────────────────────────────────────────────────────

function buildOfferMarker(offer: NearbyOffer): string {
  const discount = formatDiscountPct(offer.discount_pct)
  const price = formatCurrency(offer.offer_price)

  return `
    <div style="
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      background: #ffffff;
      border: 1.5px solid rgba(99,102,241,0.18);
      border-radius: 10px;
      padding: 5px 10px 6px;
      font-family: system-ui, -apple-system, sans-serif;
      white-space: nowrap;
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(99,102,241,0.18), 0 1px 4px rgba(15,23,42,0.10);
      transition: transform 0.15s ease;
    ">
      <span style="
        font-size: 12px;
        font-weight: 800;
        color: #6366F1;
        line-height: 1;
        letter-spacing: -0.01em;
      ">${discount}</span>
      <span style="
        font-size: 10px;
        font-weight: 700;
        color: #10B981;
        line-height: 1;
      ">${price}</span>
      <!-- Caret pointer -->
      <div style="
        position: absolute;
        bottom: -7px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 10px;
        height: 10px;
        background: #ffffff;
        border-right: 1.5px solid rgba(99,102,241,0.18);
        border-bottom: 1.5px solid rgba(99,102,241,0.18);
      "></div>
    </div>
  `
}

function buildPopup(offer: NearbyOffer): string {
  const price = formatCurrency(offer.offer_price)
  const original = formatCurrency(offer.original_price)

  return `
    <div style="
      font-family: system-ui, -apple-system, sans-serif;
      min-width: 200px;
      max-width: 240px;
      padding: 2px;
    ">
      <p style="
        font-size: 14px;
        font-weight: 700;
        color: #1F2937;
        margin: 0 0 4px;
        line-height: 1.35;
      ">${offer.title}</p>

      <p style="
        font-size: 12px;
        color: #94A3B8;
        margin: 0 0 10px;
      ">${offer.business_name}</p>

      <div style="
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 12px;
      ">
        <span style="
          font-size: 18px;
          font-weight: 800;
          color: #10B981;
          line-height: 1;
        ">${price}</span>
        <span style="
          font-size: 12px;
          color: #CBD5E1;
          text-decoration: line-through;
        ">${original}</span>
      </div>

      <a href="/offers/${offer.id}" style="
        display: block;
        text-align: center;
        background: #6366F1;
        color: white;
        padding: 9px 16px;
        border-radius: 10px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(99,102,241,0.30);
        letter-spacing: -0.01em;
      ">Ver oferta →</a>
    </div>
  `
}

function buildUserLocationMarker(): string {
  return `
    <div style="position: relative; width: 18px; height: 18px;">
      <!-- Pulse ring -->
      <div style="
        position: absolute;
        inset: -5px;
        border-radius: 50%;
        background: rgba(99,102,241,0.18);
        animation: pulse-ring 2s ease-out infinite;
      "></div>
      <!-- Core dot -->
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #6366F1;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(99,102,241,0.45);
        position: relative;
        z-index: 1;
      "></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0%   { transform: scale(0.8); opacity: 0.8; }
        70%  { transform: scale(1.8); opacity: 0; }
        100% { transform: scale(1.8); opacity: 0; }
      }
    </style>
  `
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MapView({ offers, userLocation, center, onOfferClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return

      // Suppress default Leaflet icon path resolution
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(mapRef.current!, {
        zoomControl: true,
        attributionControl: true,
      }).setView([center.lat, center.lng], 14)

      // CartoDB Positron — clean light tiles matching #F8FAFC aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map

      // ── User location dot ───────────────────────────────────────────────
      if (userLocation) {
        const userIcon = L.divIcon({
          className: '',
          html: buildUserLocationMarker(),
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<span style="font-family:system-ui;font-size:13px;font-weight:600;color:#6366F1">Tu ubicación</span>')
      }

      // ── Offer markers ───────────────────────────────────────────────────
      offers.forEach((offer) => {
        const markerIcon = L.divIcon({
          className: '',
          html: buildOfferMarker(offer),
          // iconSize accounts for card (width varies) + 8px caret below
          iconSize: [80, 50],
          // Anchor at caret tip — horizontal center, full height
          iconAnchor: [40, 50],
          popupAnchor: [0, -54],
        })

        L.marker([offer.business_lat, offer.business_lng], { icon: markerIcon })
          .addTo(map)
          .bindPopup(buildPopup(offer), {
            maxWidth: 260,
            className: 'ofertita-popup',
          })
          .on('click', () => onOfferClick?.(offer.id))
      })
    })

    return () => {
      cancelled = true
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-center on location change
  useEffect(() => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.setView([center.lat, center.lng], mapInstanceRef.current.getZoom())
  }, [center])

  return (
    <>
      {/* Popup border-radius override — Leaflet's default popup has square corners */}
      <style>{`
        .ofertita-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(99,102,241,0.14), 0 2px 8px rgba(15,23,42,0.08) !important;
          padding: 4px !important;
          border: 1px solid rgba(99,102,241,0.10) !important;
        }
        .ofertita-popup .leaflet-popup-content {
          margin: 12px 14px !important;
        }
        .ofertita-popup .leaflet-popup-tip {
          background: #ffffff !important;
          box-shadow: none !important;
        }
        .ofertita-popup .leaflet-popup-close-button {
          color: #94A3B8 !important;
          font-size: 18px !important;
          top: 8px !important;
          right: 8px !important;
        }
        .ofertita-popup .leaflet-popup-close-button:hover {
          color: #6366F1 !important;
        }
      `}</style>
      <div ref={mapRef} className="h-full w-full overflow-hidden rounded-[20px]" />
    </>
  )
}
