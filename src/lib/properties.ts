// ── Fuente de datos de inmuebles (Paso 4 — toggle hardcodeado ↔ Sheet) ───────
//
// Punto único desde el que la app importa los inmuebles. Una bandera decide si
// los datos vienen de `propertiesData.ts` (hardcodeados, etapa de diseño) o de
// `generatedProperties.ts` (generado en build desde Google Sheet + Cloudinary).
//
// Bandera: VITE_DATA_SOURCE = 'sheet' | 'merge' | 'hardcoded' (default: 'hardcoded').
//   - 'hardcoded': solo los datos de propertiesData.ts (etapa de diseño).
//   - 'sheet':     solo los datos generados (Google Sheet + Cloudinary).
//   - 'merge':     los del Sheet SE SUMAN a los hardcodeados (probar el Sheet sin
//                  perder los inmuebles de demo).
// Mientras se prueba el pipeline, basta con cambiar la env var — sin tocar el
// resto de la app. Al confirmar, se deja 'sheet' fija.
//
// Salvaguarda: si se pide 'sheet'/'merge' pero el módulo generado está vacío (p. ej.
// en dev sin haber corrido el build, o si el Sheet falla), se cae a los datos
// hardcodeados para no romper la web.

import type { Property, MapPin } from './types'
import {
  homeFeaturedProperties as hardcodedFeatured,
  properties as hardcodedProperties,
} from './propertiesData'
import { generatedProperties } from './generatedProperties'

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE ?? 'hardcoded'
const hasGenerated = generatedProperties.length > 0

if ((DATA_SOURCE === 'sheet' || DATA_SOURCE === 'merge') && !hasGenerated) {
  console.warn(
    '[properties] VITE_DATA_SOURCE=' + DATA_SOURCE + ' pero generatedProperties está ' +
      'vacío — usando datos hardcodeados como fallback. Corré `npm run build` o revisá SHEET_CSV_URL.',
  )
}

// En 'merge' los ids del Sheet se desplazan (+10000) para no chocar con los ids
// hardcodeados (1–108). Sin esto, la ficha /propiedades/$id mostraría el inmueble
// equivocado, porque `find` por id devuelve el primero que coincide.
const SHEET_ID_OFFSET = 10000
const sheetShifted = generatedProperties.map((p) => ({ ...p, id: p.id + SHEET_ID_OFFSET }))

/** Fuente activa, ya resuelta (con fallback a hardcoded si el Sheet está vacío). */
export const dataSource: 'sheet' | 'hardcoded' | 'merge' =
  DATA_SOURCE === 'merge' && hasGenerated
    ? 'merge'
    : DATA_SOURCE === 'sheet' && hasGenerated
      ? 'sheet'
      : 'hardcoded'

/** Todos los inmuebles publicados, ya resueltos según la bandera. */
export const properties: Property[] =
  dataSource === 'merge'
    ? [...sheetShifted, ...hardcodedProperties]
    : dataSource === 'sheet'
      ? generatedProperties
      : hardcodedProperties

/**
 * ¿Este inmueble está marcado como destacado en el Sheet?
 *
 * La columna `etiqueta` la carga el cliente a mano, así que la comparación tolera
 * mayúsculas, acentos y espacios sobrantes: DESTACADO, destacado y Destacado
 * cuentan igual. Antes era `tag === 'Destacado'` exacto y cualquier variante
 * fallaba en silencio (el inmueble mostraba el cartel pero no entraba a la home).
 */
const isDestacado = (p: Property) =>
  (p.tag ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase() === 'destacado'

/** Cuántos inmuebles entran en el carrusel de la home. */
const HOME_SLOTS = 6

/**
 * Inmuebles destacados para el home.
 *   - 'sheet': primero los marcados DESTACADO en el Sheet, y se completa hasta 6
 *     con los ÚLTIMOS del Sheet (las altas más recientes).
 *   - 'merge': los destacados del Sheet primero, completando con los curados.
 *   - 'hardcoded': la lista curada de `propertiesData`.
 *
 * Las dos reglas SE SUMAN, no se excluyen. Esto es a propósito: el cliente marca
 * DESTACADO los que quiere fijar, y para subir a la home uno que ya lleva otra
 * etiqueta (p. ej. REBAJADO — la columna sólo admite un valor) lo mueve al final
 * del Sheet. Si fueran excluyentes, un solo DESTACADO anularía esa segunda vía y
 * la home quedaría con menos de 6 inmuebles.
 */
export const homeFeaturedProperties: Property[] =
  dataSource === 'sheet'
    ? (() => {
        const destacados = generatedProperties.filter(isDestacado)
        // El relleno excluye a los destacados para no repetir ninguno si además
        // están entre las últimas filas del Sheet.
        const relleno = generatedProperties.filter((p) => !isDestacado(p)).slice(-HOME_SLOTS)
        return [...destacados, ...relleno].slice(0, HOME_SLOTS)
      })()
    : dataSource === 'merge'
      ? [...sheetShifted.filter(isDestacado), ...hardcodedFeatured].slice(0, 6)
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
