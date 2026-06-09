import type { FilterState } from '../../lib/types'
import { zones } from '../../lib/propertiesData'

interface FiltersModalProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  onReset: () => void
  resultCount: number
}

const CATEGORIES = ['piso', 'chalet', 'local', 'parking'] as const
const CATEGORY_LABELS: Record<string, string> = {
  piso: 'Piso',
  chalet: 'Chalet',
  local: 'Local',
  parking: 'Parking',
}

const COUNT_OPTIONS = [0, 1, 2, 3, 4]

export function FiltersModal({ open, onClose, filters, onChange, onReset, resultCount }: FiltersModalProps) {
  if (!open) return null

  function toggleCategory(cat: string) {
    const current = filters.category ?? []
    onChange(
      'category',
      current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat],
    )
  }

  return (
    <div className="filters-modal-backdrop" onClick={onClose}>
      <div className="filters-modal" onClick={(e) => e.stopPropagation()}>

        <div className="filters-modal-header">
          <h2>Filtros</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="filters-modal-body">

          {/* Precio */}
          <div className="filters-section">
            <p className="filters-section-title">Precio</p>
            <div className="filters-inputs">
              <div className="filters-input-group">
                <label htmlFor="fm-price-min">Mínimo</label>
                <input
                  id="fm-price-min"
                  type="number"
                  min={0}
                  className="filters-input"
                  placeholder="Sin mínimo"
                  value={filters.priceMin ?? ''}
                  onChange={(e) =>
                    onChange('priceMin', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div className="filters-input-group">
                <label htmlFor="fm-price-max">Máximo</label>
                <input
                  id="fm-price-max"
                  type="number"
                  min={0}
                  className="filters-input"
                  placeholder="Sin máximo"
                  value={filters.priceMax ?? ''}
                  onChange={(e) =>
                    onChange('priceMax', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>

          {/* Zona */}
          <div className="filters-section">
            <p className="filters-section-title">Zona</p>
            <select
              className="filters-zone-select"
              value={filters.zone}
              onChange={(e) => onChange('zone', e.target.value)}
            >
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div className="filters-section">
            <p className="filters-section-title">Categoría</p>
            <div className="filters-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filters-pill${(filters.category ?? []).includes(cat) ? ' active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Dormitorios */}
          <div className="filters-section">
            <p className="filters-section-title">Dormitorios</p>
            <div className="filters-pills">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`filters-pill${(filters.bedrooms ?? 0) === n ? ' active' : ''}`}
                  onClick={() => onChange('bedrooms', n)}
                >
                  {n === 0 ? 'Cualquier' : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Baños */}
          <div className="filters-section">
            <p className="filters-section-title">Baños</p>
            <div className="filters-pills">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`filters-pill${(filters.bathrooms ?? 0) === n ? ' active' : ''}`}
                  onClick={() => onChange('bathrooms', n)}
                >
                  {n === 0 ? 'Cualquier' : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Superficie */}
          <div className="filters-section filters-section--last">
            <p className="filters-section-title">Superficie</p>
            <div className="filters-inputs">
              <div className="filters-input-group">
                <label htmlFor="fm-surface-min">Mínimo</label>
                <input
                  id="fm-surface-min"
                  type="number"
                  min={0}
                  className="filters-input"
                  placeholder="Min m²"
                  value={filters.surfaceMin ?? ''}
                  onChange={(e) =>
                    onChange('surfaceMin', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div className="filters-input-group">
                <label htmlFor="fm-surface-max">Máximo</label>
                <input
                  id="fm-surface-max"
                  type="number"
                  min={0}
                  className="filters-input"
                  placeholder="Max m²"
                  value={filters.surfaceMax ?? ''}
                  onChange={(e) =>
                    onChange('surfaceMax', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>

        </div>

        <div className="filters-modal-footer">
          <button type="button" className="filters-clear" onClick={onReset}>
            Quitar filtros
          </button>
          <button type="button" className="filters-apply" onClick={onClose}>
            Mostrar {resultCount} inmuebles
          </button>
        </div>

      </div>
    </div>
  )
}
