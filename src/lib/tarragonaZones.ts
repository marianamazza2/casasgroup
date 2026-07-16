import spainLocations from './spainLocations.json'
import type { District, ZoneTaxonomy } from './barcelonaZones'

type RawLocation = { n: string; t: string; p?: string }

export const TARRAGONA_MUNICIPIO = 'Tarragona'

export const TARRAGONA_PROVINCE_MUNICIPIOS: string[] = (spainLocations as RawLocation[])
  .filter((loc) => loc.t === 'municipio' && loc.p === 'Tarragona')
  .map((loc) => loc.n)
  .sort((a, b) => a.localeCompare(b, 'es'))

export const TARRAGONA_DISTRICTS: District[] = [
  {
    name: 'Centre',
    barrios: ['Centre de Ciutat', 'Part Alta', 'El Serrallo'],
  },
  {
    name: 'Ponent',
    barrios: [
      'Riuclar',
      'Parc Riuclar',
      'La Floresta',
      'Icomar',
      'Bonavista',
      'Torreforta',
      'La Granja',
      'Campclar',
      'El Pilar',
    ],
  },
  {
    name: 'Nord',
    barrios: ['Sant Salvador', 'Sant Pere i Sant Pau'],
  },
  {
    name: 'Llevant',
    barrios: ['Llevant', 'Arrabassada', 'Cala Romana', 'Boscos de Tarragona', 'La Móra', 'Tamarit', 'Ferran'],
  },
]

export const TARRAGONA_ZONE_TAXONOMY: Record<string, ZoneTaxonomy> = {
  'Centre de Ciutat': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Centre', barrio: 'Centre de Ciutat' },
  'Part Alta': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Centre', barrio: 'Part Alta' },
  'El Serrallo': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Centre', barrio: 'El Serrallo' },
  Riuclar: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'Riuclar' },
  'Parc Riuclar': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'Parc Riuclar' },
  'La Floresta': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'La Floresta' },
  Icomar: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'Icomar' },
  Bonavista: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'Bonavista' },
  Torreforta: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'Torreforta' },
  'La Granja': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'La Granja' },
  Campclar: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'Campclar' },
  'El Pilar': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Ponent', barrio: 'El Pilar' },
  'Sant Salvador': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Nord', barrio: 'Sant Salvador' },
  'Sant Pere i Sant Pau': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Nord', barrio: 'Sant Pere i Sant Pau' },
  Llevant: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Llevant', barrio: 'Llevant' },
  Arrabassada: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Llevant', barrio: 'Arrabassada' },
  'Cala Romana': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Llevant', barrio: 'Cala Romana' },
  'Boscos de Tarragona': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Llevant', barrio: 'Boscos de Tarragona' },
  'La Móra': { municipio: TARRAGONA_MUNICIPIO, distrito: 'Llevant', barrio: 'La Móra' },
  Tamarit: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Llevant', barrio: 'Tamarit' },
  Ferran: { municipio: TARRAGONA_MUNICIPIO, distrito: 'Llevant', barrio: 'Ferran' },
}
