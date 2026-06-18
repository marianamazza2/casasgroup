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
          <Link to="/contacto" className="detail-btn detail-btn--gold">
            Contactar →
          </Link>
          <button className="detail-btn detail-btn--whatsapp">WhatsApp</button>
          <button className="detail-btn detail-btn--outline">Enviar email</button>
        </div>
        <p className="detail-ref">Ref. {propertyRef}</p>
      </div>
    </div>
  )
}
