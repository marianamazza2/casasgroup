import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FilterState } from '../../lib/types'
import { ZonePicker } from './ZonePicker'

interface FiltersModalProps {
  open: boolean
  onClose: () => void
  onApply: () => void
  filters: FilterState
  /** Municipios presentes en el ámbito buscado (alimenta el árbol de zonas). */
  availableMunicipios: Set<string>
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

export function FiltersModal({ open, onClose, onApply, filters, availableMunicipios, onChange, onReset, resultCount }: FiltersModalProps) {
  // Swipe-down-to-close (mobile). Drag offset in px; null = not dragging.
  const [dragY, setDragY] = useState(0)
  const dragStartRef = useRef<number | null>(null)
  const draggingRef = useRef(false)

  // Bloquea el scroll del body mientras el modal está abierto.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  function toggleCategory(cat: string) {
    const current = filters.category ?? []
    onChange(
      'category',
      current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat],
    )
  }

  function handleTouchStart(e: React.TouchEvent) {
    dragStartRef.current = e.touches[0].clientY
    draggingRef.current = true
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!draggingRef.current || dragStartRef.current === null) return
    const delta = e.touches[0].clientY - dragStartRef.current
    // Solo permite arrastrar hacia abajo.
    setDragY(delta > 0 ? delta : 0)
  }

  function handleTouchEnd() {
    if (dragY > 120) {
      onClose()
    }
    dragStartRef.current = null
    draggingRef.current = false
    setDragY(0)
  }

  return createPortal(
    <div className="filters-modal-backdrop" onClick={onClose}>
      <div
        className="filters-modal"
        onClick={(e) => e.stopPropagation()}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >

        <div
          className="filters-modal-grab"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <span className="filters-modal-handle" aria-hidden="true" />
        </div>

        <div
          className="filters-modal-header"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h2>Filtros</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="filters-modal-body">

          {/* Zona — selector anidado provincia → municipio / distrito → barrio.
              Solo móvil: en escritorio se usa el dropdown de la FilterBar. */}
          <div className="filters-section filters-section--zone-mobile">
            <p className="filters-section-title">Zona</p>
            <ZonePicker
              value={filters.zones}
              onChange={(z) => onChange('zones', z)}
              availableMunicipios={availableMunicipios}
            />
          </div>

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
          <button type="button" className="filters-apply" onClick={onApply}>
            Mostrar {resultCount} inmuebles
          </button>
        </div>

      </div>
    </div>,
    document.body,
  )
}
