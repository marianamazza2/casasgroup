import { useEffect, useMemo, useRef, useState } from 'react'
import { properties } from '../lib/properties'
import { normalize } from '../lib/locationSearch'
import {
  BARCELONA_DISTRICTS,
  BARCELONA_MUNICIPIO,
  BARCELONA_PROVINCE_MUNICIPIOS,
  matchesZoneSelection,
  taxonomyForZone,
  tok,
} from '../lib/barcelonaZones'
import {
  TARRAGONA_DISTRICTS,
  TARRAGONA_MUNICIPIO,
  TARRAGONA_PROVINCE_MUNICIPIOS,
  TARRAGONA_ZONE_TAXONOMY,
} from '../lib/tarragonaZones'
import { HOSPITALET_MUNICIPIO } from '../lib/hospitaletZones'
import {
  FLAT_BARRIO_MUNICIPIOS,
  FLAT_BARRIO_ZONE_TAXONOMY,
} from '../lib/flatBarrioMunicipios'
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
for (const d of TARRAGONA_DISTRICTS) {
  for (const b of d.barrios) BARRIO_BY_NORM.set(normalize(b), b)
}
// Municipios de un solo nivel (municipio → barrios, sin distritos): Hospitalet, Esplugues.
for (const m of FLAT_BARRIO_MUNICIPIOS) {
  for (const b of m.barrios) BARRIO_BY_NORM.set(normalize(b), b)
}

const ALL_DISTRICTS = [...BARCELONA_DISTRICTS, ...TARRAGONA_DISTRICTS]

// El cliente carga la ciudad como "Hospitalet de Llobregat" (sin el artículo),
// pero el municipio oficial —y el token del picker— es "L'Hospitalet de Llobregat".
// Canonizamos para que un inmueble de Hospitalet con `zone` sin mapear (que cae al
// fallback por ciudad) siga matcheando "todo el municipio".
function canonicalCity(city: string): string {
  const n = normalize(city)
  if (n === normalize(HOSPITALET_MUNICIPIO) || n === normalize('Hospitalet de Llobregat')) {
    return HOSPITALET_MUNICIPIO
  }
  return city
}

function taxonomyForPropertyZone(zone: string, fallbackCity = BARCELONA_MUNICIPIO) {
  return (
    FLAT_BARRIO_ZONE_TAXONOMY[zone] ??
    TARRAGONA_ZONE_TAXONOMY[zone] ??
    taxonomyForZone(zone, canonicalCity(fallbackCity))
  )
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
    const tarragonaMuni = TARRAGONA_PROVINCE_MUNICIPIOS.find((m) => normalize(m) === q)
    if (tarragonaMuni) return [tok.municipio(tarragonaMuni)]
  }
  // ¿Coincide con la zona informal de algún inmueble? Usamos su taxonomía.
  const sample = properties.find((p) => normalize(p.zone) === q)
  if (sample) {
    const tax = taxonomyForPropertyZone(sample.zone, sample.city)
    if (tax.barrio) return [tok.barrio(tax.barrio)]
    if (tax.distrito) return [tok.distrito(tax.distrito)]
    return [tok.municipio(tax.municipio)]
  }
  // ¿Es un distrito o barrio oficial escrito directamente?
  const district = ALL_DISTRICTS.find((d) => normalize(d.name) === q)
  if (district) return [tok.distrito(district.name)]
  const barrio = BARRIO_BY_NORM.get(q)
  if (barrio) return [tok.barrio(barrio)]
  return []
}

/** La página de resultados solo ofrece subzonas dentro de provincias soportadas. */
export function isBarcelonaScopedSearch(query: string, locType?: LocType, province?: string): boolean {
  if (province) return normalize(province) === normalize('Barcelona')
    || normalize(province) === normalize('Tarragona')
  if (!query) return true
  const q = normalize(query)

  if (locType === 'provincia') return q === normalize('Barcelona') || q === normalize('Tarragona')
  if (q === normalize(BARCELONA_MUNICIPIO)) return true
  if (q === normalize(TARRAGONA_MUNICIPIO)) return true
  if (BARCELONA_PROVINCE_MUNICIPIOS.some((m) => normalize(m) === q)) return true
  if (TARRAGONA_PROVINCE_MUNICIPIOS.some((m) => normalize(m) === q)) return true
  if (ALL_DISTRICTS.some((d) => normalize(d.name) === q)) return true
  if (BARRIO_BY_NORM.has(q)) return true
  return properties.some(
    (p) =>
      normalize(p.city) === q ||
      normalize(p.zone) === q,
  )
}

interface InitialSearch {
  query?: string
  mode?: FilterState['mode']
  locType?: LocType
  province?: string
}

/**
 * Estado inicial de filtros derivado de la búsqueda de la URL.
 * Zona inicial: si el usuario buscó una zona/municipio concreto (no una
 * provincia) y coincide con la taxonomía, la dejamos preseleccionada tanto
 * en el dropdown de escritorio (`zone`) como en el picker móvil (`zones`).
 */
function filtersFromSearch(
  query: string,
  mode: FilterState['mode'],
  locType?: LocType,
): FilterState {
  let zone = 'Todas'
  let zones: string[] = []
  if (locType !== 'provincia' && query) {
    const q = normalize(query)
    const exact = properties.find((p) => p.mode === mode && normalize(p.zone) === q)
    if (exact) zone = exact.zone
    else if (locType === 'municipio') zone = query
    zones = initialZoneTokens(query, locType)
  }
  return { ...defaultFilters, query, mode, zone, zones }
}

/**
 * ¿La búsqueda de la URL apunta a una ubicación reconocida por la taxonomía
 * (provincia, municipio, distrito o barrio) — y por tanto es una página con
 * valor de indexación (§4.2.3, §6)? Un texto libre que no resuelve a ninguna
 * zona real es una vista sin valor SEO → se marca noindex.
 */
export function isKnownLocationSearch(
  query: string,
  mode: FilterState['mode'],
  locType?: LocType,
  province?: string,
): boolean {
  if (province) return true
  if (!query) return false
  const f = filtersFromSearch(query, mode, locType)
  return (f.zone !== 'Todas') || f.zones.length > 0
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
  province?: string,
): boolean {
  if (p.mode !== mode) return false
  if (province) {
    const normalizedProvince = normalize(province)
    if (normalizedProvince === normalize('Tarragona')) {
      return p.city === TARRAGONA_MUNICIPIO || TARRAGONA_PROVINCE_MUNICIPIOS.some((m) => normalize(m) === normalize(p.city))
    }
    if (normalizedProvince === normalize('Barcelona')) {
      return p.city === BARCELONA_MUNICIPIO || BARCELONA_PROVINCE_MUNICIPIOS.some((m) => normalize(m) === normalize(canonicalCity(p.city)))
    }
  }
  if (!query) return true
  const q = normalize(query)
  // `canonicalCity` cubre el desfase del artículo ("Hospitalet" en los datos vs
  // "L'Hospitalet de Llobregat" en la búsqueda/dataset): sin esto, buscar el
  // municipio deja el mapa vacío aunque haya inmuebles.
  return (
    normalize(canonicalCity(p.city)).includes(q) ||
    normalize(p.zone).includes(q) ||
    normalize(p.title).includes(q)
  )
}

export function usePropertyFilters(initial: InitialSearch = {}) {
  const { query = '', mode = 'compra', locType, province = '' } = initial

  const [filters, setFilters] = useState<FilterState>(() =>
    filtersFromSearch(query, mode, locType),
  )

  // Resincroniza cuando la búsqueda de la URL cambia desde fuera de la página.
  // P.ej. el menú móvil: ir de Comprar a Alquilar dentro de /propiedades no
  // remonta la ruta (sólo cambian los search params), así que sin esto el pill
  // de modo se quedaría en el valor con el que se montó la página.
  const lastSearch = useRef({ query, mode, locType, province })
  useEffect(() => {
    const prev = lastSearch.current
    if (prev.query === query && prev.mode === mode && prev.locType === locType && prev.province === province) return
    lastSearch.current = { query, mode, locType, province }
    setFilters(filtersFromSearch(query, mode, locType))
  }, [query, mode, locType, province])

  const outsideBarcelonaScope = !isBarcelonaScopedSearch(filters.query, locType, province)

  // Inmuebles dentro del ámbito de la búsqueda (modo + texto), en vivo: si el
  // usuario edita el buscador de la página, el ámbito y las zonas se recalculan.
  const scopedProperties = useMemo(
    () =>
      outsideBarcelonaScope
        ? []
        : properties.filter((p) => matchesLocation(p, filters.mode, filters.query, province)),
    [outsideBarcelonaScope, filters.mode, filters.query, province],
  )

  // Zonas que existen realmente dentro de ese ámbito, en cascada.
  const availableZones = useMemo(() => {
    const set = new Set(scopedProperties.map((p) => p.zone))
    return ['Todas', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))]
  }, [scopedProperties])

  // Municipios presentes en el ámbito (para acotar el árbol del picker).
  const availableMunicipios = useMemo(() => {
    const set = new Set(
      scopedProperties.map((p) => taxonomyForPropertyZone(p.zone, p.city).municipio),
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
      if (useTokens && !matchesZoneSelection(taxonomyForPropertyZone(p.zone, p.city), zoneSet)) return false
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
    zonesDisabled: scopedProperties.length === 0,
    province,
    resultCount: filteredProperties.length,
    activeFilterCount,
  }
}
