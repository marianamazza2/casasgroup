import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import type { Property, ViewMode } from '../../lib/types'
import { PropertyCard } from '../../components/search/PropertyCard'
import { PropertyListItem } from '../../components/search/PropertyListItem'
import { PropertyMap } from '../../components/search/PropertyMap'
import { MapPropertyPopup } from '../../components/search/MapPropertyPopup'
import { SearchBar } from '../../components/search/SearchBar'
import { FilterBar } from '../../components/search/FilterBar'
import { ResultsHeader } from '../../components/search/ResultsHeader'
import { FiltersModal } from '../../components/search/FiltersModal'
import { usePropertyFilters } from '../../hooks/usePropertyFilters'

type PropiedadesSearch = {
  query: string
  mode: 'compra' | 'alquiler'
  locType?: 'provincia' | 'municipio' | 'distrito' | 'barrio'
  province?: string
}

const LOC_TYPES = ['provincia', 'municipio', 'distrito', 'barrio'] as const

export const Route = createFileRoute('/propiedades/')({
  validateSearch: (search: Record<string, unknown>): PropiedadesSearch => {
    const out: PropiedadesSearch = {
      query: typeof search.query === 'string' ? search.query : '',
      mode: search.mode === 'alquiler' ? 'alquiler' : 'compra',
    }
    if (LOC_TYPES.includes(search.locType as (typeof LOC_TYPES)[number])) {
      out.locType = search.locType as PropiedadesSearch['locType']
    }
    if (typeof search.province === 'string' && search.province) {
      out.province = search.province
    }
    return out
  },
  component: PropiedadesPage,
})

function PropiedadesPage() {
  const { query, mode, locType, province } = Route.useSearch()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [activeId, setActiveId] = useState<number | undefined>()
  const [popupProperty, setPopupProperty] = useState<Property | null>(null)
  const [mapVisibleIds, setMapVisibleIds] = useState<Set<number> | null>(null)
  const { filters, setFilter, resetFilters, filteredProperties, availableZones, resultCount } =
    usePropertyFilters({ query, mode, locType, province })

  const handlePinClick = useCallback((id: number) => {
    setActiveId(id)
    setPopupProperty((prev) => {
      // If clicking same pin, close popup; otherwise open new one
      if (prev?.id === id) return null
      return filteredProperties.find((p) => p.id === id) ?? null
    })
    document.getElementById(`property-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [filteredProperties])

  const handlePopupClose = useCallback(() => {
    setPopupProperty(null)
    setActiveId(undefined)
  }, [])

  const handleBoundsChange = useCallback((ids: number[]) => {
    setMapVisibleIds(new Set(ids))
  }, [])

  const visibleProperties = mapVisibleIds
    ? filteredProperties.filter((p) => mapVisibleIds.has(p.id))
    : filteredProperties

  return (
    <div className="search-page">
      {/* ── Split layout ───────────────────────────────────────────────── */}
      <div className="search-split">
        {/* Left panel — scrollable */}
        <div className="search-left">
          <SearchBar
            mode={filters.mode}
            query={filters.query}
            onModeChange={(m) => setFilter('mode', m)}
            onQueryChange={(q) => setFilter('query', q)}
          />

          <FilterBar
            filters={filters}
            zones={availableZones}
            viewMode={viewMode}
            onOpenFilters={() => setShowFiltersModal(true)}
            onZoneChange={(z) => setFilter('zone', z)}
            onViewModeChange={setViewMode}
          />

          <ResultsHeader
            count={visibleProperties.length}
            total={resultCount}
            zone={filters.zone}
            isBoundsFiltered={mapVisibleIds !== null && visibleProperties.length !== resultCount}
          />

          {/* Property grid/list */}
          <div className={`property-results ${viewMode === 'list' ? 'results-list' : 'results-grid'}`}>
            {visibleProperties.length === 0 ? (
              <p className="results-empty">No hay inmuebles en esta zona del mapa. Aleja el zoom para ver más.</p>
            ) : viewMode === 'grid' ? (
              visibleProperties.map((p) => (
                <PropertyCard key={p.id} id={`property-${p.id}`} property={p} />
              ))
            ) : (
              visibleProperties.map((p) => (
                <PropertyListItem key={p.id} id={`property-${p.id}`} property={p} />
              ))
            )}
          </div>
        </div>

        {/* Right panel — sticky map */}
        <div className="search-right">
          <PropertyMap
            properties={filteredProperties}
            activeId={activeId}
            onPinClick={handlePinClick}
            onBoundsChange={handleBoundsChange}
          />
          {popupProperty && (
            <MapPropertyPopup property={popupProperty} onClose={handlePopupClose} />
          )}
        </div>
      </div>

      <FiltersModal
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApply={() => { setMapVisibleIds(null); setShowFiltersModal(false) }}
        filters={filters}
        zones={availableZones}
        onChange={setFilter}
        onReset={resetFilters}
        resultCount={resultCount}
      />
    </div>
  )
}
