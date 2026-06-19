import { useEffect, useId, useRef, useState } from 'react'

interface FormSelectProps {
  value: string
  options: string[]
  onChange: (value: string) => void
  name?: string
  ariaLabel?: string
  placeholder?: string
}

/** Dropdown accesible con diseño propio para reemplazar el <select> nativo del form. */
export function FormSelect({
  value,
  options,
  onChange,
  name,
  ariaLabel = 'Selecciona una opción',
  placeholder = 'Selecciona...',
}: FormSelectProps) {
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

  const choose = (opt: string) => {
    onChange(opt)
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
    <div className="form-select" ref={wrapRef}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        className={`form-select-trigger${open ? ' is-open' : ''}`}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
      >
        <span className={value ? '' : 'is-placeholder'}>{value || placeholder}</span>
        <svg
          className="form-select-chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className="form-select-list" id={listboxId} role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={`form-select-item${i === highlight ? ' is-highlight' : ''}${opt === value ? ' is-selected' : ''}`}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                choose(opt)
              }}
            >
              {opt}
              {opt === value && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
