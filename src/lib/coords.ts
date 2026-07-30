// ── Validación de coordenadas ────────────────────────────────────────────────
//
// Las coordenadas se cargan a mano en el Sheet, así que llegan con los errores
// típicos: un punto decimal mal puesto ("413.9" en vez de "41.39"), lat y lng
// invertidos, o una celda pegada de otra fila. MapLibre lanza una excepción ante
// una coordenada fuera de rango ("Invalid LngLat latitude value") y en la ficha
// eso se lleva puesto el render de toda la página, no solo el mapa.
//
// El filtro estricto —¿cae dentro de Cataluña?— vive en `scripts/buildData.mjs`,
// que es donde se puede avisar de un dato mal cargado. Acá el criterio es el
// mínimo que MapLibre tolera: este es el último cinturón de seguridad, por si un
// dato corrupto llegara igual al cliente.

import type { Property } from './types'

export type Coords = { lat: number; lng: number }

export function isValidCoords(coords?: Coords): coords is Coords {
  if (!coords) return false
  const { lat, lng } = coords
  return (
    Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  )
}

export function hasValidCoords(p: Property): boolean {
  return isValidCoords(p.coords)
}
