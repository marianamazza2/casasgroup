import { Link } from '@tanstack/react-router'
import { useState } from 'react'

type Props = { propertyRef: string }

export function ContactCard({ propertyRef }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`detail-contact-card${open ? ' detail-contact-card--open' : ''}`}>
      <button
        type="button"
        className="detail-contact-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="detail-contact-title">¿Te interesa este inmueble?</span>
        <span className="detail-contact-chevron" aria-hidden="true">⌄</span>
      </button>

      <div className="detail-contact-body">
        <div className="detail-gold-line" />
        <p className="detail-contact-sub">
          Contáctanos y te ayudamos con todos los detalles.
        </p>
        <div className="detail-contact-options">
          <Link to="/contacto" className="detail-btn">
            <span className="detail-btn-label">Contactar</span>
            <span className="detail-btn-arrow" aria-hidden="true">→</span>
          </Link>
          <button className="detail-btn">
            <span className="detail-btn-label">WhatsApp</span>
            <span className="detail-btn-arrow" aria-hidden="true">→</span>
          </button>
          <button className="detail-btn">
            <span className="detail-btn-label">Enviar email</span>
            <span className="detail-btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
        <p className="detail-ref">Ref. {propertyRef}</p>
      </div>
    </div>
  )
}
