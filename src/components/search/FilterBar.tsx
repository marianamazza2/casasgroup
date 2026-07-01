import type { FilterState, ViewMode } from '../../lib/types'
import { ZonePicker } from './ZonePicker'

interface FilterBarProps {
  filters: FilterState
  /** Municipios con inmuebles en el ámbito (marcan con un punto el árbol). */
  availableMunicipios: Set<string>
  viewMode: ViewMode
  /** Nº de filtros activos; muestra un badge sobre el botón si > 0. */
  activeFilterCount: number
  onOpenFilters: () => void
  onZonesChange: (zones: string[]) => void
  onViewModeChange: (mode: ViewMode) => void
}

export function FilterBar({ filters, availableMunicipios, viewMode, activeFilterCount, onOpenFilters, onZonesChange, onViewModeChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <button
        type="button"
        className={`filter-btn${activeFilterCount > 0 ? ' has-filters' : ''}`}
        onClick={onOpenFilters}
        aria-label="Filtros"
        title="Filtros"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="5" x2="14" y2="5" />
          <line x1="10" y1="5" x2="3" y2="5" />
          <line x1="21" y1="12" x2="12" y2="12" />
          <line x1="8" y1="12" x2="3" y2="12" />
          <line x1="21" y1="19" x2="16" y2="19" />
          <line x1="12" y1="19" x2="3" y2="19" />
          <line x1="14" y1="3" x2="14" y2="7" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="16" y1="17" x2="16" y2="21" />
        </svg>
        {activeFilterCount > 0 && (
          <span className="filter-badge" aria-label={`${activeFilterCount} filtros activos`}>
            {activeFilterCount}
          </span>
        )}
      </button>

      <ZonePicker
        value={filters.zones}
        onChange={onZonesChange}
        availableMunicipios={availableMunicipios}
        variant="dropdown"
      />

      <div className="filter-bar-spacer" />

      <div className="view-toggle" role="group" aria-label="Modo de vista">
        <button
          type="button"
          className={`view-btn${viewMode === 'grid' ? ' active' : ''}`}
          aria-label="Vista cuadrícula"
          onClick={() => onViewModeChange('grid')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
          </svg>
        </button>
        <button
          type="button"
          className={`view-btn${viewMode === 'list' ? ' active' : ''}`}
          aria-label="Vista lista"
          onClick={() => onViewModeChange('list')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="4" width="18" height="3" rx="1" />
            <rect x="3" y="10.5" width="18" height="3" rx="1" />
            <rect x="3" y="17" width="18" height="3" rx="1" />
          </svg>
        </button>
      </div>
    </div>
  )
}
