import { useEffect, useMemo, useRef } from 'react'
import Map, { Layer, NavigationControl, Source } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import type { FeatureCollection } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'

// Mismo motor (MapLibre) y estilo (MapTiler) que el mapa de búsqueda, para no
// arrastrar un segundo stack de mapas (Leaflet) solo por este mapa.
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`

const PULSE_LAYER = 'approx-pulse'
const PULSE_PERIOD_S = 2.6 // duración de un ciclo completo (crecer + decrecer)

type Props = {
  coords: { lat: number; lng: number }
}

export function PropertyMap({ coords }: Props) {
  const mapRef = useRef<MapRef>(null)

  // Punto único (la ubicación aproximada); el círculo pulsante se dibuja encima.
  const point = useMemo<FeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [coords.lng, coords.lat] }, properties: {} },
      ],
    }),
    [coords.lng, coords.lat],
  )

  // Animación "respiración": el radio oscila de chico a grande y vuelta, y la
  // opacidad se atenúa al crecer. Se anima el paint del layer vía rAF.
  useEffect(() => {
    let raf = 0
    let startTs: number | null = null

    const tick = (ts: number) => {
      const map = mapRef.current?.getMap()
      if (map && map.getLayer(PULSE_LAYER)) {
        if (startTs === null) startTs = ts
        const t = (ts - startTs) / 1000
        // phase ∈ [0,1] suave: 0 (chico) → 1 (grande) → 0, en bucle
        const phase = (1 - Math.cos((t / PULSE_PERIOD_S) * 2 * Math.PI)) / 2
        map.setPaintProperty(PULSE_LAYER, 'circle-radius', 28 + phase * 46)
        map.setPaintProperty(PULSE_LAYER, 'circle-opacity', 0.3 - phase * 0.18)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ height: 220, borderRadius: 14, overflow: 'hidden' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: coords.lng, latitude: coords.lat, zoom: 14 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        scrollZoom={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Source id="approx-area" type="geojson" data={point}>
          {/* Círculo pulsante, sin borde: indica la zona aproximada del inmueble */}
          <Layer
            id={PULSE_LAYER}
            type="circle"
            paint={{
              'circle-color': '#a47b36',
              'circle-radius': 28,
              'circle-opacity': 0.3,
              'circle-stroke-width': 0,
            }}
          />
        </Source>
      </Map>
    </div>
  )
}
