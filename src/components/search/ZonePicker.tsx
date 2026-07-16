import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  BARCELONA_DISTRICTS,
  BARCELONA_PROVINCE_MUNICIPIOS,
  tok,
} from '../../lib/barcelonaZones'
import {
  TARRAGONA_DISTRICTS,
  TARRAGONA_MUNICIPIO,
  TARRAGONA_PROVINCE_MUNICIPIOS,
} from '../../lib/tarragonaZones'
import { HOSPITALET_BARRIOS, HOSPITALET_MUNICIPIO } from '../../lib/hospitaletZones'
import { normalize } from '../../lib/locationSearch'

interface ZonePickerProps {
  /** Tokens seleccionados (m:/d:/b:). */
  value: string[]
  onChange: (tokens: string[]) => void
  /** Municipios presentes en el ámbito actual de búsqueda. */
  availableMunicipios: Set<string>
  /** Provincia activa para construir el árbol de zonas. */
  province?: string
  /**
   * "sheet" (móvil, por defecto) = resumen tocable → overlay full-screen.
   * "dropdown" (escritorio) = pastilla → panel anclado bajo el botón.
   */
  variant?: 'sheet' | 'dropdown'
  disabled?: boolean
}

type TriState = 'on' | 'partial' | 'off'

/** Etiqueta legible para el resumen, a partir de un token. */
function labelOf(token: string): string {
  return token.slice(2)
}

function summaryLabel(value: string[]): string {
  if (value.length === 0) return 'Todas las zonas'
  const first = labelOf(value[0])
  return value.length === 1 ? first : `${first} +${value.length - 1}`
}

export function ZonePicker({ value, onChange, availableMunicipios, province = 'Barcelona', variant = 'sheet', disabled = false }: ZonePickerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Set<string>>(new Set(value))
  // Hospitalet arranca desplegado para que sus barrios se vean de entrada, igual
  // que los distritos de Barcelona quedan a la vista.
  const [expanded, setExpanded] = useState<Set<string>>(new Set([HOSPITALET_MUNICIPIO]))
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  const isTarragona = normalize(province) === normalize('Tarragona')
  const provinceDistricts = isTarragona ? TARRAGONA_DISTRICTS : BARCELONA_DISTRICTS
  const provinceMunicipios = isTarragona ? TARRAGONA_PROVINCE_MUNICIPIOS : BARCELONA_PROVINCE_MUNICIPIOS
  const mainMunicipio = isTarragona ? TARRAGONA_MUNICIPIO : 'Barcelona'
  // Hospitalet tiene su propio desglose (municipio → barrios); solo en Barcelona.
  const showHospitalet = !isTarragona

  // ── Filtro de texto sobre todo el árbol de la provincia ─────────────────────
  const q = normalize(query)
  const searching = q.length > 0

  // Municipios de la provincia visibles según el filtro (la capital y Hospitalet
  // van aparte, con su propio desglose de zonas).
  const municipios = useMemo(() => {
    const base = provinceMunicipios.filter((m) => normalize(m) !== normalize(HOSPITALET_MUNICIPIO))
    return searching ? base.filter((m) => normalize(m).includes(q)) : base
  }, [provinceMunicipios, q, searching])

  // Barrios de Hospitalet visibles según el filtro.
  const hospitaletBarrios = useMemo(
    () => (searching ? HOSPITALET_BARRIOS.filter((b) => normalize(b).includes(q)) : HOSPITALET_BARRIOS),
    [q, searching],
  )
  const showHospitaletHeader = !searching || normalize(HOSPITALET_MUNICIPIO).includes(q)
  const showHospitaletBlock = showHospitalet && (showHospitaletHeader || hospitaletBarrios.length > 0)

  // Distritos de Barcelona ciudad visibles según el filtro, con sus barrios.
  const districts = useMemo(() => {
    if (!searching) {
      return provinceDistricts.map((d) => ({ d, barrios: d.barrios }))
    }
    return provinceDistricts.map((d) => {
      const districtMatch = normalize(d.name).includes(q)
      const barrios = districtMatch ? d.barrios : d.barrios.filter((b) => normalize(b).includes(q))
      return { d, barrios, visible: districtMatch || barrios.length > 0 }
    }).filter((x) => x.visible)
  }, [provinceDistricts, q, searching])

  const showBcnHeader = !searching || normalize(mainMunicipio).includes(q)
  const showBarcelona = showBcnHeader || districts.length > 0

  // Al abrir, clonamos la selección comprometida como borrador y limpiamos búsqueda.
  function openOverlay() {
    if (disabled) return
    setDraft(new Set(value))
    setQuery('')
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Dropdown (escritorio): cerrar al hacer click fuera, descartando el borrador.
  useEffect(() => {
    if (!open || variant !== 'dropdown') return
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open, variant])

  // ── Estado tri-estado ──────────────────────────────────────────────────────
  function districtState(name: string, barrios: string[]): TriState {
    if (draft.has(tok.distrito(name))) return 'on'
    if (barrios.some((b) => draft.has(tok.barrio(b)))) return 'partial'
    return 'off'
  }

  // El barrio se marca solo por su propio token: si el distrito está completo
  // (token d:) los barrios se ven vacíos (modo "todo el distrito").
  function barrioChecked(barrio: string): boolean {
    return draft.has(tok.barrio(barrio))
  }

  const allBcnState: TriState = (() => {
    if (!showBarcelona) return 'off'
    const states = provinceDistricts.map((d) => districtState(d.name, d.barrios))
    if (states.every((s) => s === 'on')) return 'on'
    if (states.some((s) => s !== 'off')) return 'partial'
    return 'off'
  })()

  // Hospitalet (un nivel): "todo el municipio" es el token m:; cada barrio es b:.
  const hospitaletState: TriState = (() => {
    if (draft.has(tok.municipio(HOSPITALET_MUNICIPIO))) return 'on'
    if (HOSPITALET_BARRIOS.some((b) => draft.has(tok.barrio(b)))) return 'partial'
    return 'off'
  })()

  // ── Mutaciones del borrador ────────────────────────────────────────────────
  function toggleDistrict(name: string, barrios: string[]) {
    const next = new Set(draft)
    const state = districtState(name, barrios)
    barrios.forEach((b) => next.delete(tok.barrio(b)))
    next.delete(tok.distrito(name))
    if (state === 'off') next.add(tok.distrito(name))
    setDraft(next)
  }

  function toggleBarrio(districtName: string, barrios: string[], barrio: string) {
    const next = new Set(draft)
    if (next.has(tok.distrito(districtName))) {
      // Estaba "todo el distrito" → pasar a selección específica de este barrio.
      next.delete(tok.distrito(districtName))
      next.add(tok.barrio(barrio))
    } else if (next.has(tok.barrio(barrio))) {
      next.delete(tok.barrio(barrio))
    } else {
      next.add(tok.barrio(barrio))
      // Si quedan todos los barrios marcados, colapsar a "todo el distrito".
      if (barrios.every((b) => next.has(tok.barrio(b)))) {
        barrios.forEach((b) => next.delete(tok.barrio(b)))
        next.add(tok.distrito(districtName))
      }
    }
    setDraft(next)
  }

  function toggleAllBarcelona() {
    const next = new Set(draft)
    // Limpia todos los tokens de Barcelona (d:/b:), conserva municipios (m:).
    provinceDistricts.forEach((d) => {
      next.delete(tok.distrito(d.name))
      d.barrios.forEach((b) => next.delete(tok.barrio(b)))
    })
    if (allBcnState !== 'on') {
      provinceDistricts.forEach((d) => next.add(tok.distrito(d.name)))
    }
    setDraft(next)
  }

  // Hospitalet: "todo el municipio" alterna el token m: y limpia barrios sueltos.
  function toggleAllHospitalet() {
    const next = new Set(draft)
    const muni = tok.municipio(HOSPITALET_MUNICIPIO)
    const wasOff = hospitaletState === 'off'
    HOSPITALET_BARRIOS.forEach((b) => next.delete(tok.barrio(b)))
    next.delete(muni)
    if (wasOff) next.add(muni)
    setDraft(next)
  }

  function toggleHospitaletBarrio(barrio: string) {
    const next = new Set(draft)
    const muni = tok.municipio(HOSPITALET_MUNICIPIO)
    if (next.has(muni)) {
      // Estaba "todo el municipio" → pasar a selección específica de este barrio.
      next.delete(muni)
      next.add(tok.barrio(barrio))
    } else if (next.has(tok.barrio(barrio))) {
      next.delete(tok.barrio(barrio))
    } else {
      next.add(tok.barrio(barrio))
      // Si quedan todos marcados, colapsar a "todo el municipio".
      if (HOSPITALET_BARRIOS.every((b) => next.has(tok.barrio(b)))) {
        HOSPITALET_BARRIOS.forEach((b) => next.delete(tok.barrio(b)))
        next.add(muni)
      }
    }
    setDraft(next)
  }

  function toggleMunicipio(name: string) {
    const next = new Set(draft)
    const t = tok.municipio(name)
    if (next.has(t)) next.delete(t)
    else next.add(t)
    setDraft(next)
  }

  function toggleExpand(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  function apply() {
    onChange(Array.from(draft))
    setOpen(false)
  }

  // "Limpiar" confirma de inmediato: vacía la selección sin pedir "Aplicar".
  function clearDraft() {
    setDraft(new Set())
    onChange([])
  }

  // ── Buscador interno (filtra todo el árbol de la provincia) ─────────────────
  const search = (
    <div className="zonepicker-search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar municipio, distrito o barrio"
        aria-label="Buscar zona"
      />
      {query && (
        <button type="button" className="zonepicker-search-clear" aria-label="Borrar búsqueda" onClick={() => setQuery('')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )

  // ── Árbol de zonas (compartido entre sheet y dropdown) ──────────────────────
  const tree = (
    <div className="zonepicker-list">
      {showBarcelona && (
        <>
          {showBcnHeader && (
            <ZoneRow
              label={`${mainMunicipio} (todo el municipio)`}
              bold
              state={allBcnState}
              onToggle={toggleAllBarcelona}
            />
          )}
          {districts.map(({ d, barrios }) => {
            const isExpanded = searching || expanded.has(d.name)
            return (
              <div key={d.name}>
                <ZoneRow
                  label={d.name}
                  state={districtState(d.name, d.barrios)}
                  onToggle={() => toggleDistrict(d.name, d.barrios)}
                  expandable={!searching}
                  expanded={isExpanded}
                  onExpand={() => toggleExpand(d.name)}
                />
                {isExpanded && (
                  <div className="zonepicker-barrios">
                    {barrios.map((b) => (
                      <ZoneRow
                        key={b}
                        label={b}
                        indent
                        state={barrioChecked(b) ? 'on' : 'off'}
                        onToggle={() => toggleBarrio(d.name, d.barrios, b)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}

      {showHospitaletBlock && (
        <div>
          {showHospitaletHeader && (
            <ZoneRow
              label={`${HOSPITALET_MUNICIPIO} (todo el municipio)`}
              bold
              marker={availableMunicipios.has(HOSPITALET_MUNICIPIO)}
              state={hospitaletState}
              onToggle={toggleAllHospitalet}
              expandable={!searching}
              expanded={searching || expanded.has(HOSPITALET_MUNICIPIO)}
              onExpand={() => toggleExpand(HOSPITALET_MUNICIPIO)}
            />
          )}
          {(searching || expanded.has(HOSPITALET_MUNICIPIO)) && (
            <div className="zonepicker-barrios">
              {hospitaletBarrios.map((b) => (
                <ZoneRow
                  key={b}
                  label={b}
                  indent
                  state={barrioChecked(b) ? 'on' : 'off'}
                  onToggle={() => toggleHospitaletBarrio(b)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {municipios.map((m) => (
        <ZoneRow
          key={m}
          label={m}
          marker={availableMunicipios.has(m)}
          state={draft.has(tok.municipio(m)) ? 'on' : 'off'}
          onToggle={() => toggleMunicipio(m)}
        />
      ))}

      {searching && !showBarcelona && !showHospitaletBlock && municipios.length === 0 && (
        <p className="zonepicker-empty">Sin resultados para “{query}”.</p>
      )}
    </div>
  )

  const footer = (
    <div className="zonepicker-footer">
      <button type="button" className="zonepicker-clear" onClick={clearDraft}>
        Limpiar
      </button>
      <button type="button" className="zonepicker-apply" onClick={apply}>
        Aplicar
      </button>
    </div>
  )

  // ── Escritorio: pastilla + panel anclado ────────────────────────────────────
  if (variant === 'dropdown') {
    return (
      <div className="zone-dd-wrap" ref={wrapRef}>
        <button
          type="button"
          className="zonepicker-trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openOverlay())}
        >
          <span className="zonepicker-trigger-label">{summaryLabel(value)}</span>
          <svg className="zonepicker-trigger-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div className="zonepicker-dropdown" role="dialog" aria-label="Zona o barrio">
            {search}
            {tree}
            {footer}
          </div>
        )}
      </div>
    )
  }

  // ── Móvil: resumen + overlay full-screen ────────────────────────────────────
  return (
    <>
      <button type="button" className="zonepicker-summary" onClick={openOverlay} disabled={disabled}>
        <span className="zonepicker-summary-label">{summaryLabel(value)}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div className="zonepicker-overlay">
            <div className="zonepicker-head">
              <h3>Zona o barrio</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {search}
            {tree}
            {footer}
          </div>,
          document.body,
        )}
    </>
  )
}

// ── Fila de zona reutilizable ─────────────────────────────────────────────────
interface ZoneRowProps {
  label: string
  state: TriState
  onToggle: () => void
  bold?: boolean
  indent?: boolean
  /** Punto que indica que la zona tiene inmuebles disponibles. */
  marker?: boolean
  expandable?: boolean
  expanded?: boolean
  onExpand?: () => void
}

function ZoneRow({ label, state, onToggle, bold, indent, marker, expandable, expanded, onExpand }: ZoneRowProps) {
  return (
    <div className={`zonepicker-row${indent ? ' is-indent' : ''}`}>
      <button type="button" className="zonepicker-check-btn" onClick={onToggle}>
        <span className={`zp-check zp-check--${state}`} aria-hidden="true">
          {state === 'on' && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {state === 'partial' && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
          )}
        </span>
        <span className={`zonepicker-row-label${bold ? ' is-bold' : ''}`}>{label}</span>
        {marker && <span className="zonepicker-row-dot" title="Con inmuebles" aria-hidden="true" />}
      </button>
      {expandable && (
        <button
          type="button"
          className={`zonepicker-expand${expanded ? ' is-open' : ''}`}
          onClick={onExpand}
          aria-label={expanded ? 'Contraer' : 'Desplegar'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  )
}
