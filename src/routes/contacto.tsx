import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import type { ReactElement } from 'react'
import { Footer } from '../components/Footer'
import { JsonLd } from '../components/JsonLd'
import { breadcrumbSchema, organizationSchema, absoluteUrl } from '../lib/structuredData'
import { properties } from '../lib/properties'
import Map, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

// Las tarjetas de contacto aparecen escalonadas al entrar en viewport
const cardGridReveal = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export const Route = createFileRoute('/contacto')({
  // ?inmueble=<id> cuando se llega desde una ficha: identifica el piso sin
  // exponer la referencia interna, y nos deja rescatar su titulo para el mensaje.
  validateSearch: (search: Record<string, unknown>): { inmueble?: number } => {
    const raw = search.inmueble
    const id = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN
    return { inmueble: Number.isFinite(id) ? id : undefined }
  },
  head: () => ({
    meta: [
      { title: 'Contacto | Group Casas Barcelona' },
      {
        name: 'description',
        content:
          'Contacta con Group Casas. Visítanos en nuestra oficina o escríbenos y te ayudamos con tu compra, venta o alquiler en Barcelona.',
      },
      { property: 'og:title', content: 'Contacto | Group Casas Barcelona' },
      {
        property: 'og:description',
        content:
          'Escríbenos o visítanos en nuestra oficina en Barcelona. Te ayudamos con tu compra, venta o alquiler.',
      },
      { property: 'og:url', content: absoluteUrl('/contacto') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/contacto') }],
  }),
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

// Google Maps para la direccion de la oficina. Se busca por el nombre catalan
// oficial de la calle (con tildes) aunque en pantalla se muestre en castellano,
// porque es como Maps la resuelve.
const OFFICE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Carrer Verge de la Mercè, 49, 08950 Esplugues de Llobregat, Barcelona',
)}`

const contactCards: ContactCard[] = [
  {
    label: 'Email',
    value: 'info@groupcasas.com',
    href: 'mailto:info@groupcasas.com',
    icon: 'mail',
  },
  {
    label: 'Telefono',
    value: '+34 930 119 056',
    href: 'tel:+34930119056',
    icon: 'phone',
  },
  {
    label: 'WhatsApp',
    value: '+34 601 391 778',
    href: 'https://wa.me/34601391778',
    icon: 'whatsapp',
  },
  {
    label: 'Horario',
    value: 'Lun - Vie: 09:30 - 20:30 hs.',
    detail: 'Sab: 10:00 - 20:00 hs.',
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
  // Si se llega desde una ficha (/contacto?inmueble=12) abrimos el formulario ya
  // prellenado. El mensaje nombra el inmueble por su titulo y zona en vez de por
  // la referencia interna: se entiende de un vistazo en WhatsApp o en el email.
  const { inmueble } = Route.useSearch()
  const property = inmueble === undefined ? undefined : properties.find((p) => p.id === inmueble)
  // El titulo ya incluye calle y zona ("Piso en venta en Carrer X - Zona"), asi
  // que no hace falta anadirle la localidad.
  const propertyLabel = property?.title ?? ''
  const propertyMessage = property
    ? `Hola, me interesa este inmueble: ${propertyLabel}. ¿Podéis darme más información?`
    : ''

  const [isPanelOpen, setIsPanelOpen] = useState(() => Boolean(property))
  const [reason, setReason] = useState(contactReasons[0])

  // Devuelve el href del canal directo con el mensaje sobre el inmueble.
  const hrefForProperty = (card: ContactCard) => {
    if (!card.href || !property) return card.href
    if (card.icon === 'whatsapp') {
      return `${card.href}?text=${encodeURIComponent(propertyMessage)}`
    }
    if (card.icon === 'mail') {
      const subject = encodeURIComponent(`Consulta: ${propertyLabel}`)
      return `${card.href}?subject=${subject}&body=${encodeURIComponent(propertyMessage)}`
    }
    return card.href
  }

  // En móvil las tarjetas de contacto se convierten en un slider horizontal con
  // dots: el activo se deduce de la posición de scroll y los dots saltan a cada uno.
  const cardsRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState(0)

  const onCardsScroll = () => {
    const el = cardsRef.current
    if (!el) return
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.contact-card'))
    if (!cards.length) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closestIdx = 0
    let closestDist = Infinity
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - center)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })
    setActiveCard(closestIdx)
  }

  const goToCard = (i: number) => {
    const el = cardsRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('.contact-card')[i]
    if (!card) return
    el.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2,
      behavior: 'smooth',
    })
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

      // El hint ("ver mas" + linea) hace el mismo recorrido pero arrancando en
      // un dorado mas apagado que la marca: queda sobre el esfumado claro del
      // pie del hero, donde el dorado de la marca se lee demasiado brillante.
      // Termina en el mismo blanco calido, rgb(250,247,241).
      const hr = Math.round(120 + 130 * colorT)
      const hg = Math.round(96 + 151 * colorT)
      const hb = Math.round(52 + 189 * colorT)
      document.documentElement.style.setProperty('--hero-hint-fill', `rgb(${hr},${hg},${hb})`)

      // Tagline + CTA fade in once the photo has turned gold
      const uiT = phase(p, 0.3, 0.6)
      if (heroUiRef.current) {
        heroUiRef.current.style.opacity = String(uiT)
        heroUiRef.current.style.transform = `translateY(${(1 - uiT) * 14}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    // Segunda pasada en el frame siguiente: al entrar desde otra ruta la salida
    // animada mantiene la pagina anterior montada un instante, asi que la
    // primera lectura puede caer con el scroll aun sin resetear y dejar el hero
    // pintado como si ya se hubiera scrolleado.
    const raf = requestAnimationFrame(handleScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', handleScroll)
      // Las dos variables viven en <html>, asi que sobreviven al cambio de
      // ruta: sin limpiarlas, la proxima visita arranca con el blanco del final
      // del scroll en vez del dorado que define :root.
      document.documentElement.style.removeProperty('--hero-fill')
      document.documentElement.style.removeProperty('--hero-hint-fill')
    }
  }, [])

  return (
    <main className="contact-page">
      {/* LocalBusiness/RealEstateAgent con NAP y horario — §4.6, §5.2. La ficha
          es la página que más refuerza la señal de negocio local. */}
      <JsonLd data={organizationSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Contacto', path: '/contacto' },
        ])}
      />
      <div className="hero-scroll-wrapper" ref={heroWrapperRef}>
        <section className="hero" id="contacto-top">
          <div className="hero-gold-bg" ref={heroGoldRef} />
          <div className="hero-media" ref={heroMediaRef} />
          {/* Esfumado del pie del hero hacia el fondo de la seccion siguiente,
              igual que en la home (ver .hero-fade en index.css). */}
          <div className="hero-fade" aria-hidden="true" />
          <div className="hero-content">
            {/* H1 semántico. La marca visible (hero-brand "HABLEMOS") es un div
                animado, así que el encabezado real va oculto pero accesible. */}
            <h1 className="visually-hidden">
              Contacta con Group Casas — Inmobiliaria en Barcelona
            </h1>
            <div className="hero-brand" aria-label="Hablemos">
              <div className="hero-brand-fill" ref={heroFillRef}>
                <span className="hero-brand-hablemos">HABLEMOS</span>
              </div>
            </div>
            <div className="hero-ui" ref={heroUiRef}>
              <p className="contact-hero-tagline">
                Estamos aqui para ayudarte en cada paso.
                <br />
                Cuentanos que necesitas y te responderemos.
              </p>
              <button type="button" className="button-link" onClick={() => setIsPanelOpen(true)}>
                Rellenar formulario
              </button>
            </div>
          </div>
          <div className="hero-scroll-hint" aria-hidden="true">
            <span>ver mas</span>
            <span className="scroll-pulse-line" />
          </div>
        </section>
      </div>

      <section className="contact-intro">
        <div className="contact-direct">
          <span className="contact-direct-eyebrow">Contacto directo</span>
          <h2>Si lo prefieres, contactanos directamente.</h2>
          <motion.div
            className="contact-card-grid"
            ref={cardsRef}
            onScroll={onCardsScroll}
            variants={cardGridReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
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
                  <motion.article className="contact-card" key={card.label} variants={cardReveal}>
                    {inner}
                  </motion.article>
                )
              }
              const isExternal = card.href.startsWith('http')
              return (
                <motion.a
                  className="contact-card"
                  key={card.label}
                  href={hrefForProperty(card)}
                  variants={cardReveal}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {inner}
                </motion.a>
              )
            })}
          </motion.div>
          <div className="contact-card-dots" role="tablist" aria-label="Datos de contacto">
            {contactCards.map((card, i) => (
              <button
                key={card.label}
                type="button"
                className={`contact-card-dot${activeCard === i ? ' is-active' : ''}`}
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
          <h2>Visitanos</h2>
          <address>
            <a className="location-address-link" href={OFFICE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              <span className="location-address-lines">
                Calle Verge de la Merce 49, local 16<br />
                08950 Esplugues de Llobregat<br />
                Barcelona
              </span>
              <span className="location-address-cta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Como llegar
                <span className="location-address-arrow" aria-hidden="true">→</span>
              </span>
            </a>
          </address>
          <p>Lun - Vie: 09:30 - 20:30 hs.<br />Sab: 10:00 - 20:00 hs.</p>
        </div>
        <div className="map-panel" aria-label="Mapa de la oficina">
          <Map
            initialViewState={{ longitude: 2.0829, latitude: 41.3766, zoom: 15 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`}
          >
            <Marker longitude={2.0829} latitude={41.3766} anchor="bottom">
              {/* Pin de mapa (gota) con las iniciales GC; la punta cae en la coordenada */}
              <svg width="34" height="44" viewBox="0 0 32 42" aria-label="Oficina Group Casas" style={{ display: 'block', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.28))' }}>
                <path
                  d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z"
                  fill="#a47b36"
                />
                <text
                  x="16"
                  y="21"
                  textAnchor="middle"
                  fill="#fff"
                  fontFamily="'Cormorant Garamond', Georgia, serif"
                  fontSize="14"
                  fontWeight="700"
                >
                  GC
                </text>
              </svg>
            </Marker>
          </Map>
        </div>
      </section>

      <Footer />

      {isPanelOpen
        ? createPortal(
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
                <input name="phone" type="tel" placeholder="601 391 778" required />
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
                Mensaje
                <textarea name="message" placeholder="Escribe tu mensaje..." rows={5} defaultValue={propertyMessage} />
              </label>
              <button type="submit">Enviar mensaje</button>
            </form>
          </aside>
            </div>,
            document.body,
          )
        : null}
    </main>
  )
}
