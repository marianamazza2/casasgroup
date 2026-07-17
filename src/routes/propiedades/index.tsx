import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useRef, useState } from 'react'
import type { Property, ViewMode } from '../../lib/types'
import { PropertyCard } from '../../components/search/PropertyCard'
import { PropertyListItem } from '../../components/search/PropertyListItem'
import { PropertyMap } from '../../components/search/PropertyMap'
import { MapPropertyPopup } from '../../components/search/MapPropertyPopup'
import { SearchBar } from '../../components/search/SearchBar'
import { FilterBar } from '../../components/search/FilterBar'
import { ResultsHeader } from '../../components/search/ResultsHeader'
import { NoResults } from '../../components/search/NoResults'
import { FiltersModal } from '../../components/search/FiltersModal'
import { usePropertyFilters, isKnownLocationSearch, isBarcelonaScopedSearch } from '../../hooks/usePropertyFilters'
import { Seo } from '../../components/Seo'
import { SITE_URL } from '../../lib/structuredData'

type PropiedadesSearch = {
  query: string
  mode: 'compra' | 'alquiler'
  locType?: 'provincia' | 'municipio' | 'distrito' | 'barrio'
  province?: string
}

const LOC_TYPES = ['provincia', 'municipio', 'distrito', 'barrio'] as const

/** Primera letra en mayúscula (para ubicaciones de la URL en el title/description). */
const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

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
  const activeProvince = province || (locType === 'provincia' ? query : undefined)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [activeId, setActiveId] = useState<number | undefined>()
  const [popupProperty, setPopupProperty] = useState<Property | null>(null)
  const [mapVisibleIds, setMapVisibleIds] = useState<Set<number> | null>(null)
  // Mobile: la página entera es el scroller. Mostramos el botón flotante
  // "Mapa" una vez que la lista ha empezado a tapar el mapa.
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolledIntoList, setScrolledIntoList] = useState(false)
  const { filters, setFilter, resetFilters, filteredProperties, availableMunicipios, zonesDisabled, resultCount, activeFilterCount } =
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

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (el) setScrolledIntoList(el.scrollTop > 140)
  }, [])

  const scrollToMap = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const visibleProperties = mapVisibleIds
    ? filteredProperties.filter((p) => mapVisibleIds.has(p.id))
    : filteredProperties

  // H1 semántico y dinámico: modo (venta/alquiler) + ubicación buscada. La UI de
  // búsqueda es intencionadamente sobria (sin título grande), así que el
  // encabezado real va oculto pero accesible (mismo patrón que la home).
  const modeLabel = filters.mode === 'alquiler' ? 'en alquiler' : 'en venta'
  const heading =
    filters.zone && filters.zone !== 'Todas'
      ? filters.zone
      : filters.query || province || 'Barcelona'

  // ── SEO (§4.2.2, §4.2.3, §6) ──────────────────────────────────────────────
  // title/description/canonical/robots se derivan de los SEARCH PARAMS DE LA URL
  // (query/mode/province), no del estado vivo de filtros: son la vista indexable
  // y estable. Los micro-filtros (precio, habitaciones…) no viven en la URL, así
  // que no generan combinaciones duplicadas que crawlear.
  const rawLocation = (province || query).trim()
  const hasLocationParam = Boolean(rawLocation)
  // Vista indexable = ubicación reconocida por la taxonomía Y dentro de una
  // provincia soportada. Fuera de ámbito (p.ej. province=Madrid) o texto libre
  // sin match → vista thin/vacía → noindex (§6:
  // no gastar crawl budget en URLs sin valor).
  const knownLocation =
    isKnownLocationSearch(query, mode, locType, province) &&
    isBarcelonaScopedSearch(query, locType, province)
  const seoNoindex = hasLocationParam && !knownLocation
  const seoLocation = knownLocation && rawLocation ? capitalize(rawLocation) : 'Barcelona'
  const seoTitle =
    mode === 'alquiler'
      ? `Pisos en alquiler en ${seoLocation} | Group Casas`
      : `Pisos y casas en venta en ${seoLocation} | Group Casas`
  const seoDescription =
    mode === 'alquiler'
      ? `Pisos en alquiler en ${seoLocation}. Filtra por precio, habitaciones y zona y encuentra tu próximo hogar con Group Casas.`
      : `Pisos y casas en venta en ${seoLocation}. Filtra por zona, precio y características y encuentra tu próximo hogar con Group Casas.`
  // Canonical limpio: mode solo si no es el por defecto (compra) — así la vista
  // base coincide con /propiedades del sitemap. Se conserva la ubicación solo si
  // es reconocida; locType (pista interna) se descarta siempre.
  const canonicalParams = new URLSearchParams()
  if (knownLocation && rawLocation) {
    if (province) canonicalParams.set('province', province)
    else canonicalParams.set('query', query)
  }
  if (mode === 'alquiler') canonicalParams.set('mode', 'alquiler')
  const canonicalQuery = canonicalParams.toString()
  const seoCanonical = `${SITE_URL}/propiedades${canonicalQuery ? `?${canonicalQuery}` : ''}`

  return (
    <div className="search-page" ref={scrollRef} onScroll={handleScroll}>
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonical={seoCanonical}
        noindex={seoNoindex}
      />
      <h1 className="visually-hidden">
        Pisos y casas {modeLabel} en {heading}
      </h1>

      {/* ── Split layout ───────────────────────────────────────────────── */}
      <div className="search-split">
        {/* Left panel — scrollable */}
        <div className="search-left">
          {/* En mobile esta franja queda fija arriba (búsqueda + filtros) */}
          <div className="search-controls">
            <SearchBar
              mode={filters.mode}
              query={filters.query}
              onModeChange={(m) => setFilter('mode', m)}
              onQueryChange={(q) => setFilter('query', q)}
            />

            <FilterBar
              filters={filters}
              availableMunicipios={availableMunicipios}
              province={activeProvince}
              zonesDisabled={zonesDisabled}
              viewMode={viewMode}
              activeFilterCount={activeFilterCount}
              onOpenFilters={() => setShowFiltersModal(true)}
              onZonesChange={(z) => setFilter('zones', z)}
              onViewModeChange={setViewMode}
            />
          </div>

          <ResultsHeader
            count={visibleProperties.length}
            total={resultCount}
            zone={filters.zone}
            isBoundsFiltered={mapVisibleIds !== null && visibleProperties.length !== resultCount}
          />

          {/* Property grid/list */}
          <div className={`property-results ${viewMode === 'list' ? 'results-list' : 'results-grid'}`}>
            {resultCount === 0 ? (
              // Sin inventario real para esta búsqueda/filtros → captamos el lead.
              <NoResults
                mode={filters.mode}
                zone={filters.query || province}
                activeFilterCount={activeFilterCount}
                onClearFilters={resetFilters}
              />
            ) : visibleProperties.length === 0 ? (
              // Hay inmuebles, pero el encuadre del mapa los deja fuera.
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
            focusZones={filters.zones}
            emptyLocation={filters.query || province}
            onPinClick={handlePinClick}
            onBoundsChange={handleBoundsChange}
          />
          {popupProperty && (
            <MapPropertyPopup property={popupProperty} onClose={handlePopupClose} />
          )}
        </div>
      </div>

      {/* Botón flotante (solo mobile): vuelve al mapa tapado por la lista */}
      <button
        type="button"
        className={`map-fab${scrolledIntoList ? ' is-visible' : ''}`}
        onClick={scrollToMap}
      >
        Mapa
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      </button>

      <FiltersModal
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApply={() => { setMapVisibleIds(null); setShowFiltersModal(false) }}
        filters={filters}
        availableMunicipios={availableMunicipios}
        province={activeProvince}
        zonesDisabled={zonesDisabled}
        onChange={setFilter}
        onReset={resetFilters}
        resultCount={resultCount}
      />
    </div>
  )
}
