import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Property } from '../../lib/types'

const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`
const BARCELONA_CENTER: [number, number] = [2.1734, 41.3851]

// Coordenada válida para MapLibre: lng ∈ [-180,180], lat ∈ [-90,90]. Un dato
// corrupto (p. ej. lat "413.9" por un punto decimal mal puesto en el origen)
// haría reventar setLngLat/fitBounds y tiraría toda la página, así que lo
// descartamos en vez de propagar la excepción.
function hasValidCoords(p: Property): boolean {
  if (!p.coords) return false
  const { lat, lng } = p.coords
  return (
    Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  )
}

type MarkerEntry = { marker: maplibregl.Marker; el: HTMLButtonElement }

type Props = {
  properties: Property[]
  activeId?: number
  /** Tokens de zona seleccionados; al cambiar, el mapa reencuadra a esa zona. */
  focusZones?: string[]
  onPinClick: (id: number) => void
  onBoundsChange?: (ids: number[]) => void
}

function getVisibleIds(map: maplibregl.Map, props: Property[]): number[] {
  const bounds = map.getBounds()
  return props
    .filter((p) => hasValidCoords(p) && bounds.contains([p.coords!.lng, p.coords!.lat]))
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

export function PropertyMap({ properties, activeId, focusZones, onPinClick, onBoundsChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Map<number, MarkerEntry>>(new Map())
  const callbackRef = useRef(onPinClick)
  const boundsCallbackRef = useRef(onBoundsChange)
  const propertiesRef = useRef(properties)
  const prevFocusRef = useRef<string | null>(null)

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
        if (!hasValidCoords(p) || markersRef.current.has(p.id)) return

        // Wrapper posicionado por MapLibre (su transform de translate). El botón
        // interior lleva los estilos/animaciones: así sus transiciones no se
        // aplican al transform de posición y los pines no quedan rezagados al
        // hacer pan del mapa.
        const wrapper = document.createElement('div')
        const el = document.createElement('button')
        el.type = 'button'
        el.className = 'map-pin'
        el.textContent = formatPin(p)
        el.addEventListener('click', () => callbackRef.current(p.id))
        wrapper.appendChild(el)

        const marker = new maplibregl.Marker({ element: wrapper, anchor: 'center' })
          .setLngLat([p.coords!.lng, p.coords!.lat])
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

  // Reencuadrar el mapa según la zona seleccionada. Al cambiar `focusZones`,
  // ajustamos la vista a los inmuebles del ámbito (los pines ya filtrados).
  // Si una zona no tiene inmuebles con coordenadas, no movemos (no hay a dónde).
  const focusKey = (focusZones ?? []).join('|')
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // En el primer render con "Todas las zonas" (sin selección) conservamos el
    // encuadre inicial de Barcelona; solo reencuadramos ante cambios reales.
    if (prevFocusRef.current === null && focusKey === '') {
      prevFocusRef.current = focusKey
      return
    }
    prevFocusRef.current = focusKey

    const fit = () => {
      const withCoords = propertiesRef.current.filter(hasValidCoords)
      if (withCoords.length === 0) return
      const bounds = new maplibregl.LngLatBounds()
      withCoords.forEach((p) => bounds.extend([p.coords!.lng, p.coords!.lat]))
      map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 600 })
    }

    if (map.isStyleLoaded()) fit()
    else map.once('load', fit)
  }, [focusKey])

  // Sync active highlight
  useEffect(() => {
    markersRef.current.forEach(({ el }, id) => {
      el.classList.toggle('map-pin-active', id === activeId)
    })
  }, [activeId])

  return <div ref={containerRef} className="property-map" />
}
