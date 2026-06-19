import { useMemo, useState } from 'react'
import { properties } from '../lib/propertiesData'
import { normalize } from '../lib/locationSearch'
import {
  BARCELONA_DISTRICTS,
  BARCELONA_MUNICIPIO,
  BARCELONA_PROVINCE_MUNICIPIOS,
  matchesZoneSelection,
  taxonomyForZone,
  tok,
} from '../lib/barcelonaZones'
import type { FilterState } from '../lib/types'

export type LocType = 'provincia' | 'municipio' | 'distrito' | 'barrio' | undefined

const defaultFilters: FilterState = {
  mode: 'compra',
  query: '',
  zone: 'Todas',
  zones: [],
}

// Índice para resolver el texto de búsqueda a un barrio oficial (normalizado → nombre canónico).
const BARRIO_BY_NORM = new Map<string, string>()
for (const d of BARCELONA_DISTRICTS) {
  for (const b of d.barrios) BARRIO_BY_NORM.set(normalize(b), b)
}

/** Convierte una búsqueda libre en un token de zona si coincide con la taxonomía. */
function initialZoneTokens(query: string, locType?: LocType): string[] {
  if (!query) return []
  const q = normalize(query)
  // Municipio entero: Barcelona ciudad no tiene token `m:` (la capital queda
  // fuera de la lista de municipios de la provincia y el picker la representa
  // con sus 10 distritos), así que la preseleccionamos como "todo el municipio".
  // Cualquier otro municipio de la provincia sí usa su token `m:`.
  if (locType === 'municipio') {
    if (q === normalize(BARCELONA_MUNICIPIO)) {
      return BARCELONA_DISTRICTS.map((d) => tok.distrito(d.name))
    }
    const muni = BARCELONA_PROVINCE_MUNICIPIOS.find((m) => normalize(m) === q)
    if (muni) return [tok.municipio(muni)]
  }
  // ¿Coincide con la zona informal de algún inmueble? Usamos su taxonomía.
  const sample = properties.find((p) => normalize(p.zone) === q)
  if (sample) {
    const tax = taxonomyForZone(sample.zone, sample.city)
    if (tax.barrio) return [tok.barrio(tax.barrio)]
    if (tax.distrito) return [tok.distrito(tax.distrito)]
    return [tok.municipio(tax.municipio)]
  }
  // ¿Es un distrito o barrio oficial escrito directamente?
  const district = BARCELONA_DISTRICTS.find((d) => normalize(d.name) === q)
  if (district) return [tok.distrito(district.name)]
  const barrio = BARRIO_BY_NORM.get(q)
  if (barrio) return [tok.barrio(barrio)]
  return []
}

interface InitialSearch {
  query?: string
  mode?: FilterState['mode']
  locType?: LocType
  province?: string
}

/**
 * ¿El inmueble cae dentro del *ámbito de ubicación* buscado (modo + texto)?
 * Se usa para acotar resultados y para derivar qué zonas ofrecer en cascada,
 * antes de aplicar el filtro de zona y el resto.
 */
function matchesLocation(
  p: (typeof properties)[number],
  mode: FilterState['mode'],
  query: string,
): boolean {
  if (p.mode !== mode) return false
  if (!query) return true
  const q = normalize(query)
  return (
    normalize(p.city).includes(q) ||
    normalize(p.zone).includes(q) ||
    normalize(p.title).includes(q)
  )
}

export function usePropertyFilters(initial: InitialSearch = {}) {
  const { query = '', mode = 'compra', locType, province = '' } = initial

  // Zona inicial: si el usuario buscó una zona/municipio concreto (no una
  // provincia) y coincide con la taxonomía, la dejamos preseleccionada tanto
  // en el dropdown de escritorio (`zone`) como en el picker móvil (`zones`).
  const [filters, setFilters] = useState<FilterState>(() => {
    let zone = 'Todas'
    let zones: string[] = []
    if (locType !== 'provincia' && query) {
      const q = normalize(query)
      const exact = properties.find(
        (p) => p.mode === mode && normalize(p.zone) === q,
      )
      if (exact) zone = exact.zone
      else if (locType === 'municipio') zone = query
      zones = initialZoneTokens(query, locType)
    }
    return { ...defaultFilters, query, mode, zone, zones }
  })

  // Inmuebles dentro del ámbito de la búsqueda (modo + texto), en vivo: si el
  // usuario edita el buscador de la página, el ámbito y las zonas se recalculan.
  const scopedProperties = useMemo(
    () => properties.filter((p) => matchesLocation(p, filters.mode, filters.query)),
    [filters.mode, filters.query],
  )

  // Zonas que existen realmente dentro de ese ámbito, en cascada.
  const availableZones = useMemo(() => {
    const set = new Set(scopedProperties.map((p) => p.zone))
    return ['Todas', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))]
  }, [scopedProperties])

  // Municipios presentes en el ámbito (para acotar el árbol del picker).
  const availableMunicipios = useMemo(() => {
    const set = new Set(
      scopedProperties.map((p) => taxonomyForZone(p.zone, p.city).municipio),
    )
    return set
  }, [scopedProperties])

  const filteredProperties = useMemo(() => {
    // Picker móvil (multi-selección anidada): tiene prioridad si hay tokens.
    const zoneSet = new Set(filters.zones)
    const useTokens = zoneSet.size > 0
    // Dropdown simple de escritorio: si la zona ya no existe en el ámbito, se ignora.
    const zoneActive =
      !useTokens && filters.zone !== 'Todas' && availableZones.includes(filters.zone)
    return scopedProperties.filter((p) => {
      if (useTokens && !matchesZoneSelection(taxonomyForZone(p.zone, p.city), zoneSet)) return false
      if (zoneActive && p.zone !== filters.zone) return false

      if (filters.priceMin != null && p.price < filters.priceMin) return false
      if (filters.priceMax != null && p.price > filters.priceMax) return false

      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(p.category)) return false
      }

      if (filters.bedrooms != null && filters.bedrooms > 0 && p.beds < filters.bedrooms) return false
      if (filters.bathrooms != null && filters.bathrooms > 0 && p.baths < filters.bathrooms) return false

      if (filters.surfaceMin != null && p.m2 < filters.surfaceMin) return false
      if (filters.surfaceMax != null && p.m2 > filters.surfaceMax) return false

      return true
    })
  }, [scopedProperties, availableZones, filters])

  // Nº de grupos de filtros activos (los del modal "Filtros"), para el badge.
  const activeFilterCount = useMemo(() => {
    let n = 0
    // Zona: tokens del picker móvil, o el dropdown simple (si sigue siendo válido).
    const useTokens = filters.zones.length > 0
    const zoneActive =
      !useTokens && filters.zone !== 'Todas' && availableZones.includes(filters.zone)
    if (useTokens || zoneActive) n++
    if (filters.priceMin != null || filters.priceMax != null) n++
    if (filters.category && filters.category.length > 0) n++
    if (filters.bedrooms != null && filters.bedrooms > 0) n++
    if (filters.bathrooms != null && filters.bathrooms > 0) n++
    if (filters.surfaceMin != null || filters.surfaceMax != null) n++
    return n
  }, [filters, availableZones])

  function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters({ ...defaultFilters, query, mode })
  }

  return {
    filters,
    setFilter,
    resetFilters,
    filteredProperties,
    availableZones,
    availableMunicipios,
    province,
    resultCount: filteredProperties.length,
    activeFilterCount,
  }
}
