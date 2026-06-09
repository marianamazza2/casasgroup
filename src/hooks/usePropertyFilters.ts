import { useState, useMemo } from 'react'
import { properties } from '../lib/propertiesData'
import type { FilterState } from '../lib/types'

const defaultFilters: FilterState = {
  mode: 'compra',
  query: '',
  zone: 'Todas',
}

export function usePropertyFilters(initialQuery = '', initialMode: FilterState['mode'] = 'compra') {
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilters, query: initialQuery, mode: initialMode })

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (p.mode !== filters.mode) return false

      if (filters.zone !== 'Todas' && p.zone !== filters.zone) return false

      if (filters.query) {
        const q = filters.query.toLowerCase()
        if (!p.title.toLowerCase().includes(q) && !p.zone.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false
      }

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
  }, [filters])

  function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters(defaultFilters)
  }

  return {
    filters,
    setFilter,
    resetFilters,
    filteredProperties,
    resultCount: filteredProperties.length,
  }
}
