import { useMemo, useState } from 'react'
import { properties } from '../lib/propertiesData'
import { normalize } from '../lib/locationSearch'
import type { FilterState } from '../lib/types'

export type LocType = 'provincia' | 'municipio' | undefined

const defaultFilters: FilterState = {
  mode: 'compra',
  query: '',
  zone: 'Todas',
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
  // provincia) y coincide con una zona existente, la dejamos preseleccionada.
  const [filters, setFilters] = useState<FilterState>(() => {
    let zone = 'Todas'
    if (locType !== 'provincia' && query) {
      const q = normalize(query)
      const exact = properties.find(
        (p) => p.mode === mode && normalize(p.zone) === q,
      )
      if (exact) zone = exact.zone
    }
    return { ...defaultFilters, query, mode, zone }
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

  const filteredProperties = useMemo(() => {
    // Si la zona seleccionada ya no existe en el ámbito actual (p. ej. tras
    // editar la búsqueda), se ignora y se comporta como "Todas".
    const zoneActive = filters.zone !== 'Todas' && availableZones.includes(filters.zone)
    return scopedProperties.filter((p) => {
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
    province,
    resultCount: filteredProperties.length,
  }
}
