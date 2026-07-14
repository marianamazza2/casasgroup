import type { FilterState } from '../../lib/types'

// Mismo número que usa la página de contacto (src/routes/contacto.tsx).
const WHATSAPP_NUMBER = '34601391778'

interface NoResultsProps {
  mode: FilterState['mode']
  /** Texto/zona que buscó el usuario (o provincia, como fallback). */
  zone?: string
  /** Nº de filtros activos; si > 0 ofrecemos también "quitar filtros". */
  activeFilterCount: number
  onClearFilters: () => void
}

/**
 * Estado vacío cuando NO hay inmuebles para la búsqueda (p. ej. una provincia
 * sin cartera). En vez de un callejón sin salida, capturamos el lead por
 * WhatsApp con la zona ya escrita en el mensaje. No confundir con el vacío por
 * zoom del mapa, que se maneja aparte en la página de resultados.
 */
export function NoResults({ mode, zone, activeFilterCount, onClearFilters }: NoResultsProps) {
  const z = zone?.trim() || ''
  const accion = mode === 'compra' ? 'comprar' : 'alquilar'

  const title = z
    ? `No tenemos inmuebles en ${z} ahora mismo`
    : 'No encontramos inmuebles con estos filtros'

  const message = z
    ? `Hola, estoy buscando ${accion} una vivienda en ${z}. ¿Tenéis algo disponible o podéis avisarme cuando entre algo?`
    : `Hola, estoy buscando ${accion} una vivienda. ¿Me podéis ayudar?`

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <div className="no-results">
      <div className="no-results-icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      </div>

      <h3 className="no-results-title">{title}</h3>
      <p className="no-results-sub">
        Ampliamos la cartera constantemente. Déjanos tu contacto y te avisamos en
        cuanto entre algo{z ? ` en ${z}` : ''}.
      </p>

      <div className="no-results-actions">
        <a
          className="no-results-wa"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.16c-.24.68-1.42 1.32-1.95 1.36-.5.05-1.13.24-3.68-.77-3.11-1.23-5.1-4.4-5.26-4.6-.15-.2-1.25-1.67-1.25-3.19 0-1.51.79-2.26 1.07-2.57.28-.31.61-.38.81-.38.2 0 .41 0 .58.01.19.01.44-.07.68.52.24.6.83 2.07.9 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.34.07.13.07.72-.17 1.4Z" />
          </svg>
          Avísame por WhatsApp
        </a>

        {activeFilterCount > 0 && (
          <button type="button" className="no-results-clear" onClick={onClearFilters}>
            Quitar filtros
          </button>
        )}
      </div>
    </div>
  )
}
