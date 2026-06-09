import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons broken by Vite's asset bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type Props = {
  coords: { lat: number; lng: number }
  title: string
}

export function PropertyMap({ coords, title }: Props) {
  // Invalidate map size after mount so tiles render correctly inside flex layout
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [])

  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: 220, width: '100%', borderRadius: 14 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coords.lat, coords.lng]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  )
}
