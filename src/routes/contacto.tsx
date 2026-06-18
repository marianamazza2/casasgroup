import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { Footer } from '../components/Footer'
import Map, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

export const Route = createFileRoute('/contacto')({
  component: ContactPage,
})

const contactReasons = ['Comprar', 'Alquilar', 'Vender', 'Reformas', 'Hipotecas', 'Administracion', 'Otro']

type ContactCard = {
  label: string
  value: string
  href?: string
  detail?: string
  icon: string
}

const contactCards: ContactCard[] = [
  {
    label: 'Email',
    value: 'info@casasgroup.es',
    href: 'mailto:info@casasgroup.es',
    icon: 'mail',
  },
  {
    label: 'Telefono',
    value: '+34 123 456 789',
    href: 'tel:+34123456789',
    icon: 'phone',
  },
  {
    label: 'WhatsApp',
    value: '+34 600 000 000',
    href: 'https://wa.me/34600000000',
    icon: 'whatsapp',
  },
  {
    label: 'Horario',
    value: 'Lun - Vie: 9:00 - 19:00',
    detail: 'Sab: 10:00 - 14:00',
    icon: 'clock',
  },
]

const cardIcons: Record<string, ReactElement> = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.6A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
      <path d="M9 9.2c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.7.1.1.1.3 0 .4l-.3.4-.3.3c-.1.1-.2.3 0 .5.2.4.7 1.1 1.4 1.5.9.6 1.3.7 1.5.6l.5-.5c.2-.2.3-.2.5-.1l1.4.7c.2.1.3.2.4.3 0 .2 0 .8-.3 1.2-.3.4-1 .8-1.5.8-.5.1-1.1.1-2.3-.4-2-.8-3.2-2.9-3.3-3-.1-.2-.8-1.1-.8-2.1 0-1 .5-1.5.7-1.7z" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
}

function ContactPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [reason, setReason] = useState(contactReasons[0])

  // En mobile las tarjetas de contacto se muestran de a una en un slider
  // horizontal; la card activa se deduce de la posicion de scroll y los dots
  // permiten saltar a cada una.
  const cardGridRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState(0)

  const onCardGridScroll = () => {
    const el = cardGridRef.current
    if (!el || el.clientWidth === 0) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActiveCard(Math.max(0, Math.min(contactCards.length - 1, idx)))
  }

  const goToCard = (i: number) => {
    const el = cardGridRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const heroGoldRef = useRef<HTMLDivElement>(null)
  const heroMediaRef = useRef<HTMLDivElement>(null)
  const heroFillRef = useRef<HTMLDivElement>(null)
  const heroUiRef = useRef<HTMLDivElement>(null)

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

      const bgT = phase(p, 0, 0.35)
      if (heroMediaRef.current) heroMediaRef.current.style.opacity = String(1 - bgT)
      if (heroGoldRef.current) heroGoldRef.current.style.opacity = String(bgT)

      // Brand lightens as the photo turns gold: rgb(164,123,54) → warm white
      const colorT = phase(p, 0.1, 0.6)
      const r = Math.round(164 + 86 * colorT)
      const g = Math.round(123 + 124 * colorT)
      const b = Math.round(54 + 187 * colorT)
      document.documentElement.style.setProperty('--hero-fill', `rgb(${r},${g},${b})`)

      // Tagline + CTA fade in once the photo has turned gold
      const uiT = phase(p, 0.3, 0.6)
      if (heroUiRef.current) {
        heroUiRef.current.style.opacity = String(uiT)
        heroUiRef.current.style.transform = `translateY(${(1 - uiT) * 14}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="contact-page">
      <div className="hero-scroll-wrapper" ref={heroWrapperRef}>
        <section className="hero" id="contacto-top">
          <div className="hero-gold-bg" ref={heroGoldRef} />
          <div className="hero-media" ref={heroMediaRef} />
          <div className="hero-content">
            <div className="hero-brand" aria-label="Hablemos">
              <div className="hero-brand-fill" ref={heroFillRef}>
                <span className="hero-brand-hablemos">HABLEMOS</span>
              </div>
            </div>
            <div className="hero-ui" ref={heroUiRef}>
              <p className="contact-hero-tagline">
                Estamos aqui para ayudarte en cada paso. Cuentanos que necesitas y te responderemos con una propuesta clara.
              </p>
              <button type="button" className="button-link" onClick={() => setIsPanelOpen(true)}>
                Escribenos
              </button>
            </div>
          </div>
          <div className="hero-scroll-hint" aria-hidden="true">
            <div className="scroll-arrow" />
          </div>
        </section>
      </div>

      <section className="contact-intro">
        <div className="contact-direct">
          <span className="contact-direct-eyebrow">Contacto directo</span>
          <h2>Si lo prefieres, contactanos directamente.</h2>
          <div className="contact-card-grid" ref={cardGridRef} onScroll={onCardGridScroll}>
            {contactCards.map((card) => {
              const inner = (
                <>
                  <span className="contact-card-icon" aria-hidden="true">
                    {cardIcons[card.icon]}
                  </span>
                  <span className="contact-card-text">
                    <span className="contact-card-label">{card.label}</span>
                    <span className="contact-card-value">{card.value}</span>
                    {card.detail ? <span className="contact-card-detail">{card.detail}</span> : null}
                  </span>
                </>
              )
              if (!card.href) {
                return (
                  <article className="contact-card" key={card.label}>
                    {inner}
                  </article>
                )
              }
              const isExternal = card.href.startsWith('http')
              return (
                <a
                  className="contact-card"
                  key={card.label}
                  href={card.href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {inner}
                </a>
              )
            })}
          </div>
          <div className="contact-card-dots" role="tablist" aria-label="Datos de contacto">
            {contactCards.map((card, i) => (
              <button
                key={card.label}
                type="button"
                className={`contact-card-dot${activeCard === i ? ' active' : ''}`}
                aria-label={`Ver ${card.label}`}
                aria-selected={activeCard === i}
                onClick={() => goToCard(i)}
              />
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

      <Footer />

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
