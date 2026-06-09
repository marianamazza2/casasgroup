import { Link } from '@tanstack/react-router'

type Props = { propertyRef: string }

export function ContactCard({ propertyRef }: Props) {
  return (
    <div className="detail-contact-card">
      <p className="detail-contact-title">¿Te interesa este inmueble?</p>
      <div className="detail-gold-line" />
      <p className="detail-contact-sub">
        Contáctanos y te ayudamos con todos los detalles.
      </p>
      <Link to="/contacto" className="detail-btn detail-btn--gold">
        Contactar →
      </Link>
      <button className="detail-btn detail-btn--whatsapp">WhatsApp</button>
      <button className="detail-btn detail-btn--outline">Enviar email</button>
      <p className="detail-ref">Ref. {propertyRef}</p>
    </div>
  )
}
