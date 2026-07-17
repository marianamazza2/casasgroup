// ── Taxonomía de Esplugues de Llobregat ─────────────────────────────────────
//
// Mismo modelo que L'Hospitalet: UN solo nivel (municipio → barrios directos,
// sin distritos). Ver [[project-hospitalet-zones]] y [[project-zone-filters]].
//
// Nota de colisión: el token de barrio es global (`b:<nombre>`), así que dos
// municipios no pueden compartir el nombre exacto de un barrio o se pisarían. Por
// eso el centro de Esplugues va como "El Centre" (Hospitalet ya usa "Centre").

import type { ZoneTaxonomy } from './barcelonaZones'

export const ESPLUGUES_MUNICIPIO = 'Esplugues de Llobregat'

/** Barrios oficiales de Esplugues, en orden alfabético para el picker. */
export const ESPLUGUES_BARRIOS: string[] = [
  'Can Clota',
  'Can Vidalet',
  'Ciutat Diagonal',
  'El Centre',
  'El Gall',
  'Finestrelles',
  'La Miranda',
  'La Plana - Montesa',
]

/**
 * Etiqueta `zone` del Sheet → barrio oficial. La clave es el texto EXACTO del
 * Sheet; el `barrio` del valor es el nombre canónico del picker (`ESPLUGUES_BARRIOS`).
 * Incluye el nombre canónico + variantes reales del cliente ("La Plana - Montesa").
 */
export const ESPLUGUES_ZONE_TAXONOMY: Record<string, ZoneTaxonomy> = {
  // Nombres canónicos
  'Can Clota': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'Can Clota' },
  'Can Vidalet': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'Can Vidalet' },
  'Ciutat Diagonal': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'Ciutat Diagonal' },
  'El Centre': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'El Centre' },
  'El Gall': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'El Gall' },
  Finestrelles: { municipio: ESPLUGUES_MUNICIPIO, barrio: 'Finestrelles' },
  'La Miranda': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'La Miranda' },
  // La Plana y Montesa se ofrecen como un único barrio combinado (así los carga el cliente).
  'La Plana - Montesa': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'La Plana - Montesa' },
  'La Plana-Montesa': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'La Plana - Montesa' },
  'La Plana': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'La Plana - Montesa' },
  Montesa: { municipio: ESPLUGUES_MUNICIPIO, barrio: 'La Plana - Montesa' },
  'Can Clota - Finestrelles': { municipio: ESPLUGUES_MUNICIPIO, barrio: 'Can Clota' },
}
