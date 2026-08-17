/* Boton "Ver mas / Ver menos" compartido por los textos que se colapsan en
   mobile (descripcion de un inmueble, "Por que elegirnos" de la home...).
   Siempre lleva el piquito al lado: apunta hacia abajo para abrir y gira 180deg
   cuando el texto ya esta desplegado. */
type TextToggleProps = {
  expanded: boolean
  onToggle: () => void
  /** id del texto que controla, para lectores de pantalla. */
  controls?: string
  className?: string
}

export function TextToggle({ expanded, onToggle, controls, className }: TextToggleProps) {
  return (
    <button
      type="button"
      className={`text-toggle${className ? ` ${className}` : ''}`}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onToggle}
    >
      {expanded ? 'Ver menos' : 'Ver más'}
      <svg
        className="text-toggle-chevron"
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  )
}
