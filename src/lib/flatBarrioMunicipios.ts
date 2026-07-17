// ── Municipios con desglose de barrios "plano" (1 nivel) ─────────────────────
//
// Municipios de la provincia de Barcelona que en el picker se despliegan en sus
// barrios directamente (municipio → barrios, SIN nivel de distrito), a diferencia
// de Barcelona/Tarragona ciudad (distrito → barrio). Fuente única para el picker
// (`ZonePicker`) y el filtrado (`usePropertyFilters`), para que no se desincronicen.
//
// Añadir un municipio nuevo = crear su `*Zones.ts` y sumar una entrada aquí.
// Ojo colisiones: el token de barrio es global (`b:<nombre>`), así que ningún
// barrio puede repetir nombre exacto entre municipios (ver "El Centre" en Esplugues).

import type { ZoneTaxonomy } from './barcelonaZones'
import { HOSPITALET_MUNICIPIO, HOSPITALET_BARRIOS, HOSPITALET_ZONE_TAXONOMY } from './hospitaletZones'
import { ESPLUGUES_MUNICIPIO, ESPLUGUES_BARRIOS, ESPLUGUES_ZONE_TAXONOMY } from './espluguesZones'

export interface FlatBarrioMunicipio {
  name: string
  barrios: string[]
}

export const FLAT_BARRIO_MUNICIPIOS: FlatBarrioMunicipio[] = [
  { name: HOSPITALET_MUNICIPIO, barrios: HOSPITALET_BARRIOS },
  { name: ESPLUGUES_MUNICIPIO, barrios: ESPLUGUES_BARRIOS },
]

/** Todas las etiquetas `zone` → taxonomía, combinadas de los municipios planos. */
export const FLAT_BARRIO_ZONE_TAXONOMY: Record<string, ZoneTaxonomy> = {
  ...HOSPITALET_ZONE_TAXONOMY,
  ...ESPLUGUES_ZONE_TAXONOMY,
}
