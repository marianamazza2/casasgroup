import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import Map, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

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

  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const heroBgRef = useRef<HTMLDivElement>(null)
  const heroMediaRef = useRef<HTMLDivElement>(null)
  const heroOutlineRef = useRef<HTMLDivElement>(null)
  const heroFillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const smoothstep = (t: number) => t * t * (3 - 2 * t)
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
    const phase = (p: number, start: number, end: number) =>
      smoothstep(clamp((p - start) / (end - start), 0, 1))

    const handleScroll = () => {
      const wrapper = heroWrapperRef.current
      if (!wrapper) return
      const top = wrapper.getBoundingClientRect().top
      const scrollable = wrapper.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const p = clamp(-top / scrollable, 0, 1)

      const bgT = phase(p, 0, 0.2)
      if (heroMediaRef.current) heroMediaRef.current.style.opacity = String(1 - bgT)
      if (heroBgRef.current) heroBgRef.current.style.opacity = String(bgT)

      const outlineT = phase(p, 0, 0.3)
      if (heroOutlineRef.current) heroOutlineRef.current.style.opacity = String(1 - outlineT)

      const colorT = phase(p, 0, 0.7)
      const r = Math.round(219 - 55 * colorT)
      const g = Math.round(185 - 62 * colorT)
      const b = Math.round(110 - 56 * colorT)
      document.documentElement.style.setProperty('--hero-fill', `rgb(${r},${g},${b})`)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="contact-page">
      <div className="hero-scroll-wrapper" ref={heroWrapperRef}>
        <section className="hero" id="contacto-top">
          <div className="hero-white-bg" ref={heroBgRef} />
          <div className="hero-media" ref={heroMediaRef} />
          <div className="hero-content">
            <div className="hero-brand" aria-label="Hablemos">
              <div className="hero-brand-outline" ref={heroOutlineRef}>
                <span className="hero-brand-hablemos">HABLEMOS</span>
              </div>
              <div className="hero-brand-fill" ref={heroFillRef}>
                <span className="hero-brand-hablemos">HABLEMOS</span>
              </div>
            </div>
            <div className="hero-ui">
              <p className="contact-hero-tagline">
                Estamos aqui para ayudarte en cada paso. Cuentanos que necesitas y te responderemos con una propuesta clara.
              </p>
              <button type="button" className="button-link" onClick={() => setIsPanelOpen(true)}>
                Escribenos
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="contact-intro">
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
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
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
          <Map
            initialViewState={{ longitude: 2.0829, latitude: 41.3766, zoom: 15 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`}
          >
            <Marker longitude={2.0829} latitude={41.3766} anchor="bottom">
              <div className="map-marker">CG</div>
            </Marker>
          </Map>
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
