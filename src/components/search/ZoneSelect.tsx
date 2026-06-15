import { useEffect, useId, useRef, useState } from 'react'

interface ZoneSelectProps {
  value: string
  options: string[]
  onChange: (value: string) => void
  /** "pill" = pastilla compacta (barra de filtros); "block" = ancho completo (modal). */
  variant?: 'pill' | 'block'
  ariaLabel?: string
}

const label = (z: string) => (z === 'Todas' ? 'Todas las zonas' : z)

export function ZoneSelect({
  value,
  options,
  onChange,
  variant = 'pill',
  ariaLabel = 'Zona',
}: ZoneSelectProps) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  // Cierra al hacer click fuera.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  // Al abrir, resalta la opción seleccionada.
  useEffect(() => {
    if (open) setHighlight(Math.max(0, options.indexOf(value)))
  }, [open, value, options])

  const choose = (z: string) => {
    onChange(z)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      else setHighlight((h) => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (open && options[highlight]) choose(options[highlight])
      else setOpen(true)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className={`zone-dd zone-dd--${variant}`} ref={wrapRef}>
      <button
        type="button"
        className="zone-dd-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
      >
        <span>{label(value)}</span>
        <svg
          className="zone-dd-chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {value !== 'Todas' && variant === 'pill' && <span className="zone-dd-badge" />}

      {open && (
        <ul className="zone-dd-list" id={listboxId} role="listbox">
          {options.map((z, i) => (
            <li
              key={z}
              role="option"
              aria-selected={z === value}
              className={`zone-dd-item${i === highlight ? ' is-highlight' : ''}${z === value ? ' is-selected' : ''}`}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                choose(z)
              }}
            >
              {label(z)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
