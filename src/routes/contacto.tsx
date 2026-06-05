import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState } from 'react'

export const Route = createFileRoute('/contacto')({
  component: ContactPage,
})

const contactReasons = ['Comprar', 'Alquilar', 'Vender', 'Reformas', 'Hipotecas', 'Administracion', 'Otro']

const contactCards = [
  {
    label: 'Email',
    value: 'info@casasgroup.es',
    href: 'mailto:info@casasgroup.es',
  },
  {
    label: 'Telefono',
    value: '+34 123 456 789',
    href: 'tel:+34123456789',
  },
  {
    label: 'WhatsApp',
    value: '+34 600 000 000',
    href: 'https://wa.me/34600000000',
  },
  {
    label: 'Horario',
    value: 'Lun - Vie: 9:00 - 19:00',
    detail: 'Sab: 10:00 - 14:00',
  },
]

function ContactPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [reason, setReason] = useState(contactReasons[0])

  return (
    <main className="contact-page">
      <header className="site-nav">
        <Link className="logo logo-small" to="/" aria-label="Casas Group">
          <span>CASAS</span>
          <small>GROUP</small>
        </Link>
        <nav aria-label="Navegacion principal">
          <a href="/#propiedades">Comprar</a>
          <a href="/#propiedades">Alquilar</a>
          <a href="/#valoracion">Vender</a>
          <a href="/#nosotros">Nosotros</a>
          <a href="/#servicios">Servicios</a>
          <Link to="/contacto">Contacto</Link>
        </nav>
      </header>

      <section className="contact-hero">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span>Contacto</span>
          <h1>Hablemos</h1>
          <p>Estamos aqui para ayudarte en cada paso. Cuentanos que necesitas y te responderemos con una propuesta clara.</p>
          <button type="button" onClick={() => setIsPanelOpen(true)}>
            Escribenos
          </button>
        </motion.div>
      </section>

      <section className="contact-intro">
        <div className="contact-photo" aria-hidden="true" />
        <div className="contact-direct">
          <h2>Si lo prefieres, contactanos directamente.</h2>
          <div className="contact-card-grid">
            {contactCards.map((card) => (
              <article key={card.label}>
                <span>{card.label}</span>
                {card.href ? <a href={card.href}>{card.value}</a> : <strong>{card.value}</strong>}
                {card.detail ? <small>{card.detail}</small> : null}
              </article>
            ))}
          </div>
          <div className="social-row" aria-label="Redes sociales">
            <a href="https://instagram.com" aria-label="Instagram">IG</a>
            <a href="https://facebook.com" aria-label="Facebook">FB</a>
            <a href="https://linkedin.com" aria-label="LinkedIn">LI</a>
          </div>
        </div>
      </section>

      <section className="location-band">
        <div>
          <span>Donde estamos</span>
          <h2>Visitanos en nuestra oficina</h2>
          <address>
            Calle Ejemplo 123, Local 2<br />
            08950 Esplugues de Llobregat<br />
            Barcelona
          </address>
          <p>Lunes a Viernes: 9:00 - 19:00<br />Sabado: 10:00 - 14:00</p>
        </div>
        <div className="map-panel" aria-label="Mapa de la oficina">
          <span>CG</span>
        </div>
      </section>

      <footer className="footer">
        <div>
          <div className="logo footer-logo">
            <span>CASAS</span>
            <small>GROUP</small>
          </div>
          <p>Tu hogar empieza aqui.</p>
        </div>
        <div>
          <h3>Inmuebles</h3>
          <a href="/#propiedades">Comprar</a>
          <a href="/#propiedades">Alquilar</a>
          <a href="/#valoracion">Vender</a>
        </div>
        <div>
          <h3>Contacto</h3>
          <a href="mailto:info@casasgroup.es">info@casasgroup.es</a>
          <a href="tel:+34123456789">+34 123 456 789</a>
          <span>Esplugues de Llobregat</span>
        </div>
      </footer>

      {isPanelOpen ? (
        <div className="contact-drawer" role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
          <button className="drawer-backdrop" type="button" aria-label="Cerrar formulario" onClick={() => setIsPanelOpen(false)} />
          <aside>
            <div className="drawer-header">
              <h2 id="contact-form-title">Cuentanos en que podemos ayudarte</h2>
              <button type="button" aria-label="Cerrar formulario" onClick={() => setIsPanelOpen(false)}>
                x
              </button>
            </div>
            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                Nombre *
                <input name="name" placeholder="Tu nombre" required />
              </label>
              <label>
                Apellidos *
                <input name="surname" placeholder="Tus apellidos" required />
              </label>
              <label>
                Email *
                <input name="email" type="email" placeholder="tu@email.com" required />
              </label>
              <label>
                Telefono *
                <input name="phone" type="tel" placeholder="+34 600 000 000" required />
              </label>
              <label>
                Motivo de contacto *
                <select name="reason" value={reason} onChange={(event) => setReason(event.target.value)} required>
                  {contactReasons.map((item) => (
                    <option value={item} key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Referencia de inmueble
                <input name="reference" placeholder="Ej: CG-0001" />
              </label>
              <label>
                Mensaje
                <textarea name="message" placeholder="Escribe tu mensaje..." rows={5} />
              </label>
              <button type="submit">Enviar mensaje</button>
            </form>
          </aside>
        </div>
      ) : null}
    </main>
  )
}
