// ── Fuente de datos de inmuebles (Paso 4 — toggle hardcodeado ↔ Sheet) ───────
//
// Punto único desde el que la app importa los inmuebles. Una bandera decide si
// los datos vienen de `propertiesData.ts` (hardcodeados, etapa de diseño) o de
// `generatedProperties.ts` (generado en build desde Google Sheet + Cloudinary).
//
// Bandera: VITE_DATA_SOURCE = 'sheet' | 'hardcoded' (default: 'hardcoded').
// Mientras se prueba el pipeline, basta con cambiar la env var — sin tocar el
// resto de la app. Al confirmar, se deja 'sheet' fija.
//
// Salvaguarda: si se pide 'sheet' pero el módulo generado está vacío (p. ej. en
// dev sin haber corrido el build, o si el Sheet falla), se cae a los datos
// hardcodeados para no romper la web.

import type { Property, MapPin } from './types'
import {
  homeFeaturedProperties as hardcodedFeatured,
  properties as hardcodedProperties,
} from './propertiesData'
import { generatedProperties } from './generatedProperties'

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE ?? 'hardcoded'

const useSheet = DATA_SOURCE === 'sheet' && generatedProperties.length > 0

if (DATA_SOURCE === 'sheet' && generatedProperties.length === 0) {
  console.warn(
    '[properties] VITE_DATA_SOURCE=sheet pero generatedProperties está vacío — ' +
      'usando datos hardcodeados como fallback. Corré `npm run build` o revisá SHEET_CSV_URL.',
  )
}

/** Fuente activa: 'sheet' (Google Sheet + Cloudinary) o 'hardcoded'. */
export const dataSource: 'sheet' | 'hardcoded' = useSheet ? 'sheet' : 'hardcoded'

/** Todos los inmuebles publicados, ya resueltos según la bandera. */
export const properties: Property[] = useSheet ? generatedProperties : hardcodedProperties

/**
 * Inmuebles destacados para el home. Con datos del Sheet se derivan de los que
 * llevan etiqueta DESTACADO (tag 'Destacado'); si no hay ninguno, se toman los
 * primeros. Con datos hardcodeados se usa la lista curada de `propertiesData`.
 */
export const homeFeaturedProperties: Property[] = useSheet
  ? (() => {
      const destacados = generatedProperties.filter((p) => p.tag === 'Destacado')
      return (destacados.length ? destacados : generatedProperties).slice(0, 6)
    })()
  : hardcodedFeatured

/** Pins del mapa — derivados de la fuente activa (mismo cálculo que el original). */
export const mapPins: MapPin[] = properties
  .filter((p) => p.coords)
  .map((p, i) => ({
    id: p.id,
    priceLabel:
      p.mode === 'alquiler'
        ? `${(p.price / 1000).toFixed(0)}k/m`
        : p.price >= 1000000
          ? `${(p.price / 1000000).toFixed(1)}M`
          : `${Math.round(p.price / 1000)}k`,
    top: `${15 + (i % 5) * 14}%`,
    left: `${20 + (i % 6) * 12}%`,
  }))
