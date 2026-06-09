import type { FilterState, ViewMode } from '../../lib/types'
import { zones } from '../../lib/propertiesData'

interface FilterBarProps {
  filters: FilterState
  viewMode: ViewMode
  onOpenFilters: () => void
  onZoneChange: (zone: string) => void
  onViewModeChange: (mode: ViewMode) => void
}

export function FilterBar({ filters, viewMode, onOpenFilters, onZoneChange, onViewModeChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <button type="button" className="filter-btn" onClick={onOpenFilters}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        Filtros
      </button>

      <div className="zone-chip-wrap">
        <select
          className="zone-select"
          value={filters.zone}
          onChange={(e) => onZoneChange(e.target.value)}
        >
          {zones.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
        {filters.zone !== 'Todas' && <span className="zone-badge" />}
      </div>

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
