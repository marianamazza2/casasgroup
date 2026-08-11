// ── Fuente de datos de inmuebles ─────────────────────────────────────────────
//
// Punto único desde el que la app importa los inmuebles. Los datos vienen de
// `generatedProperties.ts`, que `scripts/buildData.mjs` regenera en cada build a
// partir del Google Sheet + Cloudinary (solo las filas con `publicado = SI`).
//
// Antes había un toggle VITE_DATA_SOURCE ('hardcoded' | 'sheet' | 'merge') que
// permitía servir unos inmuebles de demo mientras se probaba el pipeline. Se quitó
// una vez verificado en producción: los datos de demo viajaban en el bundle (~26 KB
// de JS) aunque nunca se mostraran, porque el import estático impedía tree-shaking.
//
// Por qué es seguro no tener fallback: buildData.mjs aborta el build si el Sheet
// responde con 0 filas publicadas, así que Vercel descarta ese deploy y deja en vivo
// la última versión buena. Un build exitoso siempre trae inmuebles.

import type { Property, MapPin } from './types'
import { generatedProperties } from './generatedProperties'

/** Todos los inmuebles publicados en el Sheet. */
export const properties: Property[] = generatedProperties

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
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase() === 'destacado'

/** Cuántos inmuebles entran en el carrusel de la home. */
const HOME_SLOTS = 6

/**
 * Inmuebles destacados para el home: primero los marcados DESTACADO en el Sheet, y
 * se completa hasta 6 con los ÚLTIMOS del Sheet (las altas más recientes).
 *
 * Las dos reglas SE SUMAN, no se excluyen. Esto es a propósito: el cliente marca
 * DESTACADO los que quiere fijar, y para subir a la home uno que ya lleva otra
 * etiqueta (p. ej. REBAJADO — la columna sólo admite un valor) lo mueve al final
 * del Sheet. Si fueran excluyentes, un solo DESTACADO anularía esa segunda vía y
 * la home quedaría con menos de 6 inmuebles.
 */
export const homeFeaturedProperties: Property[] = (() => {
  const destacados = properties.filter(isDestacado)
  // El relleno excluye a los destacados para no repetir ninguno si además
  // están entre las últimas filas del Sheet.
  const relleno = properties.filter((p) => !isDestacado(p)).slice(-HOME_SLOTS)
  return [...destacados, ...relleno].slice(0, HOME_SLOTS)
})()

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
