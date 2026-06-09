import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Property } from '../../lib/types'

const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`
const BARCELONA_CENTER: [number, number] = [2.1734, 41.3851]

type MarkerEntry = { marker: maplibregl.Marker; el: HTMLButtonElement }

type Props = {
  properties: Property[]
  activeId?: number
  onPinClick: (id: number) => void
  onBoundsChange?: (ids: number[]) => void
}

function getVisibleIds(map: maplibregl.Map, props: Property[]): number[] {
  const bounds = map.getBounds()
  return props
    .filter((p) => p.coords && bounds.contains([p.coords.lng, p.coords.lat]))
    .map((p) => p.id)
}

function formatPin(p: Property): string {
  if (p.mode === 'alquiler') {
    return p.price < 1000 ? `${p.price}€` : `${(p.price / 1000).toFixed(1)}k/m`
  }
  return p.price >= 1_000_000
    ? `${(p.price / 1_000_000).toFixed(1)}M`
    : `${Math.round(p.price / 1000)}k`
}

export function PropertyMap({ properties, activeId, onPinClick, onBoundsChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Map<number, MarkerEntry>>(new Map())
  const callbackRef = useRef(onPinClick)
  const boundsCallbackRef = useRef(onBoundsChange)
  const propertiesRef = useRef(properties)

  useEffect(() => { callbackRef.current = onPinClick })
  useEffect(() => { boundsCallbackRef.current = onBoundsChange })
  useEffect(() => { propertiesRef.current = properties })

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: BARCELONA_CENTER,
      zoom: 12,
      attributionControl: false,
    })

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    const notify = () => {
      boundsCallbackRef.current?.(getVisibleIds(map, propertiesRef.current))
    }

    map.on('moveend', notify)
    map.on('zoomend', notify)
    map.once('load', notify)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current.clear()
    }
  }, [])

  // Sync markers when filtered properties change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const sync = () => {
      const incoming = new Set(properties.map((p) => p.id))

      markersRef.current.forEach(({ marker }, id) => {
        if (!incoming.has(id)) {
          marker.remove()
          markersRef.current.delete(id)
        }
      })

      properties.forEach((p) => {
        if (!p.coords || markersRef.current.has(p.id)) return

        const el = document.createElement('button')
        el.type = 'button'
        el.className = 'map-pin'
        el.textContent = formatPin(p)
        el.addEventListener('click', () => callbackRef.current(p.id))

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([p.coords.lng, p.coords.lat])
          .addTo(map)

        markersRef.current.set(p.id, { marker, el })
      })

      // Notify parent which of the new set are in viewport
      if (map.isStyleLoaded()) {
        boundsCallbackRef.current?.(getVisibleIds(map, properties))
      }
    }

    if (map.isStyleLoaded()) {
      sync()
    } else {
      map.once('load', sync)
    }
  }, [properties])

  // Sync active highlight
  useEffect(() => {
    markersRef.current.forEach(({ el }, id) => {
      el.classList.toggle('map-pin-active', id === activeId)
    })
  }, [activeId])

  return <div ref={containerRef} className="property-map" />
}
