import { useEffect, useId, useRef, useState } from 'react'
import {
  loadLocations,
  searchLocations,
  type Location,
} from '../../lib/locationSearch'

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  /** Se dispara al elegir una sugerencia (click o Enter sobre ella). */
  onSelect: (location: Location) => void
  /** Se dispara al buscar texto libre con Enter sin elegir sugerencia. */
  onSubmit?: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  ariaLabel?: string
  autoFocus?: boolean
}

/** Texto secundario de cada sugerencia, según el tipo de ubicación. */
function metaLabel(loc: Location): string {
  switch (loc.type) {
    case 'provincia':
      return 'Provincia'
    case 'distrito':
      return `Distrito · ${loc.city}`
    case 'barrio':
      return `Barrio · ${loc.city}`
    default:
      return loc.province ?? ''
  }
}

export function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  onSubmit,
  placeholder,
  className,
  inputClassName,
  ariaLabel,
  autoFocus,
}: LocationAutocompleteProps) {
  const [results, setResults] = useState<Location[]>([])
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const [ready, setReady] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  // Carga diferida del dataset al primer foco/teclado.
  const ensureLoaded = () => {
    if (ready) return
    loadLocations().then(() => setReady(true))
  }

  // Recalcula sugerencias cuando cambia el texto (y ya hay datos).
  useEffect(() => {
    if (!ready) return
    const next = searchLocations(value)
    setResults(next)
    setHighlight(0)
  }, [value, ready])

  // Cierra el desplegable al hacer click fuera.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const choose = (loc: Location) => {
    onChange(loc.name)
    onSelect(loc)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHighlight((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && results[highlight]) {
        e.preventDefault()
        choose(results[highlight])
      } else if (value.trim() && onSubmit) {
        onSubmit(value.trim())
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && results.length > 0

  return (
    <div className={`location-ac${className ? ` ${className}` : ''}`} ref={wrapRef}>
      <input
        type="text"
        className={inputClassName}
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        autoFocus={autoFocus}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-autocomplete="list"
        autoComplete="off"
        onFocus={() => {
          ensureLoaded()
          setOpen(true)
        }}
        onChange={(e) => {
          ensureLoaded()
          onChange(e.target.value)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
      />

      {showList && (
        <ul className="location-ac-list" id={listboxId} role="listbox">
          {results.map((loc, i) => (
            <li
              key={`${loc.type}:${loc.name}:${loc.province ?? ''}`}
              role="option"
              aria-selected={i === highlight}
              className={`location-ac-item${i === highlight ? ' is-highlight' : ''}`}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                // mousedown (no click) para no perder foco antes de elegir
                e.preventDefault()
                choose(loc)
              }}
            >
              <span className="location-ac-name">{loc.name}</span>
              <span className="location-ac-meta">{metaLabel(loc)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
